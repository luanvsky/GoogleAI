import React, { useState, useMemo } from 'react';
import { ProcessDocumentDetail } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Eye, 
  Check, 
  UserCheck, 
  Calendar,
  X
} from 'lucide-react';

interface ProcessDocumentsTableProps {
  documentos?: ProcessDocumentDetail[];
  fallbackDocs?: string[];
}

export function ProcessDocumentsTable({ documentos, fallbackDocs }: ProcessDocumentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [inspectedDoc, setInspectedDoc] = useState<ProcessDocumentDetail | null>(null);

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

  // Filtragem
  const filtered = useMemo(() => {
    return documentos.filter(doc => {
      const matchSearch = 
        !searchTerm || 
        doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.numeroSei.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.signatarioOuSetor && doc.signatarioOuSetor.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = 
        selectedCategory === 'TODOS' ||
        (selectedCategory === 'SOLICITACAO' && doc.tipo.toLowerCase().includes('solicita')) ||
        (selectedCategory === 'EDITAL' && (doc.tipo.toLowerCase().includes('edital') || doc.tipo.toLowerCase().includes('homolog'))) ||
        (selectedCategory === 'FREQUENCIA' && (doc.tipo.toLowerCase().includes('frequ') || doc.tipo.toLowerCase().includes('ponto') || doc.tipo.toLowerCase().includes('ateste'))) ||
        (selectedCategory === 'CALCULO' && (doc.tipo.toLowerCase().includes('planilha') || doc.tipo.toLowerCase().includes('calculo') || doc.tipo.toLowerCase().includes('dam'))) ||
        (selectedCategory === 'AUTORIZACAO' && (doc.tipo.toLowerCase().includes('despacho') || doc.tipo.toLowerCase().includes('portaria')));

      return matchSearch && matchCategory;
    });
  }, [documentos, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-3">
      {/* Top Banner Compacto com Estatística */}
      <div className="p-3.5 bg-gray-50 dark:bg-[#1f2226] border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-black/5 dark:bg-white/10 rounded-xl text-black dark:text-white">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
              <span>Instrução Processual SEI</span>
              <span className="px-2 py-0.5 bg-black dark:bg-[#00FF00] text-[#00FF00] dark:text-black rounded-full text-[10px] font-mono font-bold">
                {documentos.length} peças
              </span>
            </div>
            <p className="text-[11px] text-black/60 dark:text-white/60">
              Navegação paginada sem rolagem para exame minucioso de cada peça do processo.
            </p>
          </div>
        </div>

        {/* Input de Busca */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-black/40 dark:text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por Nº SEI, peça ou autor..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#141618] border border-black/10 dark:border-white/10 rounded-xl text-xs text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
        </div>
      </div>

      {/* Categorias Rápidas */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
        {[
          { id: 'TODOS', label: `Todos (${documentos.length})` },
          { id: 'SOLICITACAO', label: 'Solicitações' },
          { id: 'EDITAL', label: 'Editais / Seleção' },
          { id: 'FREQUENCIA', label: 'Frequência / Atestes' },
          { id: 'CALCULO', label: 'Planilhas & Tributos' },
          { id: 'AUTORIZACAO', label: 'Despachos & Reitoria' }
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#1f2226] text-black/70 dark:text-white/70 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* INSPETOR INLINE DO DOCUMENTO SELECIONADO (SEM ROLAGEM) */}
      {inspectedDoc && (
        <div className="p-4 bg-emerald-50/50 dark:bg-[#1a221d] border-2 border-emerald-300 dark:border-[#00FF00]/40 rounded-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 dark:bg-[#00FF00]/20 text-emerald-800 dark:text-[#00FF00] rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider text-emerald-700 dark:text-[#00FF00] block">
                  Peça em Exame Detalhado
                </span>
                <h5 className="text-xs font-black text-black dark:text-white">
                  {inspectedDoc.tipo} • Nº SEI {inspectedDoc.numeroSei} {inspectedDoc.folhaOuPagina && `(${inspectedDoc.folhaOuPagina})`}
                </h5>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectedDoc(null)}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-black/50 dark:text-white/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-black/85 dark:text-white/85 leading-relaxed bg-white dark:bg-[#141618] p-3 rounded-xl border border-black/5 dark:border-white/10">
            {inspectedDoc.descricao}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 bg-white dark:bg-[#141618] rounded-lg border border-black/5 dark:border-white/10 flex items-center gap-1.5 text-black/70 dark:text-white/70">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF00] shrink-0" />
              <span className="truncate">Origem: <strong>{inspectedDoc.signatarioOuSetor || 'Gabinete / Setor'}</strong></span>
            </div>

            <div className="p-2 bg-white dark:bg-[#141618] rounded-lg border border-black/5 dark:border-white/10 flex items-center gap-1.5 text-black/70 dark:text-white/70">
              <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Data/Período: <strong>{inspectedDoc.data || 'Mês de Referência'}</strong></span>
            </div>

            <div className="p-2 bg-white dark:bg-[#141618] rounded-lg border border-black/5 dark:border-white/10 flex items-center justify-between">
              <span className="text-black/60 dark:text-white/60">Status no Parecer:</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-md text-[10px]">
                {inspectedDoc.statusConformidade}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabela Compacta Paginada */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#181a1d]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#202326] border-b border-black/10 dark:border-white/10 text-[9px] uppercase font-black text-black/60 dark:text-white/60 tracking-wider">
              <th className="p-2.5">Peça / Tipo</th>
              <th className="p-2.5">Nº SEI</th>
              <th className="p-2.5">Descrição Sumária</th>
              <th className="p-2.5">Origem</th>
              <th className="p-2.5 text-center">Status</th>
              <th className="p-2.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-xs text-black/50 dark:text-white/50">
                  Nenhum documento encontrado com os filtros informados.
                </td>
              </tr>
            ) : (
              paginated.map((doc, idx) => {
                const isInspected = inspectedDoc?.numeroSei === doc.numeroSei;
                return (
                  <tr 
                    key={idx} 
                    className={`transition-colors cursor-pointer ${
                      isInspected 
                        ? 'bg-emerald-50/70 dark:bg-[#00FF00]/10' 
                        : 'hover:bg-gray-50/80 dark:hover:bg-white/5'
                    }`}
                    onClick={() => setInspectedDoc(doc)}
                  >
                    <td className="p-2.5 font-bold text-black dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                        <span className="truncate max-w-[130px]">{doc.tipo}</span>
                      </div>
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-black/70 dark:text-white/70 whitespace-nowrap">
                      <span className="font-semibold text-black dark:text-white">{doc.numeroSei}</span>
                      {doc.folhaOuPagina && (
                        <span className="text-[9px] text-black/40 dark:text-white/40 block">{doc.folhaOuPagina}</span>
                      )}
                    </td>
                    <td className="p-2.5 text-black/80 dark:text-white/80 max-w-[280px] truncate text-[11px]">
                      {doc.descricao}
                    </td>
                    <td className="p-2.5 text-[11px] text-black/60 dark:text-white/60 whitespace-nowrap max-w-[140px] truncate">
                      {doc.signatarioOuSetor || '—'}
                    </td>
                    <td className="p-2.5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        doc.statusConformidade === 'CONFORME'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}>
                        {doc.statusConformidade === 'CONFORME' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {doc.statusConformidade}
                      </span>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setInspectedDoc(doc); }}
                        className="p-1 px-2 text-[10px] font-bold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg text-black dark:text-white transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Ver
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação (Mantém o tamanho fixo da janela) */}
      <div className="flex items-center justify-between text-xs px-2 py-1 text-black/60 dark:text-white/60">
        <div className="text-[11px]">
          Mostrando <strong>{filtered.length > 0 ? (safePage - 1) * pageSize + 1 : 0}</strong> a <strong>{Math.min(safePage * pageSize, filtered.length)}</strong> de <strong>{filtered.length}</strong> documentos
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1.5 px-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#181a1d] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Anterior
          </button>

          <span className="text-[11px] font-mono font-bold text-black dark:text-white">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 px-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#181a1d] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white"
          >
            Próximo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
