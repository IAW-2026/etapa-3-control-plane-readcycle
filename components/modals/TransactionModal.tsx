"use client";

import { useState } from "react";

import BaseModal from "./BaseModal";

import TransactionsTable from "@/components/TransactionsTable";

import { Transaction } from "@/utils/types";

interface TransactionModalProps {
  transactions: Transaction[];
  onClose: () => void;
}

export default function TransactionModal({
  transactions,
  onClose,
}: TransactionModalProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <BaseModal title="Transacciones" onClose={onClose}>
      <TransactionsTable transactions={transactions} onSelect={setSelectedTx} />

      {selectedTx && (
        <div className="mt-8 border rounded p-4">
          <h3 className="font-bold text-xl">{selectedTx.id}</h3>

          <div className="space-y-2 mt-4">
            <div>Orden: {selectedTx.orderId}</div>

            <div>Estado: {selectedTx.status}</div>

            <div>Monto: ${selectedTx.amount}</div>

            <div>Método: {selectedTx.paymentMethod}</div>

            <div>Buyer: {selectedTx.buyerId}</div>

            <div>Seller: {selectedTx.sellerId}</div>

            <div>MP Payment: {selectedTx.mercadoPagoPaymentId}</div>

            <div>MP Preference: {selectedTx.mercadoPagoPreferenceId}</div>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
