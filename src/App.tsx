import React, { useState, useEffect, useMemo } from 'react';
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
  Calculator, 
  Sparkles,
  Sun,
  Moon,
  Scale,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { DocType, Analysis, CHECKLIST_BY_TYPE, RESTRICOES, DOC_GUIDES, TAX_RULES, TaxRule, ProcessAuditResult } from './types';
import { ProcessPdfAnalyzer } from './components/ProcessPdfAnalyzer';
import { HistoryStatistics } from './components/HistoryStatistics';

interface TaxCalculatorProps {
  initialAudit?: ProcessAuditResult | null;
  onApplyToForm?: (data: {
    processo: string;
    numeroDoc: string;
    tipoDoc: DocType;
    resultado: "SEM OCORRÊNCIA" | "COM OCORRÊNCIA";
    restricoes: string[];
    observacao: string;
  }) => void;
}

function TaxCalculator({ initialAudit, onApplyToForm }: TaxCalculatorProps) {
  const [processoRef, setProcessoRef] = useState<string>(initialAudit?.processo || '23060.002891/2026-11');
  const [numeroDocRef, setNumeroDocRef] = useState<string>(initialAudit?.numeroDoc || 'NF-e 000.004.882');
  const [tipoDocRef, setTipoDocRef] = useState<DocType>(initialAudit?.tipoDoc || 'DD - Documento de Despesa');
  const [grossValue, setGrossValue] = useState<number>(initialAudit?.valores?.valorBruto || 48000);
  const [selectedRule, setSelectedRule] = useState<TaxRule>(TAX_RULES[2]); // Default: Demais Serviços (9,45%)
  const [issRate, setIssRate] = useState<number>(5);
  const [issPrecoPublico, setIssPrecoPublico] = useState<number>(0);
  const [inssNormalRate, setInssNormalRate] = useState<number>(0);
  const [inssSpecial, setInssSpecial] = useState<number>(0);
  const [inssSpecialRate, setInssSpecialRate] = useState<number>(0);
  const [contaVinculada, setContaVinculada] = useState<number>(0);
  
  // Valor que veio retido/destacado no processo ou na NF pelo fornecedor/UG
  const [valorRetencaoProcesso, setValorRetencaoProcesso] = useState<number>(
    initialAudit?.valores?.retencoes !== undefined ? initialAudit.valores.retencoes : 2400
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Sincroniza se o processo do PDF mudar
  useEffect(() => {
    if (initialAudit) {
      if (initialAudit.processo) setProcessoRef(initialAudit.processo);
      if (initialAudit.numeroDoc) setNumeroDocRef(initialAudit.numeroDoc);
      if (initialAudit.tipoDoc) setTipoDocRef(initialAudit.tipoDoc);
      if (initialAudit.valores?.valorBruto) setGrossValue(initialAudit.valores.valorBruto);
      if (initialAudit.valores?.retencoes !== undefined) setValorRetencaoProcesso(initialAudit.valores.retencoes);
    }
  }, [initialAudit]);

  // Cálculos legais das retenções federais (IN RFB 1.234/2012)
  const irValue = Math.round((grossValue * selectedRule.ir)) / 100;
  const csllValue = Math.round((grossValue * selectedRule.csll)) / 100;
  const cofinsValue = Math.round((grossValue * selectedRule.cofins)) / 100;
  const pisValue = Math.round((grossValue * selectedRule.pis)) / 100;
  const federalTotal = Number((irValue + csllValue + cofinsValue + pisValue).toFixed(2));
  
  // ISS e INSS
  const issValue = Number(((grossValue * issRate) / 100 + issPrecoPublico).toFixed(2));
  const inssNormalValue = Math.round((grossValue * inssNormalRate)) / 100;

  // Retenção Total Devida por Lei
  const totalRetencoesDevidas = Number((federalTotal + issValue + inssNormalValue + inssSpecial + contaVinculada).toFixed(2));
  const valorLiquidoDevido = Number((grossValue - totalRetencoesDevidas).toFixed(2));

  // Confronto: Retenção Devida na Lei vs Retenção Informada no Processo
  const diferencaRetencao = Number((totalRetencoesDevidas - valorRetencaoProcesso).toFixed(2));
  const temDivergencia = Math.abs(diferencaRetencao) > 0.05;

  // Cenários para testes rápidos e demonstração
  const carregarCenarioDivergente = () => {
    setProcessoRef('23060.002891/2026-11');
    setNumeroDocRef('NF-e 000.004.882 / 2026');
    setTipoDocRef('DD - Documento de Despesa');
    setGrossValue(48000.00);
    setSelectedRule(TAX_RULES[2]); // Demais Serviços (9,45%: IR 4,8% + CSLL 1% + COFINS 3% + PIS 0,65%)
    setIssRate(5);
    setIssPrecoPublico(0);
    setInssNormalRate(0);
    setInssSpecial(0);
    setContaVinculada(0);
    setValorRetencaoProcesso(2400.00); // Reteve apenas 5% de ISS (R$ 2.400) e omitiu R$ 4.536,00 de tributos federais da IN 1234/12!
  };

  const carregarCenarioRegular = () => {
    setProcessoRef('23060.001955/2026-88');
    setNumeroDocRef('NF-e 000.012.345');
    setTipoDocRef('DD - Documento de Despesa');
    setGrossValue(15400.00);
    setSelectedRule(TAX_RULES[0]); // Bens de Consumo (5,85%)
    setIssRate(0);
    setIssPrecoPublico(0);
    setInssNormalRate(0);
    setInssSpecial(0);
    setContaVinculada(0);
    setValorRetencaoProcesso(900.90); // 15.400 * 5,85% = R$ 900,90 exatos!
  };

  // Parecer Técnico Rígido fundamentado na Lei e nas Normas
  const parecerTecnicoRigido = temDivergencia
    ? `PARECER TÉCNICO DE CONFRONTO TRIBUTÁRIO (IN RFB nº 1.234/2012 e Lei nº 4.320/1964):
Examinada a documentação fiscal e a liquidação da despesa relativa ao Processo ${processoRef} (${numeroDocRef}), apurou-se que o valor bruto faturado é de R$ ${grossValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
Em estrita aplicação das normas tributárias da Instrução Normativa RFB nº 1.234/2012 (Art. 2º e Anexo I - DARF ${selectedRule.darf}) e do código tributário municipal, a retenção legal compulsória na fonte totaliza R$ ${totalRetencoesDevidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Retenção Federal: R$ ${federalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} [IR R$ ${irValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, CSLL R$ ${csllValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, COFINS R$ ${cofinsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, PIS R$ ${pisValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}] e ISSQN/Previdência: R$ ${(issValue + inssNormalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).
Entretanto, o montante destacado e retido no processo/documento é de apenas R$ ${valorRetencaoProcesso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, configurando DIVERGÊNCIA ${diferencaRetencao > 0 ? 'A MENOR (SUB-RETENÇÃO)' : 'A MAIOR'} NO VALOR DE R$ ${Math.abs(diferencaRetencao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
Conforme prescreve o Art. 63 da Lei nº 4.320/1964 e a Portaria IFS nº 1.633/2026 (Macrofunção SIAFI 020314), a liquidação e o pagamento da despesa pública dependem da exata dedução dos tributos legais exigíveis. A não retenção enseja responsabilização funcional solidária do conformista perante os órgãos de controle.
CONCLUSÃO RIGOROSA: Registra-se a RESTRIÇÃO IMPEDITIVA "005 - Divergência de Valores/Cálculos Tributários ou Retenções (IN 1234/12)", classificando o ato como COM OCORRÊNCIA, restando suspenso o ateste de regularidade até a retificação da nota fiscal ou retenção complementar em folha de liquidação.`
    : `PARECER DE CONFORMIDADE TRIBUTÁRIA E CONTÁBIL:
Examinada a documentação fiscal e a liquidação do Processo ${processoRef} (${numeroDocRef}), confirma-se a conformidade integral dos cálculos. A retenção legalmente devida de R$ ${totalRetencoesDevidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (IN RFB nº 1.234/2012 - DARF ${selectedRule.darf}) corresponde com exatidão ao montante retido nos autos de R$ ${valorRetencaoProcesso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Divergência: R$ 0,00). O procedimento atende ao Art. 63 da Lei nº 4.320/1964 e à Macrofunção SIAFI 020314. Resultado: SEM OCORRÊNCIA.`;

  const copyParecer = () => {
    navigator.clipboard.writeText(parecerTecnicoRigido);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyToForm = () => {
    if (onApplyToForm) {
      onApplyToForm({
        processo: processoRef,
        numeroDoc: numeroDocRef,
        tipoDoc: tipoDocRef,
        resultado: temDivergencia ? 'COM OCORRÊNCIA' : 'SEM OCORRÊNCIA',
        restricoes: temDivergencia ? ['005 - Divergência de Valores'] : [],
        observacao: parecerTecnicoRigido
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Header Card with Quick Scenario Buttons */}
      <div className="bg-white dark:bg-[#16181A] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:bg-[#00FF00]/10 dark:text-[#00FF00] rounded-2xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
              Calculadora Tributária & Confronto Contábil Legal
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-emerald-400 dark:bg-white/10 dark:text-[#00FF00]">
                IN RFB nº 1.234/2012
              </span>
            </h2>
            <p className="text-xs text-black/50 dark:text-white/50">
              Auditoria de retenções na fonte, confronto com o processo administrativo e aplicação rigorosa da Restrição 005.
            </p>
          </div>
        </div>

        {/* Action / Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={carregarCenarioDivergente}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5 transition-all"
            title="Preencher com caso real de divergência na retenção de tributos federais"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Exemplo com Divergência (Restrição 005)
          </button>
          <button
            type="button"
            onClick={carregarCenarioRegular}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 transition-all"
            title="Preencher com cálculo regular sem divergência"
          >
            <Check className="w-3.5 h-3.5" />
            Exemplo Regular (Sem Ocorrência)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Parameters and Process Reference */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identificação do Processo em Confronto */}
          <div className="bg-white dark:bg-[#16181A] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-black/40 dark:text-white/40" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                1. Dados do Processo / Documento Auditado
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-black/50 dark:text-white/40 block mb-1">
                  Processo SEI
                </label>
                <input
                  type="text"
                  value={processoRef}
                  onChange={(e) => setProcessoRef(e.target.value)}
                  placeholder="23060.000000/2026-00"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-black/50 dark:text-white/40 block mb-1">
                  Nº Documento / NF-e
                </label>
                <input
                  type="text"
                  value={numeroDocRef}
                  onChange={(e) => setNumeroDocRef(e.target.value)}
                  placeholder="NF-e 1234 / NS 5678"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]"
                />
              </div>
            </div>

            {/* Valor informado no processo para confronto */}
            <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <label className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block mb-1 tracking-widest flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Valor da Retenção Destacada no Processo / NF (R$)
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400 font-bold text-xs">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={valorRetencaoProcesso || ''}
                  onChange={(e) => setValorRetencaoProcesso(Number(e.target.value))}
                  placeholder="0,00"
                  className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#16181A] border border-amber-500/30 rounded-xl text-base font-black text-amber-900 dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[10px] text-amber-700/70 dark:text-amber-400/70 mt-1.5 leading-relaxed">
                Informe o valor que a Unidade Gestora ou o fornecedor lançou nos autos. A calculadora confrontará com a exigência legal da IN RFB nº 1.234/2012.
              </p>
            </div>
          </div>

          {/* Parâmetros Contábeis Legais */}
          <div className="bg-[#141414] text-white p-6 rounded-3xl shadow-xl border border-white/10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00FF00]/10 rounded-xl">
                <Scale className="w-5 h-5 text-[#00FF00]" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#00FF00]">
                2. Parâmetros Normativos (Lei & IN 1234/12)
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">
                  Valor Bruto da NF-e / Liquidação
                </label>
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
                <label className="text-[10px] uppercase font-bold text-white/40 block mb-2 tracking-widest">
                  Natureza do Serviço / Objeto (IN RFB nº 1.234/2012)
                </label>
                <select 
                  value={selectedRule.id}
                  onChange={e => {
                    const rule = TAX_RULES.find(r => r.id === e.target.value);
                    if (rule) setSelectedRule(rule);
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 transition-all appearance-none text-white"
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
                  <span className="text-[10px] uppercase font-bold text-white/40 block tracking-widest">Total ISSQN Retido</span>
                  <span className="text-sm font-bold text-white">R$ {issValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none text-white"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none text-white"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SIAFI Reference */}
          <div className="bg-white dark:bg-[#16181A] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-black/40 dark:text-white/40" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                Classificação Contábil no SIAFI
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-2xl border border-black/5 dark:border-white/10">
                <span className="text-[8px] uppercase font-black text-black/30 dark:text-white/30 block mb-1">DARF Único</span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#00FF00] bg-black px-2 py-0.5 rounded">
                  {selectedRule.darf}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-2xl border border-black/5 dark:border-white/10">
                <span className="text-[8px] uppercase font-black text-black/30 dark:text-white/30 block mb-1">Natureza DDF</span>
                <span className="text-xs font-mono font-bold text-black dark:text-white">
                  {selectedRule.ddf}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output / Memória de Cálculo + Seção Rígida de Confronto */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Principal: Memória de Cálculo Conforme a Lei */}
          <div className="bg-white dark:bg-[#16181A] p-6 md:p-8 rounded-[40px] shadow-xl border border-black/5 dark:border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 dark:border-white/10">
              <div>
                <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-black/30 dark:text-white/30 mb-1">
                  Memória de Cálculo Legal
                </h2>
                <p className="text-lg font-serif italic text-black/70 dark:text-white/80">
                  {selectedRule.label}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#00FF00] bg-black px-3 py-1 rounded-full">
                  Retenção Legal Devida
                </span>
                <div className="text-3xl font-black mt-2 text-black dark:text-white">
                  R$ {totalRetencoesDevidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Detalhamento das parcelas federais e municipais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-b border-black/5 dark:border-white/10">
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-black text-black/50 dark:text-white/40 tracking-widest border-l-2 border-[#00FF00] pl-2">
                  Detalhamento Federal (IN 1234/12)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/50 dark:text-white/40">IRPJ ({selectedRule.ir}%)</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {irValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50 dark:text-white/40">CSLL ({selectedRule.csll}%)</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {csllValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50 dark:text-white/40">COFINS ({selectedRule.cofins}%)</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {cofinsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/50 dark:text-white/40">PIS/PASEP ({selectedRule.pis}%)</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {pisValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase text-[#00FF00] bg-black p-2 rounded-lg">
                    <span>Total Federal Retido</span>
                    <span>R$ {federalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-black text-black/50 dark:text-white/40 tracking-widest border-l-2 border-[#00FF00] pl-2">
                  Previdenciário e Municipal
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/50 dark:text-white/40">INSS Normal ({inssNormalRate}%)</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {inssNormalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50 dark:text-white/40">INSS Especial</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {inssSpecial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50 dark:text-white/40">Conta Vinculada</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {contaVinculada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/50 dark:text-white/40">ISSQN ({issRate}%)</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      R$ {issValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#202326] p-3 rounded-2xl border border-black/5 dark:border-white/10 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black text-black/50 dark:text-white/40">Líquido a Pagar</span>
                    <span className="text-base font-black text-black dark:text-white">
                      R$ {valorLiquidoDevido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO CRÍTICA DE CONFRONTO E RIGOR NORMATIVO */}
            <div className={`p-6 rounded-3xl border transition-all ${
              temDivergencia 
                ? 'bg-red-500/5 dark:bg-red-500/10 border-red-500/30' 
                : 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  {temDivergencia ? (
                    <div className="p-2 bg-red-500 text-white rounded-xl animate-pulse">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 bg-emerald-500 text-white rounded-xl">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-black/40 dark:text-white/40 block">
                      Resultado do Confronto Contábil
                    </span>
                    <h4 className={`text-base font-black ${temDivergencia ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {temDivergencia 
                        ? 'COM OCORRÊNCIA — RESTRIÇÃO 005 IMPEDITIVA' 
                        : 'SEM OCORRÊNCIA — CÁLCULOS REGULARES'}
                    </h4>
                  </div>
                </div>

                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  temDivergencia 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {temDivergencia ? 'Restrição 005 Aplicável' : 'Conforme a Lei'}
                </span>
              </div>

              {/* Matriz comparativa de valores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/60 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5 mb-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-black/50 dark:text-white/40 block mb-0.5">
                    Retenção Legal Devida
                  </span>
                  <span className="text-base font-black text-black dark:text-white font-mono">
                    R$ {totalRetencoesDevidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-black/50 dark:text-white/40 block mb-0.5">
                    Retenção no Processo/NF
                  </span>
                  <span className="text-base font-black text-black dark:text-white font-mono">
                    R$ {valorRetencaoProcesso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-black/50 dark:text-white/40 block mb-0.5">
                    Divergência Apurada
                  </span>
                  <span className={`text-base font-black font-mono ${
                    temDivergencia ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {diferencaRetencao > 0 ? '+' : ''}R$ {diferencaRetencao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Texto do parecer e fundamentação */}
              <div className="p-4 bg-white dark:bg-[#111214] rounded-2xl border border-black/10 dark:border-white/10 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-black/60 dark:text-white/60 tracking-wider">
                    Parecer Técnico Normativo do Auditor
                  </span>
                  <button
                    type="button"
                    onClick={copyParecer}
                    className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white flex items-center gap-1 font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Parecer</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-black/70 dark:text-white/70 whitespace-pre-line font-mono leading-relaxed bg-black/5 dark:bg-white/5 p-3 rounded-xl">
                  {parecerTecnicoRigido}
                </p>
              </div>

              {/* Botões de Ação Direta no Sistema */}
              <div className="flex flex-wrap gap-3">
                {temDivergencia ? (
                  <button
                    type="button"
                    onClick={handleApplyToForm}
                    className="flex-1 min-w-[240px] px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Aplicar Restrição 005 no Formulário e Iniciar Registro</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyToForm}
                    className="flex-1 min-w-[240px] px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Transferir Regularidade para o Formulário (Sem Ocorrência)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>

            {/* Citação normativa oficial */}
            <div className="flex items-start gap-4 p-4 bg-[#00FF00]/5 dark:bg-[#00FF00]/10 rounded-3xl border border-[#00FF00]/10 dark:border-[#00FF00]/20">
              <AlertCircle className="w-5 h-5 text-[#00CC00] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-black/70 dark:text-white/80 uppercase tracking-widest">
                  Fundamentação Legal Vinculante
                </p>
                <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed">
                  Conforme a <b>IN RFB nº 1.234/2012</b>, o <b>Art. 63 da Lei nº 4.320/1964</b> e a <b>Portaria IFS nº 1.633/2026</b> (Macrofunção SIAFI 020314), havendo divergência tributária superior a centavos na liquidação da despesa, é dever funcional apor a <b>Restrição 005</b> com resultado <b>COM OCORRÊNCIA</b>.
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
  const [view, setView] = useState<'form' | 'pdf-analyzer' | 'history' | 'calculator'>('form');
  const [currentAudit, setCurrentAudit] = useState<ProcessAuditResult | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sincroniza a classe 'dark' no html root para Tailwind v4
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const filteredAnalyses = useMemo(() => {
    if (!searchTerm.trim()) return analyses;
    const term = searchTerm.toLowerCase();
    return analyses.filter(item => 
      (item.processo && item.processo.toLowerCase().includes(term)) ||
      (item.tipoDoc && item.tipoDoc.toLowerCase().includes(term)) ||
      (item.numeroDoc && item.numeroDoc.toLowerCase().includes(term)) ||
      (item.conformista && item.conformista.toLowerCase().includes(term)) ||
      (item.resultado && item.resultado.toLowerCase().includes(term)) ||
      (item.restricoes && item.restricoes.some(r => r.toLowerCase().includes(term)))
    );
  }, [analyses, searchTerm]);

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
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0C0D0E] text-[#141414] dark:text-white font-sans transition-colors duration-200">
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
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <a 
              href="https://ais-pre-rxxw4xraqndg73w5bkb6jj-213322120758.us-east1.run.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all text-white/70"
            >
              <ExternalLink className="w-3 h-3 text-[#00FF00]" /> Link Externo
            </a>

            {/* Seletor de Tema Light / Dark Mode */}
            <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/10">
              <button 
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  theme === 'light' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
                title="Modo Claro"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Claro</span>
              </button>
              <button 
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#00FF00] text-black shadow-sm shadow-[#00FF00]/20' 
                    : 'text-white/60 hover:text-white'
                }`}
                title="Modo Escuro"
              >
                <Moon className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">Escuro</span>
              </button>
            </div>

            <nav className="flex bg-white/10 p-1 rounded-full border border-white/10 flex-wrap gap-1 sm:gap-0">
            <button 
              onClick={() => setView('form')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'form' ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Análise
            </button>
            <button 
              onClick={() => setView('pdf-analyzer')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'pdf-analyzer' ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Análise PDF (IA)
            </button>
            <button 
              onClick={() => setView('calculator')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'calculator' ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Calculator className="w-3.5 h-3.5" /> Calculadora
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'history' ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
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
                <div className="bg-white dark:bg-[#16181A] p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-4 border-b border-black/5 dark:border-white/10 pb-2">
                    <User className="w-4 h-4 text-black/40 dark:text-white/40" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black/60 dark:text-white/60">Identificação</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40 block mb-1 leading-none">Conformista</label>
                      <input 
                        type="text" 
                        value={conformista}
                        onChange={e => setConformista(e.target.value)}
                        placeholder="Nome"
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-lg text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40 block mb-1 leading-none">Processo SEI</label>
                      <input 
                        type="text" 
                        value={processo}
                        onChange={e => setProcesso(e.target.value)}
                        placeholder="00000.000000/0000-00"
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-lg text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/20 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40 block mb-1 leading-none">Número Doc</label>
                      <input 
                        type="text" 
                        value={numeroDoc}
                        onChange={e => setNumeroDoc(e.target.value)}
                        placeholder="Ex: NF 123..."
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-lg text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40 block mb-1.5 leading-none">Tipo de Documento</label>
                      <div className="relative">
                        <select
                          value={tipoDoc}
                          onChange={e => setTipoDoc(e.target.value as DocType)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-lg text-[11px] font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 transition-all appearance-none pr-8 cursor-pointer"
                        >
                          {Object.keys(CHECKLIST_BY_TYPE).map(type => (
                            <option key={type} value={type} className="bg-white dark:bg-[#16181A] text-black dark:text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40 dark:text-white/40 pointer-events-none" />
                      </div>
                      
                      {/* Quick access badges for all document types */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {(Object.keys(CHECKLIST_BY_TYPE) as DocType[]).map(quickType => (
                          <button
                            key={quickType}
                            type="button"
                            onClick={() => setTipoDoc(quickType)}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold transition-all border ${tipoDoc === quickType ? 'bg-black text-[#00FF00] border-black dark:bg-[#00FF00] dark:text-black dark:border-[#00FF00]' : 'bg-gray-100 dark:bg-white/5 text-black/50 dark:text-white/50 border-black/5 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10'}`}
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
                  <div className="bg-white dark:bg-[#16181A] rounded-xl shadow-md border border-black/5 dark:border-white/10 overflow-hidden transition-colors">
                    <div className="p-3 px-4 border-b border-black/5 dark:border-white/10 bg-gray-50 dark:bg-[#202326] flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">Checklist De Conformidade</h2>
                        <div className="flex items-center gap-1.5 bg-white dark:bg-[#16181A] px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10">
                          <div className="h-1 w-10 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${(Object.values(checklist).filter(Boolean).length / CHECKLIST_BY_TYPE[tipoDoc].length) * 100}%` }}
                              className="h-full bg-[#00FF00] transition-all"
                            />
                          </div>
                          <span className="text-[9px] font-bold text-black/40 dark:text-white/50">
                            {Math.round((Object.values(checklist).filter(Boolean).length / CHECKLIST_BY_TYPE[tipoDoc].length) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex bg-white dark:bg-[#16181A] p-0.5 rounded-lg border border-black/5 dark:border-white/10 shadow-sm">
                        <button 
                          onClick={() => setResultado('SEM OCORRÊNCIA')}
                          className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${resultado === 'SEM OCORRÊNCIA' ? 'bg-[#00FF00] text-black' : 'text-black/30 dark:text-white/40 hover:text-black/50 dark:hover:text-white'}`}
                        >
                          Sem Ocorrência
                        </button>
                        <button 
                          onClick={() => setResultado('COM OCORRÊNCIA')}
                          className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${resultado === 'COM OCORRÊNCIA' ? 'bg-red-500 text-white' : 'text-black/30 dark:text-white/40 hover:text-black/50 dark:hover:text-white'}`}
                        >
                          Com Ocorrência
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist Items Area */}
                <div className="bg-white dark:bg-[#16181A] rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-4 sm:p-5 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {CHECKLIST_BY_TYPE[tipoDoc].map(item => (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${checklist[item.id] ? 'bg-[#00FF00]/5 dark:bg-[#00FF00]/10 border-[#00FF00]/20 dark:border-[#00FF00]/30' : 'bg-white dark:bg-[#202326] border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20'}`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${checklist[item.id] ? 'bg-[#00FF00] border-[#00FF00]' : 'border-black/10 dark:border-white/20 group-hover:border-black/20 dark:group-hover:border-white/30'}`}>
                          {checklist[item.id] && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-tight ${checklist[item.id] ? 'font-bold text-black dark:text-white' : 'text-black/70 dark:text-white/70'}`}>{item.label}</p>
                          {item.hint && <p className="text-[10px] text-black/40 dark:text-white/40 mt-1 italic leading-tight">{item.hint}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {resultado === 'COM OCORRÊNCIA' && (
                    <div 
                      className="space-y-3 mb-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/40"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Ocorrências Encontradas</h3>
                        <span className="text-[9px] text-red-400 dark:text-red-300 uppercase font-bold">Macrofunção 020314</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {RESTRICOES.map(code => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => toggleRestricao(code)}
                            className={`text-left px-2.5 py-1.5 rounded-lg text-[9px] transition-all border ${selectedRestricoes.includes(code) ? 'bg-red-500 text-white border-red-500 font-medium' : 'bg-white dark:bg-[#16181A] border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 hover:border-red-400'}`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={observacao}
                        onChange={e => setObservacao(e.target.value)}
                        placeholder="Descreva detalhadamente a ocorrência para o relatório..."
                        className="w-full p-2.5 bg-white dark:bg-[#16181A] border border-red-200 dark:border-red-800/60 text-black dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[70px]"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={resetForm}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-white/10 text-black/60 dark:text-white/70 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                    >
                      Limpar
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-[#141414] dark:bg-[#00FF00] text-white dark:text-black py-2.5 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-black dark:hover:bg-[#00CC00] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/10"
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
        ) : view === 'pdf-analyzer' ? (
          <ProcessPdfAnalyzer
            conformistaPadrao={conformista}
            onOpenCalculator={() => setView('calculator')}
            onAuditChange={(audit) => setCurrentAudit(audit)}
            onImportToForm={(data) => {
              setProcesso(data.processo);
              setNumeroDoc(data.numeroDoc);
              if (data.tipoDoc) setTipoDoc(data.tipoDoc);
              setResultado(data.resultado);
              setSelectedRestricoes(data.restricoes);
              setObservacao(data.observacao);
              setView('form');
            }}
            onSaveToHistory={async (data) => {
              try {
                const res = await fetch('/api/analyses', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                if (res.ok) {
                  fetchAnalyses();
                }
              } catch (err) {
                console.error("Erro ao salvar análise direta:", err);
              }
            }}
          />
        ) : view === 'calculator' ? (
          <TaxCalculator 
            initialAudit={currentAudit}
            onApplyToForm={(data) => {
              setProcesso(data.processo);
              setNumeroDoc(data.numeroDoc);
              if (data.tipoDoc) setTipoDoc(data.tipoDoc);
              setResultado(data.resultado);
              setSelectedRestricoes(data.restricoes);
              setObservacao(data.observacao);
              setView('form');
            }}
          />
        ) : (
          <div className="space-y-8">
            {/* Seção de Estatísticas com Recharts */}
            <HistoryStatistics analyses={analyses} theme={theme} />

            {/* Listagem e Tabela de Registros */}
            <div 
              className="bg-white dark:bg-[#16181A] rounded-3xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden transition-colors"
            >
              <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white">Histórico de Análises</h2>
                  <p className="text-xs text-black/40 dark:text-white/40 mt-1">
                    {analyses.length === 0 
                      ? "Nenhum processo registrado" 
                      : `Exibindo ${filteredAnalyses.length} de ${analyses.length} processo${analyses.length > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/40" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar processo, doc, conformista..."
                      className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/20 w-full sm:w-64"
                    />
                  </div>
                  <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00FF00] text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00CC00] transition-all shadow-sm shrink-0"
                  >
                    <FileText className="w-4 h-4" /> Baixar CSV
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:block overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#202326]">
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 dark:text-white/40 tracking-widest">Data/Hora</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 dark:text-white/40 tracking-widest">Processo SEI</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 dark:text-white/40 tracking-widest">Documento</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 dark:text-white/40 tracking-widest">Resultado</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 dark:text-white/40 tracking-widest">Ocorrências</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-black/40 dark:text-white/40 tracking-widest">Conformista</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnalyses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-black/40 dark:text-white/40 italic">
                          {analyses.length === 0 
                            ? "Nenhuma análise registrada ainda." 
                            : `Nenhum processo encontrado para a busca "${searchTerm}".`}
                        </td>
                      </tr>
                    ) : (
                      filteredAnalyses.map(item => (
                        <tr key={item.id} className="border-t border-black/5 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                          <td className="p-4">
                            <div className="text-sm font-mono text-black dark:text-white">{new Date(item.timestamp).toLocaleDateString()}</div>
                            <div className="text-[10px] text-black/30 dark:text-white/40">{new Date(item.timestamp).toLocaleTimeString()}</div>
                          </td>
                          <td className="p-4 text-sm font-bold text-black dark:text-white">{item.processo}</td>
                          <td className="p-4">
                            <div className="text-sm font-bold text-black dark:text-white">{item.tipoDoc}</div>
                            <div className="text-[10px] text-black/40 dark:text-white/40 italic">{item.numeroDoc || "S/N"}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.resultado === 'SEM OCORRÊNCIA' ? 'bg-[#00FF00]/20 text-green-800 dark:text-[#00FF00]' : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'}`}>
                              {item.resultado}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="max-w-[200px] truncate text-[11px] text-black/60 dark:text-white/70">
                              {item.restricoes && item.restricoes.length > 0 ? item.restricoes.join(", ") : "Nenhuma"}
                            </div>
                            {item.observacao && (
                              <div className="max-w-[200px] truncate text-[10px] text-black/40 dark:text-white/40 italic">
                                {item.observacao}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-sm text-black/60 dark:text-white/70">{item.conformista}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards for Mobile/Tablet */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredAnalyses.length === 0 ? (
                  <div className="p-12 text-center text-black/40 dark:text-white/40 italic">
                    {analyses.length === 0 
                      ? "Nenhuma análise registrada ainda." 
                      : `Nenhum processo encontrado para a busca "${searchTerm}".`}
                  </div>
                ) : (
                  filteredAnalyses.map(item => (
                    <div 
                      key={item.id}
                      className="bg-gray-50 dark:bg-[#202326] p-4 rounded-2xl border border-black/5 dark:border-white/10 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-black/30 dark:text-white/40 tracking-widest">{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}</div>
                          <div className="text-base font-bold text-black dark:text-white mt-1">{item.processo}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${item.resultado === 'SEM OCORRÊNCIA' ? 'bg-[#00FF00] text-black' : 'bg-red-500 text-white'}`}>
                          {item.resultado === 'SEM OCORRÊNCIA' ? 'Ok' : 'Ocorrência'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 border-t border-black/5 dark:border-white/10 pt-3">
                        <FileText className="w-3 h-3 text-black/40 dark:text-white/40" />
                        <div className="text-xs font-medium text-black/70 dark:text-white/80">{item.tipoDoc} {item.numeroDoc && <span className="text-black/30 dark:text-white/40">| {item.numeroDoc}</span>}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white dark:bg-[#16181A] p-2 rounded-lg border border-black/5 dark:border-white/10">
                          <p className="text-[9px] uppercase font-bold text-black/30 dark:text-white/40">Conformista</p>
                          <p className="text-[11px] font-medium text-black dark:text-white truncate">{item.conformista}</p>
                        </div>
                        <div className="bg-white dark:bg-[#16181A] p-2 rounded-lg border border-black/5 dark:border-white/10">
                          <p className="text-[9px] uppercase font-bold text-black/30 dark:text-white/40">Ocorrências</p>
                          <p className="text-[11px] font-medium text-black dark:text-white truncate">{(item.restricoes && item.restricoes.length > 0) ? item.restricoes.length : 0}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto p-12 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/20 dark:text-white/30">Link de Acesso Direto</p>
          <a 
            href="https://ais-pre-rxxw4xraqndg73w5bkb6jj-213322120758.us-east1.run.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-mono text-black/40 dark:text-white/50 hover:text-[#00FF00] dark:hover:text-[#00FF00] transition-colors border-b border-black/5 dark:border-white/10 pb-1"
          >
            ais-pre-rxxw4xraqndg73w5bkb6jj...run.app
          </a>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-black/30 dark:text-white/40">
          Baseado no Manual de Procedimentos para a Conformidade de Registro de Gestão 2026 (Portaria IFS nº 1.633/2026)
        </p>
      </footer>
      <Analytics />
    </div>
  );
}
