"use client";

import { useState } from "react";

import BaseModal from "./BaseModal";

import ProductsTable from "@/components/ProductsTable";

import { Product } from "@/utils/types";

interface ProductModalProps {
  products: Product[];
  onClose: () => void;
}

export default function ProductModal({ products, onClose }: ProductModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <BaseModal title="Productos" onClose={onClose}>
      <ProductsTable products={products} onSelect={setSelectedProduct} />

      {selectedProduct && (
        <div className="mt-8 border rounded p-4">
          <h3 className="font-bold text-xl mb-4">{selectedProduct.title}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>ID:</strong> {selectedProduct.id}
            </div>

            <div>
              <strong>Autor:</strong> {selectedProduct.author}
            </div>

            <div>
              <strong>Precio:</strong> ${selectedProduct.price}
            </div>

            <div>
              <strong>Stock:</strong> {selectedProduct.stock}
            </div>

            <div>
              <strong>Categoría:</strong> {selectedProduct.category?.name}
            </div>

            <div>
              <strong>Estado:</strong>{" "}
              {selectedProduct.isActive ? "Activo" : "Inactivo"}
            </div>
          </div>

          <div className="mt-4">
            <strong>Descripción</strong>

            <p className="mt-2">{selectedProduct.description}</p>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
