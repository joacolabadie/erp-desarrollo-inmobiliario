import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesInvitaciones as organizacionesInvitacionesTabla,
  organizacionesMiembros as organizacionesMiembrosTabla,
  organizaciones as organizacionesTabla,
} from "@/lib/server/db/schema/organizaciones";
import {
  hashToken,
  normalizeEmail,
} from "@/lib/server/organizaciones/invitaciones";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "No autorizado." },
      { status: 401 },
    );
  }

  const parsedBody = bodySchema.safeParse(await req.json().catch(() => null));

  if (!parsedBody.success) {
    return NextResponse.json(
      { ok: false, message: "Datos del formulario invalidos." },
      { status: 400 },
    );
  }

  const tokenHash = hashToken(parsedBody.data.token);
  const emailUsuario = normalizeEmail(session.user.email);

  const invitacion = await db
    .select({
      id: organizacionesInvitacionesTabla.id,
      organizacionId: organizacionesInvitacionesTabla.organizacionId,
      email: organizacionesInvitacionesTabla.email,
      rol: organizacionesInvitacionesTabla.rol,
      estado: organizacionesInvitacionesTabla.estado,
      expiraEn: organizacionesInvitacionesTabla.expiraEn,
      activo: organizacionesInvitacionesTabla.activo,
    })
    .from(organizacionesInvitacionesTabla)
    .where(
      and(
        eq(organizacionesInvitacionesTabla.tokenHash, tokenHash),
        eq(organizacionesInvitacionesTabla.activo, true),
      ),
    )
    .limit(1);

  if (invitacion.length === 0) {
    return NextResponse.json(
      { ok: false, message: "La invitacion no existe o ya no es valida." },
      { status: 404 },
    );
  }

  const invitacionActual = invitacion[0]!;

  if (invitacionActual.estado !== "pendiente") {
    return NextResponse.json(
      { ok: false, message: "La invitacion ya no esta disponible." },
      { status: 409 },
    );
  }

  if (invitacionActual.expiraEn.getTime() <= Date.now()) {
    await db
      .update(organizacionesInvitacionesTabla)
      .set({
        estado: "expirada",
      })
      .where(eq(organizacionesInvitacionesTabla.id, invitacionActual.id));

    return NextResponse.json(
      { ok: false, message: "La invitacion expiro." },
      { status: 410 },
    );
  }

  if (normalizeEmail(invitacionActual.email) !== emailUsuario) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Debes iniciar sesion con el mismo email al que se envio la invitacion.",
      },
      { status: 403 },
    );
  }

  const organizacion = await db
    .select({ id: organizacionesTabla.id })
    .from(organizacionesTabla)
    .where(
      and(
        eq(organizacionesTabla.id, invitacionActual.organizacionId),
        eq(organizacionesTabla.activo, true),
      ),
    )
    .limit(1);

  if (organizacion.length === 0) {
    return NextResponse.json(
      { ok: false, message: "La organizacion no existe o esta inactiva." },
      { status: 404 },
    );
  }

  try {
    await db.transaction(async (tx) => {
      const miembroActivo = await tx
        .select({ id: organizacionesMiembrosTabla.id })
        .from(organizacionesMiembrosTabla)
        .where(
          and(
            eq(
              organizacionesMiembrosTabla.organizacionId,
              invitacionActual.organizacionId,
            ),
            eq(organizacionesMiembrosTabla.usuarioId, session.user.id),
            eq(organizacionesMiembrosTabla.activo, true),
          ),
        )
        .limit(1);

      if (miembroActivo.length === 0) {
        await tx.insert(organizacionesMiembrosTabla).values({
          organizacionId: invitacionActual.organizacionId,
          usuarioId: session.user.id,
          rol: invitacionActual.rol,
          estado: "activo",
          activo: true,
        });
      }

      await tx
        .update(organizacionesInvitacionesTabla)
        .set({
          estado: "aceptada",
        })
        .where(eq(organizacionesInvitacionesTabla.id, invitacionActual.id));
    });

    return NextResponse.json({
      ok: true,
      message: "Invitacion aceptada correctamente.",
      data: {
        organizacionId: invitacionActual.organizacionId,
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Ocurrio un error inesperado al aceptar la invitacion.",
      },
      { status: 500 },
    );
  }
}
