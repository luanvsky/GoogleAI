import React, { useState } from 'react';
import { ParecerTecnicoConformista } from '../types';
import { 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Landmark, 
  PenTool, 
  BookOpen, 
  AlertOctagon, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface ParecerTecnicoViewProps {
  parecer?: ParecerTecnicoConformista;
  parecerConclusivoSimples?: string;
  sugestaoConformista?: string;
  onExportPdf?: () => void;
  modeloRespostaSei?: string;
}

export function ParecerTecnicoView({
  parecer,
  parecerConclusivoSimples,
  sugestaoConformista,
  onExportPdf,
  modeloRespostaSei
}: ParecerTecnicoViewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedSei, setCopiedSei] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'stepper' | 'full'>('stepper');

  const copySeiModel = () => {
    if (modeloRespostaSei) {
      navigator.clipboard.writeText(modeloRespostaSei);
      setCopiedSei(true);
      setTimeout(() => setCopiedSei(false), 2500);
    }
  };

  // Montar texto completo para cópia do parecer estruturado
  const getFullFormattedText = () => {
    if (!parecer) {
      return parecerConclusivoSimples || '';
    }

    const idSafe = {
      processoSei: parecer.identificacao?.processoSei || 'Não informado nos autos',
      ugGestao: parecer.identificacao?.ugGestao || '158134 / 26423 (IFS)',
      unidadeDemandante: parecer.identificacao?.unidadeDemandante || 'Não especificada',
      favorecido: parecer.identificacao?.favorecido || 'Não identificado',
      cnpjFavorecido: parecer.identificacao?.cnpjFavorecido || 'Não informado',
      enquadramentoLegal: parecer.identificacao?.enquadramentoLegal || 'Lei nº 14.133/2021 c/c Lei nº 4.320/1964',
      valorTotalProcesso: parecer.identificacao?.valorTotalProcesso || ''
    };

    const {
      resumoObjeto = '',
      analiseInstrucaoProcessual = '',
      analiseExecucaoOrcamentariaFinanceira = '',
      analiseDocumentoHabilELiquidacao = '',
      analiseTributariaERetencoes = '',
      analiseDocumentosSiafi = '',
      analiseEscritaObservacoesContabeis = '',
      conclusaoEEncaminhamento = '',
      registroSugerido = 'SEM OCORRÊNCIA',
      normasAplicaveis = [],
      inconsistenciasDetectadas = [],
      auditoriaSiafiProfunda
    } = parecer;

    let normasTexto = '';
    if (normasAplicaveis && normasAplicaveis.length > 0) {
      normasTexto = '\n\nNORMAS APLICÁVEIS E FUNDAMENTAÇÃO LEGAL:\n' +
        normasAplicaveis.map((n, i) => `${i + 1}. ${n.norma} (${n.esferaOuOrgao})\n   Aplicação: ${n.aplicacaoNoProcesso}\n   Status: ${n.statusAtendimento}`).join('\n\n');
    }

    let inconsistenciasTexto = '';
    if (inconsistenciasDetectadas && inconsistenciasDetectadas.length > 0) {
      inconsistenciasTexto = '\n\nMATRIZ DE RISCOS E APONTAMENTOS:\n' +
        inconsistenciasDetectadas.map((inc, i) => `${i + 1}. [${inc.impactoRisco}] ${inc.item}: ${inc.descricao}\n   Base Legal: ${inc.fundamentacaoLegal}\n   Ação Recomendada: ${inc.acaoSaneadoraOuJustificativa}`).join('\n\n');
    }

    let varreduraSiafiTexto = '';
    if (auditoriaSiafiProfunda) {
      varreduraSiafiTexto = '\n\nVARREDURA PERICIAL NO SIAFI:\n' +
        `- Estágio Orçamentário: ${auditoriaSiafiProfunda.estagioOrcamentario}\n` +
        `- Estágio de Liquidação: ${auditoriaSiafiProfunda.estagioLiquidacao}\n` +
        `- Estágio de Pagamento: ${auditoriaSiafiProfunda.estagioPagamento}\n` +
        `- Conformidade Tributária: ${auditoriaSiafiProfunda.conformidadeTributaria}\n` +
        `- Fidedignidade das Observações: ${auditoriaSiafiProfunda.fidedignidadeEscritaContabil}\n` +
        `- Segregação de Funções: ${auditoriaSiafiProfunda.segregacaoFuncoes}`;
    }

    return `INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS
DIRETORIA DE CONTABILIDADE E ORÇAMENTO
SETOR DE CONFORMIDADE DOS REGISTROS DE GESTÃO (CGCONFREG)

PARECER TÉCNICO DE CONFORMIDADE DE REGISTRO DE GESTÃO

1. IDENTIFICAÇÃO DO PROCESSO:
- Processo SEI: ${idSafe.processoSei}
- UG / Gestão: ${idSafe.ugGestao}
- Unidade Demandante: ${idSafe.unidadeDemandante}
- Favorecido: ${idSafe.favorecido} (CNPJ/CPF: ${idSafe.cnpjFavorecido})
- Enquadramento Legal: ${idSafe.enquadramentoLegal}
${idSafe.valorTotalProcesso ? `- Valor Total Auditado: ${idSafe.valorTotalProcesso}` : ''}

2. RESUMO DO OBJETO E FINALIDADE:
${resumoObjeto}

3. ANÁLISE DA INSTRUÇÃO PROCESSUAL (SEI):
${analiseInstrucaoProcessual}

4. ANÁLISE DA EXECUÇÃO ORÇAMENTÁRIA E FINANCEIRA:
${analiseExecucaoOrcamentariaFinanceira}

5. LIQUIDAÇÃO DA DESPESA E EXAME DO DOCUMENTO HÁBIL:
${analiseDocumentoHabilELiquidacao}

6. ANÁLISE TRIBUTÁRIA E RETENÇÕES NA FONTE:
${analiseTributariaERetencoes}

7. EXAME EXAUSTIVO DOS DOCUMENTOS SIAFI:
${analiseDocumentosSiafi}${varreduraSiafiTexto}

8. EXAME CRITERIOSO DA REDAÇÃO E OBSERVAÇÕES CONTÁBEIS:
${analiseEscritaObservacoesContabeis}${normasTexto}${inconsistenciasTexto}

9. CONCLUSÃO E ENCAMINHAMENTO:
${conclusaoEEncaminhamento}

10. REGISTRO SUGERIDO NO SIAFI:
Status: ${registroSugerido}
${sugestaoConformista ? `Orientação: ${sugestaoConformista}` : ''}

Conformista Responsável: Setor de Conformidade dos Registros de Gestão / IFS`;
  };

  const copyFullParecer = () => {
    const text = getFullFormattedText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!parecer) {
    return (
      <div className="bg-white dark:bg-[#16181A] p-6 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" />
            Parecer Técnico Conclusivo
          </h4>
          <button
            type="button"
            onClick={copyFullParecer}
            className="flex items-center gap-1.5 px-3 py-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed font-serif">
          {parecerConclusivoSimples || 'Nenhum parecer técnico gerado.'}
        </p>
      </div>
    );
  }

  const safeIdentificacao = {
    processoSei: parecer.identificacao?.processoSei || '23060.002402/2026-87',
    ugGestao: parecer.identificacao?.ugGestao || '158134 / 26423 (IFS Reitoria)',
    unidadeDemandante: parecer.identificacao?.unidadeDemandante || 'Não especificada',
    favorecido: parecer.identificacao?.favorecido || 'Docentes / Favorecido do Processo',
    cnpjFavorecido: parecer.identificacao?.cnpjFavorecido || '',
    enquadramentoLegal: parecer.identificacao?.enquadramentoLegal || 'Lei nº 4.320/1964 e Macrofunção SIAFI 020314',
    valorTotalProcesso: parecer.identificacao?.valorTotalProcesso || ''
  };

  const {
    resumoObjeto = '',
    analiseInstrucaoProcessual = '',
    analiseExecucaoOrcamentariaFinanceira = '',
    analiseDocumentoHabilELiquidacao = '',
    analiseTributariaERetencoes = '',
    analiseDocumentosSiafi = '',
    analiseEscritaObservacoesContabeis = '',
    conclusaoEEncaminhamento = '',
    registroSugerido = 'SEM OCORRÊNCIA',
    normasAplicaveis = [],
    inconsistenciasDetectadas = [],
    auditoriaSiafiProfunda
  } = parecer;

  const sectionsList = [
    { id: 1, label: '1. Identificação' },
    { id: 2, label: '2. Objeto' },
    { id: 3, label: '3. Instrução SEI' },
    { id: 4, label: '4. Orçamento & Finanças' },
    { id: 5, label: '5. Liquidação & Hábil' },
    { id: 6, label: '6. Tributos & Retenções' },
    { id: 7, label: '7. Documentos SIAFI' },
    { id: 8, label: '8. Escrita Contábil (OBS)' },
    { id: 9, label: '9. Normas & Riscos' },
    { id: 10, label: '10. Conclusão & SIAFI' }
  ];

  return (
    <div className="space-y-3">
      {/* Header Actions & Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2 p-3 bg-gray-50 dark:bg-[#181a1d] rounded-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-[#00FF00]/15 text-emerald-800 dark:text-[#00FF00] rounded-xl">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Parecer Técnico do Conformista
            </h3>
            <span className="text-[10px] text-black/50 dark:text-white/50">
              Macrofunção SIAFI 020314 • Visualização sem rolagem por seções
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#202326] p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('stepper')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'stepper'
                  ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                  : 'text-black/60 dark:text-white/60'
              }`}
            >
              Navegar Seções (Sem Rolagem)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'full'
                  ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                  : 'text-black/60 dark:text-white/60'
              }`}
            >
              Visualização Completa
            </button>
          </div>

          <button
            type="button"
            onClick={copyFullParecer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-[#00FF00] text-[#00FF00] dark:text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-[#00DD00] transition-all shadow-sm active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copiar Parecer
              </>
            )}
          </button>

          {modeloRespostaSei && (
            <button
              type="button"
              onClick={copySeiModel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
              title="Copiar relatório formatado no padrão SEI (Macrofunção 020314)"
            >
              {copiedSei ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copiado SEI!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Padrão SEI
                </>
              )}
            </button>
          )}

          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
              title="Exportar Relatório PDF deste parecer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* SELETOR DE SEÇÕES (Zero Rolagem) */}
      {viewMode === 'stepper' && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-bold scrollbar-none">
          {sectionsList.map(sec => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 border ${
                activeSection === sec.id
                  ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black border-transparent shadow-sm'
                  : 'bg-white dark:bg-[#181a1d] text-black/70 dark:text-white/70 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      )}

      {/* Official IFS Paper Canvas */}
      <div className="bg-white dark:bg-[#181a1d] p-5 sm:p-7 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm space-y-5 font-serif">
        {/* Official Header */}
        <div className="text-center pb-3 border-b border-black/10 dark:border-white/10 space-y-0.5">
          <div className="text-[9px] font-sans font-black tracking-widest uppercase text-black/50 dark:text-white/50">
            República Federativa do Brasil • Ministério da Educação
          </div>
          <div className="text-xs font-sans font-black tracking-wide text-black dark:text-white uppercase">
            INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS
          </div>
          <div className="text-[10px] font-sans text-black/70 dark:text-white/70">
            Diretoria de Contabilidade e Orçamento • Setor de Conformidade dos Registros de Gestão
          </div>
          <div className="pt-1">
            <span className="px-2.5 py-0.5 bg-black/5 dark:bg-white/10 rounded-full font-sans text-[9px] font-black uppercase tracking-widest text-black dark:text-white inline-block">
              Parecer Técnico de Conformidade de Registro de Gestão
            </span>
          </div>
        </div>

        {/* ===================== RENDERIZAÇÃO DAS SEÇÕES ===================== */}

        {/* SEÇÃO 1: IDENTIFICAÇÃO */}
        {(viewMode === 'full' || activeSection === 1) && (
          <div className="space-y-2">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80 flex items-center gap-1.5">
              <span>1. IDENTIFICAÇÃO DO PROCESSO</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Processo Administrativo SEI</span>
                <span className="font-mono font-bold text-black dark:text-white">{safeIdentificacao.processoSei}</span>
              </div>
              <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">UG / Gestão</span>
                <span className="font-bold text-black dark:text-white">{safeIdentificacao.ugGestao}</span>
              </div>
              <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Unidade Demandante</span>
                <span className="font-bold text-black dark:text-white">{safeIdentificacao.unidadeDemandante}</span>
              </div>
              <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Favorecido / Credor</span>
                <span className="font-bold text-black dark:text-white">{safeIdentificacao.favorecido}</span>
                {safeIdentificacao.cnpjFavorecido && (
                  <span className="text-[10px] font-mono text-black/60 dark:text-white/60 block">{safeIdentificacao.cnpjFavorecido}</span>
                )}
              </div>
              <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Enquadramento Legal</span>
                <span className="font-bold text-black dark:text-white">{safeIdentificacao.enquadramentoLegal}</span>
              </div>
              {safeIdentificacao.valorTotalProcesso && (
                <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                  <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Valor Auditado</span>
                  <span className="font-mono font-black text-black dark:text-white">{safeIdentificacao.valorTotalProcesso}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEÇÃO 2: RESUMO DO OBJETO */}
        {(viewMode === 'full' || activeSection === 2) && (
          <div className="space-y-1.5 pt-1">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              2. RESUMO DO OBJETO E FINALIDADE
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/10">
              {resumoObjeto}
            </p>
          </div>
        )}

        {/* SEÇÃO 3: INSTRUÇÃO PROCESSUAL */}
        {(viewMode === 'full' || activeSection === 3) && (
          <div className="space-y-1.5 pt-1">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              3. ANÁLISE DA INSTRUÇÃO PROCESSUAL (SEI)
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/10">
              {analiseInstrucaoProcessual}
            </p>
          </div>
        )}

        {/* SEÇÃO 4: EXECUÇÃO ORÇAMENTÁRIA E FINANCEIRA */}
        {(viewMode === 'full' || activeSection === 4) && (
          <div className="space-y-1.5 pt-1">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              4. ANÁLISE DA EXECUÇÃO ORÇAMENTÁRIA E FINANCEIRA
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/10">
              {analiseExecucaoOrcamentariaFinanceira}
            </p>
          </div>
        )}

        {/* SEÇÃO 5: LIQUIDAÇÃO E DOCUMENTO HÁBIL */}
        {(viewMode === 'full' || activeSection === 5) && (
          <div className="space-y-1.5 pt-1">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              5. LIQUIDAÇÃO DA DESPESA E EXAME DO DOCUMENTO HÁBIL
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/10">
              {analiseDocumentoHabilELiquidacao}
            </p>
          </div>
        )}

        {/* SEÇÃO 6: ANÁLISE TRIBUTÁRIA E RETENÇÕES */}
        {(viewMode === 'full' || activeSection === 6) && (
          <div className="space-y-1.5 pt-1">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              6. ANÁLISE TRIBUTÁRIA E RETENÇÕES NA FONTE (IN RFB Nº 1.234/2012 & PREVIDÊNCIA)
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/10">
              {analiseTributariaERetencoes}
            </p>
          </div>
        )}

        {/* SEÇÃO 7: EXAME DOS DOCUMENTOS SIAFI & VARREDURA */}
        {(viewMode === 'full' || activeSection === 7) && (
          <div className="space-y-3 pt-1 font-sans">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              7. EXAME EXAUSTIVO DOS DOCUMENTOS SIAFI & VARREDURA PERICIAL
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-3 rounded-xl border border-black/5 dark:border-white/10 font-serif">
              {analiseDocumentosSiafi}
            </p>

            {auditoriaSiafiProfunda && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-black/60 dark:text-white/60 block">Estágio Orçamentário</span>
                  <p className="text-black/90 dark:text-white/90 text-[11px] leading-relaxed">{auditoriaSiafiProfunda.estagioOrcamentario}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-black/60 dark:text-white/60 block">Estágio da Liquidação</span>
                  <p className="text-black/90 dark:text-white/90 text-[11px] leading-relaxed">{auditoriaSiafiProfunda.estagioLiquidacao}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-black/60 dark:text-white/60 block">Estágio do Pagamento</span>
                  <p className="text-black/90 dark:text-white/90 text-[11px] leading-relaxed">{auditoriaSiafiProfunda.estagioPagamento}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-black/60 dark:text-white/60 block">Conformidade Tributária</span>
                  <p className="text-black/90 dark:text-white/90 text-[11px] leading-relaxed">{auditoriaSiafiProfunda.conformidadeTributaria}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO 8: OBSERVAÇÃO CONTÁBIL */}
        {(viewMode === 'full' || activeSection === 8) && (
          <div className="space-y-1.5 pt-1">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              8. EXAME DA REDAÇÃO E OBSERVAÇÕES CONTÁBEIS (MACROFUNÇÃO 020314)
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/10">
              {analiseEscritaObservacoesContabeis}
            </p>
          </div>
        )}

        {/* SEÇÃO 9: NORMAS E MATRIZ DE RISCOS */}
        {(viewMode === 'full' || activeSection === 9) && (
          <div className="space-y-3 pt-1 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              9. NORMAS APLICÁVEIS E MATRIZ DE RISCOS
            </h4>
            {normasAplicaveis && normasAplicaveis.length > 0 && (
              <div className="space-y-1.5">
                {normasAplicaveis.map((n, i) => (
                  <div key={i} className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 flex items-start justify-between gap-2 text-xs">
                    <div>
                      <strong className="text-black dark:text-white block text-[11px]">{n.norma}</strong>
                      <span className="text-black/70 dark:text-white/70 text-[10px]">{n.aplicacaoNoProcesso}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold text-[9px] shrink-0">
                      {n.statusAtendimento}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {inconsistenciasDetectadas && inconsistenciasDetectadas.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {inconsistenciasDetectadas.map((inc, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-black dark:text-white font-bold">{inc.item}</strong>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[9px] font-bold">
                        {inc.impactoRisco}
                      </span>
                    </div>
                    <p className="text-black/80 dark:text-white/80 text-[11px]">{inc.descricao}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO 10: CONCLUSÃO E REGISTRO SUGERIDO NO SIAFI */}
        {(viewMode === 'full' || activeSection === 10) && (
          <div className="space-y-3 pt-1 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
              10. CONCLUSÃO E REGISTRO SUGERIDO NO SIAFI (TRANSAÇÃO ATUCONF)
            </h4>
            <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify bg-gray-50 dark:bg-[#202326] p-4 rounded-xl border border-black/5 dark:border-white/10 font-serif">
              {conclusaoEEncaminhamento}
            </p>

            <div className="p-4 bg-gray-50 dark:bg-[#202326] rounded-2xl border border-black/10 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                  Status Homologatório do Conformista
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${
                  registroSugerido === 'SEM OCORRÊNCIA'
                    ? 'bg-[#00FF00] text-black'
                    : 'bg-red-600 text-white'
                }`}>
                  {registroSugerido}
                </span>
              </div>
              {sugestaoConformista && (
                <p className="text-xs text-black/80 dark:text-white/80 font-mono">
                  Orientação Técnica: {sugestaoConformista}
                </p>
              )}
            </div>
          </div>
        )}

        {/* NAVEGAÇÃO ENTRE SEÇÕES (Modo Stepper) */}
        {viewMode === 'stepper' && (
          <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10 font-sans">
            <button
              type="button"
              disabled={activeSection <= 1}
              onClick={() => setActiveSection(s => Math.max(1, s - 1))}
              className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#202326] disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1.5 text-black dark:text-white"
            >
              <ChevronLeft className="w-4 h-4" /> Seção Anterior
            </button>

            <span className="text-xs text-black/50 dark:text-white/50 font-bold">
              Seção {activeSection} de {sectionsList.length}
            </span>

            <button
              type="button"
              disabled={activeSection >= sectionsList.length}
              onClick={() => setActiveSection(s => Math.min(sectionsList.length, s + 1))}
              className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#202326] disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1.5 text-black dark:text-white"
            >
              Próxima Seção <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
