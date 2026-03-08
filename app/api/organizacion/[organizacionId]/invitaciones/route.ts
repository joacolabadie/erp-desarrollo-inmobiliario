import { invitacionSendSchema } from "@/features/plataforma/organizaciones/shared/schema";
import { auth } from "@/lib/auth";
import type { MiembroOrganizacionRol } from "@/lib/domain";
import { db } from "@/lib/server/db";
import { users as usersTabla } from "@/lib/server/db/schema/auth.generated";
import {
  organizacionesInvitaciones as organizacionesInvitacionesTabla,
  organizacionesMiembros as organizacionesMiembrosTabla,
  organizaciones as organizacionesTabla,
} from "@/lib/server/db/schema/organizaciones";
import { sendOrganizacionInvitacionEmail } from "@/lib/server/email/send-organizacion-invitacion-email";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import {
  generateToken,
  hashToken,
  normalizeEmail,
} from "@/lib/server/organizaciones/invitaciones";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const paramsSchema = z.object({
  organizacionId: z.uuid(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ organizacionId: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "No autorizado." },
      { status: 401 },
    );
  }

  const parsedParams = paramsSchema.safeParse(await params);

  if (!parsedParams.success) {
    return NextResponse.json(
      { ok: false, message: "La organizacion seleccionada es invalida." },
      { status: 400 },
    );
  }

  const parsedBody = invitacionSendSchema.safeParse(
    await req.json().catch(() => null),
  );

  if (!parsedBody.success) {
    return NextResponse.json(
      { ok: false, message: "Datos del formulario invalidos." },
      { status: 400 },
    );
  }

  const allowed = await hasAplicacionPlataformaAccess({
    userId: session.user.id,
    clave: "ORGANIZACIONES",
  });

  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "No autorizado." },
      { status: 403 },
    );
  }

  const organizacionId = parsedParams.data.organizacionId;
  const email = normalizeEmail(parsedBody.data.email);
  const rol = parsedBody.data.rol as MiembroOrganizacionRol;

  const organizacion = await db
    .select({
      id: organizacionesTabla.id,
      nombre: organizacionesTabla.nombre,
    })
    .from(organizacionesTabla)
    .where(
      and(
        eq(organizacionesTabla.id, organizacionId),
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

  const miembroExistente = await db
    .select({ id: organizacionesMiembrosTabla.id })
    .from(organizacionesMiembrosTabla)
    .innerJoin(
      usersTabla,
      eq(organizacionesMiembrosTabla.usuarioId, usersTabla.id),
    )
    .where(
      and(
        eq(organizacionesMiembrosTabla.organizacionId, organizacionId),
        eq(organizacionesMiembrosTabla.activo, true),
        eq(usersTabla.email, email),
      ),
    )
    .limit(1);

  if (miembroExistente.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "El email ya pertenece a un miembro activo de la organizacion.",
      },
      { status: 409 },
    );
  }

  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    return NextResponse.json(
      { ok: false, message: "No se pudo generar la URL de invitacion." },
      { status: 500 },
    );
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiraEn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    const invitacion = await db
      .select({ id: organizacionesInvitacionesTabla.id })
      .from(organizacionesInvitacionesTabla)
      .where(
        and(
          eq(organizacionesInvitacionesTabla.organizacionId, organizacionId),
          eq(organizacionesInvitacionesTabla.email, email),
          eq(organizacionesInvitacionesTabla.estado, "pendiente"),
          eq(organizacionesInvitacionesTabla.activo, true),
        ),
      )
      .limit(1);

    if (invitacion.length > 0) {
      await db
        .update(organizacionesInvitacionesTabla)
        .set({
          tokenHash,
          expiraEn,
          rol,
        })
        .where(eq(organizacionesInvitacionesTabla.id, invitacion[0]!.id));
    } else {
      await db.insert(organizacionesInvitacionesTabla).values({
        organizacionId,
        email,
        rol,
        estado: "pendiente",
        tokenHash,
        expiraEn,
        activo: true,
      });
    }

    const invitacionUrl = `${siteUrl}/invitaciones/aceptar?token=${encodeURIComponent(rawToken)}`;

    await sendOrganizacionInvitacionEmail({
      to: email,
      invitacionUrl,
      organizacionNombre: organizacion[0]!.nombre,
      rol,
    });

    return NextResponse.json({
      ok: true,
      message: "Invitacion enviada correctamente.",
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("SEND_ORGANIZACION_INVITACION_EMAIL_ERROR:")
    ) {
      console.error(error.message);

      return NextResponse.json(
        {
          ok: false,
          message: "No se pudo enviar el email de invitacion.",
        },
        { status: 502 },
      );
    }

    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Ya existe una invitacion pendiente activa para este email en la organizacion.",
          },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Ocurrio un error inesperado al enviar la invitacion.",
      },
      { status: 500 },
    );
  }
}
