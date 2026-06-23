'use client';

import { DashboardMetric } from "@/app/dashboard/data";

interface DashboardCardProps {
  item: DashboardMetric;
  onClick?: (id: string) => void;
}

function getIcon(id: string) {
  switch (id) {
    case 'usuarios':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.243 0-4.352-.64-6.136-1.75a11.261 11.261 0 01-1.378-1.077 4.125 4.125 0 016.963-3.415 9.39 9.39 0 012.628.374m7.446-4.231a4.5 4.5 0 11-8.258-3.91M14 8.25a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
      );
    case 'productos':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case 'ordenes':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case 'carritos':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.116 60.116 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      );
    case 'transacciones':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'disputas':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
        </svg>
      );
    case 'envios':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-.447-.266-.852-.682-1.028l-2.9-1.223A1.82 1.82 0 0015.963 9H13.5v5.25m4.5 0H13.5m0-8.25h2.463c.276 0 .543.1.751.278l2.9 2.5a1.125 1.125 0 01.37.837V14.25m-15-10.5a1.125 1.125 0 00-1.125 1.125v7.5c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H6.75z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
}

function getIconBgStyles(id: string) {
  if (id === 'disputas' || id === 'carritos') {
    return "bg-brand-clay/10 text-brand-clay";
  }
  return "bg-brand-sage/10 text-brand-sage";
}

export default function DashboardCard({ item, onClick }: DashboardCardProps) {
  return (
    <button
      onClick={() => onClick?.(item.id)}
      className="w-full text-left group relative flex flex-col bg-white hover:bg-brand-beige/20 p-6 rounded-2xl border border-brand-sand/70 hover:border-brand-sage/40 hover:shadow-md transition-all duration-300 ease-out cursor-pointer overflow-hidden font-normal"
    >
      {/* Visual Hover highlight strip */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-brand-sage/60 transition-colors duration-300"></div>

      {/* Top Row: Icon only (trend removed) */}
      <div className="mb-5">
        <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 w-fit ${getIconBgStyles(item.id)}`}>
          {getIcon(item.id)}
        </div>
      </div>

      {/* Center details: Title and Number */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-brand-forest/60 uppercase tracking-wider">
          {item.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black text-brand-forest font-sans leading-none tracking-tight">
            {item.count.toLocaleString('es-AR')}
          </span>
          <span className="text-xs font-medium text-brand-forest/50">
            {item.unit.split(' ')[1] || ''}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs font-light text-brand-forest/70 line-clamp-2 leading-relaxed mb-5">
        {item.description}
      </p>

      {/* Card Footer: Action button placed in the bottom left where status was */}
      <div className="w-full mt-auto pt-4 border-t border-brand-sand/50 flex items-center text-[11px]">
        <span className="flex items-center gap-1.5 font-bold text-brand-sage bg-brand-sage/5 group-hover:bg-brand-sage group-hover:text-white px-3 py-1.5 rounded-xl border border-brand-sage/20 transition-all duration-300">
          <span>Gestionar Módulo</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </button>
  );
}
