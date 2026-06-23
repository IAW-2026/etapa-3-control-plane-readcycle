"use client";

interface DashboardCardProps {
  title: string;
  value: number | string;
  description?: string;
  onClick?: () => void;
}

export default function DashboardCard({
  title,
  value,
  description,
  onClick,
}: DashboardCardProps) {
  return (
    <button
      onClick={onClick}
      className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition-all
                hover:shadow-md
                hover:border-gray-300
            "
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-500">{title}</p>

        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>

        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </button>
  );
}
