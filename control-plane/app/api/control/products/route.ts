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

    const baseUrl = process.env.NEXT_PUBLIC_SELLER_API_URL;
    const apiKey = process.env.SELLER_APIKEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Faltan variables de entorno para conectar con Seller API" },
        { status: 500 }
      );
    }

    // Safely combine base URL and path to avoid double slashes or duplication
    let url = baseUrl;
    if (url.endsWith('/api/')) {
      url = `${url}public/products`;
    } else if (url.endsWith('/api')) {
      url = `${url}/public/products`;
    } else {
      const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
      url = `${cleanBase}/api/public/products`;
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
    let rawProducts: any[] = [];
    if (Array.isArray(data)) {
      rawProducts = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.products)) rawProducts = data.products;
      else if (Array.isArray(data.data)) rawProducts = data.data;
    }

    const formattedProducts = rawProducts.map((p: any) => ({
      id: p.id,
      titulo: p.title || p.titulo || "Sin título",
      autor: p.author || p.autor || "Sin autor",
      precio: p.price ?? p.precio ?? 0,
      stock: p.stock ?? 0,
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error: any) {
    console.error("Error en GET /api/control/products:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener productos",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await checkAdminAuthorization();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Falta el ID del producto" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SELLER_API_URL;
    const apiKey = process.env.SELLER_APIKEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Faltan variables de entorno para conectar con Seller API" },
        { status: 500 }
      );
    }

    // Safely combine base URL and path to avoid double slashes or duplication
    let url = baseUrl;
    if (url.endsWith('/api/')) {
      url = `${url}admin/products/${id}`;
    } else if (url.endsWith('/api')) {
      url = `${url}/admin/products/${id}`;
    } else {
      const cleanBase = url.endsWith('/') ? url.slice(0, -1) : url;
      url = `${cleanBase}/api/admin/products/${id}`;
    }

    console.log(`Sending DELETE request to: ${url}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error deleting product from external API (status ${response.status}):`, errorText);
      return NextResponse.json(
        { success: false, error: `Error de API externa al eliminar: ${response.status} ${response.statusText}. Details: ${errorText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Error en DELETE /api/control/products:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al eliminar producto",
      },
      { status: error.message === "No autenticado" ? 401 : error.message.includes("No autorizado") ? 403 : 500 }
    );
  }
}
