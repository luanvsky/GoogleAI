import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  PenTool, 
  Layers, 
  Building2, 
  Scale, 
  Search, 
  Copy, 
  Check, 
  FileText,
  ShieldCheck,
  FileCheck,
  Info,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List
} from 'lucide-react';
import { ProcessEvidence } from '../types';

interface ProcessEvidenceTableProps {
  evidencias?: ProcessEvidence[];
}

export function ProcessEvidenceTable({ evidencias = [] }: ProcessEvidenceTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const pageSize = viewMode === 'cards' ? 4 : 8;

  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      TODAS: evidencias.length
    };
    evidencias.forEach(ev => {
      counts[ev.categoria] = (counts[ev.categoria] || 0) + 1;
    });
    return counts;
  }, [evidencias]);

  const filteredEvidencias = useMemo(() => {
    return evidencias.filter(ev => {
      const matchesCategory = selectedCategory === 'TODAS' || ev.categoria === selectedCategory;
      const matchesSearch = 
        !searchTerm ||
        ev.campo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.valorOuConteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.documentoOrigem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.impactoNoParecer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [evidencias, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredEvidencias.length / pageSize) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = filteredEvidencias.slice((safePage - 1) * pageSize, safePage * pageSize);

  const copyEvidencias = () => {
    const text = evidencias.map((ev, i) => 
      `${i + 1}. [${ev.categoria.toUpperCase()}] ${ev.campo}: "${ev.valorOuConteudo}"\n   Documento de Origem: ${ev.documentoOrigem}\n   Fundamentação no Parecer: ${ev.impactoNoParecer}\n`
    ).join('\n');

    navigator.clipboard.writeText(
      `ROL DE EVIDÊNCIAS ENCONTRADAS NO PROCESSO ORIGINAL\n` +
      `Total de Evidências Auditadas: ${evidencias.length}\n\n` + text
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'Valores':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF00]" />;
      case 'Datas':
        return <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'Assinaturas':
        return <PenTool className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'Classificação Orçamentária':
        return <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'Identificação / Favorecido':
        return <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'Atestes e Certidões':
        return <FileCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'Normativo / Autorizativo':
      default:
        return <Scale className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
    }
  };

  const getCategoryBadgeClass = (categoria: string) => {
    switch (categoria) {
      case 'Valores':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';
      case 'Datas':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
      case 'Assinaturas':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/40';
      case 'Classificação Orçamentária':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40';
      case 'Identificação / Favorecido':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40';
      case 'Atestes e Certidões':
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/40';
      case 'Normativo / Autorizativo':
      default:
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/40';
    }
  };

  return (
    <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-3.5 transition-colors">
      {/* HEADER DA SEÇÃO */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 dark:bg-[#00FF00]/15 text-emerald-800 dark:text-[#00FF00] rounded-xl">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
              Evidências Encontradas no Processo
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                {evidencias.length}
              </span>
            </h4>
            <p className="text-[11px] text-black/60 dark:text-white/60">
              Navegação paginada sem rolagem de tela.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#202326] p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                viewMode === 'cards'
                  ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                  : 'text-black/60 dark:text-white/60'
              }`}
            >
              <LayoutGrid className="w-3 h-3" /> Cartões
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                  : 'text-black/60 dark:text-white/60'
              }`}
            >
              <List className="w-3 h-3" /> Tabela
            </button>
          </div>

          {evidencias.length > 0 && (
            <button
              type="button"
              onClick={copyEvidencias}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-black dark:text-white border border-black/5 dark:border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-[#00FF00]" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copiar Rol
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* FILTROS E PESQUISA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-bold">
          {Object.entries(categories).map(([cat, count]) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1 whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-black text-[#00FF00] dark:bg-white dark:text-black shadow-sm'
                  : 'bg-gray-100 dark:bg-[#202326] text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-[#282C30]'
              }`}
            >
              <span>{cat === 'TODAS' ? 'Todas' : cat}</span>
              <span className="opacity-60 text-[9px]">({count})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56 shrink-0">
          <Search className="w-3.5 h-3.5 text-black/40 dark:text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar evidência..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-3 py-1 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
        </div>
      </div>

      {/* CONTEÚDO: MODO CARTÕES OU MODO TABELA */}
      {filteredEvidencias.length === 0 ? (
        <div className="p-8 text-center text-xs text-black/50 dark:text-white/50 space-y-2 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
          <Info className="w-6 h-6 mx-auto text-black/30 dark:text-white/30" />
          <div>Nenhuma evidência localizada com os critérios de filtro selecionados.</div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {paginated.map((evidencia, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl space-y-2 hover:border-black/20 dark:hover:border-white/20 transition-colors text-xs"
            >
              <div className="flex items-start justify-between flex-wrap gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${getCategoryBadgeClass(evidencia.categoria)}`}>
                  {getCategoryIcon(evidencia.categoria)}
                  {evidencia.categoria}
                </span>

                <span className="text-[10px] text-black/60 dark:text-white/60 font-medium truncate max-w-[170px]">
                  Origem: <strong>{evidencia.documentoOrigem}</strong>
                </span>
              </div>

              <div className="font-bold text-black dark:text-white text-xs">
                {evidencia.campo}
              </div>

              <div className="p-2 bg-white dark:bg-[#16181A] rounded-lg border border-black/5 dark:border-white/10 font-mono text-[11px] text-emerald-700 dark:text-[#00FF00] font-semibold break-words">
                {evidencia.valorOuConteudo}
              </div>

              <div className="text-[10px] text-black/70 dark:text-white/70 leading-relaxed line-clamp-2">
                <strong>Parecer:</strong> {evidencia.impactoNoParecer}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* MODO TABELA SINTÉTICA COMPACTA */
        <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#181a1d]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#202326] border-b border-black/10 dark:border-white/10 text-[9px] uppercase font-black text-black/60 dark:text-white/60 tracking-wider">
                <th className="p-2">Categoria</th>
                <th className="p-2">Campo</th>
                <th className="p-2">Dado Extraído</th>
                <th className="p-2">Documento de Origem</th>
                <th className="p-2">Fundamentação Técnica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[11px]">
              {paginated.map((ev, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                  <td className="p-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getCategoryBadgeClass(ev.categoria)}`}>
                      {ev.categoria}
                    </span>
                  </td>
                  <td className="p-2 font-bold text-black dark:text-white whitespace-nowrap">
                    {ev.campo}
                  </td>
                  <td className="p-2 font-mono font-semibold text-emerald-700 dark:text-[#00FF00] whitespace-nowrap">
                    {ev.valorOuConteudo}
                  </td>
                  <td className="p-2 text-black/70 dark:text-white/70 whitespace-nowrap">
                    {ev.documentoOrigem}
                  </td>
                  <td className="p-2 text-black/80 dark:text-white/80 max-w-xs truncate">
                    {ev.impactoNoParecer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINAÇÃO COMPACTA */}
      <div className="flex items-center justify-between text-xs px-1 pt-1 text-black/60 dark:text-white/60">
        <div className="text-[11px]">
          Exibindo <strong>{filteredEvidencias.length > 0 ? (safePage - 1) * pageSize + 1 : 0}</strong> a <strong>{Math.min(safePage * pageSize, filteredEvidencias.length)}</strong> de <strong>{filteredEvidencias.length}</strong> evidências
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1 px-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#202326] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Anterior
          </button>

          <span className="text-[11px] font-mono font-bold text-black dark:text-white">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-1 px-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#202326] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 text-black dark:text-white"
          >
            Próximo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
