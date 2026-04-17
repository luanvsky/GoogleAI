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
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocType, Analysis, CHECKLIST_BY_TYPE, RESTRICOES, DOC_GUIDES } from './types';

export default function App() {
  const [view, setView] = useState<'form' | 'history'>('form');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [conformista, setConformista] = useState('');
  const [processo, setProcesso] = useState('');
  const [numeroDoc, setNumeroDoc] = useState('');
  const [tipoDoc, setTipoDoc] = useState<DocType>('Nota Fiscal');
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
      <header className="bg-[#141414] text-white p-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-[#00FF00]" />
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase">Conformidade IFS</h1>
              <p className="text-xs opacity-60 italic font-serif">Registro de Gestão</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <button 
              onClick={() => setView('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${view === 'form' ? 'bg-[#00FF00] text-black' : 'hover:bg-white/10'}`}
            >
              <PlusCircle className="w-4 h-4" /> Nova Análise
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${view === 'history' ? 'bg-[#00FF00] text-black' : 'hover:bg-white/10'}`}
            >
              <History className="w-4 h-4" /> Histórico
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {view === 'form' ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Sidebar: Identification (Left) */}
                <aside className="lg:col-span-3 space-y-4 sticky top-6 order-1 lg:order-1">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-5 border-b border-black/5 pb-3">
                      <User className="w-4 h-4 text-black/40" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-black/60">Identificação</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs uppercase font-bold text-black/40 block mb-1.5">Conformista</label>
                        <input 
                          type="text" 
                          value={conformista}
                          onChange={e => setConformista(e.target.value)}
                          placeholder="Nome"
                          className="w-full px-3 py-2.5 bg-gray-50 border border-black/10 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-black/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-black/40 block mb-1.5">Processo SEI</label>
                        <input 
                          type="text" 
                          value={processo}
                          onChange={e => setProcesso(e.target.value)}
                          placeholder="00000.000000/0000-00"
                          className="w-full px-3 py-2.5 bg-gray-50 border border-black/10 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-black/10 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-black/40 block mb-1.5">Número do Documento</label>
                        <input 
                          type="text" 
                          value={numeroDoc}
                          onChange={e => setNumeroDoc(e.target.value)}
                          placeholder="Ex: NF 123, OB 456..."
                          className="w-full px-3 py-2.5 bg-gray-50 border border-black/10 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-black/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-black/40 block mb-3">Tipo de Documento</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                          {Object.keys(CHECKLIST_BY_TYPE).map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setTipoDoc(type as DocType)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg text-[11px] sm:text-xs transition-all border ${tipoDoc === type ? 'bg-[#00FF00] text-black border-[#00FF00] font-bold shadow-sm' : 'bg-gray-50 border-black/5 text-black/60 hover:bg-gray-100'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Area: Roteiro + Checklist (Right) */}
                <div className="lg:col-span-9 space-y-6 order-2 lg:order-2">
                  {/* Roteiro: Top of Main Area */}
                  <motion.div 
                    key={`roteiro-${tipoDoc}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#141414] text-white rounded-xl shadow-lg border border-white/10 overflow-hidden"
                  >
                    <button 
                      onClick={() => setIsRoteiroOpen(!isRoteiroOpen)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#00FF00]/10 rounded-lg">
                          <FileText className="w-5 h-5 text-[#00FF00]" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#00FF00]">Roteiro de Análise: {tipoDoc}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {!isRoteiroOpen && (
                          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest hidden md:block">Ver Orientações Detalhadas</p>
                        )}
                        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isRoteiroOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isRoteiroOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 bg-white/5"
                        >
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="text-[10px] uppercase font-black text-[#00FF00]/60 tracking-widest flex items-center gap-1.5">
                                <ClipboardCheck className="w-3 h-3" /> Propósito da Análise
                              </h4>
                              <p className="text-xs text-white/80 leading-normal italic">{DOC_GUIDES[tipoDoc].description}</p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest flex items-center gap-1.5">
                                <Search className="w-3 h-3 text-[#00FF00]" /> Campos Críticos
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {DOC_GUIDES[tipoDoc].fieldsToWatch.map(field => (
                                  <span key={field} className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[9px] text-white/60">
                                    {field}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Checklist Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                    <div className="p-4 px-6 border-b border-black/5 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-6">
                        <h2 className="text-sm font-bold uppercase tracking-tight text-black/70">Checklist de Verificação de Conformidade</h2>
                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-black/5">
                          <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              animate={{ width: `${(Object.values(checklist).filter(Boolean).length / CHECKLIST_BY_TYPE[tipoDoc].length) * 100}%` }}
                              className="h-full bg-[#00FF00]"
                            />
                          </div>
                          <span className="text-[11px] font-bold text-black/40">
                            {Math.round((Object.values(checklist).filter(Boolean).length / CHECKLIST_BY_TYPE[tipoDoc].length) * 100)}% Concluído
                          </span>
                        </div>
                      </div>
                      <div className="flex bg-white p-1 rounded-xl border border-black/5 shadow-sm">
                        <button 
                          onClick={() => setResultado('SEM OCORRÊNCIA')}
                          className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${resultado === 'SEM OCORRÊNCIA' ? 'bg-[#00FF00] text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
                        >
                          Sem Ocorrência
                        </button>
                        <button 
                          onClick={() => setResultado('COM OCORRÊNCIA')}
                          className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${resultado === 'COM OCORRÊNCIA' ? 'bg-red-500 text-white shadow-sm' : 'text-black/40 hover:text-black/60'}`}
                        >
                          Com Ocorrência
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        {CHECKLIST_BY_TYPE[tipoDoc].map(item => (
                          <div 
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`flex items-start gap-5 p-5 rounded-xl border transition-all cursor-pointer group ${checklist[item.id] ? 'bg-[#00FF00]/5 border-[#00FF00]/20' : 'bg-white border-black/5 hover:border-black/10'}`}
                          >
                            <div className={`mt-1 w-7 h-7 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${checklist[item.id] ? 'bg-[#00FF00] border-[#00FF00]' : 'border-black/10 group-hover:border-black/20'}`}>
                              {checklist[item.id] && <CheckCircle2 className="w-5 h-5 text-black" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-base leading-snug ${checklist[item.id] ? 'font-bold text-black' : 'text-black/70'}`}>{item.label}</p>
                              {item.hint && <p className="text-sm text-black/40 mt-2 italic">{item.hint}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {resultado === 'COM OCORRÊNCIA' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4 mb-6 p-4 bg-red-50 rounded-2xl border border-red-100"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-red-600">Ocorrências Encontradas</h3>
                            <span className="text-[10px] text-red-400 uppercase font-bold">Macrofunção 020314</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {RESTRICOES.map(code => (
                              <button
                                key={code}
                                onClick={() => toggleRestricao(code)}
                                className={`text-left px-3 py-1.5 rounded-lg text-[10px] transition-all border ${selectedRestricoes.includes(code) ? 'bg-red-500 text-white border-red-500' : 'bg-white border-red-200 text-red-700 hover:border-red-400'}`}
                              >
                                {code}
                              </button>
                            ))}
                          </div>
                          <textarea 
                            value={observacao}
                            onChange={e => setObservacao(e.target.value)}
                            placeholder="Descreva detalhadamente a ocorrência para o relatório..."
                            className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[80px]"
                          />
                        </motion.div>
                      )}

                      <div className="flex gap-4">
                        <button 
                          onClick={resetForm}
                          className="px-6 py-3 bg-gray-100 text-black/60 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all"
                        >
                          Limpar Formulário
                        </button>
                        <button 
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex-1 bg-[#141414] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-lg shadow-black/10"
                        >
                          {loading ? "Processando..." : (
                            <>
                              Finalizar e Registrar Análise <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
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
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto p-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-black/30">
          Baseado no Manual de Procedimentos para a Conformidade de Registro de Gestão • IFS
        </p>
      </footer>
    </div>
  );
}
