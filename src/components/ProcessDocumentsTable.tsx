import React from 'react';
import { ProcessDocumentDetail } from '../types';
import { FileText, CheckCircle2, AlertTriangle, Building, Calendar, Layers } from 'lucide-react';

interface ProcessDocumentsTableProps {
  documentos?: ProcessDocumentDetail[];
  fallbackDocs?: string[];
}

export function ProcessDocumentsTable({ documentos, fallbackDocs }: ProcessDocumentsTableProps) {
  if ((!documentos || documentos.length === 0) && (!fallbackDocs || fallbackDocs.length === 0)) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-[#202326] rounded-2xl border border-black/5 dark:border-white/10 text-center space-y-2">
        <FileText className="w-8 h-8 text-black/40 dark:text-white/40 mx-auto" />
        <div className="text-xs font-bold text-black/70 dark:text-white/70">
          Nenhuma peça processual individualizada no relatório.
        </div>
      </div>
    );
  }

  // Se não temos a lista estruturada, usamos os identificados simples
  if (!documentos || documentos.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/60">
          Documentos Localizados no Processo ({fallbackDocs?.length})
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fallbackDocs?.map((doc, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-[#181a1d] border border-black/5 dark:border-white/10 rounded-xl flex items-center gap-2 text-xs">
              <FileText className="w-4 h-4 text-black/50 dark:text-white/50 shrink-0" />
              <span className="font-medium text-black/80 dark:text-white/80">{doc}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-gray-50 dark:bg-[#1f2226] border border-black/10 dark:border-white/10 rounded-2xl flex items-start gap-3">
        <Layers className="w-5 h-5 text-black/70 dark:text-white/70 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-black uppercase tracking-wider text-[10px] text-black/80 dark:text-white/80">
            Instrução Processual SEI Analisada ({documentos.length} Documentos)
          </div>
          <p className="text-[11px] text-black/70 dark:text-white/70 leading-relaxed">
            Relação completa de atos, termos de referência, portarias, despachos e documentos comprobatórios examinados para atestar a regularidade da liquidação e pagamento.
          </p>
        </div>
      </div>

      {/* Table / List of SEI Docs */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#181a1d]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#202326] border-b border-black/10 dark:border-white/10 text-[9px] uppercase font-black text-black/60 dark:text-white/60 tracking-wider">
              <th className="p-3">Peça / Tipo</th>
              <th className="p-3">Nº SEI / Folha</th>
              <th className="p-3">Descrição / Finalidade</th>
              <th className="p-3">Origem / Signatário</th>
              <th className="p-3 text-right">Conformidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {documentos.map((doc, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-black dark:text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                    <span>{doc.tipo}</span>
                  </div>
                </td>
                <td className="p-3 font-mono text-[11px] text-black/70 dark:text-white/70 whitespace-nowrap">
                  <div>{doc.numeroSei}</div>
                  {doc.folhaOuPagina && (
                    <span className="text-[9px] text-black/40 dark:text-white/40">{doc.folhaOuPagina}</span>
                  )}
                </td>
                <td className="p-3 text-black/80 dark:text-white/80 leading-relaxed">
                  {doc.descricao}
                </td>
                <td className="p-3 text-[11px] text-black/60 dark:text-white/60 whitespace-nowrap">
                  <div>{doc.signatarioOuSetor || '—'}</div>
                  {doc.data && <div className="text-[9px] text-black/40 dark:text-white/40">{doc.data}</div>}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    doc.statusConformidade === 'CONFORME'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : doc.statusConformidade === 'NÃO SE APLICA'
                      ? 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}>
                    {doc.statusConformidade === 'CONFORME' && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {doc.statusConformidade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
