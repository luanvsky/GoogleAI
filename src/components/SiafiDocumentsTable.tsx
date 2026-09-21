import React, { useState } from 'react';
import { SiafiDocumentAudit } from '../types';
import { 
  Landmark, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  LayoutGrid,
  Maximize2
} from 'lucide-react';

interface SiafiDocumentsTableProps {
  documentos?: SiafiDocumentAudit[];
}

export function SiafiDocumentsTable({ documentos }: SiafiDocumentsTableProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'focused' | 'paginated'>('focused');
  const [page, setPage] = useState<number>(1);
  const pageSize = 4;

  if (!documentos || documentos.length === 0) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-[#202326] rounded-2xl border border-black/5 dark:border-white/10 text-center space-y-2">
        <Landmark className="w-8 h-8 text-black/40 dark:text-white/40 mx-auto" />
        <div className="text-xs font-bold text-black/70 dark:text-white/70">
          Nenhum documento emitido pelo SIAFI foi individualizado neste processo.
        </div>
        <p className="text-[10px] text-black/40 dark:text-white/40 max-w-sm mx-auto">
          Os atos de gestão podem estar amparados em documento de despesa mercantil direta ou lista de credores externa.
        </p>
      </div>
    );
  }

  const getDocColor = (tipo: string) => {
    switch (tipo.toUpperCase()) {
      case 'NP':
        return 'bg-emerald-600 text-white border-emerald-500';
      case 'RP':
        return 'bg-orange-600 text-white border-orange-500';
      case 'DB':
        return 'bg-cyan-700 text-white border-cyan-600';
      case 'NC':
        return 'bg-blue-600 text-white border-blue-500';
      case 'NE':
        return 'bg-amber-600 text-white border-amber-500';
      case 'PA':
        return 'bg-violet-600 text-white border-violet-500';
      case 'RC':
        return 'bg-emerald-700 text-white border-emerald-600';
      case 'DD':
        return 'bg-rose-600 text-white border-rose-500';
      case 'PF':
        return 'bg-fuchsia-700 text-white border-fuchsia-600';
      case 'AV':
      case 'OB':
        return 'bg-teal-700 text-white border-teal-600';
      case 'FL':
        return 'bg-purple-700 text-white border-purple-600';
      case 'ND':
        return 'bg-indigo-600 text-white border-indigo-500';
      case 'PC':
        return 'bg-yellow-700 text-white border-yellow-600';
      case 'DT':
        return 'bg-sky-700 text-white border-sky-600';
      case 'SF':
        return 'bg-lime-700 text-white border-lime-600';
      case 'NS':
        return 'bg-purple-600 text-white border-purple-500';
      case 'RO':
        return 'bg-indigo-600 text-white border-indigo-500';
      case 'LF':
        return 'bg-sky-700 text-white border-sky-600';
      default:
        return 'bg-neutral-800 text-white border-neutral-700';
    }
  };

  const safeIndex = Math.min(Math.max(0, selectedIndex), documentos.length - 1);
  const activeDoc = documentos[safeIndex];

  const totalPages = Math.ceil(documentos.length / pageSize) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedDocs = documentos.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-3">
      {/* Top Banner & View Switcher */}
      <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-800 dark:text-blue-300">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-950 dark:text-blue-200 flex items-center gap-2">
              <span>Atos Contábeis no SIAFI</span>
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-mono font-bold">
                {documentos.length} atos auditados
              </span>
            </div>
            <p className="text-[11px] text-blue-900/80 dark:text-blue-200/80">
              Macrofunção SIAFI 020314 • Auditoria pontual sem rolagem vertical.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-[#181a1d] p-1 rounded-xl border border-black/10 dark:border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('focused')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'focused'
                ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" /> Focado (1 por tela)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('paginated')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'paginated'
                ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Paginado ({pageSize}/pág)
          </button>
        </div>
      </div>

      {/* MODO 1: VISUALIZADOR FOCADO (ZERO ROLAGEM) */}
      {viewMode === 'focused' && (
        <div className="space-y-3">
          {/* Barra Horizontal de Seleção de Documento */}
          <div className="flex items-center justify-between gap-2 p-1.5 bg-gray-100 dark:bg-[#181a1d] rounded-2xl border border-black/10 dark:border-white/10">
            <button
              type="button"
              disabled={safeIndex <= 0}
              onClick={() => setSelectedIndex(i => Math.max(0, i - 1))}
              className="p-1.5 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#202326] disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white shrink-0"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            {/* Chips de Documentos */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-1 scrollbar-none">
              {documentos.map((doc, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black border-transparent shadow-sm'
                        : 'bg-white dark:bg-[#202326] text-black/70 dark:text-white/70 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${getDocColor(doc.tipo)}`}>
                      {doc.tipo}
                    </span>
                    <span className="font-mono text-[11px]">{doc.numero}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={safeIndex >= documentos.length - 1}
              onClick={() => setSelectedIndex(i => Math.min(documentos.length - 1, i + 1))}
              className="p-1.5 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#202326] disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white shrink-0"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Painel do Documento Ativo */}
          {activeDoc && (
            <div className="p-5 bg-white dark:bg-[#181a1d] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm space-y-3 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap border-b border-black/5 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase border shadow-sm ${getDocColor(activeDoc.tipo)}`}>
                    {activeDoc.tipo}
                  </span>
                  <div>
                    <div className="text-base font-black text-black dark:text-white font-mono tracking-tight flex items-center gap-2">
                      <span>{activeDoc.numero}</span>
                      <span className="text-[10px] font-sans font-normal text-black/50 dark:text-white/50">
                        (Ato {safeIndex + 1} de {documentos.length})
                      </span>
                    </div>
                    {activeDoc.data && (
                      <div className="text-[11px] text-black/50 dark:text-white/50 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Data de Emissão: {activeDoc.data}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-black dark:text-white font-mono bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-xl">
                    R$ {activeDoc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    activeDoc.status === 'REGULAR'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                      : activeDoc.status === 'RESSALVA'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300'
                  }`}>
                    {activeDoc.status}
                  </span>
                </div>
              </div>

              {/* Favorecido e Célula Orçamentária */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeDoc.favorecido && (
                  <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-0.5">
                    <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                      Favorecido / Destinatário
                    </span>
                    <div className="font-bold text-black/90 dark:text-white/90">
                      {activeDoc.favorecido}
                    </div>
                  </div>
                )}

                {activeDoc.classificacaoOuContas && (
                  <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-0.5">
                    <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                      Célula Orçamentária / Contas Contábeis
                    </span>
                    <div className="font-mono text-[11px] text-black/80 dark:text-white/80">
                      {activeDoc.classificacaoOuContas}
                    </div>
                  </div>
                )}
              </div>

              {/* Eventos SIAFI */}
              {activeDoc.eventos && activeDoc.eventos.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest">
                    Eventos Contábeis:
                  </span>
                  {activeDoc.eventos.map((ev, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded text-[10px] font-mono text-blue-800 dark:text-blue-300 font-bold">
                      {ev}
                    </span>
                  ))}
                </div>
              )}

              {/* Descrição / Transcrição da OBS */}
              {activeDoc.descricaoOuObservacao && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                    Transcrição do Campo OBSERVAÇÃO (Macrofunção 020314)
                  </span>
                  <div className="p-3 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-black/90 dark:text-white/90 leading-relaxed break-words">
                    "{activeDoc.descricaoOuObservacao}"
                  </div>
                </div>
              )}

              {/* Parecer do Conformista */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF00]" />
                  Parecer Técnico do Conformista sobre este Documento
                </div>
                <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-sans text-[11px]">
                  {activeDoc.parecerTecnico}
                </p>
              </div>

              {/* Signatários */}
              {activeDoc.signatarios && activeDoc.signatarios.length > 0 && (
                <div className="text-[10px] text-black/50 dark:text-white/50 flex items-center gap-1 pt-1 border-t border-black/5 dark:border-white/10">
                  <User className="w-3.5 h-3.5" /> Signatário(s) / Agente(s): {activeDoc.signatarios.join(' • ')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODO 2: LISTA COMPACTA PAGINADA */}
      {viewMode === 'paginated' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paginatedDocs.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 bg-white dark:bg-[#181a1d] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm space-y-2 hover:border-black/20 dark:hover:border-white/20 transition-all text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getDocColor(doc.tipo)}`}>
                      {doc.tipo}
                    </span>
                    <span className="font-mono font-bold text-black dark:text-white">{doc.numero}</span>
                  </div>
                  <span className="font-mono font-bold text-black dark:text-white text-[11px]">
                    R$ {doc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {doc.favorecido && (
                  <div className="text-[11px] text-black/70 dark:text-white/70 truncate">
                    <strong>Favorecido:</strong> {doc.favorecido}
                  </div>
                )}

                {doc.descricaoOuObservacao && (
                  <div className="p-2 bg-gray-50 dark:bg-[#202326] rounded-lg font-mono text-[10px] text-black/80 dark:text-white/80 line-clamp-2">
                    "{doc.descricaoOuObservacao}"
                  </div>
                )}

                <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-[#00FF00] shrink-0" />
                  <span className="truncate">{doc.parecerTecnico}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-black/60 dark:text-white/60">
            <div className="text-[11px]">
              Página <strong>{safePage}</strong> de <strong>{totalPages}</strong> ({documentos.length} atos)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 px-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#181a1d] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 px-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#181a1d] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white"
              >
                Próximo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
