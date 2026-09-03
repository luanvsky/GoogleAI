import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Suporte a arquivos PDF em base64 com limite expandido
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const DATA_FILE = path.join(process.cwd(), "analyses.json");

  // Endpoint para análise de processos em PDF via IA (Gemini 3.8 Flash)
  app.post("/api/analyze-process-pdf", async (req, res) => {
    try {
      const { pdfBase64, fileName, docTypeHint, conformistaHint } = req.body;

      if (!pdfBase64) {
        return res.status(400).json({ error: "O arquivo PDF (base64) é obrigatório." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Chave GEMINI_API_KEY não configurada no ambiente. Adicione a chave no painel Settings > Secrets." 
        });
      }

      // Limpar prefixo base64 se presente
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "").replace(/^data:.*?;base64,/, "");

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Você é o Auditor Oficial e Conformista de Registro de Gestão do IFS (Instituto Federal de Sergipe), atuando no âmbito do SIAFI e SEI.
Sua tarefa é analisar minuciosamente este processo/documento em anexo (PDF) e identificar se há RESTRIÇÕES conforme as fontes normativas vigentes:
1. Macrofunção SIAFI 020314 (Conformidade dos Registros de Gestão);
2. Manual de Procedimentos para a Conformidade de Registro de Gestão do IFS / Portaria IFS nº 1.633/2026;
3. Instrução Normativa RFB nº 1.234/2012 (Retenção ampla na fonte de IR, CSLL, COFINS, PIS em órgãos federais);
4. Lei nº 4.320/1964 (Fases da despesa pública: Empenho prévio, Liquidação com Ateste formal/comprovação do recebimento, Pagamento);
5. Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos e Ordem Cronológica de Pagamento - Art. 141);
6. Lei Complementar nº 101/2000 (Lei de Responsabilidade Fiscal).

${docTypeHint ? `Dica de Tipo de Documento sugerido pelo usuário: ${docTypeHint}` : ''}
${conformistaHint ? `Conformista responsável: ${conformistaHint}` : ''}

RELAÇÃO OFICIAL DE RESTRIÇÕES SIAFI / CONFORMIDADE DE REGISTRO DE GESTÃO DO IFS:
- "001 - Documentação Suporte Inadequada" (ex.: documento ilegível, incompleto, rasurado, descrição vaga do serviço/fornecimento, ausência de nota fiscal idônea ou relatório de medição);
- "002 - Documentação Suporte Inexistente" (ex.: ausência total de Nota Fiscal, falta de certidões de regularidade fiscal/trabalhista, falta de termo de recebimento/medição, falta de comprovação de entrega);
- "003 - Registro não Espelha o Ato/Fato de Gestão" (ex.: valor faturado diverge do empenhado sem justificativa, divergência de saldo, evento contábil distorcido, datas incoerentes);
- "004 - Ausência de Ateste/Recebimento na Nota Fiscal/Fatura" (ex.: nota fiscal/fatura sem o carimbo ou assinatura digital formal do fiscal de contrato ou comissão com ateste de recebimento definitivo/provisório nos termos do Art. 73 da Lei 4.320/64);
- "005 - Divergência de Valores/Cálculos Tributários ou Retenções (IN 1234/12)" (ex.: ausência de retenção dos tributos federais devidos (IRRF, CSLL, PIS, COFINS), enquadramento incorreto de alíquotas da IN 1234/12, cálculo incorreto de ISS ou retenção previdenciária de INSS, falta de DARF correspondente);
- "006 - Ausência de Regularidade Fiscal/Trabalhista (SICAF/CND/FGTS)" (ex.: certidões CND/PGFN, CRF/FGTS ou CNDT vencidas ou ausência de extrato de consulta ao SICAF no momento da liquidação/pagamento);
- "007 - Descumprimento de Prazo ou Vigência Contratual" (ex.: entrega de produto/serviço após vigência do contrato sem termo aditivo, nota emitida fora do prazo);
- "008 - Ausência de Autorização/Despacho do Ordenador de Despesa" (ex.: liquidação ou pagamento sem despacho formal de autorização do Ordenador de Despesas do IFS);
- "009 - Favorecido ou Dados Bancários Divergentes" (ex.: conta bancária do favorecido para depósito divergente da constante na NF ou CNPJ do pagamento diferente da matriz/filial contratada);
- "010 - Classificação Orçamentária/Natureza de Despesa Incorreta" (ex.: despesa de material de consumo empenhada indevidamente em permanente ou vice-versa);
- "011 - Ausência de Nota de Empenho Vinculada Regular" (ex.: despesa processada sem número de empenho prévio ou empenho cancelado/insuficiente);
- "012 - Inobservância da Ordem Cronológica de Pagamento" (ex.: pagamento realizado fora da ordem legal sem despacho circunstanciado e fundamentado).

DIRETRIZES DE AUDITORIA:
1. Extraia o Número do Processo SEI (ex: 23060.000123/2026-45), o Número do Documento principal, o Tipo de Documento SIAFI mais apropriado ("DD - Documento de Despesa", "NP - Nota de Pagamento", "NE - Nota de Empenho", "RP - Restos a Pagar", "OB - Ordem Bancária", "DARF - Documento de Arrecadação", etc.), o Favorecido (Razão Social e CNPJ/CPF), os Valores (Bruto, Retenções, Líquido).
2. Identifique todos os documentos encontrados no processo em anexo.
3. Avalie o checklist normativo obrigatório.
4. Conclusão da Conformidade:
   - Se houver QUALQUER restrição ou não-conformidade identificada, o resultado DEVE ser "COM OCORRÊNCIA", detalhando cada uma das restrições com severidade, trecho/página de evidência e a ação corretiva necessária.
   - Se tudo estiver estritamente regular e comprovado no processo, o resultado será "SEM OCORRÊNCIA".
5. Forneça o Parecer Conclusivo oficial do Conformista de Registro de Gestão do IFS fundamentado e a sugestão de registro SIAFI.`;

      const auditSchema = {
        type: Type.OBJECT,
        properties: {
          processo: { type: Type.STRING, description: "Número do processo SEI extraído" },
          numeroDoc: { type: Type.STRING, description: "Número do documento principal (ex: NF 1234, 2026NE000123)" },
          tipoDoc: { type: Type.STRING, description: "Tipo de documento correspondente ex: DD - Documento de Despesa, NP - Nota de Pagamento, etc." },
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
              valorBruto: { type: Type.NUMBER },
              retencoes: { type: Type.NUMBER },
              valorLiquido: { type: Type.NUMBER },
              detalheRetencoes: { type: Type.STRING }
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
          documentosIdentificados: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          parecerConclusivo: { type: Type.STRING },
          sugestaoConformista: { type: Type.STRING },
          confiancaAnalise: { type: Type.STRING }
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
          "documentosIdentificados", 
          "parecerConclusivo", 
          "sugestaoConformista"
        ]
      };

      // Tentar modelos suportados com fallback resiliente e backoff em caso de alta demanda (503/429)
      const candidateModels = [
        "gemini-3.1-flash-lite", 
        "gemini-3.5-flash", 
        "gemini-flash-latest", 
        "gemini-3.8-flash"
      ];
      let response: any = null;
      let lastError: any = null;

      for (let i = 0; i < candidateModels.length; i++) {
        const modelName = candidateModels[i];
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: cleanBase64
                }
              },
              {
                text: prompt
              }
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: auditSchema
            }
          });

          if (response && response.text) {
            console.log(`Auditoria concluída com sucesso pelo modelo: ${modelName}`);
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Tentativa de análise com modelo ${modelName} falhou:`, err.message?.slice(0, 150));
          
          // Se for erro de alta demanda temporária (503) ou cota (429), aguarda breve pausa antes do próximo modelo
          if (i < candidateModels.length - 1) {
            const isDemandSpike = err.message?.includes("503") || err.message?.includes("UNAVAILABLE") || err.message?.includes("429");
            const delayMs = isDemandSpike ? 1500 : 500;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error("Não foi possível obter resposta dos modelos de inteligência artificial.");
      }

      const responseText = response.text || "{}";
      const auditResult = JSON.parse(responseText);

      return res.json({
        success: true,
        fileName: fileName || "processo.pdf",
        audit: auditResult
      });
    } catch (error: any) {
      console.error("Erro na análise do PDF com Gemini:", error);
      let userFriendlyMessage = error.message || "Falha ao processar o arquivo PDF com a IA.";
      if (error.message?.includes("503") || error.message?.includes("UNAVAILABLE")) {
        userFriendlyMessage = "O serviço de IA está enfrentando alta demanda temporária no Google (503). Por favor, aguarde alguns instantes e tente novamente.";
      } else if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        userFriendlyMessage = "Limite de requisições por minuto atingido momentaneamente. Por favor, aguarde cerca de 30 segundos e tente novamente.";
      } else if (error.message?.includes("INVALID_ARGUMENT")) {
        userFriendlyMessage = "O formato ou conteúdo do PDF enviado não pôde ser interpretado. Certifique-se de que o PDF é válido e não está corrompido ou protegido por senha.";
      }

      return res.status(500).json({ 
        error: userFriendlyMessage,
        details: error.toString()
      });
    }
  });

  // Endpoint para salvar análises
  app.post("/api/analyses", async (req, res) => {
    const newAnalysis = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };

    // Salva localmente no JSON
    let data = [];
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
    data.push(newAnalysis);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    // ENVIO PARA O EXCEL (Power Automate)
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
  app.get("/api/analyses", (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      res.json(data);
    } else {
      res.json([]);
    }
  });

  // Middleware de tratamento de erro para rotas da API (garante JSON sempre)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Erro capturado no middleware do Express:", err);
    if (res.headersSent) {
      return next(err);
    }
    const status = err.status || err.statusCode || 500;
    let message = err.message || "Erro interno no processamento.";
    if (err.type === "entity.too.large") {
      message = "O arquivo enviado excede o limite suportado pelo servidor. Por favor, envie um arquivo menor (até 20MB).";
    }
    res.status(status).json({ error: message, success: false });
  });

  if (process.env.NODE_ENV !== "production") {
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

startServer();
