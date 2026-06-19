'use client';

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AdminTablePagination({
  currentPage,
  totalPages,
  onPageChange
}: AdminTablePaginationProps) {
  return (
    <div className="bg-brand-beige/20 px-5 py-3.5 border-t border-brand-sand/50 flex justify-center items-center text-xs font-semibold text-brand-forest/70">
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="p-1 rounded-lg border border-brand-sand bg-white disabled:opacity-40 text-brand-forest hover:bg-brand-beige transition-colors disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="p-1 rounded-lg border border-brand-sand bg-white disabled:opacity-40 text-brand-forest hover:bg-brand-beige transition-colors disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
