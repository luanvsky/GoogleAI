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
  Info
} from 'lucide-react';
import { ProcessEvidence } from '../types';

interface ProcessEvidenceTableProps {
  evidencias?: ProcessEvidence[];
}

export function ProcessEvidenceTable({ evidencias = [] }: ProcessEvidenceTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

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

  // Resumo de contagens
  const countValores = evidencias.filter(e => e.categoria === 'Valores').length;
  const countDatas = evidencias.filter(e => e.categoria === 'Datas').length;
  const countAssinaturas = evidencias.filter(e => e.categoria === 'Assinaturas').length;
  const countAtestes = evidencias.filter(e => e.categoria === 'Atestes e Certidões' || e.categoria === 'Normativo / Autorizativo').length;

  return (
    <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-4 transition-colors">
      {/* HEADER DA SEÇÃO */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" />
            Evidências Encontradas no Processo Original
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
              {evidencias.length}
            </span>
          </h4>
          <p className="text-[11px] text-black/60 dark:text-white/60 mt-0.5">
            Mapeamento dos campos concretos (valores, datas, assinaturas e atestes) que embasaram o parecer técnico final.
          </p>
        </div>

        {evidencias.length > 0 && (
          <button
            type="button"
            onClick={copyEvidencias}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-black dark:text-white"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-[#00FF00]" /> Rol Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copiar Rol de Evidências
              </>
            )}
          </button>
        )}
      </div>

      {/* CARDS DE RESUMO DAS EVIDÊNCIAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="p-3 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#00FF00] mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Valores Auditados</span>
          </div>
          <div className="text-base font-black text-black dark:text-white font-mono">{countValores}</div>
          <div className="text-[9px] text-black/50 dark:text-white/50">Montantes, retenções e taxas</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Datas e Prazos</span>
          </div>
          <div className="text-base font-black text-black dark:text-white font-mono">{countDatas}</div>
          <div className="text-[9px] text-black/50 dark:text-white/50">Vencimento, emissão e cronologia</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl">
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 mb-1">
            <PenTool className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Assinaturas e Atos</span>
          </div>
          <div className="text-base font-black text-black dark:text-white font-mono">{countAssinaturas}</div>
          <div className="text-[9px] text-black/50 dark:text-white/50">Ordenadores, Reitoria e Fiscais</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl">
          <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 mb-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Atestes & CNDs</span>
          </div>
          <div className="text-base font-black text-black dark:text-white font-mono">{countAtestes}</div>
          <div className="text-[9px] text-black/50 dark:text-white/50">Regularidade e liquidação física</div>
        </div>
      </div>

      {/* FILTROS E PESQUISA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-black/5 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(categories).map(([cat, count]) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-black text-[#00FF00] dark:bg-white dark:text-black shadow-sm'
                  : 'bg-gray-100 dark:bg-[#202326] text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-[#282C30]'
              }`}
            >
              <span>{cat === 'TODAS' ? 'Todas' : cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                selectedCategory === cat
                  ? 'bg-white/20 text-[#00FF00] dark:bg-black/20 dark:text-black font-mono'
                  : 'bg-black/5 dark:bg-white/10 font-mono'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Buscar por campo, valor, doc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-lg text-xs text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-black dark:focus:border-white"
          />
        </div>
      </div>

      {/* LISTAGEM DE EVIDÊNCIAS */}
      {filteredEvidencias.length === 0 ? (
        <div className="p-8 text-center text-xs text-black/50 dark:text-white/50 space-y-2 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
          <Info className="w-6 h-6 mx-auto text-black/30 dark:text-white/30" />
          <div>Nenhuma evidência localizada com os critérios de filtro selecionados.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvidencias.map((evidencia, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl space-y-2.5 hover:border-black/20 dark:hover:border-white/20 transition-colors"
            >
              {/* Top row: Campo, Categoria Badge, Origem */}
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${getCategoryBadgeClass(evidencia.categoria)}`}>
                    {getCategoryIcon(evidencia.categoria)}
                    {evidencia.categoria}
                  </span>
                  <h5 className="text-xs font-black text-black dark:text-white">
                    {evidencia.campo}
                  </h5>
                </div>

                <div className="text-[10px] text-black/60 dark:text-white/60 flex items-center gap-1 font-medium bg-white dark:bg-[#16181A] px-2.5 py-0.5 rounded-md border border-black/5 dark:border-white/10">
                  <FileText className="w-3 h-3 text-black/40 dark:text-white/40" />
                  <span>Origem: <strong>{evidencia.documentoOrigem}</strong></span>
                </div>
              </div>

              {/* Valor / Conteúdo extraído */}
              <div className="p-2.5 bg-white dark:bg-[#16181A] rounded-lg border border-black/5 dark:border-white/10 font-mono text-[11px] text-black/90 dark:text-white/90 break-words flex items-start gap-2">
                <span className="text-[9px] font-black uppercase text-black/40 dark:text-white/40 shrink-0 select-none mt-0.5">
                  Dado Extraído:
                </span>
                <span className="font-semibold text-emerald-700 dark:text-[#00FF00]">
                  {evidencia.valorOuConteudo}
                </span>
              </div>

              {/* Impacto no Parecer Técnico */}
              <div className="flex items-start gap-2 text-[11px] text-black/80 dark:text-white/80 leading-relaxed font-sans pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-black/90 dark:text-white/90">Fundamentação Técnica no Parecer:</strong>{' '}
                  <span className="text-black/70 dark:text-white/70">{evidencia.impactoNoParecer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER INFORMATIVO */}
      <div className="p-3 bg-black dark:bg-[#0C0D0E] text-[#00FF00] rounded-xl text-xs font-mono flex items-center justify-between border border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#00FF00]" />
          <span>Rastreabilidade Processual Plena (Art. 63 Lei 4.320/64 c/c Macrofunção SIAFI 020314)</span>
        </div>
        <span className="text-[10px] text-white/70">
          Todas as evidências extraídas correspondem a peças autênticas do processo.
        </span>
      </div>
    </div>
  );
}
