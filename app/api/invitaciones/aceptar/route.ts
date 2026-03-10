import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesInvitaciones as organizacionesInvitacionesTabla,
  organizacionesMiembros as organizacionesMiembrosTabla,
  organizaciones as organizacionesTabla,
} from "@/lib/server/db/schema/organizaciones";
import { hashToken, normalizeEmail } from "@/lib/server/invitaciones";
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

  const result = bodySchema.safeParse(await req.json().catch(() => null));

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Datos del formulario inválidos." },
      { status: 400 },
    );
  }

  const email = normalizeEmail(session.user.email);
  const tokenHash = hashToken(result.data.token);

  const invitacion = await db
    .select({
      id: organizacionesInvitacionesTabla.id,
      organizacionId: organizacionesInvitacionesTabla.organizacionId,
      email: organizacionesInvitacionesTabla.email,
      expiraEn: organizacionesInvitacionesTabla.expiraEn,
      rol: organizacionesInvitacionesTabla.rol,
      estado: organizacionesInvitacionesTabla.estado,
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
      { ok: false, message: "La invitación no existe o ya no es válida." },
      { status: 404 },
    );
  }

  if (invitacion[0].estado !== "pendiente") {
    return NextResponse.json(
      { ok: false, message: "La invitación ya no está disponible." },
      { status: 409 },
    );
  }

  if (invitacion[0].expiraEn.getTime() <= Date.now()) {
    await db
      .update(organizacionesInvitacionesTabla)
      .set({
        estado: "expirada",
      })
      .where(eq(organizacionesInvitacionesTabla.id, invitacion[0].id));

    return NextResponse.json(
      { ok: false, message: "La invitación expiró." },
      { status: 410 },
    );
  }

  if (normalizeEmail(invitacion[0].email) !== email) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Debes iniciar sesión con el mismo email al que se envió la invitación.",
      },
      { status: 403 },
    );
  }

  const organizacion = await db
    .select({
      id: organizacionesTabla.id,
    })
    .from(organizacionesTabla)
    .where(
      and(
        eq(organizacionesTabla.id, invitacion[0].organizacionId),
        eq(organizacionesTabla.activo, true),
      ),
    )
    .limit(1);

  if (organizacion.length === 0) {
    return NextResponse.json(
      { ok: false, message: "La organización no existe o está inactiva." },
      { status: 404 },
    );
  }

  try {
    await db.transaction(async (tx) => {
      const miembro = await tx
        .select({
          id: organizacionesMiembrosTabla.id,
        })
        .from(organizacionesMiembrosTabla)
        .where(
          and(
            eq(
              organizacionesMiembrosTabla.organizacionId,
              invitacion[0].organizacionId,
            ),
            eq(organizacionesMiembrosTabla.usuarioId, session.user.id),
            eq(organizacionesMiembrosTabla.activo, true),
          ),
        )
        .limit(1);

      if (miembro.length === 0) {
        await tx.insert(organizacionesMiembrosTabla).values({
          organizacionId: invitacion[0].organizacionId,
          usuarioId: session.user.id,
          rol: invitacion[0].rol,
          activo: true,
        });
      }

      await tx
        .update(organizacionesInvitacionesTabla)
        .set({
          estado: "aceptada",
        })
        .where(eq(organizacionesInvitacionesTabla.id, invitacion[0].id));
    });

    return NextResponse.json({
      ok: true,
      message: "Invitación aceptada correctamente.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Ocurrió un error inesperado al aceptar la invitación.",
      },
      { status: 500 },
    );
  }
}
