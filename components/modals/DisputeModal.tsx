"use client";

import { useState } from "react";

import BaseModal from "./BaseModal";

import DisputesTable from "@/components/DisputesTable";

import { Dispute } from "@/utils/types";

interface DisputeModalProps {
  disputes: Dispute[];
  onClose: () => void;
}

export default function DisputeModal({ disputes, onClose }: DisputeModalProps) {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  return (
    <BaseModal title="Disputas" onClose={onClose}>
      <DisputesTable disputes={disputes} onSelect={setSelectedDispute} />

      {selectedDispute && (
        <div className="mt-8 border rounded p-4">
          <h3 className="font-bold text-xl">{selectedDispute.id}</h3>

          <div className="space-y-2 mt-4">
            <div>Usuario: {selectedDispute.userId}</div>

            <div>Razón: {selectedDispute.reason}</div>

            <div>Estado: {selectedDispute.status}</div>

            <div>
              Resolución: {selectedDispute.resolution ?? "Sin resolver"}
            </div>

            <div>Transacción: {selectedDispute.transactionId}</div>
          </div>

          {selectedDispute.transaction && (
            <div className="mt-6">
              <h4 className="font-semibold">Información de la transacción</h4>

              <div className="mt-2">
                Monto: ${selectedDispute.transaction.amount}
              </div>

              <div>Estado: {selectedDispute.transaction.status}</div>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
}
