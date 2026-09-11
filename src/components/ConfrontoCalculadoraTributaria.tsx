import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  ShieldAlert, 
  DollarSign, 
  Percent, 
  Landmark, 
  ShieldCheck,
  HelpCircle,
  Copy,
  ExternalLink,
  Info
} from 'lucide-react';
import { TAX_RULES, ProcessAuditResult, ProcessRestriction, ConfrontoCalculadora } from '../types';

interface ConfrontoCalculadoraProps {
  auditResult: ProcessAuditResult;
  onApplyRestriction?: (restriction: ProcessRestriction) => void;
  onOpenFullCalculator?: (params: { grossValue: number; ruleId: string; issRate: number; inssRate: number }) => void;
  onUpdateAuditWithConfronto?: (confronto: ConfrontoCalculadora) => void;
}

export const ConfrontoCalculadoraTributaria: React.FC<ConfrontoCalculadoraProps> = ({
  auditResult,
  onApplyRestriction,
  onOpenFullCalculator,
  onUpdateAuditWithConfronto
}) => {
  // 1. Detect default tax rule based on process nature or existing confrontation
  const initialRuleId = useMemo(() => {
    if (auditResult.confrontoCalculadora?.regraId) {
      return auditResult.confrontoCalculadora.regraId;
    }
    if (auditResult.naturezaProcesso === 'AUXILIO_ESTUDANTIL' || auditResult.naturezaProcesso === 'TAXAS_E_CONTRIBUICOES') {
      return 'ISENTO';
    }
    const docTitle = `${auditResult.tipoDoc} ${auditResult.numeroDoc} ${auditResult.favorecido?.nome || ''}`.toLowerCase();
    if (docTitle.includes('limpeza') || docTitle.includes('conserva')) return '17032';
    if (docTitle.includes('vigil')) return '17031';
    if (docTitle.includes('mão de obra') || docTitle.includes('mao de obra')) return '17033';
    if (docTitle.includes('livro') || docTitle.includes('alimenta') || docTitle.includes('material')) return '17001';
    return '17099'; // Default 9.45%
  }, [auditResult]);

  const [selectedRuleId, setSelectedRuleId] = useState<string>(initialRuleId);
  const [customGrossValue, setCustomGrossValue] = useState<number>(auditResult.valores?.valorBruto || 0);
  const [issRate, setIssRate] = useState<number>(0);
  const [inssRate, setInssRate] = useState<number>(() => {
    const nome = auditResult.favorecido?.nome?.toLowerCase() || '';
    if (nome.includes('limpeza') || nome.includes('vigilancia') || nome.includes('conservacao')) {
      return 11; // INSS 11% padrão cessão de mão de obra
    }
    return 0;
  });

  const [appliedRestrictionFeedback, setAppliedRestrictionFeedback] = useState<string | null>(null);

  // Selected rule details
  const selectedRule = useMemo(() => {
    if (selectedRuleId === 'ISENTO') {
      return {
        id: 'ISENTO',
        label: auditResult.naturezaProcesso === 'AUXILIO_ESTUDANTIL'
          ? 'Auxílio Estudantil (Dispensa e Imunidade Tributária - Lei 4.320/64)'
          : 'Taxas Públicas / Emolumentos Autárquicos (Não incidência - IN RFB 1234/12)',
        ir: 0,
        csll: 0,
        cofins: 0,
        pis: 0,
        total: 0,
        darf: 'N/A',
        ddf: 'N/A'
      };
    }
    return TAX_RULES.find(r => r.id === selectedRuleId) || TAX_RULES[0];
  }, [selectedRuleId, auditResult.naturezaProcesso]);

  // Calculations according to law (IN RFB 1.234/2012 + ISS + INSS)
  const legalCalculations = useMemo(() => {
    const base = Number(customGrossValue) || 0;
    const ir = (base * selectedRule.ir) / 100;
    const csll = (base * selectedRule.csll) / 100;
    const cofins = (base * selectedRule.cofins) / 100;
    const pis = (base * selectedRule.pis) / 100;
    const federalTotal = ir + csll + cofins + pis;

    const iss = (base * (Number(issRate) || 0)) / 100;
    const inss = (base * (Number(inssRate) || 0)) / 100;

    const totalRetentions = federalTotal + iss + inss;
    const legalNetValue = base - totalRetentions;

    return {
      base,
      ir,
      csll,
      cofins,
      pis,
      federalTotal,
      iss,
      inss,
      totalRetentions,
      legalNetValue
    };
  }, [customGrossValue, selectedRule, issRate, inssRate]);

  // Process documented values
  const processValores = useMemo(() => {
    return {
      bruto: auditResult.valores?.valorBruto || 0,
      retencoes: auditResult.valores?.retencoes || 0,
      liquido: auditResult.valores?.valorLiquido || 0
    };
  }, [auditResult.valores]);

  // Comparison & Divergence Analysis
  const confrontation = useMemo(() => {
    const diffRetencao = Math.round((legalCalculations.totalRetentions - processValores.retencoes) * 100) / 100;
    const diffLiquido = Math.round((legalCalculations.legalNetValue - processValores.liquido) * 100) / 100;
    const hasDivergence = Math.abs(diffRetencao) > 0.05 || Math.abs(diffLiquido) > 0.05;

    let status: "CONVERGENTE" | "DIVERGENCIA_DETECTADA" | "ISENTO_OU_DISPENSADO" = "CONVERGENTE";
    if (selectedRuleId === 'ISENTO' && processValores.retencoes === 0) {
      status = "ISENTO_OU_DISPENSADO";
    } else if (hasDivergence) {
      status = "DIVERGENCIA_DETECTADA";
    }

    let justificativa = "";
    if (status === 'ISENTO_OU_DISPENSADO') {
      justificativa = "Valores em conformidade. O processo está devidamente respaldado por dispensa legal de retenções tributárias federais na fonte.";
    } else if (status === 'CONVERGENTE') {
      justificativa = `Cálculo perfeitamente convergente. As retenções calculadas pela IN RFB nº 1.234/2012 (R$ ${legalCalculations.totalRetentions.toFixed(2)}) coincidem com o montante informado no processo (R$ ${processValores.retencoes.toFixed(2)}).`;
    } else {
      justificativa = `Divergência Tributária Identificada: Pela legislação federal (IN RFB nº 1.234/2012, alíquota de ${selectedRule.total}%), o montante de retenção devido é de R$ ${legalCalculations.totalRetentions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, porém no processo/documento foi informado/retido R$ ${processValores.retencoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, resultando em uma divergência de R$ ${Math.abs(diffRetencao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    }

    return {
      diffRetencao,
      diffLiquido,
      hasDivergence,
      status,
      justificativa
    };
  }, [legalCalculations, processValores, selectedRuleId, selectedRule.total]);

  // Check if restriction 005 is already registered in the audit
  const has005Already = useMemo(() => {
    return (auditResult.restricoesDetectadas || []).some(r => r.codigo.startsWith('005'));
  }, [auditResult.restricoesDetectadas]);

  // Strict application of restriction 005
  const handleApplyStrictRestriction = () => {
    const diffAbs = Math.abs(confrontation.diffRetencao).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const retDevida = legalCalculations.totalRetentions.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const retProcesso = processValores.retencoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    const newRestriction: ProcessRestriction = {
      codigo: "005 - Divergência de Valores/Cálculos Tributários ou Retenções (IN 1234/12)",
      titulo: `Divergência de Cálculo Tributário na Fonte: R$ ${diffAbs}`,
      descricao: `Identificada divergência matemática e tributária entre as retenções exigidas por lei (IN RFB nº 1.234/2012 e legislação correlata) e os valores constantes do processo. Valor de retenção devido por lei: R$ ${retDevida} (Alíquota ${selectedRule.total}%). Valor informado/retido no processo: R$ ${retProcesso}. Divergência: R$ ${diffAbs}. Infração ao Art. 2º da IN RFB nº 1.234/2012 e Art. 63 da Lei nº 4.320/1964.`,
      severidade: confrontation.diffRetencao > 0 ? "Impeditiva" : "Grave",
      trechoEvidencia: `Confronto da Calculadora Oficial: Valor Bruto R$ ${legalCalculations.base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Retenção Legal Apurada: R$ ${retDevida}. Retenção no Processo: R$ ${retProcesso}. Diferença: R$ ${diffAbs}.`,
      acaoRecomendada: "Submeter os autos ao setor de liquidação para reemissão da Nota Fiscal ou retificação da Nota de Lançamento de Sistema (NS), garantindo o recolhimento integral das retenções tributárias devidas aos cofres da União via SIAFI."
    };

    if (onApplyRestriction) {
      onApplyRestriction(newRestriction);
    }

    if (onUpdateAuditWithConfronto) {
      onUpdateAuditWithConfronto({
        valorBrutoProcesso: processValores.bruto,
        retencaoProcesso: processValores.retencoes,
        valorLiquidoProcesso: processValores.liquido,
        regraId: selectedRuleId,
        regraLabel: selectedRule.label,
        aliquotaTotal: selectedRule.total,
        irCalculado: legalCalculations.ir,
        csllCalculado: legalCalculations.csll,
        cofinsCalculado: legalCalculations.cofins,
        pisCalculado: legalCalculations.pis,
        issCalculado: legalCalculations.iss,
        inssCalculado: legalCalculations.inss,
        retencoesLegaisTotais: legalCalculations.totalRetentions,
        valorLiquidoCalculado: legalCalculations.legalNetValue,
        diferencaRetencao: confrontation.diffRetencao,
        diferencaLiquido: confrontation.diffLiquido,
        statusConfronto: confrontation.status,
        justificativaNormativa: confrontation.justificativa,
        restricaoAplicada: newRestriction.codigo
      });
    }

    setAppliedRestrictionFeedback(`Restrição 005 aplicada com rigor normativo! Status do processo atualizado para COM OCORRÊNCIA.`);
    setTimeout(() => setAppliedRestrictionFeedback(null), 5000);
  };

  const copyMemoriaCalculo = () => {
    const text = `=== MEMÓRIA DE CÁLCULO E CONFRONTO TRIBUTÁRIO (IN RFB 1.234/2012 & LEI 4.320/64) ===
Processo: ${auditResult.processo}
Documento: ${auditResult.numeroDoc} (${auditResult.tipoDoc})
Favorecido: ${auditResult.favorecido?.nome || 'N/A'} (CNPJ/CPF: ${auditResult.favorecido?.cnpjCpf || 'N/A'})

[1. CÁLCULO LEGAL EXIGIDO]
Base de Cálculo (Valor Bruto): R$ ${legalCalculations.base.toFixed(2)}
Enquadramento IN RFB 1.234/12: Código ${selectedRule.id} - ${selectedRule.label}
- IRRF (${selectedRule.ir}%): R$ ${legalCalculations.ir.toFixed(2)}
- CSLL (${selectedRule.csll}%): R$ ${legalCalculations.csll.toFixed(2)}
- COFINS (${selectedRule.cofins}%): R$ ${legalCalculations.cofins.toFixed(2)}
- PIS/PASEP (${selectedRule.pis}%): R$ ${legalCalculations.pis.toFixed(2)}
Subtotal Federal (DARF ${selectedRule.darf}): R$ ${legalCalculations.federalTotal.toFixed(2)}
- ISSQN (${issRate}%): R$ ${legalCalculations.iss.toFixed(2)}
- INSS (${inssRate}%): R$ ${legalCalculations.inss.toFixed(2)}
Total Retenções Legais: R$ ${legalCalculations.totalRetentions.toFixed(2)}
Valor Líquido Legal a Pagar: R$ ${legalCalculations.legalNetValue.toFixed(2)}

[2. VALORES CONSTANTES NO PROCESSO]
Valor Bruto Documentado: R$ ${processValores.bruto.toFixed(2)}
Retenções Declaradas no Processo: R$ ${processValores.retencoes.toFixed(2)}
Valor Líquido Declarado no Processo: R$ ${processValores.liquido.toFixed(2)}

[3. DIAGNÓSTICO E CONFRONTO]
Divergência de Retenção: R$ ${confrontation.diffRetencao.toFixed(2)}
Divergência de Líquido: R$ ${confrontation.diffLiquido.toFixed(2)}
Status: ${confrontation.status}
Parecer Técnico: ${confrontation.justificativa}`;

    navigator.clipboard.writeText(text);
    alert("Memória de cálculo copiada com sucesso para a área de transferência!");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-black dark:bg-[#00FF00] text-[#00FF00] dark:text-black rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 rounded text-[9px] font-black uppercase tracking-widest">
                  IN RFB Nº 1.234/2012 & Portaria IFS 1.633/2026
                </span>
                <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">
                  SIAFI 020314
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-black dark:text-white mt-0.5">
                Calculadora Oficial de Retenções & Confronto Tributário
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={copyMemoriaCalculo}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-black dark:text-white rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5"
              title="Copiar memória de cálculo auditada"
            >
              <Copy className="w-3.5 h-3.5" /> Copiar Memória
            </button>
            {onOpenFullCalculator && (
              <button
                type="button"
                onClick={() => onOpenFullCalculator({
                  grossValue: customGrossValue,
                  ruleId: selectedRuleId,
                  issRate,
                  inssRate
                })}
                className="px-3 py-1.5 bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black hover:opacity-90 rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir na Calculadora Geral
              </button>
            )}
          </div>
        </div>

        {/* Feedback banner if restriction was just applied */}
        {appliedRestrictionFeedback && (
          <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl text-red-900 dark:text-red-200 text-xs font-bold flex items-center gap-2 animate-bounce">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{appliedRestrictionFeedback}</span>
          </div>
        )}

        {/* Parameters & Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base de Cálculo */}
          <div>
            <label className="text-[10px] uppercase font-black text-black/50 dark:text-white/50 block mb-1.5 tracking-wider flex items-center justify-between">
              <span>Base de Cálculo (R$)</span>
              <span className="text-[9px] text-blue-600 dark:text-blue-400 font-mono">Extraído do Processo</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-black/40 dark:text-white/40 font-bold">R$</span>
              <input
                type="number"
                step="0.01"
                value={customGrossValue}
                onChange={(e) => setCustomGrossValue(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]"
              />
            </div>
          </div>

          {/* Enquadramento IN 1234/12 */}
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase font-black text-black/50 dark:text-white/50 block mb-1.5 tracking-wider flex items-center justify-between">
              <span>Enquadramento Tributário Legal (IN RFB nº 1.234/2012)</span>
              <span className="text-[9px] text-[#00AA00] dark:text-[#00FF00] font-bold">Alíquota: {selectedRule.total}%</span>
            </label>
            <select
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs font-medium text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]"
            >
              <option value="ISENTO">
                {auditResult.naturezaProcesso === 'AUXILIO_ESTUDANTIL'
                  ? 'Auxílio Financeiro a Estudantes (3.3.90.18) - Isenção e Dispensa de Retenção Legal'
                  : 'Taxas Públicas / ART CREA-SE (3.3.90.47) - Não incidência de Retenção'}
              </option>
              {TAX_RULES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.label} ({r.total}% = IR {r.ir}% + CSLL {r.csll}% + COFINS {r.cofins}% + PIS {r.pis}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional municipal / INSS controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-black/5 dark:border-white/10">
          <div>
            <label className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block mb-1">
              ISSQN Municipal (%)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={issRate}
              onChange={(e) => setIssRate(parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-lg text-xs font-mono text-black dark:text-white"
            />
          </div>
          <div>
            <label className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block mb-1">
              INSS Mão de Obra (%)
            </label>
            <input
              type="number"
              min="0"
              max="11"
              step="1"
              value={inssRate}
              onChange={(e) => setInssRate(parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-lg text-xs font-mono text-black dark:text-white"
            />
          </div>
          <div className="col-span-2 flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setCustomGrossValue(auditResult.valores?.valorBruto || 0);
                setSelectedRuleId(initialRuleId);
              }}
              className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all"
            >
              Resetar para Valores do PDF
            </button>
          </div>
        </div>
      </div>

      {/* DIVERGENCE OR CONVERGENCE SIGNAL BANNER */}
      {confrontation.hasDivergence ? (
        <div className="p-5 bg-red-50 dark:bg-red-950/40 border-2 border-red-400 dark:border-red-700/80 rounded-2xl shadow-md text-red-950 dark:text-red-100 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-600 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                    DIVERGÊNCIA TRIBUTÁRIA IDENTIFICADA
                  </span>
                  <span className="text-[10px] font-bold text-red-800 dark:text-red-300">
                    Rigor Normativo Exigido: Restrição 005
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-red-900 dark:text-red-200">
                  Diferença de Retenção: R$ {Math.abs(confrontation.diffRetencao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {confrontation.diffRetencao > 0 ? '(Retenção a MENOR no processo)' : '(Retenção a MAIOR no processo)'}
                </h4>
                <p className="text-xs leading-relaxed text-red-900/90 dark:text-red-200/90 max-w-3xl">
                  {confrontation.justificativa}
                </p>
                <div className="text-[11px] font-medium text-red-800 dark:text-red-300 pt-1">
                  <strong>Fundamentação Legal:</strong> Art. 2º da IN RFB nº 1.234/2012, Art. 63 da Lei nº 4.320/1964 e Macrofunção SIAFI 020314. O órgão público federal responde pelo recolhimento incorreto de tributos retidos.
                </div>
              </div>
            </div>

            {/* Action to strictly enforce restriction */}
            <div className="shrink-0 flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={handleApplyStrictRestriction}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                {has005Already ? 'Atualizar Restrição 005' : 'Aplicar Restrição 005 (COM OCORRÊNCIA)'}
              </button>
              {has005Already && (
                <span className="text-[10px] font-bold text-red-700 dark:text-red-400">
                  ✓ Restrição 005 ativa no parecer
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-2xl text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <span>Cálculos Rigorosamente Convergentes com a Lei</span>
                <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900/60 rounded-full text-[9px] font-bold">
                  Diferença: R$ 0,00
                </span>
              </div>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 mt-0.5">
                {confrontation.justificativa}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 shrink-0">
            Conforme IN RFB 1234/12
          </span>
        </div>
      )}

      {/* DETAILED COMPARISON TABLE */}
      <div className="bg-white dark:bg-[#16181A] rounded-2xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
        <div className="p-4 bg-gray-50/70 dark:bg-[#1f2226] border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-black/60 dark:text-white/60" />
            <h4 className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">
              Quadro Comparativo: Legislação vs. Documentação do Processo
            </h4>
          </div>
          <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">
            Tolerância: R$ 0,05 (Centavos)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100/50 dark:bg-white/5 border-b border-black/5 dark:border-white/10 text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50">
              <tr>
                <th className="p-3.5 font-black">Item de Verificação</th>
                <th className="p-3.5 font-black">Cálculo Legal Exigido (IN 1234 / Leis)</th>
                <th className="p-3.5 font-black">Constante no Processo (NF / SIAFI)</th>
                <th className="p-3.5 font-black">Divergência (R$)</th>
                <th className="p-3.5 font-black text-right">Diagnóstico de Conformidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
              {/* Valor Bruto */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="p-3.5 font-sans font-medium text-black dark:text-white">
                  Valor Bruto (Base de Cálculo)
                </td>
                <td className="p-3.5 font-bold text-black dark:text-white">
                  R$ {legalCalculations.base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black/70 dark:text-white/70">
                  R$ {processValores.bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black/40 dark:text-white/40">
                  R$ {(legalCalculations.base - processValores.bruto).toFixed(2)}
                </td>
                <td className="p-3.5 text-right font-sans">
                  {Math.abs(legalCalculations.base - processValores.bruto) <= 0.05 ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[9px] font-bold">
                      Exato
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded text-[9px] font-bold">
                      Divergente
                    </span>
                  )}
                </td>
              </tr>

              {/* IRRF */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="p-3.5 font-sans text-black/80 dark:text-white/80 pl-6">
                  ↳ IRRF ({selectedRule.ir}%)
                </td>
                <td className="p-3.5 font-medium text-red-600 dark:text-red-400">
                  R$ {legalCalculations.ir.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black/50 dark:text-white/50">
                  {selectedRule.ir > 0 ? 'Conforme destaque' : 'Dispensa/Isento'}
                </td>
                <td className="p-3.5 text-black/40 dark:text-white/40">—</td>
                <td className="p-3.5 text-right font-sans">
                  <span className="text-[10px] text-black/50 dark:text-white/50">IN RFB 1.234/12</span>
                </td>
              </tr>

              {/* CSLL */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="p-3.5 font-sans text-black/80 dark:text-white/80 pl-6">
                  ↳ CSLL ({selectedRule.csll}%)
                </td>
                <td className="p-3.5 font-medium text-red-600 dark:text-red-400">
                  R$ {legalCalculations.csll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black/50 dark:text-white/50">
                  {selectedRule.csll > 0 ? 'Conforme destaque' : 'Dispensa/Isento'}
                </td>
                <td className="p-3.5 text-black/40 dark:text-white/40">—</td>
                <td className="p-3.5 text-right font-sans">
                  <span className="text-[10px] text-black/50 dark:text-white/50">Lei 10.833/03</span>
                </td>
              </tr>

              {/* COFINS */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="p-3.5 font-sans text-black/80 dark:text-white/80 pl-6">
                  ↳ COFINS ({selectedRule.cofins}%)
                </td>
                <td className="p-3.5 font-medium text-red-600 dark:text-red-400">
                  R$ {legalCalculations.cofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black/50 dark:text-white/50">
                  {selectedRule.cofins > 0 ? 'Conforme destaque' : 'Dispensa/Isento'}
                </td>
                <td className="p-3.5 text-black/40 dark:text-white/40">—</td>
                <td className="p-3.5 text-right font-sans">
                  <span className="text-[10px] text-black/50 dark:text-white/50">Lei 10.833/03</span>
                </td>
              </tr>

              {/* PIS */}
              <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="p-3.5 font-sans text-black/80 dark:text-white/80 pl-6">
                  ↳ PIS/PASEP ({selectedRule.pis}%)
                </td>
                <td className="p-3.5 font-medium text-red-600 dark:text-red-400">
                  R$ {legalCalculations.pis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black/50 dark:text-white/50">
                  {selectedRule.pis > 0 ? 'Conforme destaque' : 'Dispensa/Isento'}
                </td>
                <td className="p-3.5 text-black/40 dark:text-white/40">—</td>
                <td className="p-3.5 text-right font-sans">
                  <span className="text-[10px] text-black/50 dark:text-white/50">Lei 10.833/03</span>
                </td>
              </tr>

              {/* ISS Municipal */}
              {issRate > 0 && (
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                  <td className="p-3.5 font-sans text-black/80 dark:text-white/80 pl-6">
                    ↳ ISSQN Municipal ({issRate}%)
                  </td>
                  <td className="p-3.5 font-medium text-red-600 dark:text-red-400">
                    R$ {legalCalculations.iss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-black/50 dark:text-white/50">DAM Municipal</td>
                  <td className="p-3.5 text-black/40 dark:text-white/40">—</td>
                  <td className="p-3.5 text-right font-sans">
                    <span className="text-[10px] text-black/50 dark:text-white/50">LC 116/2003</span>
                  </td>
                </tr>
              )}

              {/* INSS Previdenciário */}
              {inssRate > 0 && (
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                  <td className="p-3.5 font-sans text-black/80 dark:text-white/80 pl-6">
                    ↳ INSS Previdenciário ({inssRate}%)
                  </td>
                  <td className="p-3.5 font-medium text-red-600 dark:text-red-400">
                    R$ {legalCalculations.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-black/50 dark:text-white/50">GPS / DCTFWeb</td>
                  <td className="p-3.5 text-black/40 dark:text-white/40">—</td>
                  <td className="p-3.5 text-right font-sans">
                    <span className="text-[10px] text-black/50 dark:text-white/50">Lei 8.212/91</span>
                  </td>
                </tr>
              )}

              {/* TOTAL RETENÇÕES */}
              <tr className="bg-gray-100/60 dark:bg-white/5 font-bold">
                <td className="p-3.5 font-sans text-black dark:text-white">
                  TOTAL DAS RETENÇÕES
                </td>
                <td className="p-3.5 text-red-600 dark:text-red-400">
                  R$ {legalCalculations.totalRetentions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black dark:text-white">
                  R$ {processValores.retencoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className={`p-3.5 font-black ${
                  confrontation.hasDivergence ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  R$ {confrontation.diffRetencao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-right font-sans">
                  {confrontation.hasDivergence ? (
                    <span className="px-2.5 py-1 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-wider">
                      Restrição 005
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[9px] font-black uppercase tracking-wider">
                      Regular
                    </span>
                  )}
                </td>
              </tr>

              {/* VALOR LÍQUIDO A PAGAR */}
              <tr className="bg-black/5 dark:bg-white/10 font-black text-sm">
                <td className="p-3.5 font-sans text-black dark:text-white">
                  VALOR LÍQUIDO A PAGAR (OB/SIAFI)
                </td>
                <td className="p-3.5 text-emerald-700 dark:text-[#00FF00]">
                  R$ {legalCalculations.legalNetValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-black dark:text-white">
                  R$ {processValores.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className={`p-3.5 ${
                  Math.abs(confrontation.diffLiquido) > 0.05 ? 'text-red-600 dark:text-red-400' : 'text-black/50 dark:text-white/50'
                }`}>
                  R$ {confrontation.diffLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-right font-sans">
                  {Math.abs(confrontation.diffLiquido) <= 0.05 ? (
                    <span className="text-xs text-emerald-700 dark:text-[#00FF00] font-bold">
                      ✓ Convergente
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 dark:text-red-400 font-bold">
                      ⚠ Divergente
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer info and guidelines */}
        <div className="p-4 bg-gray-50 dark:bg-[#202326] border-t border-black/5 dark:border-white/10 text-[11px] text-black/60 dark:text-white/60 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-black/80 dark:text-white/80">
            <Info className="w-3.5 h-3.5 text-black dark:text-white" />
            Normas de Auditoria de Conformidade Contábil Aplicáveis:
          </div>
          <p className="leading-relaxed">
            • <strong>IN RFB nº 1.234/2012 (Arts. 2º, 3º e 6º):</strong> É compulsória a retenção de tributos federais no ato de liquidação/pagamento pelos órgãos e autarquias federais, sob pena de responsabilidade funcional e tributária do agente liquidante.<br />
            • <strong>Lei nº 4.320/1964 (Art. 63):</strong> A liquidação consiste na verificação do direito adquirido pelo credor, mediante títulos e documentos comprobatórios, com apuração exata da quantia a pagar.<br />
            • <strong>Macrofunção SIAFI 020314 (Conformidade dos Registros de Gestão):</strong> Havendo qualquer divergência de cálculo ou recolhimento a menor na fonte, o Conformista deve emitir registro <strong>COM OCORRÊNCIA</strong> e aplicar a Restrição 005.
          </p>
        </div>
      </div>
    </div>
  );
};
