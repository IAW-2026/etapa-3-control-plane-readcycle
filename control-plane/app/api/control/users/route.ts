import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Helper helper para verificar si el usuario actual es administrador
async function checkAdminAuthorization() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("No autenticado");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const roles = (user.publicMetadata?.roles || []) as string[];
  const isAdmin = roles.some((role) => role.toUpperCase() === "ADMIN");

  if (!isAdmin) {
    throw new Error("No autorizado - Se requiere rol de Administrador");
  }

  return client;
}

export async function GET() {
  try {
    const client = await checkAdminAuthorization();

    // Consultamos los usuarios de la instancia de Clerk (límite de 100 para administración)
    const { data: users } = await client.users.getUserList({
      limit: 100,
      orderBy: "-created_at",
    });

    const formattedUsers = users.map((user) => {
      const nombre =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        user.emailAddresses[0]?.emailAddress ||
        "Sin nombre";

      const email = user.emailAddresses[0]?.emailAddress || "Sin email";

      const roles = (user.publicMetadata?.roles || []) as string[];
      const expectedRoles = ["ADMIN", "CARRIER", "OPERATOR", "SELLER", "BUYER"];
      let rol = "BUYER";
      const foundRole = roles.find((r) => expectedRoles.includes(r.toUpperCase()));
      if (foundRole) {
        rol = foundRole.toUpperCase();
      } else if (roles.some((r) => r.toLowerCase() === "moderador" || r.toLowerCase() === "moderator")) {
        rol = "OPERATOR";
      } else if (roles.some((r) => r.toLowerCase() === "admin")) {
        rol = "ADMIN";
      } else if (roles.some((r) => r.toLowerCase() === "cliente")) {
        rol = "BUYER";
      } else if (roles[0]) {
        rol = roles[0].toUpperCase();
      }

      const estado = user.banned ? "Suspendido" : "Activo";

      return {
        id: user.id,
        nombre,
        email,
        rol,
        estado,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error: any) {
    console.error("Error en GET /api/control/users:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener usuarios de Clerk",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const client = await checkAdminAuthorization();
    const body = await req.json();
    const { action, userId, nombre, lastName, email, password, rol } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "Falta parámetro 'action'" }, { status: 400 });
    }

    if (action === "create") {
      if (!email || !password) {
        return NextResponse.json({ success: false, error: "Email y Contraseña son obligatorios" }, { status: 400 });
      }

      const nameParts = (nombre || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "Usuario";
      const userLastName = lastName || nameParts.slice(1).join(" ") || undefined;

      // Mapear rol a metadatos de Clerk
      const clerkRole = (rol || "BUYER").toUpperCase();

      const newUser = await client.users.createUser({
        emailAddress: [email],
        password,
        firstName,
        lastName: userLastName,
        publicMetadata: {
          roles: [clerkRole],
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: newUser.id,
          nombre: [newUser.firstName, newUser.lastName].filter(Boolean).join(" ") || "Sin nombre",
          email: newUser.emailAddresses[0]?.emailAddress || "",
          rol,
          estado: "Activo",
        },
      });
    }

    // Para el resto de acciones, se requiere el userId
    if (!userId) {
      return NextResponse.json({ success: false, error: "Falta parámetro 'userId'" }, { status: 400 });
    }

    if (action === "suspend") {
      await client.users.banUser(userId);
      return NextResponse.json({ success: true });
    }

    if (action === "activate") {
      await client.users.unbanUser(userId);
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      await client.users.deleteUser(userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: `Acción '${action}' no reconocida` }, { status: 400 });
  } catch (error: any) {
    console.error("Error en POST /api/control/users:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al procesar acción sobre usuario en Clerk",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}
