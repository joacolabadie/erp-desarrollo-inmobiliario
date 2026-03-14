import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import {
  organizacionesInvitaciones as organizacionesInvitacionesTabla,
  organizacionesMiembros as organizacionesMiembrosTabla,
} from "@/lib/server/db/schema/organizaciones";
import { hashToken } from "@/lib/server/invitaciones";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  token: z.string().trim().min(1),
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
      { ok: false, message: "Datos de la solicitud inválidos." },
      { status: 400 },
    );
  }

  const tokenHash = hashToken({ token: result.data.token });

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
    .where(eq(organizacionesInvitacionesTabla.tokenHash, tokenHash))
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

  if (invitacion[0].email !== session.user.email) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Debes iniciar sesión con el mismo email al que se envió la invitación.",
      },
      { status: 403 },
    );
  }

  const miembro = await db
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
      ),
    )
    .limit(1);

  if (miembro.length > 0) {
    await db
      .update(organizacionesInvitacionesTabla)
      .set({
        estado: "revocada",
      })
      .where(eq(organizacionesInvitacionesTabla.id, invitacion[0].id));

    return NextResponse.json(
      {
        ok: false,
        message: "Ya pertenecés a esta organización.",
      },
      { status: 409 },
    );
  }

  try {
    await db.transaction(async (tx) => {
      await tx.insert(organizacionesMiembrosTabla).values({
        organizacionId: invitacion[0].organizacionId,
        usuarioId: session.user.id,
        rol: invitacion[0].rol,
      });

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
