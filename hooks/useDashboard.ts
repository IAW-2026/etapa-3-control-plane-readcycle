import { useCallback, useEffect, useState } from "react";

import { dashboardService } from "@/services/dashboard.service";
import { DashboardData } from "@/utils/types";

interface UseDashboardReturn {
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardData();
      setDashboard(data);
    } catch (err) {
      console.error(err);

      setError("No se pudo cargar la información del dashboard");
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    setLastUpdated(new Date());
  }, [loadDashboard]);

  return {
    dashboard,
    loading,
    error,
    lastUpdated,
    refresh: loadDashboard,
  };
}
