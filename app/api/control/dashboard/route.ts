import { NextResponse } from "next/server";

// Simulación de llamadas externas independientes.
// En el futuro, estas funciones harán fetches reales a microservicios externos distribuidos.
async function fetchExternalUsersCount(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50)); // Simula latencia
  return 2480;
}

async function fetchExternalProductsCount(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50));
  return 8432;
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
