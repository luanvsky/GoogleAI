import React from 'react';
import { SiafiDocumentAudit } from '../types';
import { Landmark, CheckCircle2, AlertTriangle, FileText, User, Calendar, DollarSign, Tag, ArrowRight } from 'lucide-react';

interface SiafiDocumentsTableProps {
  documentos?: SiafiDocumentAudit[];
}

export function SiafiDocumentsTable({ documentos }: SiafiDocumentsTableProps) {
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
      case 'NC':
        return 'bg-blue-600 text-white border-blue-500';
      case 'RO':
        return 'bg-indigo-600 text-white border-indigo-500';
      case 'NE':
        return 'bg-amber-600 text-white border-amber-500';
      case 'NS':
        return 'bg-purple-600 text-white border-purple-500';
      case 'NP':
        return 'bg-emerald-600 text-white border-emerald-500';
      case 'OB':
        return 'bg-teal-700 text-white border-teal-600';
      default:
        return 'bg-neutral-800 text-white border-neutral-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Explanatory Banner */}
      <div className="p-4 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex items-start gap-3">
        <Landmark className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-black uppercase tracking-wider text-[10px] text-blue-900 dark:text-blue-300">
            Exame Exaustivo dos Documentos Emitidos pelo SIAFI (Macrofunção 020314)
          </div>
          <p className="text-[11px] text-blue-950/90 dark:text-blue-200/90 leading-relaxed">
            Foram identificados e auditados individualmente <strong>{documentos.length} documento(s) contábeis/orçamentários</strong> registrados no Sistema Integrado de Administração Financeira (SIAFI). Cada documento foi verificado quanto a eventos, contas, signatários, saldo e exatidão descritiva.
          </p>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3.5">
        {documentos.map((doc, idx) => (
          <div 
            key={idx}
            className="p-5 bg-white dark:bg-[#181a1d] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm space-y-3 hover:border-black/20 dark:hover:border-white/20 transition-all"
          >
            {/* Header: Tipo, Número, Data, Status */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wider uppercase border shadow-sm ${getDocColor(doc.tipo)}`}>
                  {doc.tipo}
                </span>
                <div>
                  <div className="text-sm font-black text-black dark:text-white font-mono tracking-tight">
                    {doc.numero}
                  </div>
                  {doc.data && (
                    <div className="text-[10px] text-black/50 dark:text-white/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Data de Emissão: {doc.data}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-black dark:text-white font-mono bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                  R$ {doc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  doc.status === 'REGULAR'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                    : doc.status === 'RESSALVA'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>

            {/* Credor / Favorecido & Classificação Orçamentária */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {doc.favorecido && (
                <div className="p-2.5 bg-gray-50 dark:bg-[#222529] rounded-xl border border-black/5 dark:border-white/10 space-y-0.5">
                  <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                    Favorecido / Destinatário
                  </span>
                  <div className="font-bold text-black/90 dark:text-white/90 truncate">
                    {doc.favorecido}
                  </div>
                </div>
              )}

              {doc.classificacaoOuContas && (
                <div className="p-2.5 bg-gray-50 dark:bg-[#222529] rounded-xl border border-black/5 dark:border-white/10 space-y-0.5">
                  <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                    Célula Orçamentária / Contas Contábeis
                  </span>
                  <div className="font-mono text-[11px] text-black/80 dark:text-white/80 truncate">
                    {doc.classificacaoOuContas}
                  </div>
                </div>
              )}
            </div>

            {/* Eventos Contábeis */}
            {doc.eventos && doc.eventos.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest">
                  Eventos SIAFI:
                </span>
                {doc.eventos.map((ev, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded text-[10px] font-mono text-blue-800 dark:text-blue-300">
                    {ev}
                  </span>
                ))}
              </div>
            )}

            {/* Descrição / Observação lançada */}
            {doc.descricaoOuObservacao && (
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                  Descrição / Observação do Lançamento no SIAFI
                </span>
                <div className="p-3 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-black/90 dark:text-white/90 leading-relaxed">
                  "{doc.descricaoOuObservacao}"
                </div>
              </div>
            )}

            {/* Parecer Técnico Individual do Auditor */}
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF00]" />
                Parecer Técnico do Conformista sobre este Documento SIAFI
              </div>
              <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-sans text-[11px]">
                {doc.parecerTecnico}
              </p>
            </div>

            {/* Signatários */}
            {doc.signatarios && doc.signatarios.length > 0 && (
              <div className="text-[10px] text-black/40 dark:text-white/40 flex items-center gap-1 pt-1 border-t border-black/5 dark:border-white/10">
                <User className="w-3 h-3" /> Signatário(s): {doc.signatarios.join(' • ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
