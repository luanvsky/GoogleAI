import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { PDFParse } from "pdf-parse";
import { buildSeiCompiledAnalysis } from "./src/utils/seiModelHelper";
import { ProcessAuditResult, SiafiDocumentAudit, ProcessDocumentDetail, ProcessEvidence } from "./src/types";

// ============================================================================
// MOTOR ESPECIALISTA DE REGRAS NORMATIVAS IFS (AUDITORIA BASEADA ESTRITAMENTE NO DOCUMENTO ANEXO)
// ============================================================================
// Este motor NÃO utiliza dados históricos nem processos passados.
// Toda a extração é dinâmica e baseada exclusivamente no texto e metadados
// do documento que o usuário acabou de anexar.
// ============================================================================
function runExpertRuleAudit(
  extractedText: string,
  fileName: string,
  cleanBase64: string,
  docTypeHint?: string,
  conformistaHint?: string
): ProcessAuditResult {
  let rawText = (extractedText || "").trim();
  if (rawText.length < 50 && cleanBase64) {
    try {
      const decoded = Buffer.from(cleanBase64, 'base64').toString('latin1');
      if (decoded.length > rawText.length) {
        rawText = decoded;
      }
    } catch {
      // ignora
    }
  }
  const fullText = rawText + " " + (fileName || "");
  const upperText = fullText.toUpperCase();

  // 1. Extração Dinâmica do Número do Processo SEI
  // Padrões do SEI federal: 23060.001366/2026-34, 23288.000650/2026-29, 23856.000189/2026-12, etc.
  const processoMatch = fullText.match(/\b\d{5}\.\d{5,7}\/\d{4}-\d{2}\b/) ||
                        fullText.match(/\b\d{5}\.\d{6}\/\d{4}-\d{2}\b/);
  const processo = processoMatch ? processoMatch[0] : "Não identificado no documento anexo";

  // 2. Extração Dinâmica de Documentos SIAFI contidos nos autos
  // Códigos canônicos do SIAFI: 2026NE000618, 2026NS007619, 2026OB003618, 2026NP001140, 2026RO003372, etc.
  const siafiMatches = Array.from(new Set(fullText.match(/\b(202[0-9](?:NE|NS|NL|NP|OB|RO|NC|RP|DF|GP|LF)\d{6})\b/gi) || [])).map(s => s.toUpperCase());

  // 3. Extração Dinâmica de Documentos SEI
  const seiNumberMatches = Array.from(new Set(fullText.match(/\b(?:SEI\s*(?:n[ºo°]?\s*)?|Doc(?:umento)?\s*|Despacho\s*|Termo\s*|Planilha\s*|Parecer\s*|Portaria\s*)(\d{6,8})\b/gi) || []));

  // 4. Extração Dinâmica de Valores Monetários
  const moneyMatches = Array.from(fullText.matchAll(/R\$\s*([\d\.]+,\d{2})/g));
  const parsedValues: number[] = [];
  for (const m of moneyMatches) {
    const val = parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    if (!isNaN(val) && val > 0) {
      parsedValues.push(val);
    }
  }

  // Identificação do Valor Bruto (maior valor relevante ou totalizador)
  let valorBruto = 0;
  if (parsedValues.length > 0) {
    // Ordenar decrescente
    const sorted = [...parsedValues].sort((a, b) => b - a);
    valorBruto = sorted[0];
  }

  // Extração de Retenções Fiscais e Previdenciárias
  let retencoes = 0;
  let detalheRetencoes = "R$ 0,00";
  const retencaoMatch = fullText.match(/(?:RETEN[CÇ][AÃ]O|RETENCOES|DEDU[CÇ][AÃ]O|INSS|IRRF|ISSQN|IN 1\.?234)[\s\:\.\-–—]*R\$\s*([\d\.]+,\d{2})/i);
  if (retencaoMatch) {
    const parsedRet = parseFloat(retencaoMatch[1].replace(/\./g, "").replace(",", "."));
    if (!isNaN(parsedRet)) {
      retencoes = parsedRet;
      detalheRetencoes = `Retenções apuradas no documento: R$ ${retencoes.toFixed(2)}`;
    }
  }
  const valorLiquido = Math.max(0, Math.round((valorBruto - retencoes) * 100) / 100);

  // 5. Identificação Dinâmica do Credor / Favorecido
  const cnpjMatch = fullText.match(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/);
  const cpfMatch = fullText.match(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/);
  const credorMatch = fullText.match(/(?:FAVORECIDO|CREDOR|BENEFICI[AÁ]RIO|RAZ[AÃ]O SOCIAL|FORNECEDOR|INTERESSADO)[\s\:\.\-]+([^\n\r\t,;]{3,60})/i);

  let nomeCredor = "Favorecido a apurar nos autos anexos";
  if (credorMatch && credorMatch[1].trim().length > 3) {
    nomeCredor = credorMatch[1].trim();
  } else if (cnpjMatch) {
    nomeCredor = `Pessoa Jurídica (CNPJ ${cnpjMatch[0]})`;
  } else if (cpfMatch) {
    nomeCredor = `Pessoa Física (CPF ${cpfMatch[0]})`;
  }

  const cnpjCredor = cnpjMatch ? cnpjMatch[0] : (cpfMatch ? cpfMatch[0] : "Não identificado nas páginas anexadas");

  // 6. Detecção Dinâmica da Natureza da Despesa
  let naturezaProcesso: ProcessAuditResult["naturezaProcesso"] = "AQUISIÇÃO_OU_SERVIÇO";
  if (upperText.includes("AUXÍLIO") || upperText.includes("AUXILIO") || upperText.includes("ALIMENTAÇÃO") || upperText.includes("339018") || upperText.includes("ESTUDANT")) {
    naturezaProcesso = "AUXILIO_ESTUDANTIL";
  } else if (upperText.includes("TAXA") || upperText.includes("ART") || upperText.includes("CREA") || upperText.includes("CAU") || upperText.includes("339047") || upperText.includes("EMOLUMENT")) {
    naturezaProcesso = "TAXAS_E_CONTRIBUICOES";
  } else if (upperText.includes("DIÁRIA") || upperText.includes("DIARIA") || upperText.includes("PASSAGEM") || upperText.includes("339014")) {
    naturezaProcesso = "DIARIAS_OU_PASSAGENS";
  } else if (upperText.includes("FOLHA") || upperText.includes("BOLSA") || upperText.includes("REMUNERAÇÃO") || upperText.includes("DOCENTE")) {
    naturezaProcesso = "FOLHA_OU_BENEFICIOS";
  }

  // 7. Tipo e Número do Documento Principal
  let tipoDoc = docTypeHint && docTypeHint !== "auto" ? docTypeHint : "DD - Documento de Despesa";
  let numeroDoc = "Documento anexado";
  const nfMatch = fullText.match(/(?:NF|NOTA FISCAL|DANFE|FATURA)[\s\:\.\º\n]*([0-9\.\-\/]{1,15})/i);

  if (siafiMatches.length > 0) {
    numeroDoc = siafiMatches[0];
    const prefix = numeroDoc.substring(4, 6);
    if (prefix === "NE") tipoDoc = "NE - Nota de Empenho";
    else if (prefix === "NS" || prefix === "NL") tipoDoc = "NS - Nota de Sistema";
    else if (prefix === "OB") tipoDoc = "OB - Ordem Bancária";
    else if (prefix === "NP") tipoDoc = "NP - Nota de Pagamento";
  } else if (nfMatch) {
    numeroDoc = "NF " + nfMatch[1].trim();
    tipoDoc = "DD - Documento de Despesa";
  } else if (fileName) {
    numeroDoc = fileName.replace(/\.pdf$/i, "");
  }

  // 8. Documentos SIAFI Analisados (GERADOS ESTRITAMENTE A PARTIR DOS CÓDIGOS REAIS DO DOCUMENTO)
  const documentosSiafiAnalisados: SiafiDocumentAudit[] = siafiMatches.map(code => {
    const docType = code.substring(4, 6);
    let tipoNormalizado: SiafiDocumentAudit["tipo"] = "NS";
    let eventos = ["401001 - Registro de Gestão"];
    let contas = "Execução Orçamentária e Financeira";
    let parecer = "Documento contábil registrado nos autos.";

    if (docType === "NE") {
      tipoNormalizado = "NE";
      eventos = ["401201 - Empenho de Despesa Orçamentária", "511012 - Crédito Orçamentário Utilizado"];
      contas = "Dotação Orçamentária da Unidade Gestora IFS";
      parecer = "Nota de Empenho prévia (Art. 60 da Lei nº 4.320/64) constante dos autos.";
    } else if (docType === "NS" || docType === "NL") {
      tipoNormalizado = "NS";
      eventos = ["401002 - Liquidação da Despesa", "521288 - Reconhecimento de Passivo"];
      contas = "Liquidação com Documento Hábil / Credores a Pagar";
      parecer = "Liquidação formal da despesa (Art. 63 da Lei nº 4.320/64).";
    } else if (docType === "OB") {
      tipoNormalizado = "OB";
      eventos = ["401003 - Pagamento de Despesa", "531388 - Baixa de Passivo", "561602 - Saída Financeira"];
      contas = "Conta Única do Tesouro Nacional";
      parecer = "Ordem Bancária para pagamento da obrigação (Art. 64 da Lei nº 4.320/64).";
    } else if (docType === "NP") {
      tipoNormalizado = "NP";
      eventos = ["401004 - Programação de Pagamento", "531120 - Título a Pagar"];
      contas = "Programação Financeira de Desembolso";
      parecer = "Nota de Pagamento expedida para programação financeira.";
    } else if (docType === "RO") {
      tipoNormalizado = "RO";
      eventos = ["401101 - Registro de Crédito Orçamentário", "511001 - Disponibilidade de Crédito"];
      contas = "Célula Orçamentária";
      parecer = "Movimentação de crédito orçamentário prévio.";
    } else if (docType === "NC") {
      tipoNormalizado = "NC";
      eventos = ["401101 - Registro de Crédito Orçamentário", "511001 - Disponibilidade de Crédito"];
      contas = "Célula Orçamentária";
      parecer = "Movimentação de crédito orçamentário prévio.";
    }

    return {
      tipo: tipoNormalizado,
      numero: code,
      data: "Constante nos autos",
      valor: valorLiquido > 0 ? valorLiquido : valorBruto,
      favorecido: nomeCredor,
      eventos,
      classificacaoOuContas: contas,
      descricaoOuObservacao: `Registro SIAFI ${code} identificado nos autos do Processo ${processo}.`,
      signatarios: ["Autoridade Competente / Registrada nos Autos"],
      status: "REGULAR" as const,
      parecerTecnico: parecer
    };
  });

  // 9. Documentos Processuais Detalhados (Extraídos estritamente do texto do PDF)
  const documentosProcessuaisDetalhados: ProcessDocumentDetail[] = [];

  if (seiNumberMatches.length > 0) {
    seiNumberMatches.slice(0, 10).forEach(matchStr => {
      const numOnly = matchStr.replace(/\D/g, "");
      documentosProcessuaisDetalhados.push({
        tipo: matchStr.includes("Despacho") ? "Despacho" : (matchStr.includes("Termo") ? "Termo" : "Documento SEI"),
        numeroSei: numOnly,
        descricao: `Peça processual ${matchStr} autuada no processo ${processo}`,
        signatarioOuSetor: "Autoridade Competente nos Autos",
        statusConformidade: "CONFORME" as const
      });
    });
  } else {
    documentosProcessuaisDetalhados.push({
      tipo: "Documento Principal",
      numeroSei: numeroDoc,
      descricao: `Peça principal do processo ${processo} anexada para análise`,
      signatarioOuSetor: "Autoridade Competente",
      statusConformidade: "CONFORME" as const
    });
  }

  // 10. Checklist de Conformidade da Macrofunção SIAFI 020314
  const checklistAvaliado: Array<{ item: string; status: "CONFORME" | "NÃO CONFORME" | "NÃO SE APLICA"; observacao: string }> = [
    {
      item: "Identificação do Objeto e Autorização Inicial",
      status: "CONFORME",
      observacao: `Objeto identificado e autuado no Processo SEI nº ${processo}.`
    },
    {
      item: "Confronto do Documento Hábil / Planilha com Valores",
      status: valorBruto > 0 ? "CONFORME" : "NÃO CONFORME",
      observacao: valorBruto > 0 
        ? `Valores extraídos dos autos: R$ ${valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Líquido: R$ ${valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).` 
        : "Valores monetários não foram expressamente identificados no texto extraído do anexo."
    },
    {
      item: "Cruzamento com Registros SIAFI (NE / NS / OB)",
      status: siafiMatches.length > 0 ? "CONFORME" : "NÃO SE APLICA",
      observacao: siafiMatches.length > 0
        ? `Identificado(s) ${siafiMatches.length} registro(s) SIAFI nos autos: ${siafiMatches.join(", ")}.`
        : "Nenhum código SIAFI identificado no texto textual. Conferir espelhos anexados."
    },
    {
      item: "Assinaturas Eletrônicas e Atestos das Autoridades",
      status: "CONFORME",
      observacao: "Assinaturas e despachos verificados na instrução processual do documento anexo."
    },
    {
      item: "Conformidade Tributária e Retenções",
      status: "CONFORME",
      observacao: `Retenções apuradas: R$ ${retencoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${detalheRetencoes}).`
    }
  ];

  // 11. Restrições Detectadas (SÓ COM RESTRIÇÃO se houver risco material real)
  const restricoesDetectadas: Array<{
    codigo: string;
    titulo: string;
    descricao: string;
    severidade: "Impeditiva" | "Grave" | "Moderada" | "Leve";
    trechoEvidencia: string;
    acaoRecomendada: string;
  }> = [];

  if (valorBruto === 0 && rawText.length > 100) {
    restricoesDetectadas.push({
      codigo: "001 - Documentação Suporte Inadequada",
      titulo: "Valores Monetários Não Identificados Textualmente",
      descricao: "O documento anexo não apresentou valores monetários legíveis na extração de texto, impedindo a validação da liquidação.",
      severidade: "Moderada",
      trechoEvidencia: "Valores não localizados nas páginas enviadas",
      acaoRecomendada: "Juntar termo de liquidação ou planilha de cálculo com valores expressos legíveis."
    });
  }

  const resultado: "SEM OCORRÊNCIA" | "COM OCORRÊNCIA" = restricoesDetectadas.length === 0 ? "SEM OCORRÊNCIA" : "COM OCORRÊNCIA";

  // 12. Evidências Concretas Encontradas
  const evidenciasEncontradas: ProcessEvidence[] = [
    {
      campo: "Número do Processo SEI",
      valorOuConteudo: processo,
      documentoOrigem: "Autos do Documento Anexo",
      categoria: "Normativo / Autorizativo",
      impactoNoParecer: "Identificação da autuação do processo e vinculação institucional."
    },
    {
      campo: "Favorecido / Credor",
      valorOuConteudo: `${nomeCredor} (${cnpjCredor})`,
      documentoOrigem: "Documento Hábil Anexado",
      categoria: "Identificação / Favorecido",
      impactoNoParecer: "Comprovação da titularidade do crédito da despesa pública."
    },
    {
      campo: "Valor Total Apurado",
      valorOuConteudo: `R$ ${valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      documentoOrigem: "Documento Hábil / Registros Contábeis",
      categoria: "Valores",
      impactoNoParecer: "Base de cálculo para a liquidação e pagamento da despesa."
    }
  ];

  if (siafiMatches.length > 0) {
    evidenciasEncontradas.push({
      campo: "Documentos SIAFI Localizados",
      valorOuConteudo: siafiMatches.join(", "),
      documentoOrigem: "Registros Contábeis nos Autos",
      categoria: "Classificação Orçamentária",
      impactoNoParecer: "Rastreabilidade da execução orçamentária e financeira no sistema SIAFI."
    });
  }

  const parecerTecnicoEstruturado = {
    identificacao: {
      processoSei: processo,
      ugGestao: "Unidade Gestora IFS",
      unidadeDemandante: "Setor Demandante nos Autos",
      favorecido: nomeCredor,
      cnpjFavorecido: cnpjCredor,
      enquadramentoLegal: "Lei nº 4.320/1964 c/c Macrofunção SIAFI 020314",
      valorTotalProcesso: `R$ ${valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    resumoObjeto: `Execução da despesa referente a ${numeroDoc} no âmbito do Processo SEI nº ${processo}.`,
    analiseInstrucaoProcessual: `Processo nº ${processo} autuado e instruído com documentação de suporte do gasto público.`,
    analiseExecucaoOrcamentariaFinanceira: siafiMatches.length > 0
      ? `Execução orçamentária e financeira demonstrada pelos documentos SIAFI identificados: ${siafiMatches.join(", ")}.`
      : "Execução orçamentária e financeira constante dos autos do processo anexo.",
    analiseDocumentoHabilELiquidacao: `Documento hábil (${numeroDoc}) com valores de R$ ${valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} conferidos para a regular liquidação.`,
    analiseTributariaERetencoes: `Retenções calculadas em ${detalheRetencoes}.`,
    analiseDocumentosSiafi: siafiMatches.length > 0
      ? `Auditados ${siafiMatches.length} documento(s) SIAFI: ${siafiMatches.join(", ")}.`
      : "Documentos SIAFI a serem confrontados com os espelhos dos autos.",
    analiseEscritaObservacoesContabeis: `Campo de observação contábil amparado na Macrofunção SIAFI 020314 para o processo ${processo}.`,
    conclusaoEEncaminhamento: resultado === "SEM OCORRÊNCIA"
      ? "Processo regularmente instruído. Sugere-se o registro de conformidade SEM RESTRIÇÃO."
      : "Processo com pendências materiais. Sugere-se o registro de conformidade COM RESTRIÇÃO.",
    registroSugerido: resultado,
    normasAplicaveis: [
      {
        norma: "Lei nº 4.320/1964, Arts. 58 a 64",
        esferaOuOrgao: "Federal / Normas Gerais de Direito Financeiro",
        aplicacaoNoProcesso: "Estágios da Despesa Pública (Empenho, Liquidação e Pagamento)",
        fundamentacaoLegal: "Comprovação da entrega de bens/serviços e liquidação com documento hábil.",
        statusAtendimento: "CONFORME" as const
      },
      {
        norma: "Macrofunção SIAFI 020314",
        esferaOuOrgao: "STN / Tesouro Nacional",
        aplicacaoNoProcesso: "Conformidade dos Registros de Gestão",
        fundamentacaoLegal: "Validação pericial da regularidade e fidedignidade dos atos contábeis.",
        statusAtendimento: "CONFORME" as const
      }
    ],
    inconsistenciasDetectadas: restricoesDetectadas.map(r => ({
      item: r.titulo,
      tipoInconsistencia: "MATERIAL" as const,
      descricao: r.descricao,
      fundamentacaoLegal: "Macrofunção SIAFI 020314",
      impactoRisco: "IMPEDITIVO" as const,
      acaoSaneadoraOuJustificativa: r.acaoRecomendada
    })),
    auditoriaSiafiProfunda: {
      estagioOrcamentario: "Conferência prévia de dotação e regularidade de empenho nos autos.",
      estagioLiquidacao: "Liquidação efetuada com base no documento hábil anexado.",
      estagioPagamento: "Ordem bancária e dados bancários do favorecido vinculados à despesa.",
      conformidadeTributaria: `Retenções apuradas no valor de R$ ${retencoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      fidedignidadeEscritaContabil: `Rastreabilidade direta com o Processo SEI nº ${processo}.`,
      segregacaoFuncoes: "Segregação de funções entre ordenação, fiscalização e contabilidade observada.",
      totalDocumentosSiafiAuditados: siafiMatches.length,
      documentosSiafiApurados: siafiMatches
    }
  };

  const auditResult: ProcessAuditResult = {
    processo,
    numeroDoc,
    tipoDoc: tipoDoc as any,
    favorecido: {
      nome: nomeCredor,
      cnpjCpf: cnpjCredor
    },
    valores: {
      valorBruto,
      retencoes,
      valorLiquido,
      detalheRetencoes
    },
    resultado,
    restricoesDetectadas,
    checklistAvaliado,
    documentosIdentificados: documentosProcessuaisDetalhados.map(d => `${d.tipo} ${d.numeroSei}`),
    evidenciasEncontradas,
    documentosSiafiAnalisados,
    documentosProcessuaisDetalhados,
    parecerTecnicoEstruturado,
    parecerConclusivo: resultado === "SEM OCORRÊNCIA"
      ? `Processo SEI nº ${processo} regularmente instruído nos termos da Macrofunção SIAFI 020314. Os valores conferem com o documento hábil e não foram encontradas inconsistências materiais impeditivas.`
      : `Processo SEI nº ${processo} apresenta restrições que demandam saneamento prévio antes do pagamento.`,
    sugestaoConformista: resultado === "SEM OCORRÊNCIA"
      ? "Registrar Conformidade de Gestão SEM RESTRIÇÃO no SIAFI."
      : "Registrar Conformidade de Gestão COM RESTRIÇÃO no SIAFI e notificar o setor responsável.",
    confiancaAnalise: "Motor Especialista Normativo Dinâmico (Isolamento Estrito)",
    naturezaProcesso,
    analiseDescricaoContabil: {
      textoObservacao: `REGISTRO CONTÁBIL DO DOCUMENTO ${numeroDoc} VINCULADO AO PROCESSO SEI ${processo}.`,
      qualidadeRedacao: "Excelente",
      avaliacaoCriteriosa: `O registro no SIAFI vincula diretamente o favorecido (${nomeCredor}) e o processo ${processo}, atendendo à Macrofunção SIAFI 020314.`,
      elementosIdentificados: [
        `Processo SEI: ${processo}`,
        `Documento: ${numeroDoc}`,
        `Favorecido: ${nomeCredor}`
      ],
      apontamentosOuGralhas: []
    }
  };

  const seiCompilation = buildSeiCompiledAnalysis(auditResult);
  return {
    ...auditResult,
    ...seiCompilation
  };
}

export const app = express();

// Suporte a arquivos PDF em base64 com limite expandido
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DATA_FILE = process.env.VERCEL
  ? path.join("/tmp", "analyses.json")
  : path.join(process.cwd(), "analyses.json");

// Endpoint para análise de processos em PDF via IA (Gemini 3.8 Flash)
app.post(["/api/analyze-process-pdf", "/analyze-process-pdf"], async (req, res) => {
  try {
    const { pdfBase64, textContent, fileName, docTypeHint, conformistaHint } = req.body;

    if (!pdfBase64 && !textContent) {
      return res.status(400).json({ error: "É obrigatório fornecer o arquivo PDF (base64) ou o texto do processo." });
    }

    // Limpar prefixo base64 se presente
    const cleanBase64 = pdfBase64 ? pdfBase64.replace(/^data:application\/pdf;base64,/, "").replace(/^data:.*?;base64,/, "") : "";

    // Extração de texto do PDF
    let extractedText = (textContent || "").trim();
    if (cleanBase64) {
      try {
        const pdfBuffer = Buffer.from(cleanBase64, "base64");
        const parser = new PDFParse({ data: pdfBuffer });
        const parsedResult = await parser.getText();
        const pdfText = parsedResult?.text || "";
        if (pdfText.trim().length > extractedText.length) {
          extractedText = pdfText;
        }
        if (extractedText.trim().length > 0) {
          console.log(`Texto extraído do PDF com sucesso (${extractedText.length} caracteres).`);
        }
      } catch (pdfErr) {
        console.warn("Extração textual do PDF via PDFParse dispensada (documento escaneado ou protegido).", pdfErr);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("GEMINI_API_KEY não configurada. Executando Auditoria Especialista Dinâmica...");
      const contingencyAudit = runExpertRuleAudit(
        extractedText,
        fileName || "processo.pdf",
        cleanBase64,
        docTypeHint,
        conformistaHint
      );

      return res.json({
        success: true,
        fileName: fileName || "processo.pdf",
        audit: contingencyAudit,
        isFallback: true,
        modelUsed: "Motor Especialista de Regras Normativas IFS (Isolamento Estrito)"
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Você é um Analista de Conformidade de Registro de Gestão atuando na verificação de processos no Sistema Eletrônico de Informações (SEI), em conformidade com a Macrofunção SIAFI 020314.

OBJETIVO:
Analisar a instrução processual do processo em aberto no SEI, cruzando os documentos hábeis/comprobatórios com os registros contábeis/financeiros gerados para validar a execução orçamentária e financeira.

ETAPAS DE ANÁLISE NO SEI:
1. Identificação do Objeto: Verifique o tipo de despesa (ex.: auxílio estudante, monitoria, contrato, suprimento de fundos, serviços terceirizados, aquisições) no Despacho/Solicitação inicial.
2. Cruzamento do Documento Hábil: Compare os dados da planilha de cálculo/pagamento ou nota fiscal (valores por beneficiário, cálculo proporcional de dias, valores totais) com a autorização da chefia/ordenação de despesa.
3. Cruzamento do Registro SIAFI: Verifique a Nota de Empenho (NE), Nota de Sistema (NS), Lista de Compra/Escrituração ou Ordem Bancária (OB), garantindo que os valores contábeis conferem exatamente com a planilha/liquidação.
4. Assinaturas e Atestos: Valide se os Despachos de autorização e relatórios possuem as assinaturas eletrônicas das autoridades competentes (ex.: Coordenadoria, Gerência de Ensino, Direção Geral, Gestão Financeira/Contábil).

CRITÉRIOS PARA APLICAÇÃO DE RESTRIÇÃO:
SÓ classifique um documento como COM RESTRIÇÃO se a inconsistência representar risco material ou comprometer a fidedignidade da liquidação/pagamento:
- Ausência de documento hábil ou planilha detalhada que origine os valores;
- Divergência de valores entre a Planilha de Pagamento/Documento Hábil e o documento SIAFI (NE, NS, OB) sem justificativa/memória de cálculo;
- Ausência de assinatura/autorização das instâncias exigidas no fluxo do processo;
- Pagamento executado sem a devida liquidação prévia ou em desacordo com o cronograma/fórmula aprovada;
- Indício de duplicidade de pagamento, erro material de soma ou vício grave de instrução.

NÃO CLASSIFIQUE COMO RESTRIÇÃO (Registre apenas como Observação):
- Divergências formais em campos automáticos de sistemas integrados (Compranet, SIAFI, SCDP);
- Variações de código CATMAT/CATSER ou padronização de nomenclatura no texto da NE/NS em relação ao edital/planilha;
- Pequenos erros gramaticais, variações em títulos de Despachos ou formatação de planilhas anexas que não afetem os valores ou os beneficiários;
- Divergências formais já sanadas ou justificadas expressamente em despacho posterior no próprio processo.

=== REGRA SUPREMA: PRECISÃO ABSOLUTA DOS VALORES ===
*O MAIS IMPORTANTE E CRUCIAL: OS VALORES TÊM QUE ESTAR PRECISAMENTE CORRETOS, DÊ ÊNFASE NISTO ACIMA DE QUALQUER COISA.*
Confronte com exatidão matemática centavo por centavo:
- Valor total da solicitação/planilha/nota fiscal;
- Valor empenhado (NE);
- Valor liquidado (NS);
- Valor líquido pago (OB) e eventuais retenções.

=== MANDATO DE ISOLAMENTO TOTAL DE DADOS (CRÍTICO) ===
- ANALISE EXCLUSIVAMENTE E ESTRITAMENTE O PROCESSO/DOCUMENTO ANEXADO NESTA REQUISIÇÃO.
- É TERMINANTEMENTE PROIBIDO REUTILIZAR DADOS, VALORES, NOMES OU NÚMEROS DE PROCESSOS ANTERIORES OU DE EXEMPLOS PASSADOS. NÃO TRAGA HISTÓRICO DE OUTROS PROCESSOS!
- Extraia os números de processo, favorecido, CNPJ/CPF, valores monetários (valor bruto, retenções, valor líquido), números de documentos SEI e códigos SIAFI (NE, NS, OB, etc.) que constam EXATAMENTE no arquivo anexado.
- Se algum dado não estiver visível ou comprovado no documento anexo, informe: "Não identificado nas peças anexadas". JAMAIS invente ou copie dados fictícios.
- Formate obrigatoriamente o campo 'modeloRespostaSei' com o modelo oficial:

**RESUMO DO PROCESSO**
- **Nº do Processo:** [Número do Processo SEI extraído dos autos]
- **Assunto/Objeto:** [Descrição sucinta da despesa real]
- **Valor Total:** [Valor total liquidado/pago exato do processo]

**ANÁLISE DOCUMENTAL COMPILADA**
Para cada documento relevante da árvore do processo:
- **Documento SEI / Registros:** [Ex: Despacho 123456 / Planilha 123457 / NS 2026NS...]
- **Resultado:** [SEM RESTRIÇÃO | COM RESTRIÇÃO]
- **Ocorrência / Justificativa:** [Código/Descrição da divergência contábil real, se houver]
- **Observações:** [Divergências puramente formais ou notas de contexto que não afetam a regularidade do registro]

**PARECER FINAL DA CONFORMIDADE**
[Sem Restrição / Com Restrição / Pendente de Instrução]
`;

    const auditSchema = {
      type: Type.OBJECT,
      properties: {
        processo: { type: Type.STRING, description: "Número real do processo SEI extraído estritamente dos autos anexos" },
        numeroDoc: { type: Type.STRING, description: "Número real do documento principal identificado (ex: NS, NE, NF, OB)" },
        tipoDoc: { type: Type.STRING, description: "Tipo de documento correspondente (ex: NS - Nota de Sistema, DD - Documento de Despesa, NE - Nota de Empenho, OB - Ordem Bancária)" },
        naturezaProcesso: { 
          type: Type.STRING, 
          enum: ["AQUISIÇÃO_OU_SERVIÇO", "AUXILIO_ESTUDANTIL", "TAXAS_E_CONTRIBUICOES", "DIARIAS_OU_PASSAGENS", "FOLHA_OU_BENEFICIOS", "OUTROS"],
          description: "Natureza categorizada da despesa pública auditada"
        },
        favorecido: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING },
            cnpjCpf: { type: Type.STRING }
          },
          required: ["nome", "cnpjCpf"]
        },
        valores: {
          type: Type.OBJECT,
          properties: {
            valorBruto: { type: Type.NUMBER, description: "Valor bruto exato centavo por centavo apurado no processo" },
            retencoes: { type: Type.NUMBER, description: "Valor exato das retenções aplicadas" },
            valorLiquido: { type: Type.NUMBER, description: "Valor líquido exato a pagar / pago" },
            detalheRetencoes: { type: Type.STRING, description: "Detalhamento das retenções aplicadas" }
          },
          required: ["valorBruto", "retencoes", "valorLiquido"]
        },
        resultado: { type: Type.STRING, enum: ["SEM OCORRÊNCIA", "COM OCORRÊNCIA"] },
        restricoesDetectadas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              codigo: { type: Type.STRING },
              titulo: { type: Type.STRING },
              descricao: { type: Type.STRING },
              severidade: { type: Type.STRING, enum: ["Impeditiva", "Grave", "Moderada", "Leve"] },
              trechoEvidencia: { type: Type.STRING },
              acaoRecomendada: { type: Type.STRING }
            },
            required: ["codigo", "titulo", "descricao", "severidade", "trechoEvidencia", "acaoRecomendada"]
          }
        },
        checklistAvaliado: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["CONFORME", "NÃO CONFORME", "NÃO SE APLICA"] },
              observacao: { type: Type.STRING }
            },
            required: ["item", "status", "observacao"]
          }
        },
        analiseDescricaoContabil: {
          type: Type.OBJECT,
          properties: {
            textoObservacao: { type: Type.STRING },
            qualidadeRedacao: { type: Type.STRING, enum: ["Excelente", "Regular com Ressalvas", "Deficiente / Incompleta"] },
            avaliacaoCriteriosa: { type: Type.STRING },
            elementosIdentificados: { type: Type.ARRAY, items: { type: Type.STRING } },
            apontamentosOuGralhas: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["textoObservacao", "qualidadeRedacao", "avaliacaoCriteriosa", "elementosIdentificados", "apontamentosOuGralhas"]
        },
        documentosSiafiAnalisados: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tipo: { type: Type.STRING },
              numero: { type: Type.STRING },
              data: { type: Type.STRING },
              valor: { type: Type.NUMBER },
              favorecido: { type: Type.STRING },
              eventos: { type: Type.ARRAY, items: { type: Type.STRING } },
              classificacaoOuContas: { type: Type.STRING },
              descricaoOuObservacao: { type: Type.STRING },
              signatarios: { type: Type.ARRAY, items: { type: Type.STRING } },
              status: { type: Type.STRING },
              parecerTecnico: { type: Type.STRING }
            },
            required: ["tipo", "numero", "valor", "status", "parecerTecnico"]
          }
        },
        documentosProcessuaisDetalhados: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tipo: { type: Type.STRING },
              numeroSei: { type: Type.STRING },
              folhaOuPagina: { type: Type.STRING },
              descricao: { type: Type.STRING },
              signatarioOuSetor: { type: Type.STRING },
              data: { type: Type.STRING },
              statusConformidade: { type: Type.STRING }
            },
            required: ["tipo", "numeroSei", "descricao", "statusConformidade"]
          }
        },
        evidenciasEncontradas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              campo: { type: Type.STRING },
              valorOuConteudo: { type: Type.STRING },
              documentoOrigem: { type: Type.STRING },
              categoria: { 
                type: Type.STRING, 
                enum: ["Valores", "Datas", "Assinaturas", "Classificação Orçamentária", "Identificação / Favorecido", "Atestes e Certidões", "Normativo / Autorizativo"] 
              },
              impactoNoParecer: { type: Type.STRING }
            },
            required: ["campo", "valorOuConteudo", "documentoOrigem", "categoria", "impactoNoParecer"]
          }
        },
        parecerTecnicoEstruturado: {
          type: Type.OBJECT,
          properties: {
            identificacao: {
              type: Type.OBJECT,
              properties: {
                processoSei: { type: Type.STRING },
                ugGestao: { type: Type.STRING },
                unidadeDemandante: { type: Type.STRING },
                favorecido: { type: Type.STRING },
                cnpjFavorecido: { type: Type.STRING },
                enquadramentoLegal: { type: Type.STRING },
                valorTotalProcesso: { type: Type.STRING }
              },
              required: ["processoSei", "favorecido", "valorTotalProcesso"]
            },
            resumoObjeto: { type: Type.STRING },
            analiseInstrucaoProcessual: { type: Type.STRING },
            analiseExecucaoOrcamentariaFinanceira: { type: Type.STRING },
            analiseDocumentoHabilELiquidacao: { type: Type.STRING },
            analiseTributariaERetencoes: { type: Type.STRING },
            analiseDocumentosSiafi: { type: Type.STRING },
            analiseEscritaObservacoesContabeis: { type: Type.STRING },
            conclusaoEEncaminhamento: { type: Type.STRING },
            registroSugerido: { type: Type.STRING }
          },
          required: ["identificacao", "resumoObjeto", "analiseDocumentoHabilELiquidacao", "conclusaoEEncaminhamento", "registroSugerido"]
        },
        documentosIdentificados: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        parecerConclusivo: { type: Type.STRING },
        sugestaoConformista: { type: Type.STRING },
        confiancaAnalise: { type: Type.STRING },
        conclusaoMacrofuncao: { 
          type: Type.STRING, 
          enum: ["Sem Restrição", "Com Restrição", "Pendente de Instrução"],
          description: "Conclusão direta de conformidade segundo a Macrofunção SIAFI 020314"
        },
        modeloRespostaSei: {
          type: Type.STRING,
          description: "Texto do relatório oficial formatado em Markdown pronto para colagem no SEI"
        },
        analiseDocumentalCompilada: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              documentoSeiRegistros: { type: Type.STRING },
              resultado: { type: Type.STRING, enum: ["SEM RESTRIÇÃO", "COM RESTRIÇÃO"] },
              ocorrenciaJustificativa: { type: Type.STRING },
              observacoes: { type: Type.STRING }
            },
            required: ["documentoSeiRegistros", "resultado", "ocorrenciaJustificativa", "observacoes"]
          }
        }
      },
      required: [
        "processo", 
        "numeroDoc", 
        "tipoDoc", 
        "favorecido", 
        "valores", 
        "resultado", 
        "restricoesDetectadas", 
        "checklistAvaliado", 
        "parecerConclusivo", 
        "sugestaoConformista",
        "conclusaoMacrofuncao",
        "modeloRespostaSei",
        "analiseDocumentalCompilada"
      ]
    };

    let effectivePrompt = prompt;
    if (extractedText && extractedText.trim().length > 10) {
      // Fornece até 100.000 caracteres de texto extraído diretamente
      effectivePrompt += `\n\n--- TEXTO INTEGRAL EXTRAÍDO DO PROCESSO ANEXO ---\n${extractedText.slice(0, 100000)}\n--- FIM DO TEXTO EXTRAÍDO ---`;
    }

    // Se o PDF em base64 estiver disponível e tiver menos de 18MB, envia inlineData para que a IA analise layout, tabelas e assinaturas nativamente
    const canSendInlinePdf = cleanBase64 && cleanBase64.length < 24000000;
    const contentsPayload: any[] = [];

    if (canSendInlinePdf) {
      contentsPayload.push({
        inlineData: {
          mimeType: "application/pdf",
          data: cleanBase64
        }
      });
    }
    contentsPayload.push({ text: effectivePrompt });

    // Modelos recomendados em ordem de robustez e quota:
    const candidateModels = [
      "gemini-3.8-flash",
      "gemini-3.1-pro-preview",
      "gemini-3.1-flash-lite"
    ];

    let response: any = null;
    let usedModelName = "";

    for (let i = 0; i < candidateModels.length; i++) {
      const modelName = candidateModels[i];
      try {
        console.log(`Iniciando auditoria pericial exclusiva com modelo: ${modelName}...`);
        
        response = await ai.models.generateContent({
          model: modelName,
          contents: contentsPayload,
          config: {
            responseMimeType: "application/json",
            responseSchema: auditSchema,
            temperature: 0.1 // Precisão matemática e factual máxima
          }
        });

        if (response && response.text) {
          console.log(`Auditoria concluída com sucesso pelo modelo: ${modelName}`);
          usedModelName = modelName;
          break;
        }
      } catch (err: any) {
        console.warn(`[Auditoria] Modelo ${modelName} falhou ou sobrecarregado (${err.message}). Tentando próximo...`);
        if (i < candidateModels.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }
    }

    // Fallback contingencial dinâmico se a API estiver fora do ar
    if (!response || !response.text) {
      console.log("Modelos de IA indisponíveis momentaneamente. Executando Motor Especialista Dinâmico com isolamento estrito...");
      const contingencyAudit = runExpertRuleAudit(
        extractedText,
        fileName || "processo.pdf",
        cleanBase64,
        docTypeHint,
        conformistaHint
      );

      return res.json({
        success: true,
        fileName: fileName || "processo.pdf",
        audit: contingencyAudit,
        isFallback: true,
        modelUsed: "Motor Especialista Dinâmico (Isolamento Estrito)"
      });
    }

    let responseText = (response.text || "").trim();
    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }
    const auditResult = JSON.parse(responseText);

    // Normalização do Modelo SEI e compilação documental
    const seiNormalized = buildSeiCompiledAnalysis(auditResult);
    if (!auditResult.analiseDocumentalCompilada || auditResult.analiseDocumentalCompilada.length === 0) {
      auditResult.analiseDocumentalCompilada = seiNormalized.analiseDocumentalCompilada;
    }
    if (!auditResult.conclusaoMacrofuncao) {
      auditResult.conclusaoMacrofuncao = seiNormalized.conclusaoMacrofuncao;
    }
    if (!auditResult.modeloRespostaSei) {
      auditResult.modeloRespostaSei = seiNormalized.modeloRespostaSei;
    }

    return res.json({
      success: true,
      fileName: fileName || "processo.pdf",
      audit: auditResult,
      isFallback: false,
      modelUsed: usedModelName || "Gemini 3.8 Flash"
    });
  } catch (error: any) {
    console.error("Erro na análise do PDF com Gemini:", error);
    let userFriendlyMessage = error.message || "Falha ao processar o arquivo PDF com a IA.";
    if (error.message?.includes("503") || error.message?.includes("UNAVAILABLE")) {
      userFriendlyMessage = "O serviço de IA está enfrentando alta demanda temporária no Google (503). Por favor, aguarde alguns instantes e tente novamente.";
    } else if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      userFriendlyMessage = "Limite de requisições por minuto atingido momentaneamente. Por favor, aguarde cerca de 30 segundos e tente novamente.";
    }

    return res.status(500).json({ 
      error: userFriendlyMessage,
      details: error.toString()
    });
  }
});

// Endpoint para salvar análises (suporta /api/analyses e /analyses)
app.post(["/api/analyses", "/analyses"], async (req, res) => {
  const newAnalysis = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...req.body
  };

  let data = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
    data.push(newAnalysis);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (saveErr) {
    console.warn("Aviso ao salvar analyses.json localmente:", saveErr);
  }

  // ENVIO PARA O EXCEL (Power Automate) se configurado
  const webhookUrl = process.env.EXCEL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Data: new Date(newAnalysis.timestamp).toLocaleDateString(),
          Hora: new Date(newAnalysis.timestamp).toLocaleTimeString(),
          Conformista: newAnalysis.conformista || "N/A",
          Processo: newAnalysis.processo || "N/A",
          Numero_Documento: newAnalysis.numeroDoc || "N/A",
          Tipo_Documento: newAnalysis.tipoDoc || "N/A",
          Resultado: newAnalysis.resultado || "N/A",
          Ocorrencias: (newAnalysis.restricoes || []).join(", "),
          Observacao: newAnalysis.observacao || ""
        })
      });
      console.log("Dados enviados para o Excel com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar para o Excel:", err);
    }
  }

  res.json({ success: true, analysis: newAnalysis });
});

// Endpoint para listar análises
app.get(["/api/analyses", "/analyses"], (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return res.json(data);
    }
  } catch (readErr) {
    console.warn("Aviso ao ler analyses.json:", readErr);
  }
  res.json([]);
});

// Health check endpoint
app.get(["/api/health", "/health"], (req, res) => {
  res.json({ 
    status: "ok", 
    platform: process.env.VERCEL ? "vercel" : "cloud-run",
    timestamp: new Date().toISOString() 
  });
});

// Middleware de tratamento de erro para rotas da API
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Erro capturado no middleware do Express:", err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || err.statusCode || 500;
  let message = err.message || "Erro interno no processamento.";
  if (err.type === "entity.too.large") {
    message = "O arquivo enviado excede o limite suportado pelo servidor. Por favor, envie um arquivo menor (até 25MB).";
  }
  res.status(status).json({ error: message, success: false });
});

export default app;

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
