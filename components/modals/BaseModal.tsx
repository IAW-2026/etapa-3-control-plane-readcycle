"use client";

import { ReactNode } from "react";

interface BaseModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function BaseModal({
  title,
  children,
  onClose,
}: BaseModalProps) {
  return (
    <div
      className="
                fixed
                inset-0
                z-50
                bg-black/50
                flex
                items-center
                justify-center
            "
    >
      <div
        className="
                    bg-white
                    rounded-xl
                    shadow-xl
                    w-[95%]
                    max-w-6xl
                    h-[90vh]
                    flex
                    flex-col
                "
      >
        <div
          className="
                        border-b
                        p-5
                        flex
                        justify-between
                        items-center
                    "
        >
          <h2
            className="
                            text-2xl
                            font-bold
                        "
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
                            px-4
                            py-2
                            border
                            rounded
                        "
          >
            Cerrar
          </button>
        </div>

        <div
          className="
                        flex-1
                        overflow-auto
                        p-6
                    "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
