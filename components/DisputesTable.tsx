"use client";

import { Dispute } from "@/utils/types";

interface DisputesTableProps {
  disputes: Dispute[];
  onSelect: (dispute: Dispute) => void;
}

export default function DisputesTable({
  disputes,
  onSelect,
}: DisputesTableProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">ID</th>

            <th className="p-3 text-left">Usuario</th>

            <th className="p-3 text-left">Razón</th>

            <th className="p-3 text-left">Estado</th>

            <th className="p-3 text-left">Transacción</th>

            <th className="p-3 text-left">Fecha</th>

            <th className="p-3 text-left">Acción</th>
          </tr>
        </thead>

        <tbody>
          {disputes.map((dispute) => (
            <tr key={dispute.id} className="border-b">
              <td className="p-3">{dispute.id}</td>

              <td className="p-3">{dispute.userId}</td>

              <td className="p-3">{dispute.reason}</td>

              <td className="p-3">{dispute.status}</td>

              <td className="p-3">{dispute.transactionId}</td>

              <td className="p-3">
                {new Date(dispute.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3">
                <button
                  onClick={() => onSelect(dispute)}
                  className="
                                        px-3
                                        py-1
                                        bg-black
                                        text-white
                                        rounded
                                    "
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
