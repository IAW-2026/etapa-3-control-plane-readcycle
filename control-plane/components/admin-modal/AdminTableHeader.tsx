'use client';

interface AdminTableHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddClick: () => void;
  showAdd?: boolean;
}

export default function AdminTableHeader({
  searchTerm,
  setSearchTerm,
  onAddClick,
  showAdd = true
}: AdminTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-forest/40">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </span>
        <input 
          type="text"
          placeholder="Buscar registros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-brand-sand rounded-xl bg-white text-sm placeholder-brand-forest/40 focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage"
        />
      </div>

      {showAdd && (
        <button
          onClick={onAddClick}
          className="px-4 py-2.5 bg-brand-sage hover:bg-brand-forest text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Crear Nuevo
        </button>
      )}
    </div>
  );
}
