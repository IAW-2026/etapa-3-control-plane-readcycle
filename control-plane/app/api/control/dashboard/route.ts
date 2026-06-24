import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

// Simulación de llamadas externas independientes.
// En el futuro, estas funciones harán fetches reales a microservicios externos distribuidos.
async function fetchExternalUsersCount(): Promise<number> {
  try {
    const client = await clerkClient();
    const { totalCount } = await client.users.getUserList();
    return totalCount;
  } catch (error) {
    console.error("Error fetching Clerk users count for dashboard:", error);
    return 0;
  }
}

async function fetchExternalProductsCount(): Promise<number> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SELLER_API_URL;
    const apiKey = process.env.SELLER_APIKEY;

    if (!baseUrl || !apiKey) {
      console.warn("Warning: NEXT_PUBLIC_SELLER_API_URL or SELLER_APIKEY env vars are not set");
      return 0;
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
      console.error(`Failed to fetch products from API: ${response.status} ${response.statusText}`);
      return 0;
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data.length;
    }

    if (data && typeof data === 'object') {
      if (Array.isArray(data.products)) return data.products.length;
      if (Array.isArray(data.data)) return data.data.length;
    }

    console.error("Expected array or object with array from products API, got:", typeof data);
    return 0;
  } catch (error) {
    console.error("Error fetching products count from seller API:", error);
    return 0;
  }
}

async function fetchExternalOrdersCount(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50));
  return 1240;
}

async function fetchExternalCartsCount(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50));
  return 312;
}

async function fetchExternalTransactionsCount(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50));
  return 3890;
}

async function fetchExternalDisputesCount(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50));
  return 14;
}

async function fetchExternalShipmentsCount(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50));
  return 854;
}

export async function GET() {
  const startTime = Date.now();
  try {
    // Ejecutamos las 7 llamadas a servicios externos de forma SIMULTÁNEA con Promise.all
    const [
      usuarios,
      productos,
      ordenes,
      carritos,
      transacciones,
      disputas,
      envios,
    ] = await Promise.all([
      fetchExternalUsersCount(),
      fetchExternalProductsCount(),
      fetchExternalOrdersCount(),
      fetchExternalCartsCount(),
      fetchExternalTransactionsCount(),
      fetchExternalDisputesCount(),
      fetchExternalShipmentsCount(),
    ]);

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      performance: {
        latencyMs: durationMs,
        concurrency: "Promise.all (7 tasks)",
      },
      data: {
        usuarios,
        productos,
        ordenes,
        carritos,
        transacciones,
        disputas,
        envios,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al consultar los servicios descentralizados de control",
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
