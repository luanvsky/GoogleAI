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
  ChevronRight,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocType, Analysis, CHECKLIST_BY_TYPE, RESTRICOES } from './types';

export default function App() {
  const [view, setView] = useState<'form' | 'history'>('form');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [conformador, setConformador] = useState('');
  const [processo, setProcesso] = useState('');
  const [tipoDoc, setTipoDoc] = useState<DocType>('Nota Fiscal');
  const [resultado, setResultado] = useState<'SEM RESTRIÇÃO' | 'COM RESTRIÇÃO'>('SEM RESTRIÇÃO');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [selectedRestricoes, setSelectedRestricoes] = useState<string[]>([]);
  const [observacao, setObservacao] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const filteredDocTypes = (Object.keys(CHECKLIST_BY_TYPE) as DocType[]).filter(type => 
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (!conformador || !processo) return alert("Preencha os campos obrigatórios!");

    setLoading(true);
    const payload = {
      conformador,
      processo,
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
    setChecklist({});
    setSelectedRestricoes([]);
    setObservacao('');
    setResultado('SEM RESTRIÇÃO');
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRestricao = (code: string) => {
    setSelectedRestricoes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
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

      <main className="max-w-5xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {view === 'form' ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Identificação</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Conformador</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                        <input 
                          type="text" 
                          value={conformador}
                          onChange={e => setConformador(e.target.value)}
                          placeholder="Nome completo"
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF00]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Processo SEI</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                        <input 
                          type="text" 
                          value={processo}
                          onChange={e => setProcesso(e.target.value)}
                          placeholder="00000.000000/0000-00"
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF00]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Tipo de Documento</h3>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-black/30" />
                    <input 
                      type="text" 
                      placeholder="Filtrar documentos..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-black/10 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#00FF00]"
                    />
                  </div>
                  <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredDocTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setTipoDoc(type)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[11px] transition-all flex justify-between items-center ${tipoDoc === type ? 'bg-[#141414] text-white' : 'hover:bg-gray-100'}`}
                      >
                        <span className="truncate">{type}</span>
                        {tipoDoc === type && <ChevronRight className="w-3 h-3 text-[#00FF00]" />}
                      </button>
                    ))}
                    {filteredDocTypes.length === 0 && (
                      <p className="text-[10px] text-center text-black/30 py-4 italic">Nenhum tipo encontrado</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Checklist */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Checklist: <span className="italic font-serif text-[#00FF00] bg-black px-3 py-1 rounded-lg ml-2">{tipoDoc}</span></h2>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setResultado('SEM RESTRIÇÃO')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${resultado === 'SEM RESTRIÇÃO' ? 'bg-[#00FF00] text-black shadow-sm' : 'text-black/40'}`}
                      >
                        Sem Restrição
                      </button>
                      <button 
                        onClick={() => setResultado('COM RESTRIÇÃO')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${resultado === 'COM RESTRIÇÃO' ? 'bg-red-500 text-white shadow-sm' : 'text-black/40'}`}
                      >
                        Com Restrição
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {CHECKLIST_BY_TYPE[tipoDoc].map(item => (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${checklist[item.id] ? 'bg-[#00FF00]/5 border-[#00FF00]/20' : 'bg-gray-50 border-transparent hover:border-black/10'}`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checklist[item.id] ? 'bg-[#00FF00] border-[#00FF00]' : 'border-black/10'}`}>
                          {checklist[item.id] && <CheckCircle2 className="w-4 h-4 text-black" />}
                        </div>
                        <span className={`text-sm ${checklist[item.id] ? 'font-medium' : 'text-black/60'}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {resultado === 'COM RESTRIÇÃO' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 mb-8"
                    >
                      <h3 className="text-xs font-bold uppercase tracking-widest text-red-500">Códigos de Restrição (Anexo VIII)</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {RESTRICOES.map(code => (
                          <button
                            key={code}
                            onClick={() => toggleRestricao(code)}
                            className={`text-left px-4 py-2 rounded-xl text-xs transition-all border ${selectedRestricoes.includes(code) ? 'bg-red-500 text-white border-red-500' : 'bg-white border-black/10 hover:border-red-500/50'}`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={observacao}
                        onChange={e => setObservacao(e.target.value)}
                        placeholder="Descreva brevemente a irregularidade encontrada..."
                        className="w-full p-4 bg-gray-50 border border-black/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px]"
                      />
                    </motion.div>
                  )}

                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#141414] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all flex items-center justify-center gap-2 group"
                  >
                    {loading ? "Processando..." : (
                      <>
                        Salvar Análise <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
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
              <div className="p-8 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Histórico de Análises</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input 
                    type="text" 
                    placeholder="Buscar processo..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Data</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Processo</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Documento</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Resultado</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 tracking-widest">Conformador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-black/40 italic">Nenhuma análise registrada ainda.</td>
                      </tr>
                    ) : (
                      analyses.map(item => (
                        <tr key={item.id} className="border-t border-black/5 hover:bg-gray-50 transition-colors cursor-pointer group">
                          <td className="p-4 text-xs font-mono">{new Date(item.timestamp).toLocaleDateString()}</td>
                          <td className="p-4 text-sm font-bold">{item.processo}</td>
                          <td className="p-4 text-xs italic font-serif">{item.tipoDoc}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.resultado === 'SEM RESTRIÇÃO' ? 'bg-[#00FF00]/20 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.resultado}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-black/60">{item.conformador}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto p-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/30">
          Baseado no Manual de Procedimentos para a Conformidade de Registro de Gestão • IFS
        </p>
      </footer>
    </div>
  );
}
