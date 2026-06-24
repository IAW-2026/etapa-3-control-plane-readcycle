import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

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
}

export async function GET() {
  try {
    await checkAdminAuthorization();

    const baseUrl = process.env.NEXT_PUBLIC_SHIPPING_API_URL;
    const apiKey = process.env.SHIPPING_APIKEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Faltan variables de entorno para conectar con Shipping API" },
        { status: 500 }
      );
    }

    let url = baseUrl;
    if (url.endsWith('/api/')) {
      url = `${url}users`;
    } else if (url.endsWith('/api')) {
      url = `${url}/users`;
    } else {
      const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
      url = `${cleanBase}/api/users`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Error de API externa al obtener usuarios: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const allUsers = Array.isArray(data) ? data : (data?.data || []);

    // Filter to only include carriers
    const carriers = allUsers
      .filter((u: any) => u.role === "CARRIER")
      .map((u: any) => ({
        id: u.id,
        username: u.username || u.email || "Sin nombre",
        email: u.email || "",
      }));

    return NextResponse.json({
      success: true,
      data: carriers,
    });
  } catch (error: any) {
    console.error("Error en GET /api/control/shipments/carriers:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener transportistas",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}
