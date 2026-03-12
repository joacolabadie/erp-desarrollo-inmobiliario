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
import { sendInvitacion } from "@/lib/server/email/send-invitacion";
import { hasAplicacionPlataformaAccess } from "@/lib/server/guards/has-aplicacion-plataforma-access";
import { generateToken, hashToken } from "@/lib/server/invitaciones";
import { isValidUuid } from "@/lib/utils/validation/is-valid-uuid";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      organizacionId: string;
    }>;
  },
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

  const { organizacionId } = await params;

  if (!isValidUuid(organizacionId)) {
    return NextResponse.json(
      { ok: false, message: "La organización seleccionada es inválida." },
      { status: 400 },
    );
  }

  const result = invitacionSendSchema.safeParse(
    await req.json().catch(() => null),
  );

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Datos del formulario inválidos." },
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

  const { email } = result.data;

  const rol = result.data.rol as MiembroOrganizacionRol;

  const organizacion = await db
    .select({
      id: organizacionesTabla.id,
      nombre: organizacionesTabla.nombre,
    })
    .from(organizacionesTabla)
    .where(eq(organizacionesTabla.id, organizacionId))
    .limit(1);

  if (organizacion.length === 0) {
    return NextResponse.json(
      { ok: false, message: "La organización no existe." },
      { status: 404 },
    );
  }

  const miembro = await db
    .select({
      id: organizacionesMiembrosTabla.id,
    })
    .from(organizacionesMiembrosTabla)
    .innerJoin(
      usersTabla,
      eq(organizacionesMiembrosTabla.usuarioId, usersTabla.id),
    )
    .where(
      and(
        eq(organizacionesMiembrosTabla.organizacionId, organizacionId),
        eq(usersTabla.email, email),
      ),
    )
    .limit(1);

  if (miembro.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "El email ya pertenece a un miembro de la organización.",
      },
      { status: 409 },
    );
  }

  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    return NextResponse.json(
      { ok: false, message: "No se pudo generar la URL de invitación." },
      { status: 500 },
    );
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);

  const expiraEn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    const invitacion = await db
      .select({
        id: organizacionesInvitacionesTabla.id,
        tokenHash: organizacionesInvitacionesTabla.tokenHash,
        expiraEn: organizacionesInvitacionesTabla.expiraEn,
        rol: organizacionesInvitacionesTabla.rol,
      })
      .from(organizacionesInvitacionesTabla)
      .where(
        and(
          eq(organizacionesInvitacionesTabla.organizacionId, organizacionId),
          eq(organizacionesInvitacionesTabla.email, email),
          eq(organizacionesInvitacionesTabla.estado, "pendiente"),
        ),
      )
      .limit(1);

    if (invitacion.length > 0) {
      await db
        .update(organizacionesInvitacionesTabla)
        .set({
          rol,
          tokenHash,
          expiraEn,
        })
        .where(eq(organizacionesInvitacionesTabla.id, invitacion[0].id));
    } else {
      await db.insert(organizacionesInvitacionesTabla).values({
        organizacionId,
        email,
        rol,
        tokenHash,
        expiraEn,
      });
    }

    const invitacionUrl = `${siteUrl}/invitaciones/aceptar?token=${encodeURIComponent(rawToken)}`;

    try {
      await sendInvitacion({
        to: email,
        invitacionUrl,
        organizacionNombre: organizacion[0].nombre,
        rol,
      });
    } catch {
      if (invitacion.length > 0) {
        await db
          .update(organizacionesInvitacionesTabla)
          .set({
            rol: invitacion[0].rol,
            tokenHash: invitacion[0].tokenHash,
            expiraEn: invitacion[0].expiraEn,
          })
          .where(eq(organizacionesInvitacionesTabla.id, invitacion[0].id));
      } else {
        await db
          .update(organizacionesInvitacionesTabla)
          .set({
            estado: "revocada",
          })
          .where(
            and(
              eq(
                organizacionesInvitacionesTabla.organizacionId,
                organizacionId,
              ),
              eq(organizacionesInvitacionesTabla.email, email),
              eq(organizacionesInvitacionesTabla.tokenHash, tokenHash),
              eq(organizacionesInvitacionesTabla.estado, "pendiente"),
            ),
          );
      }

      return NextResponse.json(
        {
          ok: false,
          message: "No se pudo enviar la invitación.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Invitación enviada correctamente.",
    });
  } catch (error: unknown) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (typeof cause === "object" && cause !== null) {
      const code = (cause as Record<string, unknown>)["code"];

      if (code === "23505") {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Ya existe una invitación pendiente para este email en la organización.",
          },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Ocurrió un error inesperado al enviar la invitación.",
      },
      { status: 500 },
    );
  }
}
