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

    const baseUrl = process.env.NEXT_PUBLIC_PAYMENTS_API_URL;
    const apiKey = process.env.DISPUTES_API_KEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Faltan variables de entorno para conectar con Payments API" },
        { status: 500 }
      );
    }

    // Safely combine base URL and path
    let url = baseUrl;
    if (url.endsWith('/api/')) {
      url = `${url}payments/disputes`;
    } else if (url.endsWith('/api')) {
      url = `${url}/payments/disputes`;
    } else {
      const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
      url = `${cleanBase}/api/payments/disputes`;
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
        { success: false, error: `Error de API externa: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let rawDisputes: any[] = [];
    if (Array.isArray(data)) {
      rawDisputes = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.disputes)) rawDisputes = data.disputes;
      else if (Array.isArray(data.data)) rawDisputes = data.data;
    }

    // Map to the schema expected by the frontend
    const formattedDisputes = rawDisputes.map((d: any) => {
      // Map status
      let estado = "Pendiente";
      if (d.status === "REVIEWING") {
        estado = "En Revisión";
      } else if (d.status === "RESOLVED") {
        estado = "Resuelta";
      } else if (d.status === "REJECTED") {
        estado = "Rechazada";
      }

      // Map severity based on reason or default
      let severidad = "Baja";
      const reasonLower = (d.reason || "").toLowerCase();
      if (reasonLower.includes("nunca recibido") || reasonLower.includes("no recibido") || reasonLower.includes("duplicado") || reasonLower.includes("canceló")) {
        severidad = "Alta";
      } else if (reasonLower.includes("incorrecto") || reasonLower.includes("dañado") || reasonLower.includes("faltantes") || reasonLower.includes("diferente")) {
        severidad = "Media";
      }

      return {
        id: d.id,
        idOrden: d.transaction?.orderId || d.transactionId || "N/A",
        motivo: d.reason || "Sin motivo",
        estado: estado,
        severidad: severidad,
        resolucion: d.resolution || "",
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedDisputes,
    });
  } catch (error: any) {
    console.error("Error en GET /api/control/disputes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener disputas",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}


export async function PATCH(req: Request) {
  try {
    await checkAdminAuthorization();

    const body = await req.json();
    const { id, estado, resolucion } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Falta el ID de la disputa" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_PAYMENTS_API_URL;
    const apiKey = process.env.DISPUTES_API_KEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Faltan variables de entorno para conectar con Payments API" },
        { status: 500 }
      );
    }

    // Map internal Spanish state back to payments API status values
    let status = "OPEN";
    if (estado === "En Revisión") {
      status = "REVIEWING";
    } else if (estado === "Resuelta") {
      status = "RESOLVED";
    } else if (estado === "Rechazada") {
      status = "REJECTED";
    }

    // Construct URL for PATCH on api/payments/disputes/[id] on the payments service
    let url = baseUrl;
    if (url.endsWith('/api/')) {
      url = `${url}payments/disputes/${id}`;
    } else if (url.endsWith('/api')) {
      url = `${url}/payments/disputes/${id}`;
    } else {
      const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
      url = `${cleanBase}/api/payments/disputes/${id}`;
    }

    console.log(`Sending PATCH request to payments service at: ${url} with status: ${status}, resolution: ${resolucion}`);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        status,
        resolution: resolucion || ""
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error updating dispute on external API (status ${response.status}):`, errorText);
      return NextResponse.json(
        { success: false, error: `Error de API externa al modificar: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const updatedData = await response.json();

    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error: any) {
    console.error("Error en PATCH /api/control/disputes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al modificar disputa",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}
