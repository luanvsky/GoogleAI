import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  History, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  User, 
  Hash,
  Send,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ExternalLink,
  Calculator
} from 'lucide-react';
import { DocType, Analysis, CHECKLIST_BY_TYPE, RESTRICOES, DOC_GUIDES, TAX_RULES, TaxRule } from './types';

function TaxCalculator() {
  const [grossValue, setGrossValue] = useState<number>(0);
  const [selectedRule, setSelectedRule] = useState<TaxRule>(TAX_RULES[2]); // Default: Demais Serviços
  const [issRate, setIssRate] = useState<number>(2);
  const [issPrecoPublico, setIssPrecoPublico] = useState<number>(0);
  const [inssNormalRate, setInssNormalRate] = useState<number>(0);
  const [inssSpecial, setInssSpecial] = useState<number>(0);
  const [inssSpecialRate, setInssSpecialRate] = useState<number>(2);
  const [contaVinculada, setContaVinculada] = useState<number>(0);

  const irValue = Math.round((grossValue * selectedRule.ir)) / 100;
  const csllValue = Math.round((grossValue * selectedRule.csll)) / 100;
  const cofinsValue = Math.round((grossValue * selectedRule.cofins)) / 100;
  const pisValue = Math.round((grossValue * selectedRule.pis)) / 100;
  const federalTotal = Number((irValue + csllValue + cofinsValue + pisValue).toFixed(2));
  
  const issValue = Number(((grossValue * issRate) / 100 + issPrecoPublico).toFixed(2));
  const inssNormalValue = Math.round((grossValue * inssNormalRate)) / 100;

  const totalRetentions = Number((federalTotal + issValue + inssNormalValue + inssSpecial + contaVinculada).toFixed(2));
  const netValue = Number((grossValue - totalRetentions).toFixed(2));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-500">
      {/* Left Column: Input */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#141414] text-white p-6 rounded-3xl shadow-xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#00FF00]/10 rounded-xl">
              <Calculator className="w-5 h-5 text-[#00FF00]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#00FF00]">Parâmetros de Cálculo</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">Valor Bruto da NF-e</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xs">R$</span>
                <input 
                  type="number" 
                  value={grossValue || ''}
                  onChange={e => setGrossValue(Number(e.target.value))}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">Natureza do Serviço (IN 1234/12)</label>
              <select 
                value={selectedRule.id}
                onChange={e => {
                  const rule = TAX_RULES.find(r => r.id === e.target.value);
                  if (rule) setSelectedRule(rule);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 transition-all appearance-none"
              >
                {TAX_RULES.map(rule => (
                  <option key={rule.id} value={rule.id} className="bg-[#141414] text-white">
                    {rule.id} - {rule.label} ({rule.total}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">% ISSQN Retido</label>
                  <input 
                    type="number" 
                    value={issRate || ''}
                    onChange={e => setIssRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">Preço Público (DAM)</label>
                  <input 
                    type="number" 
                    value={issPrecoPublico || ''}
                    onChange={e => setIssPrecoPublico(Number(e.target.value))}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="p-3 px-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-white/20 block tracking-widest">Total ISSQN</span>
                <span className="text-sm font-bold">R$ {issValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
               <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">INSS Normal (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={inssNormalRate || ''}
                      onChange={e => setInssNormalRate(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xs">%</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">INSS Especial (%)</label>
                    <select 
                      value={inssSpecialRate}
                      onChange={e => setInssSpecialRate(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none"
                    >
                      <option value={0}>NÃO</option>
                      <option value={1}>1%</option>
                      <option value={2}>2%</option>
                      <option value={3}>3%</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">Valor MO Especial</label>
                    <input 
                      type="number" 
                      onChange={e => {
                        const base = Number(e.target.value);
                        setInssSpecial(Number(((base * inssSpecialRate) / 100).toFixed(2)));
                      }}
                      placeholder="BC Especial"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none"
                    />
                  </div>
               </div>

               <div>
                 <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">Retenção Conta Vinculada (R$)</label>
                 <input 
                   type="number" 
                   value={contaVinculada || ''}
                   onChange={e => setContaVinculada(Number(e.target.value))}
                   placeholder="Manual R$ 0,00"
                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none"
                 />
               </div>
            </div>
          </div>
        </div>

        {/* SIAFI Reference */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-black/40" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-black/60">Referências SIAFI</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-2xl border border-black/5">
              <span className="text-[8px] uppercase font-black text-black/30 block mb-1">DARF Único</span>
              <span className="text-xs font-mono font-bold text-[#00FF00] bg-black px-2 py-0.5 rounded">{selectedRule.darf}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl border border-black/5">
              <span className="text-[8px] uppercase font-black text-black/30 block mb-1">Natureza DDF</span>
              <span className="text-xs font-mono font-bold">{selectedRule.ddf}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Output / Results */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-black/5 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-black/20 mb-2">Memória de Cálculo</h2>
                <p className="text-lg font-serif italic text-black/60">{selectedRule.label}</p>
              </div>
              <div className="text-right">
                 <span className="text-[10px] uppercase font-black tracking-widest text-[#00FF00] bg-black px-3 py-1 rounded-full">Retenção Total</span>
                 <div className="text-3xl font-black mt-2">R$ {totalRetentions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-black/5">
              <div className="space-y-4">
                 <h4 className="text-[10px] uppercase font-black text-black/40 tracking-widest border-l-2 border-[#00FF00] pl-2">Detalhamento Federal</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-black/40">IR ({selectedRule.ir}%)</span>
                     <span className="font-mono font-bold">R$ {irValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-black/40">CSLL ({selectedRule.csll}%)</span>
                     <span className="font-mono font-bold">R$ {csllValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-black/40">COFINS ({selectedRule.cofins}%)</span>
                     <span className="font-mono font-bold">R$ {cofinsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-sm border-b border-dashed border-black/10 pb-2">
                     <span className="text-black/40">PIS/PASEP ({selectedRule.pis}%)</span>
                     <span className="font-mono font-bold">R$ {pisValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-xs font-black uppercase text-[#00FF00] bg-black p-2 rounded-lg">
                     <span>Total Federal</span>
                     <span>R$ {federalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] uppercase font-black text-black/40 tracking-widest border-l-2 border-[#00FF00] pl-2">Previdenciário e Municipal</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-black/40">INSS Normal ({inssNormalRate}%)</span>
                     <span className="font-mono font-bold">R$ {inssNormalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-black/40">INSS Especial</span>
                     <span className="font-mono font-bold">R$ {inssSpecial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-black/40">Conta Vinculada</span>
                     <span className="font-mono font-bold">R$ {contaVinculada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-sm border-b border-dashed border-black/10 pb-2">
                     <span className="text-black/40">ISSQN ({issRate}% + DAM)</span>
                     <span className="font-mono font-bold">R$ {issValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-3xl border border-black/5">
                      <span className="text-[9px] uppercase font-black text-black/20 block mb-1">Valor Líquido a Pagar</span>
                      <div className="text-2xl font-black text-black/80">R$ {netValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                   </div>
                 </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#00FF00]/5 rounded-3xl border border-[#00FF00]/10">
              <AlertCircle className="w-5 h-5 text-[#00CC00] flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-black/60 uppercase tracking-widest">Atenção Auditor</p>
                <p className="text-xs text-black/50 leading-relaxed italic">
                  Cálculos atualizados em conformidade com o <b>Manual de Procedimentos de Conformidade de Registro de Gestão 2026</b> (Portaria IFS nº 1.633/2026) e a <b>IN RFB nº 1.234/2012</b>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'form' | 'history' | 'calculator'>('form');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [conformista, setConformista] = useState('');
  const [processo, setProcesso] = useState('');
  const [numeroDoc, setNumeroDoc] = useState('');
  const [tipoDoc, setTipoDoc] = useState<DocType>('NE - Nota de Empenho');
  const [resultado, setResultado] = useState<'SEM OCORRÊNCIA' | 'COM OCORRÊNCIA'>('SEM OCORRÊNCIA');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [selectedRestricoes, setSelectedRestricoes] = useState<string[]>([]);
  const [observacao, setObservacao] = useState('');
  const [isRoteiroOpen, setIsRoteiroOpen] = useState(true);

  useEffect(() => {
    setIsRoteiroOpen(true);
  }, [tipoDoc]);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await fetch('/api/analyses');
      const data = await res.json();
      setAnalyses(data);
    } catch (err) {
      console.error("Erro ao buscar histórico", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conformista || !processo) return alert("Preencha os campos obrigatórios!");

    setLoading(true);
    const payload = {
      conformista,
      processo,
      numeroDoc,
      tipoDoc,
      resultado,
      checklist,
      restricoes: selectedRestricoes,
      observacao
    };

    try {
      const res = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Análise registrada com sucesso!");
        resetForm();
        fetchAnalyses();
        setView('history');
      }
    } catch (err) {
      alert("Erro ao salvar análise.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProcesso('');
    setNumeroDoc('');
    setChecklist({});
    setSelectedRestricoes([]);
    setObservacao('');
    setResultado('SEM OCORRÊNCIA');
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRestricao = (code: string) => {
    setSelectedRestricoes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const downloadCSV = () => {
    if (analyses.length === 0) return alert("Nenhuma análise para baixar.");

    const headers = [
      "ID", 
      "Data_Registro", 
      "Hora_Registro", 
      "Conformista", 
      "Processo_SEI", 
      "Numero_Documento", 
      "Tipo_Documento", 
      "Resultado", 
      "Ocorrencias", 
      "Observacao", 
      "Checklist_Detalhado"
    ];

    const rows = analyses.map(item => {
      const date = new Date(item.timestamp);
      
      // Create a detailed string for the checklist
      const checklistDetails = (CHECKLIST_BY_TYPE[item.tipoDoc] || [])
        .map(check => `${check.label}: ${item.checklist[check.id] ? 'SIM' : 'NÃO'}`)
        .join(" | ");

      return [
        item.id,
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        item.conformista || "N/A",
        item.processo || "N/A",
        item.numeroDoc || "N/A",
        item.tipoDoc || "N/A",
        item.resultado || "N/A",
        (item.restricoes || []).join("; "),
        (item.observacao || "").replace(/\n/g, " "),
        checklistDetails
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `analise_detalhada_conformidade_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#141414] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#141414] text-white p-4 sm:p-5 shadow-lg">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-[#00FF00]" />
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase leading-none">Conformidade IFS</h1>
              <p className="text-[10px] opacity-80 text-[#00FF00] italic font-serif mt-1">Manual de Procedimentos 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://ais-pre-rxxw4xraqndg73w5bkb6jj-213322120758.us-east1.run.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all text-white/70"
            >
              <ExternalLink className="w-3 h-3 text-[#00FF00]" /> Link Externo
            </a>
            <nav className="flex bg-white/10 p-1 rounded-full border border-white/10">
            <button 
              onClick={() => setView('form')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'form' ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Análise
            </button>
            <button 
              onClick={() => setView('calculator')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'calculator' ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Calculator className="w-3.5 h-3.5" /> Calculadora
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'history' ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <History className="w-3.5 h-3.5" /> Histórico
            </button>
          </nav>
        </div>
      </div>
    </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6">
        {view === 'form' ? (
          <div className="space-y-4">
            {/* Roteiro: Full width banner at the top of the form view */}
            <div className="bg-[#141414] text-white rounded-2xl shadow-xl border border-white/10 overflow-hidden animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-4 p-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#00FF00]/10 rounded-xl leading-none">
                    <FileText className="w-4 h-4 text-[#00FF00]" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-[#00FF00]/20 text-[#00FF00] rounded text-[8px] font-black uppercase tracking-widest">{DOC_GUIDES[tipoDoc].code}</span>
                    <h3 className="text-xs font-black uppercase tracking-tight text-white">
                      {DOC_GUIDES[tipoDoc].title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-[9px] uppercase font-bold tracking-widest text-white/40">
                    Etapa: <span className="text-[#00FF00]">{DOC_GUIDES[tipoDoc].etapaCiclo}</span>
                  </div>
                  <button 
                    onClick={() => setIsRoteiroOpen(!isRoteiroOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all text-white/80"
                  >
                    {isRoteiroOpen ? (
                      <>Ocultar <ChevronUp className="w-3 h-3 text-[#00FF00]" /></>
                    ) : (
                      <>Mostrar Roteiro <ChevronDown className="w-3 h-3 text-[#00FF00]" /></>
                    )}
                  </button>
                </div>
              </div>
              
              {isRoteiroOpen && (
                <div className="p-4 space-y-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Detailed description block */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <h4 className="text-[9px] uppercase font-black text-[#00FF00] tracking-widest">Detalhamento Técnico</h4>
                    <p className="text-[11px] text-white/85 leading-relaxed font-sans">{DOC_GUIDES[tipoDoc].detalhamento}</p>
                  </div>

                  {/* Grid of technical metrics for the audit */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
                      <span className="text-[8px] uppercase font-black text-white/30 tracking-widest block">Finalidade</span>
                      <p className="text-[10px] text-white/90 leading-tight font-medium">{DOC_GUIDES[tipoDoc].finalidade}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
                      <span className="text-[8px] uppercase font-black text-white/30 tracking-widest block">Origem do Registro</span>
                      <p className="text-[10px] text-white/90 leading-tight font-medium">{DOC_GUIDES[tipoDoc].origem}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
                      <span className="text-[8px] uppercase font-black text-white/30 tracking-widest block">Responsável Emissão</span>
                      <p className="text-[10px] text-white/90 leading-tight font-medium">{DOC_GUIDES[tipoDoc].responsavel}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
                      <span className="text-[8px] uppercase font-black text-white/30 tracking-widest block">Impacto Contábil</span>
                      <p className="text-[10px] text-[#00FF00] leading-tight font-mono">{DOC_GUIDES[tipoDoc].impactoContabil}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/5 pt-3.5">
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase font-black text-white/30 tracking-widest block">Relação Documental</span>
                      <p className="text-[10px] text-white/80 leading-tight">{DOC_GUIDES[tipoDoc].relacaoDocs}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase font-black text-white/30 tracking-widest block">Periodicidade</span>
                      <p className="text-[10px] text-white/80 leading-tight">{DOC_GUIDES[tipoDoc].periodicidade}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase font-black text-white/30 tracking-widest block">Observações Técnicas de Controle</span>
                      <p className="text-[10px] text-yellow-400 font-medium italic leading-tight">{DOC_GUIDES[tipoDoc].observacoesTecnicas}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3.5 space-y-1.5">
                    <h4 className="text-[8px] uppercase font-black text-white/30 tracking-widest flex items-center gap-1">
                      <Search className="w-2.5 h-2.5 text-[#00FF00]" /> Campos Críticos de Verificação
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {DOC_GUIDES[tipoDoc].fieldsToWatch.map(field => (
                        <span key={field} className="px-2.5 py-0.5 bg-[#00FF00]/10 border border-[#00FF00]/20 rounded-full text-[9px] text-[#00FF00] font-bold">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Sidebar: Identification (Left) */}
              <aside className="md:col-span-4 lg:col-span-3 space-y-4 md:sticky md:top-[80px]">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                  <div className="flex items-center gap-2 mb-4 border-b border-black/5 pb-2">
                    <User className="w-4 h-4 text-black/40" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black/60">Identificação</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 block mb-1 leading-none">Conformista</label>
                      <input 
                        type="text" 
                        value={conformista}
                        onChange={e => setConformista(e.target.value)}
                        placeholder="Nome"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-black/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black/10"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 block mb-1 leading-none">Processo SEI</label>
                      <input 
                        type="text" 
                        value={processo}
                        onChange={e => setProcesso(e.target.value)}
                        placeholder="00000.000000/0000-00"
                        className="w-full px-3 py-1.5 bg-gray-50 border border-black/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black/10 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 block mb-1 leading-none">Número Doc</label>
                      <input 
                        type="text" 
                        value={numeroDoc}
                        onChange={e => setNumeroDoc(e.target.value)}
                        placeholder="Ex: NF 123..."
                        className="w-full px-3 py-1.5 bg-gray-50 border border-black/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black/10"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 block mb-1.5 leading-none">Tipo de Documento</label>
                      <div className="relative">
                        <select
                          value={tipoDoc}
                          onChange={e => setTipoDoc(e.target.value as DocType)}
                          className="w-full px-3 py-2 bg-gray-50 border border-black/10 rounded-lg text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 transition-all appearance-none pr-8 cursor-pointer"
                        >
                          {Object.keys(CHECKLIST_BY_TYPE).map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40 pointer-events-none" />
                      </div>
                      
                      {/* Quick access badges for all document types */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {(Object.keys(CHECKLIST_BY_TYPE) as DocType[]).map(quickType => (
                          <button
                            key={quickType}
                            type="button"
                            onClick={() => setTipoDoc(quickType)}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold transition-all border ${tipoDoc === quickType ? 'bg-black text-[#00FF00] border-black' : 'bg-gray-100 text-black/50 border-black/5 hover:bg-gray-200'}`}
                          >
                            {quickType.split(" - ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Area: Checklist (Right) */}
              <div className="md:col-span-8 lg:col-span-9 space-y-4">
                <div className="md:sticky md:top-[80px] z-30 space-y-4 transition-all">
                  {/* Checklist Header Section */}
                  <div className="bg-white rounded-xl shadow-md border border-black/5 overflow-hidden">
                    <div className="p-3 px-4 border-b border-black/5 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-black/50">Checklist De Conformidade</h2>
                        <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border border-black/5">
                          <div className="h-1 w-10 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${(Object.values(checklist).filter(Boolean).length / CHECKLIST_BY_TYPE[tipoDoc].length) * 100}%` }}
                              className="h-full bg-[#00FF00] transition-all"
                            />
                          </div>
                          <span className="text-[9px] font-bold text-black/40">
                            {Math.round((Object.values(checklist).filter(Boolean).length / CHECKLIST_BY_TYPE[tipoDoc].length) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex bg-white p-0.5 rounded-lg border border-black/5 shadow-sm">
                        <button 
                          onClick={() => setResultado('SEM OCORRÊNCIA')}
                          className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${resultado === 'SEM OCORRÊNCIA' ? 'bg-[#00FF00] text-black' : 'text-black/30 hover:text-black/50'}`}
                        >
                          Sem Ocorrência
                        </button>
                        <button 
                          onClick={() => setResultado('COM OCORRÊNCIA')}
                          className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${resultado === 'COM OCORRÊNCIA' ? 'bg-red-500 text-white' : 'text-black/30 hover:text-black/50'}`}
                        >
                          Com Ocorrência
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist Items Area */}
                <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {CHECKLIST_BY_TYPE[tipoDoc].map(item => (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${checklist[item.id] ? 'bg-[#00FF00]/5 border-[#00FF00]/20' : 'bg-white border-black/5 hover:border-black/10'}`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${checklist[item.id] ? 'bg-[#00FF00] border-[#00FF00]' : 'border-black/10 group-hover:border-black/20'}`}>
                          {checklist[item.id] && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-tight ${checklist[item.id] ? 'font-bold text-black' : 'text-black/70'}`}>{item.label}</p>
                          {item.hint && <p className="text-[10px] text-black/40 mt-1 italic leading-tight">{item.hint}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {resultado === 'COM OCORRÊNCIA' && (
                    <div 
                      className="space-y-3 mb-4 p-4 bg-red-50 rounded-xl border border-red-100"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-600">Ocorrências Encontradas</h3>
                        <span className="text-[9px] text-red-400 uppercase font-bold">Macrofunção 020314</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {RESTRICOES.map(code => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => toggleRestricao(code)}
                            className={`text-left px-2.5 py-1.5 rounded-lg text-[9px] transition-all border ${selectedRestricoes.includes(code) ? 'bg-red-500 text-white border-red-500 font-medium' : 'bg-white border-red-200 text-red-700 hover:border-red-400'}`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={observacao}
                        onChange={e => setObservacao(e.target.value)}
                        placeholder="Descreva detalhadamente a ocorrência para o relatório..."
                        className="w-full p-2.5 bg-white border border-red-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[70px]"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={resetForm}
                      className="px-4 py-2.5 bg-gray-100 text-black/60 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                    >
                      Limpar
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-[#141414] text-white py-2.5 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/10"
                    >
                      {loading ? "Processando..." : (
                        <>
                          Registrar Análise <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : view === 'calculator' ? (
          <TaxCalculator />
        ) : (
          <div 
            className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden"
          >
              <div className="p-8 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight">Histórico de Análises</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input 
                      type="text" 
                      placeholder="Buscar processo..."
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none w-full"
                    />
                  </div>
                  <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00FF00] text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00CC00] transition-all shadow-sm"
                  >
                    <FileText className="w-4 h-4" /> Baixar CSV
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:block overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Data/Hora</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Processo SEI</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Documento</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Resultado</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Ocorrências</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Conformista</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-black/40 italic">Nenhuma análise registrada ainda.</td>
                      </tr>
                    ) : (
                      analyses.map(item => (
                        <tr key={item.id} className="border-t border-black/5 hover:bg-gray-50 transition-colors cursor-pointer group">
                          <td className="p-4">
                            <div className="text-sm font-mono">{new Date(item.timestamp).toLocaleDateString()}</div>
                            <div className="text-[10px] text-black/30">{new Date(item.timestamp).toLocaleTimeString()}</div>
                          </td>
                          <td className="p-4 text-sm font-bold">{item.processo}</td>
                          <td className="p-4">
                            <div className="text-sm font-bold">{item.tipoDoc}</div>
                            <div className="text-[10px] text-black/40 italic">{item.numeroDoc || "S/N"}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.resultado === 'SEM OCORRÊNCIA' ? 'bg-[#00FF00]/20 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.resultado}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="max-w-[200px] truncate text-[11px] text-black/60">
                              {item.restricoes && item.restricoes.length > 0 ? item.restricoes.join(", ") : "Nenhuma"}
                            </div>
                            {item.observacao && (
                              <div className="max-w-[200px] truncate text-[10px] text-black/40 italic">
                                {item.observacao}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-sm text-black/60">{item.conformista}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards for Mobile/Tablet */}
              <div className="lg:hidden p-4 space-y-4">
                {analyses.length === 0 ? (
                  <div className="p-12 text-center text-black/40 italic">Nenhuma análise registrada ainda.</div>
                ) : (
                  analyses.map(item => (
                    <div 
                      key={item.id}
                      className="bg-gray-50 p-4 rounded-2xl border border-black/5 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-black/30 tracking-widest">{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}</div>
                          <div className="text-base font-bold text-black mt-1">{item.processo}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${item.resultado === 'SEM OCORRÊNCIA' ? 'bg-[#00FF00] text-black' : 'bg-red-500 text-white'}`}>
                          {item.resultado === 'SEM OCORRÊNCIA' ? 'Ok' : 'Ocorrência'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 border-t border-black/5 pt-3">
                        <FileText className="w-3 h-3 text-black/40" />
                        <div className="text-xs font-medium text-black/70">{item.tipoDoc} {item.numeroDoc && <span className="text-black/30">| {item.numeroDoc}</span>}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white p-2 rounded-lg border border-black/5">
                          <p className="text-[9px] uppercase font-bold text-black/30">Conformista</p>
                          <p className="text-[11px] font-medium truncate">{item.conformista}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-black/5">
                          <p className="text-[9px] uppercase font-bold text-black/30">Ocorrências</p>
                          <p className="text-[11px] font-medium truncate">{(item.restricoes && item.restricoes.length > 0) ? item.restricoes.length : 0}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto p-12 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/20">Link de Acesso Direto</p>
          <a 
            href="https://ais-pre-rxxw4xraqndg73w5bkb6jj-213322120758.us-east1.run.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-mono text-black/40 hover:text-[#00FF00] transition-colors border-b border-black/5 pb-1"
          >
            ais-pre-rxxw4xraqndg73w5bkb6jj...run.app
          </a>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-black/30">
          Baseado no Manual de Procedimentos para a Conformidade de Registro de Gestão 2026 (Portaria IFS nº 1.633/2026)
        </p>
      </footer>
    </div>
  );
}
