"use client";

import { Product } from "@/utils/types";

interface ProductsTableProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export default function ProductsTable({
  products,
  onSelect,
}: ProductsTableProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Producto</th>

            <th className="p-3 text-left">Categoría</th>

            <th className="p-3 text-left">Precio</th>

            <th className="p-3 text-left">Stock</th>

            <th className="p-3 text-left">Estado</th>

            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="p-3">{product.title}</td>

              <td className="p-3">{product.category?.name}</td>

              <td className="p-3">${product.price}</td>

              <td className="p-3">{product.stock}</td>

              <td className="p-3">
                {product.isActive ? "Activo" : "Inactivo"}
              </td>

              <td className="p-3">
                <button
                  onClick={() => onSelect(product)}
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
