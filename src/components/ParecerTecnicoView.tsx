import React, { useState } from 'react';
import { ParecerTecnicoConformista } from '../types';
import { FileText, Copy, Check, ShieldCheck, Scale, CheckCircle2, AlertTriangle, Building2, Landmark, PenTool, BookOpen, AlertOctagon, Layers, ArrowRight } from 'lucide-react';

interface ParecerTecnicoViewProps {
  parecer?: ParecerTecnicoConformista;
  parecerConclusivoSimples?: string;
  sugestaoConformista?: string;
}

export function ParecerTecnicoView({
  parecer,
  parecerConclusivoSimples,
  sugestaoConformista
}: ParecerTecnicoViewProps) {
  const [copied, setCopied] = useState(false);

  // Montar texto completo para cópia do parecer estruturado
  const getFullFormattedText = () => {
    if (!parecer) {
      return parecerConclusivoSimples || '';
    }

    const {
      identificacao,
      resumoObjeto,
      analiseInstrucaoProcessual,
      analiseExecucaoOrcamentariaFinanceira,
      analiseDocumentoHabilELiquidacao,
      analiseTributariaERetencoes,
      analiseDocumentosSiafi,
      analiseEscritaObservacoesContabeis,
      conclusaoEEncaminhamento,
      registroSugerido,
      normasAplicaveis,
      inconsistenciasDetectadas,
      auditoriaSiafiProfunda
    } = parecer;

    let normasTexto = '';
    if (normasAplicaveis && normasAplicaveis.length > 0) {
      normasTexto = `\n\nNORMAS APLICÁVEIS E FUNDAMENTAÇÃO LEGAL:\n` +
        normasAplicaveis.map(n => `- ${n.norma} (${n.esferaOuOrgao}): ${n.statusAtendimento}\n  Aplicação: ${n.aplicacaoNoProcesso}\n  Fundamentação: ${n.fundamentacaoLegal}`).join('\n');
    }

    let inconsistenciasTexto = '';
    if (inconsistenciasDetectadas && inconsistenciasDetectadas.length > 0) {
      inconsistenciasTexto = `\n\nMATRIZ DE INCONSISTÊNCIAS E GESTÃO DE RISCOS:\n` +
        inconsistenciasDetectadas.map(i => `- [${i.tipoInconsistencia}] ${i.item} (Risco: ${i.impactoRisco})\n  Descrição: ${i.descricao}\n  Fundamentação: ${i.fundamentacaoLegal}\n  Ação Saneadora: ${i.acaoSaneadoraOuJustificativa}`).join('\n');
    }

    let siafiTexto = '';
    if (auditoriaSiafiProfunda) {
      siafiTexto = `\n\nVARREDURA PROFUNDA EM REGISTROS DO SIAFI:\n` +
        `- Estágio Orçamentário: ${auditoriaSiafiProfunda.estagioOrcamentario}\n` +
        `- Estágio da Liquidação: ${auditoriaSiafiProfunda.estagioLiquidacao}\n` +
        `- Estágio do Pagamento: ${auditoriaSiafiProfunda.estagioPagamento}\n` +
        `- Conformidade Tributária: ${auditoriaSiafiProfunda.conformidadeTributaria}\n` +
        `- Fidedignidade Contábil / Descrições: ${auditoriaSiafiProfunda.fidedignidadeEscritaContabil}\n` +
        `- Segregação de Funções: ${auditoriaSiafiProfunda.segregacaoFuncoes}\n` +
        (auditoriaSiafiProfunda.documentosSiafiApurados ? `- Documentos SIAFI Auditados (${auditoriaSiafiProfunda.totalDocumentosSiafiAuditados || auditoriaSiafiProfunda.documentosSiafiApurados.length}): ${auditoriaSiafiProfunda.documentosSiafiApurados.join(', ')}\n` : '');
    }

    return `INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS
DIRETORIA DE CONTABILIDADE E ORÇAMENTO - DCO
SETOR DE CONFORMIDADE DOS REGISTROS DE GESTÃO

PARECER TÉCNICO DE CONFORMIDADE DOS REGISTROS DE GESTÃO

1. IDENTIFICAÇÃO DO PROCESSO
- Processo Administrativo SEI: ${identificacao.processoSei}
- UG / Gestão Emitente: ${identificacao.ugGestao}
- Unidade Demandante: ${identificacao.unidadeDemandante}
- Credor / Favorecido: ${identificacao.favorecido}
- CNPJ / CPF: ${identificacao.cnpjFavorecido}
- Enquadramento Legal: ${identificacao.enquadramentoLegal}
${identificacao.valorTotalProcesso ? `- Valor Total Auditado: ${identificacao.valorTotalProcesso}` : ''}

2. RESUMO DO OBJETO
${resumoObjeto}

3. ANÁLISE DA INSTRUÇÃO PROCESSUAL (SEI)
${analiseInstrucaoProcessual}

4. ANÁLISE DA EXECUÇÃO ORÇAMENTÁRIA E FINANCEIRA
${analiseExecucaoOrcamentariaFinanceira}

5. LIQUIDAÇÃO DA DESPESA E EXAME DO DOCUMENTO HÁBIL
${analiseDocumentoHabilELiquidacao}

6. ANÁLISE TRIBUTÁRIA E RETENÇÕES NA FONTE (IN RFB Nº 1.234/2012)
${analiseTributariaERetencoes}

7. EXAME EXAUSTIVO DOS DOCUMENTOS SIAFI
${analiseDocumentosSiafi}
${siafiTexto}

8. EXAME CRITERIOSO DA REDAÇÃO E OBSERVAÇÕES CONTÁBEIS
${analiseEscritaObservacoesContabeis}
${normasTexto}
${inconsistenciasTexto}

9. CONCLUSÃO E ENCAMINHAMENTO
${conclusaoEEncaminhamento}

10. REGISTRO SUGERIDO NO SIAFI
Conformidade de Registro de Gestão: ${registroSugerido}
Orientação: ${sugestaoConformista || 'Registrar na transação ATUCONF do SIAFI.'}
`;
  };

  const copyFullParecer = () => {
    const text = getFullFormattedText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!parecer) {
    return (
      <div className="bg-white dark:bg-[#181a1d] p-6 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-black dark:text-white" />
            <h4 className="text-xs font-black uppercase tracking-widest text-black/80 dark:text-white/80">
              Parecer Técnico do Conformista
            </h4>
          </div>
          <button
            type="button"
            onClick={copyFullParecer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black dark:text-white transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF00]" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copiar Parecer
              </>
            )}
          </button>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 font-serif text-xs leading-relaxed text-black/90 dark:text-white/90 whitespace-pre-wrap">
          {parecerConclusivoSimples}
        </div>
        {sugestaoConformista && (
          <div className="p-3 bg-black dark:bg-[#0C0D0E] text-[#00FF00] rounded-xl text-xs font-mono flex items-center gap-2 border border-white/10">
            <span><strong>Orientação SIAFI:</strong> {sugestaoConformista}</span>
          </div>
        )}
      </div>
    );
  }

  const {
    identificacao,
    resumoObjeto,
    analiseInstrucaoProcessual,
    analiseExecucaoOrcamentariaFinanceira,
    analiseDocumentoHabilELiquidacao,
    analiseTributariaERetencoes,
    analiseDocumentosSiafi,
    analiseEscritaObservacoesContabeis,
    conclusaoEEncaminhamento,
    registroSugerido,
    normasAplicaveis,
    inconsistenciasDetectadas,
    auditoriaSiafiProfunda
  } = parecer;

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 p-4 bg-white dark:bg-[#181a1d] rounded-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600 dark:text-[#00FF00]" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-black dark:text-white">
              Parecer Técnico Oficial do Conformista
            </h3>
            <span className="text-[10px] text-black/50 dark:text-white/50">
              Macrofunção SIAFI 020314 • Portaria IFS nº 1.633/2026 • Varredura Pericial Profunda
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={copyFullParecer}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-[#00FF00] text-[#00FF00] dark:text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-[#00DD00] transition-all shadow-sm active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Parecer Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copiar Parecer na Íntegra
            </>
          )}
        </button>
      </div>

      {/* Official IFS Paper Canvas */}
      <div className="bg-white dark:bg-[#181a1d] p-6 sm:p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm space-y-6 font-serif">
        {/* Official Header */}
        <div className="text-center pb-5 border-b border-black/10 dark:border-white/10 space-y-1">
          <div className="text-[10px] font-sans font-black tracking-widest uppercase text-black/50 dark:text-white/50">
            República Federativa do Brasil • Ministério da Educação
          </div>
          <div className="text-sm font-sans font-black tracking-wide text-black dark:text-white uppercase">
            INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS
          </div>
          <div className="text-xs font-sans text-black/70 dark:text-white/70">
            Diretoria de Contabilidade e Orçamento • Setor de Conformidade dos Registros de Gestão
          </div>
          <div className="pt-2">
            <span className="px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full font-sans text-[10px] font-black uppercase tracking-widest text-black dark:text-white inline-block">
              Parecer Técnico de Conformidade de Registro de Gestão
            </span>
          </div>
        </div>

        {/* Quadro 1: Identificação */}
        <div className="space-y-2">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80 flex items-center gap-1.5">
            <span>1. IDENTIFICAÇÃO DO PROCESSO</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
              <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Processo Administrativo SEI</span>
              <span className="font-mono font-bold text-black dark:text-white">{identificacao.processoSei}</span>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
              <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">UG / Gestão</span>
              <span className="font-bold text-black dark:text-white">{identificacao.ugGestao}</span>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
              <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Unidade Demandante</span>
              <span className="font-bold text-black dark:text-white">{identificacao.unidadeDemandante}</span>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
              <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Favorecido / Credor</span>
              <span className="font-bold text-black dark:text-white">{identificacao.favorecido}</span>
              <span className="text-[10px] font-mono text-black/60 dark:text-white/60 block">{identificacao.cnpjFavorecido}</span>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
              <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Enquadramento Legal</span>
              <span className="font-bold text-black dark:text-white">{identificacao.enquadramentoLegal}</span>
            </div>
            {identificacao.valorTotalProcesso && (
              <div className="p-2.5 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 block">Valor Auditado</span>
                <span className="font-mono font-black text-black dark:text-white">{identificacao.valorTotalProcesso}</span>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2: Resumo do Objeto */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            2. RESUMO DO OBJETO E FINALIDADE
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {resumoObjeto}
          </p>
        </div>

        {/* Seção 3: Instrução Processual */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            3. ANÁLISE DA INSTRUÇÃO PROCESSUAL (SEI)
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {analiseInstrucaoProcessual}
          </p>
        </div>

        {/* Seção 4: Execução Orçamentária e Financeira */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            4. ANÁLISE DA EXECUÇÃO ORÇAMENTÁRIA E FINANCEIRA
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {analiseExecucaoOrcamentariaFinanceira}
          </p>
        </div>

        {/* Seção 5: Liquidação e Documento Hábil */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            5. LIQUIDAÇÃO DA DESPESA E EXAME DO DOCUMENTO HÁBIL
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {analiseDocumentoHabilELiquidacao}
          </p>
        </div>

        {/* Seção 6: Análise Tributária */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            6. ANÁLISE TRIBUTÁRIA E RETENÇÕES NA FONTE (IN RFB Nº 1.234/2012)
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {analiseTributariaERetencoes}
          </p>
        </div>

        {/* Seção 7: Documentos SIAFI */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            7. EXAME EXAUSTIVO DOS DOCUMENTOS SIAFI
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {analiseDocumentosSiafi}
          </p>
        </div>

        {/* VARREDURA PROFUNDA NO SIAFI (Painel Dedicado e Detalhado) */}
        {auditoriaSiafiProfunda && (
          <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10 font-sans">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" />
                <span>Varredura Pericial Profunda em Registros do SIAFI</span>
              </h4>
              {auditoriaSiafiProfunda.totalDocumentosSiafiAuditados && (
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-[#00FF00]/10 text-emerald-800 dark:text-[#00FF00] border border-emerald-300 dark:border-[#00FF00]/30 rounded-lg text-[10px] font-bold">
                  {auditoriaSiafiProfunda.totalDocumentosSiafiAuditados} atos contábeis verificados
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-black/60 dark:text-white/60 text-[10px] font-black uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Estágio Orçamentário (Crédito & Empenho)</span>
                </div>
                <p className="text-black/90 dark:text-white/90 leading-relaxed">
                  {auditoriaSiafiProfunda.estagioOrcamentario}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-black/60 dark:text-white/60 text-[10px] font-black uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Estágio da Liquidação (Documento Hábil)</span>
                </div>
                <p className="text-black/90 dark:text-white/90 leading-relaxed">
                  {auditoriaSiafiProfunda.estagioLiquidacao}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-black/60 dark:text-white/60 text-[10px] font-black uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Estágio do Pagamento & Domicílio Bancário</span>
                </div>
                <p className="text-black/90 dark:text-white/90 leading-relaxed">
                  {auditoriaSiafiProfunda.estagioPagamento}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-black/60 dark:text-white/60 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Conformidade Tributária & Regularidade Fiscal</span>
                </div>
                <p className="text-black/90 dark:text-white/90 leading-relaxed">
                  {auditoriaSiafiProfunda.conformidadeTributaria}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-black/60 dark:text-white/60 text-[10px] font-black uppercase tracking-wider">
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Fidedignidade & Descrições no SIAFI (OBS)</span>
                </div>
                <p className="text-black/90 dark:text-white/90 leading-relaxed">
                  {auditoriaSiafiProfunda.fidedignidadeEscritaContabil}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-black/60 dark:text-white/60 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Segregação de Funções & Signatários</span>
                </div>
                <p className="text-black/90 dark:text-white/90 leading-relaxed">
                  {auditoriaSiafiProfunda.segregacaoFuncoes}
                </p>
              </div>
            </div>

            {auditoriaSiafiProfunda.documentosSiafiApurados && auditoriaSiafiProfunda.documentosSiafiApurados.length > 0 && (
              <div className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[10px] font-black uppercase text-black/50 dark:text-white/50">Atos SIAFI Mapeados:</span>
                {auditoriaSiafiProfunda.documentosSiafiApurados.map((docNum, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white dark:bg-[#181a1d] rounded-md font-mono text-[11px] font-bold text-black dark:text-white border border-black/10 dark:border-white/10">
                    {docNum}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Seção 8: Redação Contábil */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            8. EXAME CRITERIOSO DA REDAÇÃO E OBSERVAÇÕES CONTÁBEIS
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {analiseEscritaObservacoesContabeis}
          </p>
        </div>

        {/* NORMAS APLICÁVEIS E FUNDAMENTAÇÃO LEGAL */}
        {normasAplicaveis && normasAplicaveis.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10 font-sans">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                Normas Aplicáveis e Fundamentação Legal Auditada
              </h4>
            </div>

            <div className="space-y-2">
              {normasAplicaveis.map((norma, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black dark:text-white">{norma.norma}</span>
                      <span className="text-[10px] text-black/50 dark:text-white/50">({norma.esferaOuOrgao})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      norma.statusAtendimento === 'CONFORME'
                        ? 'bg-emerald-100 dark:bg-[#00FF00]/10 text-emerald-700 dark:text-[#00FF00] border border-emerald-300 dark:border-[#00FF00]/30'
                        : norma.statusAtendimento === 'VIOLADA'
                        ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                        : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                    }`}>
                      {norma.statusAtendimento}
                    </span>
                  </div>
                  <p className="text-black/80 dark:text-white/80 leading-relaxed">
                    <strong className="text-black dark:text-white font-semibold">Aplicação no Processo: </strong>
                    {norma.aplicacaoNoProcesso}
                  </p>
                  <p className="text-black/70 dark:text-white/70 text-[11px] leading-relaxed bg-white dark:bg-[#181a1d] p-2 rounded-lg border border-black/5 dark:border-white/10">
                    <strong className="text-black dark:text-white font-semibold">Fundamentação Legal: </strong>
                    {norma.fundamentacaoLegal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATRIZ DE INCONSISTÊNCIAS DETECTADAS E GESTÃO DE RISCOS */}
        {inconsistenciasDetectadas && inconsistenciasDetectadas.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10 font-sans">
            <div className="flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                Matriz de Inconsistências Detectadas e Gestão de Riscos
              </h4>
            </div>

            <div className="space-y-2">
              {inconsistenciasDetectadas.map((incons, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black dark:text-white">{incons.item}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70">
                        {incons.tipoInconsistencia}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      incons.impactoRisco.includes('NENHUM') || incons.impactoRisco.includes('CONFORME')
                        ? 'bg-emerald-100 dark:bg-[#00FF00]/10 text-emerald-700 dark:text-[#00FF00] border border-emerald-300 dark:border-[#00FF00]/30'
                        : incons.impactoRisco.includes('IMPEDITIVO')
                        ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                        : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                    }`}>
                      Risco: {incons.impactoRisco}
                    </span>
                  </div>

                  <p className="text-black/85 dark:text-white/85 leading-relaxed">
                    {incons.descricao}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 bg-white dark:bg-[#181a1d] rounded-lg border border-black/5 dark:border-white/10">
                      <strong className="text-black dark:text-white font-semibold block text-[10px] uppercase text-black/50 dark:text-white/50">Base Legal</strong>
                      <span className="text-black/80 dark:text-white/80">{incons.fundamentacaoLegal}</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-[#181a1d] rounded-lg border border-black/5 dark:border-white/10">
                      <strong className="text-black dark:text-white font-semibold block text-[10px] uppercase text-black/50 dark:text-white/50">Ação Saneadora / Justificativa</strong>
                      <span className="text-black/80 dark:text-white/80">{incons.acaoSaneadoraOuJustificativa}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção 9: Conclusão */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
          <h4 className="font-sans text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80">
            9. CONCLUSÃO E ENCAMINHAMENTO
          </h4>
          <p className="text-xs text-black/90 dark:text-white/90 leading-relaxed text-justify">
            {conclusaoEEncaminhamento}
          </p>
        </div>

        {/* Seção 10: Registro Sugerido no SIAFI */}
        <div className="p-4 bg-gray-50 dark:bg-[#202326] rounded-2xl border border-black/10 dark:border-white/10 font-sans space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">
              10. REGISTRO SUGERIDO NO SIAFI (TRANSAÇÃO ATUCONF)
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
              Orientação do Conformista: {sugestaoConformista}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
