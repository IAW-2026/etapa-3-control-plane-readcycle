"use client";

import { Transaction } from "@/utils/types";

interface TransactionsTableProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
}

export default function TransactionsTable({
  transactions,
  onSelect,
}: TransactionsTableProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">ID</th>

            <th className="p-3 text-left">Orden</th>

            <th className="p-3 text-left">Monto</th>

            <th className="p-3 text-left">Estado</th>

            <th className="p-3 text-left">Método</th>

            <th className="p-3 text-left">Fecha</th>

            <th className="p-3 text-left">Acción</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b">
              <td className="p-3">{tx.id}</td>

              <td className="p-3">{tx.orderId}</td>

              <td className="p-3">${tx.amount}</td>

              <td className="p-3">{tx.status}</td>

              <td className="p-3">{tx.paymentMethod}</td>

              <td className="p-3">
                {new Date(tx.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3">
                <button
                  onClick={() => onSelect(tx)}
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
