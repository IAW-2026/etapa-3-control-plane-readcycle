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
      url = `${url}shipments`;
    } else if (url.endsWith('/api')) {
      url = `${url}/shipments`;
    } else {
      const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
      url = `${cleanBase}/api/shipments`;
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
        { success: false, error: `Error de API externa de envíos: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawShipments = Array.isArray(data) ? data : (data?.data || []);

    const formattedShipments = rawShipments.map((s: any) => {
      let estado = "Preparación";
      if (s.currentStatus === "PICKED_UP") {
        estado = "En Camino";
      } else if (s.currentStatus === "DELIVERED") {
        estado = "Entregado";
      } else if (s.currentStatus === "CANCELLED") {
        estado = "Cancelado";
      } else if (s.currentStatus === "FAILED") {
        estado = "Fallido";
      }

      return {
        id: s.id,
        idOrden: s.orderId || "N/A",
        carrierId: s.carrierId || null,
        estado: estado,
        fechaCreacion: s.createdAt || ""
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedShipments,
    });
  } catch (error: any) {
    console.error("Error en GET /api/control/shipments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener envíos",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await checkAdminAuthorization();

    const body = await req.json();
    const { id, estado, carrierId } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Falta el ID del envío" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SHIPPING_API_URL;
    const apiKey = process.env.SHIPPING_APIKEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Faltan variables de entorno para conectar con Shipping API" },
        { status: 500 }
      );
    }

    let status = "PENDING";
    if (estado === "En Camino") {
      status = "PICKED_UP";
    } else if (estado === "Entregado") {
      status = "DELIVERED";
    } else if (estado === "Cancelado") {
      status = "CANCELLED";
    } else if (estado === "Fallido") {
      status = "FAILED";
    }

    let url = baseUrl;
    if (url.endsWith('/api/')) {
      url = `${url}shipments/${id}`;
    } else if (url.endsWith('/api')) {
      url = `${url}/shipments/${id}`;
    } else {
      const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
      url = `${cleanBase}/api/shipments/${id}`;
    }

    console.log(`Sending PUT request to shipping service at: ${url} with status: ${status}, carrierId: ${carrierId}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        currentStatus: status,
        carrierId: carrierId || null,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error updating shipment on external API (status ${response.status}):`, errorText);
      return NextResponse.json(
        { success: false, error: `Error de API externa al modificar envío: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const updatedData = await response.json();

    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error: any) {
    console.error("Error en PUT /api/control/shipments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al modificar envío",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}
