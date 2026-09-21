import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  FileText, 
  Landmark, 
  ArrowRight, 
  Building2, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { DOC_GUIDES, DocType } from '../types';

export function GuiaDocumentosTable() {
  const [search, setSearch] = useState('');
  const [selectedEtapa, setSelectedEtapa] = useState<string>('todas');
  const [selectedDocCode, setSelectedDocCode] = useState<DocType | null>('NP');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const docEntries = Object.entries(DOC_GUIDES) as [DocType, typeof DOC_GUIDES[DocType]][];

  // Etapas únicas do ciclo orçamentário
  const etapas = ['todas', ...Array.from(new Set(docEntries.map(([_, info]) => info.etapaCiclo)))];

  // Filtragem
  const filteredDocs = docEntries.filter(([code, info]) => {
    const matchesSearch = 
      code.toLowerCase().includes(search.toLowerCase()) ||
      info.title.toLowerCase().includes(search.toLowerCase()) ||
      info.description.toLowerCase().includes(search.toLowerCase()) ||
      info.finalidade.toLowerCase().includes(search.toLowerCase()) ||
      info.detalhamento.toLowerCase().includes(search.toLowerCase()) ||
      (info.fieldsToWatch || []).join(' ').toLowerCase().includes(search.toLowerCase()) ||
      info.impactoContabil.toLowerCase().includes(search.toLowerCase());

    const matchesEtapa = selectedEtapa === 'todas' || info.etapaCiclo === selectedEtapa;

    return matchesSearch && matchesEtapa;
  });

  const selectedDoc = selectedDocCode ? DOC_GUIDES[selectedDocCode] : null;

  const handleCopy = (code: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Cabeçalho do Módulo */}
      <div className="p-5 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 dark:from-blue-950/60 dark:via-[#16181A] dark:to-purple-950/60 rounded-2xl border border-blue-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[9px] font-black uppercase tracking-wider">
              Tabela Oficial • 15 Documentos
            </span>
            <span className="text-[10px] text-white/50">Normas STN / SIAFI</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Guia Completo dos 15 Documentos SIAFI
          </h3>
          <p className="text-xs text-white/70 max-w-2xl mt-0.5 leading-relaxed">
            Consulte a finalidade, impacto contábil, responsáveis e detalhamento de cada um dos 15 documentos do SIAFI de forma limpa, direta e sem linguagem hermética.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-white/10 dark:bg-white/5 rounded-xl border border-white/10 text-white text-xs font-mono font-bold flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-blue-400" />
            <span>15 Tipos Cadastrados</span>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros Rápidos */}
      <div className="bg-white dark:bg-[#16181A] p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-black/40 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código (ex: NP, NE, RP, DD), nome ou palavra-chave..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-black/40 dark:text-white/40 shrink-0 ml-1" />
            {etapas.map((etapa) => (
              <button
                key={etapa}
                type="button"
                onClick={() => setSelectedEtapa(etapa)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedEtapa === etapa
                    ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                    : 'bg-gray-100 dark:bg-white/5 text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {etapa === 'todas' ? 'Todas as Etapas' : etapa}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Seletores Rápidos dos 15 Documentos (Cliques Rápidos) */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-1.5 pt-1">
          {filteredDocs.map(([code, info]) => {
            const isSelected = selectedDocCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedDocCode(code)}
                className={`p-2 rounded-xl text-left border transition-all flex flex-col items-center sm:items-start text-center sm:text-left ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm scale-[1.02]'
                    : 'bg-gray-50 dark:bg-[#202326] text-black dark:text-white border-black/5 dark:border-white/5 hover:border-blue-400/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black font-mono tracking-tight">{code}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-medium truncate hidden sm:inline ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60'
                  }`}>
                    {(info.origem || '').split('/')[0].trim()}
                  </span>
                </div>
                <span className="text-[10px] font-semibold truncate w-full mt-0.5 opacity-90">
                  {info.title.replace(/^Roteiro de Análise:\s*/, '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cartão de Detalhes do Documento Selecionado (UX Limpa, Leiga e Despoluída) */}
      {selectedDoc && selectedDocCode && (
        <div className="bg-white dark:bg-[#16181A] p-5 sm:p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm space-y-5 transition-colors">
          {/* Topo do Cartão com Badges Claras */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black font-mono text-xl shadow-md border border-blue-400/30 shrink-0">
                {selectedDocCode}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base sm:text-lg font-black text-black dark:text-white uppercase tracking-tight">
                    {selectedDoc.nome}
                  </h4>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 rounded-full text-[10px] font-bold">
                    {selectedDoc.etapaCiclo}
                  </span>
                </div>
                <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                  Origem: <strong>{selectedDoc.origemRegistro}</strong> • Emissão: <strong>{selectedDoc.responsavelEmissao}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(selectedDocCode, `${selectedDocCode} - ${selectedDoc.nome}\nFinalidade: ${selectedDoc.finalidade}\nDetalhamento: ${selectedDoc.detalhamento}\nImpacto Contábil: ${selectedDoc.impactoContabil}`)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-black dark:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              {copiedCode === selectedDocCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-black/50 dark:text-white/50" />
                  <span>Copiar Resumo</span>
                </>
              )}
            </button>
          </div>

          {/* O que é / Finalidade em Linguagem Simples */}
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-xl space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Finalidade do Documento
            </div>
            <p className="text-sm font-medium text-black/90 dark:text-white/90 leading-relaxed">
              {selectedDoc.finalidade}
            </p>
          </div>

          {/* Detalhamento Completo */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 block">
              Detalhamento Prático & Aplicação no SIAFI
            </span>
            <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/5">
              {selectedDoc.detalhamento}
            </p>
          </div>

          {/* Grid de 4 Atributos Técnicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 dark:text-white/50 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" /> Principais Campos
              </span>
              <p className="text-xs font-semibold text-black dark:text-white">
                {selectedDoc.principaisCampos}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 dark:text-white/50 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-500" /> Impacto Contábil
              </span>
              <p className="text-xs font-semibold text-black dark:text-white">
                {selectedDoc.impactoContabil}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 dark:text-white/50 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Relação com Outros Documentos
              </span>
              <p className="text-xs font-semibold text-black dark:text-white">
                {selectedDoc.relacaoOutrosDocumentos}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 dark:text-white/50 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-500" /> Periodicidade
              </span>
              <p className="text-xs font-semibold text-black dark:text-white">
                {selectedDoc.periodicidade}
              </p>
            </div>
          </div>

          {/* Observações Técnicas */}
          {selectedDoc.observacoesTecnicas && (
            <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Observações Técnicas do Auditor
              </span>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                {selectedDoc.observacoesTecnicas}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
