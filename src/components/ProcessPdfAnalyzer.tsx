import React, { useState, useRef, useEffect } from 'react';
import { 
  FileUp, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  ArrowRight, 
  Building2, 
  DollarSign, 
  ShieldAlert, 
  Calendar, 
  Info, 
  X, 
  BookOpen, 
  PenTool, 
  GraduationCap,
  Landmark,
  Layers,
  Scale,
  ScrollText,
  Briefcase,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { DocType, ProcessAuditResult, ProcessRestriction } from '../types';
import { SiafiDocumentsTable } from './SiafiDocumentsTable';
import { ProcessDocumentsTable } from './ProcessDocumentsTable';
import { ParecerTecnicoView } from './ParecerTecnicoView';
import { ProcessEvidenceTable } from './ProcessEvidenceTable';
import { DEMO_TAXAS_CREA, DEMO_DIVERGENCIA_CALCULO } from '../data/demoScenarios';
import { ConfrontoCalculadoraTributaria } from './ConfrontoCalculadoraTributaria';

interface ProcessPdfAnalyzerProps {
  conformistaPadrao: string;
  onImportToForm: (data: {
    processo: string;
    numeroDoc: string;
    tipoDoc: DocType;
    resultado: "SEM OCORRÊNCIA" | "COM OCORRÊNCIA";
    restricoes: string[];
    observacao: string;
  }) => void;
  onSaveToHistory: (data: {
    conformista: string;
    processo: string;
    numeroDoc: string;
    tipoDoc: DocType;
    resultado: "SEM OCORRÊNCIA" | "COM OCORRÊNCIA";
    restricoes: string[];
    observacao: string;
    checklist: Record<string, boolean>;
  }) => Promise<void>;
  onOpenCalculator?: () => void;
  onAuditChange?: (audit: ProcessAuditResult) => void;
}

export function ProcessPdfAnalyzer({ conformistaPadrao, onImportToForm, onSaveToHistory, onOpenCalculator, onAuditChange }: ProcessPdfAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [conformista, setConformista] = useState<string>(conformistaPadrao || '');
  const [docTypeHint, setDocTypeHint] = useState<string>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [auditResult, setAuditResult] = useState<ProcessAuditResult | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'visao_geral' | 'calculadora_confronto' | 'evidencias_encontradas' | 'documentos_siafi' | 'documentos_sei' | 'parecer_tecnico' | 'escrita_contabil' | 'checklist'>('visao_geral');
  const [isContingencyMode, setIsContingencyMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza o resultado da auditoria com o componente pai / Calculadora Tributária
  useEffect(() => {
    if (auditResult && onAuditChange) {
      onAuditChange(auditResult);
    }
  }, [auditResult, onAuditChange]);

  // Manipulação de Upload do Arquivo
  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Por favor, selecione exclusivamente um arquivo no formato PDF.');
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setErrorMessage(`O arquivo selecionado (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB) excede o limite suportado de 25MB. Divida o processo em partes menores ou anexe apenas as peças principais.`);
      return;
    }

    setErrorMessage('');
    setFile(selectedFile);
    setAuditResult(null);
    setIsSaved(false);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setErrorMessage('Erro ao ler o arquivo selecionado.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Disparar análise com a IA
  const runAnalysis = async () => {
    if (!fileBase64) {
      setErrorMessage('Nenhum arquivo PDF carregado para análise.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisStep('Enviando processo para o auditor digital...');

    try {
      const steps = [
        'Lendo páginas e identificando documentos no PDF...',
        'Auditando notas fiscais, termos de recebimento e atestes...',
        'Conferindo retenções federais (IN RFB 1.234/2012)...',
        'Verificando conformidade com a Macrofunção SIAFI 020314...',
        'Sinalizando ocorrências e consolidando parecer técnico...'
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        setAnalysisStep(steps[stepIndex]);
      }, 2200);

      const response = await fetch('/api/analyze-process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: fileBase64,
          fileName: file?.name || 'processo.pdf',
          docTypeHint: docTypeHint === 'auto' ? undefined : docTypeHint,
          conformistaHint: conformista || undefined
        })
      });

      clearInterval(interval);

      // Leitura resiliente da resposta (previne crash se o proxy ou servidor devolver HTML de erro)
      const responseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn('Resposta não-JSON recebida da API de auditoria:', responseText.slice(0, 300));
        let friendlyError = 'Falha na resposta do servidor.';
        if (response.status === 413 || responseText.includes('413') || responseText.toLowerCase().includes('too large') || responseText.toLowerCase().includes('payload')) {
          friendlyError = 'O arquivo PDF é muito extenso para envio de uma só vez (limite de tráfego excedido). Tente anexar as páginas principais do processo (termo de ateste, nota fiscal e regularidade fiscal).';
        } else if (response.status === 504 || responseText.includes('504') || responseText.toLowerCase().includes('time-out')) {
          friendlyError = 'Tempo limite de processamento esgotado pelo servidor (Timeout). O documento pode conter muitas páginas ou a rede está instável.';
        } else if (response.status === 502 || response.status === 503 || responseText.includes('warmup') || responseText.includes('502') || responseText.includes('503')) {
          friendlyError = 'O serviço de auditoria ou modelo de IA está temporariamente indisponível ou reiniciando. Por favor, aguarde alguns segundos e clique em "Tentar novamente".';
        } else {
          friendlyError = `Erro de comunicação com o servidor (HTTP ${response.status || 'desconhecido'}). Por favor, tente novamente.`;
        }
        throw new Error(friendlyError);
      }

      if (!response.ok) {
        throw new Error(data?.error || `Erro ${response.status}: Falha no processamento com a IA`);
      }

      if (data?.audit) {
        setAuditResult(data.audit);
        setIsContingencyMode(!!data.isFallback);
      } else {
        throw new Error('A resposta da auditoria não veio no formato esperado.');
      }
    } catch (err: any) {
      console.error('Erro na análise:', err);
      setErrorMessage(err.message || 'Falha na comunicação com o serviço de auditoria.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Carregar Exemplo Demonstrativo para testes rápidos
  const loadDemoCase = (scenario: 'com_restricao' | 'sem_restricao' | 'auxilio_estudantil' | 'taxas_crea' | 'divergencia_calculo') => {
    setErrorMessage('');
    setIsSaved(false);
    if (scenario === 'divergencia_calculo') {
      setFile({ name: 'Processo_SEI_23060.002891_2026_NF_Servicos_TI_Divergencia.pdf', size: 1850300 } as File);
      setAuditResult(DEMO_DIVERGENCIA_CALCULO);
      setActiveDetailTab('calculadora_confronto');
      onAuditChange?.(DEMO_DIVERGENCIA_CALCULO);
      return;
    }
    setActiveDetailTab('visao_geral');
    if (scenario === 'taxas_crea') {
      setFile({ name: 'Processo_SEI_23060.001366_2026_Taxas_CREA_SE_ARTs.pdf', size: 2150400 } as File);
      setAuditResult(DEMO_TAXAS_CREA);
      onAuditChange?.(DEMO_TAXAS_CREA);
    } else if (scenario === 'auxilio_estudantil') {
      setFile({ name: 'Processo_SEI_23288.000650_2026_Auxilio_Estudantil_MNR.pdf', size: 1420500 } as File);
      setAuditResult({
        processo: '23288.000650/2026-29',
        numeroDoc: '2026NS009963',
        tipoDoc: 'NS - Nota de Sistema',
        naturezaProcesso: 'AUXILIO_ESTUDANTIL',
        favorecido: {
          nome: '17 Discentes do IFS Campus Lagarto (Lista de Credores PIX - 2026LX000635 / Banco do Brasil)',
          cnpjCpf: '00.000.000/0001-91 (Banco Central / BB)'
        },
        valores: {
          valorBruto: 21420.00,
          retencoes: 0.00,
          valorLiquido: 21420.00,
          detalheRetencoes: 'R$ 0,00 - Dispensa legal de retenções tributárias comerciais e IN RFB nº 1.234/2012 para Auxílio Financeiro Estudantil a pessoas físicas (Elemento 3.3.90.18)'
        },
        resultado: 'SEM OCORRÊNCIA',
        restricoesDetectadas: [],
        checklistAvaliado: [
          { 
            item: 'Documento Hábil de Liquidação (Lista de Credores / Dispensa de Nota Fiscal)', 
            status: 'CONFORME', 
            observacao: 'Liquidação instruída por Lista de Credores PIX (2026LX000635) e Nota de Lançamento de Sistema (2026NS009963). O Auxílio Estudantil (3.3.90.18) dispensa formalmente emissão de Nota Fiscal por configurar repasse a estudantes.' 
          },
          { 
            item: 'Autorização Formal de Pagamento pelo Ordenador de Despesas (Art. 64 Lei 4.320/64)', 
            status: 'CONFORME', 
            observacao: 'Autorização de Pagamento emitida pelo Ordenador de Despesas do IFS Campus Lagarto (Documento SEI nº 1062246).' 
          },
          { 
            item: 'Vinculação à Nota de Empenho Prévia e Célula Orçamentária Adequada', 
            status: 'CONFORME', 
            observacao: 'Empenho 2026NE000753 vinculado regularmente na natureza 33901801 (Auxílio Financeiro a Estudantes) e Ação Orçamentária 211V.' 
          },
          { 
            item: 'Comprovação da Elegibilidade e Aceite no Evento Acadêmico/Científico', 
            status: 'CONFORME', 
            observacao: 'Cartas de aceite dos projetos de robótica para a Mostra Nacional de Robótica (MNR 2026) e relação nominal com matrículas e chaves PIX.' 
          },
          { 
            item: 'Análise Criteriosa da Escrita da Observação no Documento Contábil (Macrofunção 020314)', 
            status: 'CONFORME', 
            observacao: 'Descrição contábil delimita o objeto, unidade, evento, datas e processo SEI. Ressalva-se apenas a gralha de digitação "MA CIDADE" (em vez de "NA CIDADE"), sem macular a validade.' 
          },
          { 
            item: 'Verificação de Retenções Tributárias na Fonte (IN RFB 1234/12)', 
            status: 'CONFORME', 
            observacao: 'Retenções R$ 0,00 - Não incidência de retenção tributária mercantil sobre auxílios financeiros concedidos a estudantes.' 
          }
        ],
        analiseDescricaoContabil: {
          textoObservacao: 'REGISTRO CONTÁBIL DA DESPESA COM AUXÍLIO FINANCEIRO EVENTUAL (CUSTEIO DE ALIMENTAÇÃO PARA OS DISCENTES), IFS CAMPUS LAGARTO/SE, QUE VÃO PARTICIPAR DA MOSTRA NACIONAL DE ROBÓTICA (MNR 2026), A SER REALIZADA MA CIDADE DE JOÃO PESSOA/PB, ENTRE OS DIAS 23 E 29/11/2026, E CONFORME DOCUMENTOS ANEXADOS AO PROCESSO Nº 23288.000650/2026-29.',
          qualidadeRedacao: 'Regular com Ressalvas',
          avaliacaoCriteriosa: 'A observação contábil constante na 2026NS009963 atende com elevado rigor aos padrões da Macrofunção SIAFI 020314: delimita o objeto com clareza (auxílio eventual de alimentação a discentes), indica a Unidade de origem (IFS Campus Lagarto/SE), o evento de destino (Mostra Nacional de Robótica - MNR 2026), a localidade (João Pessoa/PB), o intervalo de datas exato (23 a 29/11/2026) e vincula expressamente o processo administrativo SEI nº 23288.000650/2026-29.',
          elementosIdentificados: [
            'Objeto claro: Auxílio financeiro eventual para custeio de alimentação a discentes',
            'Unidade demandante: IFS Campus Lagarto/SE',
            'Evento acadêmico/científico: Mostra Nacional de Robótica (MNR 2026)',
            'Localidade geográfica e datas: João Pessoa/PB, entre 23 e 29/11/2026',
            'Processo SEI referenciado: 23288.000650/2026-29',
            'Célula orçamentária compatível: 33901801 e Empenho 2026NE000753'
          ],
          apontamentosOuGralhas: [
            'Identificada gralha tipográfica no texto original: "...A SER REALIZADA MA CIDADE DE JOÃO PESSOA/PB..." (o vocábulo correto é "NA CIDADE").',
            'Parecer sobre a gralha: Trata-se de erro formal/material de digitação perfeitamente sanável por simples leitura do contexto, não comprometendo a fidedignidade da liquidação e dispensando anulação do ato de gestão.'
          ]
        },
        documentosIdentificados: [
          'Nota de Lançamento de Sistema nº 2026NS009963 (Fl. 01/02)',
          'Lista de Credores PIX - SIAFI CONLX nº 2026LX000635 (Fl. 05)',
          'Autorização de Pagamento do Ordenador de Despesas nº 1062246 (Fl. 09)',
          'Nota de Empenho nº 2026NE000753 (Processo 23288.000150/2026-97)',
          'Cartas de Aceite dos Artigos e Trabalhos na MNR 2026 (Fl. 18 a 35)',
          'Relação Nominal dos Discentes Beneficiários e Contas PIX (Fl. 42)'
        ],
        evidenciasEncontradas: [
          {
            campo: "Valor Total do Auxílio Financeiro",
            valorOuConteudo: "R$ 21.420,00 (17 cotas de R$ 1.260,00 por discente)",
            documentoOrigem: "Lista de Credores PIX - 2026LX000635 e Nota de Lançamento 2026NS009963",
            categoria: "Valores",
            impactoNoParecer: "Confirmou a equivalência perfeita entre a soma das cotas individuais dos 17 discentes e o montante global liquidado."
          },
          {
            campo: "Retenções Tributárias (IN RFB 1.234/12)",
            valorOuConteudo: "R$ 0,00 (Não Incidência)",
            documentoOrigem: "Nota de Lançamento de Sistema nº 2026NS009963",
            categoria: "Valores",
            impactoNoParecer: "Correta aplicação da dispensa legal de retenções mercantis ou tributárias para auxílios de custeio alimentar a pessoas físicas."
          },
          {
            campo: "Período do Evento Acadêmico (MNR 2026)",
            valorOuConteudo: "23 a 29 de novembro de 2026",
            documentoOrigem: "Cartas de Aceite MNR 2026 e Campo OBSERVAÇÃO da 2026NS009963",
            categoria: "Datas",
            impactoNoParecer: "Evidenciou a perfeita sincronia cronológica entre a concessão do auxílio e a realização do evento científico em João Pessoa/PB."
          },
          {
            campo: "Data de Emissão da Nota de Lançamento",
            valorOuConteudo: "18/11/2026",
            documentoOrigem: "Nota de Lançamento de Sistema nº 2026NS009963",
            categoria: "Datas",
            impactoNoParecer: "Atestou antecedência regular do crédito orçamentário em relação à data de embarque dos discentes para a competição."
          },
          {
            campo: "Assinatura do Ordenador de Despesas do Campus Lagarto",
            valorOuConteudo: "Diretor Geral / Ordenador de Despesas do IFS Campus Lagarto",
            documentoOrigem: "Despacho Autorizativo de Pagamento nº 1062246 (Art. 64 da Lei 4.320/64)",
            categoria: "Assinaturas",
            impactoNoParecer: "Comprovou a indispensável autorização legal do ordenador, exigência do art. 64 da Lei 4.320/64."
          },
          {
            campo: "Comprovação de Elegibilidade e Aceite Científico",
            valorOuConteudo: "Projetos de Robótica homologados e cartas de aceite na Mostra Nacional de Robótica",
            documentoOrigem: "Documentos SEI anexos às Fls. 18 a 35",
            categoria: "Atestes e Certidões",
            impactoNoParecer: "Comprovou o mérito acadêmico e a legítima finalidade pública do repasse estudantil."
          },
          {
            campo: "Relação Nominal dos 17 Discentes e Chaves PIX",
            valorOuConteudo: "17 Estudantes com matrícula ativa, CPF e contas bancárias individuais cadastradas",
            documentoOrigem: "Lista SIAFI CONLX nº 2026LX000635 e Relação SEI Fl. 42",
            categoria: "Identificação / Favorecido",
            impactoNoParecer: "Garantiram a correta individualização dos beneficiários e a segurança da transferência via Banco Central / BB."
          },
          {
            campo: "Célula Orçamentária e Empenho Vinculado",
            valorOuConteudo: "Natureza 33901801 (Auxílio Financeiro a Estudantes) - Empenho 2026NE000753",
            documentoOrigem: "Nota de Empenho 2026NE000753 e Registro Orçamentário",
            categoria: "Classificação Orçamentária",
            impactoNoParecer: "Validou a correta apropriação no elemento de despesa 339018, dispensando nota fiscal por não haver relação comercial."
          }
        ],
        parecerConclusivo: 'Processo regularmente instruído. Conforme os arts. 62 a 64 da Lei nº 4.320/64 e a Macrofunção SIAFI 020314, a liquidação da despesa de auxílio financeiro estudantil encontra-se plenamente comprovada pela Lista de Credores PIX (2026LX000635), Nota de Lançamento de Sistema (2026NS009963) e Despacho Autorizativo do Ordenador de Despesas. Dispensa-se legalmente a emissão de nota fiscal mercantil e retenções tributárias da IN RFB 1.234/12. A escrita na observação contábil atende aos requisitos de clareza e fidedignidade, com ressalva meramente formal quanto à gralha tipográfica ("MA CIDADE" em vez de "NA CIDADE"), estando o processo apto para registro de conformidade SEM OCORRÊNCIA.',
        sugestaoConformista: 'Registrar a Conformidade de Gestão SEM OCORRÊNCIA no SIAFI e liberar a remessa bancária da lista de credores.',
        confiancaAnalise: 'Motor Especialista Normativo IFS (Auditado)'
      });
    } else if (scenario === 'com_restricao') {
      setFile({ name: 'Processo_SEI_23060.001452_2026_Limpeza_Campus.pdf', size: 1845200 } as File);
      setAuditResult({
        processo: '23060.001452/2026-89',
        numeroDoc: 'NF-e 10.458',
        tipoDoc: 'DD - Documento de Despesa',
        favorecido: {
          nome: 'SERVIÇOS DE LIMPEZA E CONSERVAÇÃO SERGIPE LTDA',
          cnpjCpf: '14.882.910/0001-44'
        },
        valores: {
          valorBruto: 45200.00,
          retencoes: 4271.40,
          valorLiquido: 40928.60,
          detalheRetencoes: 'IRRF (4.8%) + CSLL (1.0%) + COFINS (3.0%) + PIS (0.65%) = 9.45% conforme IN RFB 1234/12'
        },
        resultado: 'COM OCORRÊNCIA',
        restricoesDetectadas: [
          {
            codigo: '004 - Ausência de Ateste/Recebimento na Nota Fiscal/Fatura',
            titulo: 'Ateste Definitivo Inexistente na Nota Fiscal',
            descricao: 'A NF-e 10.458 não possui a assinatura digital ou carimbo formal do fiscal técnico/setor competente atestando a execução integral dos serviços de limpeza referentes ao mês.',
            severidade: 'Impeditiva',
            trechoEvidencia: 'Folha 18 do processo: Campo de recebimento da Nota Fiscal está em branco, sem assinatura eletrônica do SEI vinculada ao documento.',
            acaoRecomendada: 'Encaminhar o processo ao fiscal titular do contrato para emissão do Termo de Recebimento Definitivo e ateste formal no SEI antes da liquidação.'
          },
          {
            codigo: '006 - Ausência de Regularidade Fiscal/Trabalhista (SICAF/CND/FGTS)',
            titulo: 'Certidão de Regularidade do FGTS (CRF) Vencida',
            descricao: 'A Certidão de Regularidade do FGTS apresentada no processo expirou em 28/02/2026, sendo anterior à data de liquidação da despesa.',
            severidade: 'Grave',
            trechoEvidencia: 'Folha 32 do processo: Certificado de Regularidade do FGTS - CRF com validade até 28/02/2026.',
            acaoRecomendada: 'Emitir nova certidão atualizada no portal da Caixa Econômica Federal e anexar aos autos para comprovação da regularidade na data do pagamento.'
          }
        ],
        checklistAvaliado: [
          { item: 'Nota de Empenho prévia vinculada e com saldo suficiente', status: 'CONFORME', observacao: 'NE 2026NE000412 com saldo disponível de R$ 90.400,00' },
          { item: 'Ateste formal de execução do serviço ou recebimento do material', status: 'NÃO CONFORME', observacao: 'NF sem assinatura ou ateste do fiscal' },
          { item: 'Cálculo de retenções federais nos termos da IN RFB 1234/2012', status: 'CONFORME', observacao: 'Retenção de 9,45% (R$ 4.271,40) calculada corretamente' },
          { item: 'Certidões de regularidade fiscal e trabalhista vigentes', status: 'NÃO CONFORME', observacao: 'CRF FGTS com validade vencida' },
          { item: 'Despacho autorizativo do Ordenador de Despesa', status: 'CONFORME', observacao: 'Despacho SEI nº 459128 assinado pelo Diretor-Geral' }
        ],
        documentosIdentificados: [
          'Nota de Empenho nº 2026NE000412 (Fl. 04)',
          'Nota Fiscal Eletrônica nº 10.458 (Fl. 18)',
          'Relatório Mensal de Frequência de Postos de Trabalho (Fl. 22)',
          'Consulta SICAF / Certidões Tributárias (Fl. 30 a 34)',
          'Despacho Autorizativo de Pagamento (Fl. 36)'
        ],
        evidenciasEncontradas: [
          {
            campo: "Valor Bruto Faturado na NF-e",
            valorOuConteudo: "R$ 45.200,00",
            documentoOrigem: "NF-e nº 10.458 (Fl. 18)",
            categoria: "Valores",
            impactoNoParecer: "Valor cobrado em conformidade com o saldo da fatura da prestação de serviços de limpeza."
          },
          {
            campo: "Retenções Tributárias Federais (IN RFB 1.234/12)",
            valorOuConteudo: "R$ 4.271,40 (Alíquota 9,45% com INSS 11%)",
            documentoOrigem: "NF-e nº 10.458 e Guia de Retenção (Fl. 19)",
            categoria: "Valores",
            impactoNoParecer: "Cálculo exato das retenções fiscais obrigatórias de mão de obra exclusiva."
          },
          {
            campo: "Data de Emissão da Nota Fiscal",
            valorOuConteudo: "05/03/2026",
            documentoOrigem: "NF-e nº 10.458 (Fl. 18)",
            categoria: "Datas",
            impactoNoParecer: "Documento emitido na vigência do contrato administrativo."
          },
          {
            campo: "Ateste de Prestação de Serviços no Corpo da NF-e",
            valorOuConteudo: "Ausente / Campo em branco (Sem carimbo ou assinatura)",
            documentoOrigem: "NF-e nº 10.458 (Verso e anverso)",
            categoria: "Assinaturas",
            impactoNoParecer: "Motivou a Restrição SIAFI 004: Ausência de ateste formal da execução dos serviços pelo fiscal de contrato (Art. 63, § 2º, III da Lei 4.320/64)."
          },
          {
            campo: "Certidão de Regularidade do FGTS (CRF)",
            valorOuConteudo: "Vencida em 28/02/2026",
            documentoOrigem: "Consulta Caixa / SICAF (Fl. 32)",
            categoria: "Atestes e Certidões",
            impactoNoParecer: "Motivou a Restrição SIAFI 006: Impedimento de liquidação regular por inadimplência trabalhista/FGTS na data do pagamento."
          },
          {
            campo: "Assinatura do Ordenador de Despesas",
            valorOuConteudo: "Despacho do Diretor Geral de Administração (SEI 1022340)",
            documentoOrigem: "Despacho Autorizativo (Fl. 36)",
            categoria: "Assinaturas",
            impactoNoParecer: "Autorização de despesa presente nos autos, porém condicionada ao saneamento das certidões e ateste."
          }
        ],
        parecerConclusivo: 'Trata-se de processo de pagamento referente à prestação de serviços continuados de limpeza e conservação predial. Em exame preliminar de conformidade de registro de gestão fundamentado na Macrofunção SIAFI 020314 e Portaria IFS nº 1.633/2026, identificaram-se óbices que impedem a conformidade regular sem saneamento prévio: ausência de ateste formal na NF-e e certidão CRF vencida. Recomenda-se registrar CONFORMIDADE COM OCORRÊNCIA no SIAFI e notificar o setor demandante para juntada dos documentos pendentes.',
        sugestaoConformista: 'Registrar no SIAFI a Conformidade Diária COM OCORRÊNCIA (Restrições 004 e 006) e diligenciar o gestor do contrato.',
        confiancaAnalise: 'Alta (98%)'
      });
    } else {
      setFile({ name: 'Processo_SEI_23060.000980_2026_Material_Didatico.pdf', size: 1240100 } as File);
      setAuditResult({
        processo: '23060.000980/2026-12',
        numeroDoc: 'DANFE 4.190',
        tipoDoc: 'DD - Documento de Despesa',
        favorecido: {
          nome: 'EDITORA E DISTRIBUIDORA DE LIVROS EDUCATIVOS DO BRASIL S/A',
          cnpjCpf: '02.441.800/0001-98'
        },
        valores: {
          valorBruto: 18750.00,
          retencoes: 1096.88,
          valorLiquido: 17653.12,
          detalheRetencoes: 'Alíquota 5.85% (IR 1.2% + CSLL 1.0% + COFINS 3.0% + PIS 0.65%) - IN RFB 1234/12'
        },
        resultado: 'SEM OCORRÊNCIA',
        restricoesDetectadas: [],
        checklistAvaliado: [
          { item: 'Nota de Empenho prévia vinculada e com saldo suficiente', status: 'CONFORME', observacao: 'Empenho 2026NE000188 regular e compatível' },
          { item: 'Ateste formal de execução do serviço ou recebimento do material', status: 'CONFORME', observacao: 'Termo de Recebimento Definitivo assinado pela comissão de almoxarifado' },
          { item: 'Cálculo de retenções federais nos termos da IN RFB 1234/2012', status: 'CONFORME', observacao: 'Retenções e destaque na NF perfeitamente exatos' },
          { item: 'Certidões de regularidade fiscal e trabalhista vigentes', status: 'CONFORME', observacao: 'SICAF nível I a VI 100% válido na data do registro' },
          { item: 'Despacho autorizativo do Ordenador de Despesa', status: 'CONFORME', observacao: 'Autorização expressa conforme competência delegada' }
        ],
        documentosIdentificados: [
          'Nota de Empenho 2026NE000188 (Fl. 02)',
          'DANFE nº 4.190 (Fl. 08)',
          'Termo de Recebimento Definitivo de Materiais (Fl. 11)',
          'Comprovante de Regularidade no SICAF (Fl. 14)',
          'Despacho de Liquidação da Despesa (Fl. 16)'
        ],
        evidenciasEncontradas: [
          {
            campo: "Valor Total da Fatura / Livros Didáticos",
            valorOuConteudo: "R$ 18.750,00",
            documentoOrigem: "DANFE nº 4.190 (Fl. 08) e Empenho 2026NE000188",
            categoria: "Valores",
            impactoNoParecer: "Conferência aritmética exata dos preços unitários dos livros licitados com a dotação empenhada."
          },
          {
            campo: "Retenções Tributárias Federais (IN RFB 1.234/12)",
            valorOuConteudo: "R$ 1.096,88 (Alíquota 5,85% de bens)",
            documentoOrigem: "DANFE nº 4.190 e Nota de Lançamento de Sistema",
            categoria: "Valores",
            impactoNoParecer: "Destaque correto no corpo da NF e recolhimento integral aos cofres da União via SIAFI."
          },
          {
            campo: "Data de Recebimento Definitivo no Almoxarifado",
            valorOuConteudo: "12/03/2026",
            documentoOrigem: "Termo de Recebimento Definitivo de Bens (Fl. 11)",
            categoria: "Datas",
            impactoNoParecer: "Comprovou a entrega física no prazo contratual com inspeção qualitativa da comissão."
          },
          {
            campo: "Assinaturas da Comissão de Recebimento de Materiais",
            valorOuConteudo: "3 Servidores Efetivos designados pela Portaria IFS nº 412/2025",
            documentoOrigem: "Termo de Recebimento Definitivo (Fl. 11)",
            categoria: "Assinaturas",
            impactoNoParecer: "Ateste formal incontestável da entrega dos materiais, cumprindo o art. 63 da Lei nº 4.320/64."
          },
          {
            campo: "Certidão de Regularidade Fiscal SICAF Níveis I a VI",
            valorOuConteudo: "Válida até 30/04/2026",
            documentoOrigem: "Consulta SICAF / CNDs Federais e Trabalhistas (Fl. 14)",
            categoria: "Atestes e Certidões",
            impactoNoParecer: "Atestou a plena capacidade e regularidade fiscal do fornecedor perante o erário federal."
          }
        ],
        parecerConclusivo: 'Examinada a documentação que instrui o presente processo, constata-se a integral regularidade fiscal, orçamentária e financeira dos atos praticados. A liquidação encontra-se amparada em empenho prévio idôneo, a entrega dos materiais foi formalmente atestada pela comissão competente, os tributos foram apurados nos exatos termos da IN RFB nº 1.234/2012 e o fornecedor encontra-se com situação regular no SICAF. Processo em estrita consonância com a Macrofunção SIAFI 020314 e o Manual de Conformidade de Registro de Gestão do IFS.',
        sugestaoConformista: 'Registrar a Conformidade Diária SEM OCORRÊNCIA no SIAFI.',
        confiancaAnalise: 'Alta (99%)'
      });
    }
  };

  const handleApplyConfrontoRestriction = (restriction: ProcessRestriction) => {
    if (!auditResult) return;
    
    const existingIndex = auditResult.restricoesDetectadas.findIndex(r => r.codigo.startsWith('005'));
    let updatedRestricoes = [...auditResult.restricoesDetectadas];
    if (existingIndex >= 0) {
      updatedRestricoes[existingIndex] = restriction;
    } else {
      updatedRestricoes.push(restriction);
    }

    const updatedChecklist = [...auditResult.checklistAvaliado];
    const checkIdx = updatedChecklist.findIndex(c => 
      c.item.toLowerCase().includes('retenções') || 
      c.item.toLowerCase().includes('1234') || 
      c.item.toLowerCase().includes('cálculo')
    );
    if (checkIdx >= 0) {
      updatedChecklist[checkIdx] = {
        ...updatedChecklist[checkIdx],
        status: 'NÃO CONFORME',
        observacao: `Divergência apurada no confronto legal (IN RFB 1.234/12): ${restriction.titulo}. ${restriction.descricao}`
      };
    } else {
      updatedChecklist.push({
        item: 'Cálculo e Retenções Tributárias (IN RFB nº 1.234/2012)',
        status: 'NÃO CONFORME',
        observacao: `Divergência apurada: ${restriction.titulo}. Infração ao Art. 2º da IN RFB 1.234/12.`
      });
    }

    let updatedParecer = auditResult.parecerConclusivo;
    if (!updatedParecer.includes('Restrição 005')) {
      updatedParecer += ` [RIGOR NORMATIVO APLICADO]: Identificada divergência em retenções tributárias na fonte conforme a IN RFB nº 1.234/2012 e Lei nº 4.320/64. Aplicada formalmente a Restrição 005 (${restriction.titulo}). Parecer conclusivo alterado para COM OCORRÊNCIA.`;
    }

    const updatedAudit: ProcessAuditResult = {
      ...auditResult,
      resultado: 'COM OCORRÊNCIA',
      restricoesDetectadas: updatedRestricoes,
      checklistAvaliado: updatedChecklist,
      parecerConclusivo: updatedParecer,
      sugestaoConformista: 'Registrar no SIAFI a Conformidade dos Registros de Gestão COM OCORRÊNCIA (Restrição 005 - Impeditiva) até que a Unidade Gestora efetue a retenção fiscal devida.'
    };

    setAuditResult(updatedAudit);
    onAuditChange?.(updatedAudit);
  };

  const copyParecer = () => {
    if (!auditResult?.parecerConclusivo) return;
    navigator.clipboard.writeText(auditResult.parecerConclusivo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTransferToForm = () => {
    if (!auditResult) return;
    onImportToForm({
      processo: auditResult.processo,
      numeroDoc: auditResult.numeroDoc,
      tipoDoc: auditResult.tipoDoc,
      resultado: auditResult.resultado,
      restricoes: auditResult.restricoesDetectadas.map(r => r.codigo),
      observacao: auditResult.parecerConclusivo
    });
  };

  const handleDirectSave = async () => {
    if (!auditResult) return;
    const checklistRecord: Record<string, boolean> = {};
    auditResult.checklistAvaliado.forEach((item, index) => {
      checklistRecord[`ai_check_${index}`] = item.status === 'CONFORME';
    });

    await onSaveToHistory({
      conformista: conformista || 'Conformista Responsável',
      processo: auditResult.processo,
      numeroDoc: auditResult.numeroDoc,
      tipoDoc: auditResult.tipoDoc,
      resultado: auditResult.resultado,
      restricoes: auditResult.restricoesDetectadas.map(r => r.codigo),
      observacao: auditResult.parecerConclusivo,
      checklist: checklistRecord
    });
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Normative Framing */}
      <div className="bg-[#141414] text-white p-6 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30 rounded-full text-[9px] font-black tracking-widest uppercase">
                Auditoria Automatizada • SIAFI 020314
              </span>
              <span className="text-[10px] text-white/50">Portaria IFS nº 1.633/2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-[#00FF00]" />
              Análise de Processos em PDF com Detecção de Restrições
            </h2>
            <p className="text-xs text-white/70 max-w-3xl mt-1 leading-relaxed">
              Anexe o processo completo em formato PDF (SEI / Empenho / Nota Fiscal / Comprovantes). A IA fará a varredura das fontes normativas (Macrofunção 020314, IN RFB 1.234/2012 e Lei 4.320/64) e sinalizará imediatamente se há ou não restrições para registro.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
            <button
              type="button"
              onClick={() => loadDemoCase('divergencia_calculo')}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-sm"
              title="Testar Rigor Normativo: Divergência de Cálculo Tributário e Retenção a Menor na NF (Restrição 005)"
            >
              <Calculator className="w-3.5 h-3.5 text-rose-400" /> Exemplo Divergência de Cálculo (IN 1234/12)
            </button>
            <button
              type="button"
              onClick={() => loadDemoCase('taxas_crea')}
              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-sm"
              title="Taxas do CREA-SE / ARTs (Dispensa de NF, Boletos BB PIX e Exame dos Documentos SIAFI)"
            >
              <Landmark className="w-3.5 h-3.5 text-blue-400" /> Exemplo Taxas CREA-SE
            </button>
            <button
              type="button"
              onClick={() => loadDemoCase('auxilio_estudantil')}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-sm"
              title="Auxílio Estudantil MNR (Dispensa Legal de NF e Análise Contábil)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Exemplo Auxílio Estudantil
            </button>
            <button
              type="button"
              onClick={() => loadDemoCase('com_restricao')}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Exemplo com Restrição
            </button>
            <button
              type="button"
              onClick={() => loadDemoCase('sem_restricao')}
              className="px-3 py-1.5 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30 text-[#00FF00] rounded-xl text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Exemplo sem Restrição
            </button>
          </div>
        </div>

        {/* Subtle decorative background blur */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#00FF00]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Upload and Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upload Box & Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-4 transition-colors">
            <h3 className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-black dark:text-white" />
              Carregar Processo (PDF)
            </h3>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-[#00FF00] bg-[#00FF00]/5 scale-[0.99]' 
                  : file 
                  ? 'border-black/20 dark:border-white/20 bg-gray-50 dark:bg-[#202326]' 
                  : 'border-black/10 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30 hover:bg-gray-50/50 dark:hover:bg-white/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {file ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-black dark:bg-[#0C0D0E] text-[#00FF00] rounded-2xl flex items-center justify-center mx-auto shadow-md border border-white/10">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xs text-black dark:text-white truncate max-w-xs mx-auto">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-black/50 dark:text-white/50 font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Pronto para auditoria
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFileBase64('');
                      setAuditResult(null);
                    }}
                    className="inline-flex items-center gap-1 text-[9px] font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-1 uppercase tracking-wider"
                  >
                    <X className="w-3 h-3" /> Remover arquivo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 text-black/40 dark:text-white/40 rounded-2xl flex items-center justify-center mx-auto">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-black/80 dark:text-white/80">
                    Arraste o PDF do processo aqui ou clique para selecionar
                  </div>
                  <p className="text-[10px] text-black/40 dark:text-white/40 leading-relaxed max-w-xs mx-auto">
                    Suporta processos SEI, notas fiscais, termos de ateste e liquidações em arquivo PDF.
                  </p>
                </div>
              )}
            </div>

            {/* Optional Settings */}
            <div className="space-y-3 pt-2 border-t border-black/5 dark:border-white/10">
              <div>
                <label className="text-[10px] uppercase font-black text-black/40 dark:text-white/40 block mb-1 tracking-wider">
                  Conformista Responsável
                </label>
                <input
                  type="text"
                  value={conformista}
                  onChange={(e) => setConformista(e.target.value)}
                  placeholder="Nome do Conformista de Registro"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs font-medium text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-black/40 dark:text-white/40 block mb-1 tracking-wider">
                  Tipo de Documento Esperado
                </label>
                <select
                  value={docTypeHint}
                  onChange={(e) => setDocTypeHint(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#202326] border border-black/10 dark:border-white/10 rounded-xl text-xs font-medium text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50"
                >
                  <option value="auto" className="dark:bg-[#16181A] dark:text-white">Auto-detectar pelo conteúdo do PDF</option>
                  <option value="DD - Documento de Despesa" className="dark:bg-[#16181A] dark:text-white">DD - Documento de Despesa</option>
                  <option value="NP - Nota de Pagamento" className="dark:bg-[#16181A] dark:text-white">NP - Nota de Pagamento</option>
                  <option value="NE - Nota de Empenho" className="dark:bg-[#16181A] dark:text-white">NE - Nota de Empenho</option>
                  <option value="RP - Restos a Pagar" className="dark:bg-[#16181A] dark:text-white">RP - Restos a Pagar</option>
                  <option value="OB - Ordem Bancária" className="dark:bg-[#16181A] dark:text-white">OB - Ordem Bancária</option>
                  <option value="DARF - Documento de Arrecadação" className="dark:bg-[#16181A] dark:text-white">DARF - Documento de Arrecadação</option>
                  <option value="NS - Nota de Sistema" className="dark:bg-[#16181A] dark:text-white">NS - Nota de Sistema</option>
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-800 dark:text-red-300 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-snug font-medium">{errorMessage}</div>
                </div>
                <div className="pt-2 border-t border-red-200/60 dark:border-red-900/50 flex flex-wrap gap-1.5">
                  {fileBase64 && (
                    <button
                      type="button"
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold tracking-wide transition-all inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Tentar novamente
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => loadDemoCase('auxilio_estudantil')}
                    className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-[10px] font-bold tracking-wide transition-all inline-flex items-center gap-1"
                  >
                    <GraduationCap className="w-3 h-3" /> Auxílio Estudantil (Sem NF)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemoCase('com_restricao')}
                    className="px-2.5 py-1 bg-white dark:bg-[#202326] hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-300 dark:border-red-800/60 text-red-700 dark:text-red-300 rounded-lg text-[10px] font-bold tracking-wide transition-all"
                  >
                    Exemplo com restrição
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemoCase('sem_restricao')}
                    className="px-2.5 py-1 bg-white dark:bg-[#202326] hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-300 dark:border-red-800/60 text-red-700 dark:text-red-300 rounded-lg text-[10px] font-bold tracking-wide transition-all"
                  >
                    Exemplo regular
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Preloads (available always) */}
            <div className="p-3 bg-gray-50 dark:bg-[#1a1c1e] rounded-xl border border-black/5 dark:border-white/10 space-y-2">
              <span className="text-[9px] uppercase font-black text-black/50 dark:text-white/50 tracking-widest block">
                Exemplos de Simulação Normativa:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => loadDemoCase('taxas_crea')}
                  className="px-2 py-1.5 bg-white dark:bg-[#202326] hover:border-blue-500 border border-black/10 dark:border-white/10 text-blue-700 dark:text-blue-300 rounded-lg text-[10px] font-bold transition-all text-center truncate flex items-center justify-center gap-1"
                  title="Taxas CREA-SE (ARTs / Boletos BB / Parecer e Docs SIAFI)"
                >
                  <Landmark className="w-3 h-3 shrink-0 text-blue-600 dark:text-blue-400" /> Taxas CREA-SE
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCase('auxilio_estudantil')}
                  className="px-2 py-1.5 bg-white dark:bg-[#202326] hover:border-emerald-500 border border-black/10 dark:border-white/10 text-emerald-700 dark:text-emerald-300 rounded-lg text-[10px] font-bold transition-all text-center truncate flex items-center justify-center gap-1"
                  title="Auxílio Estudantil MNR (Dispensa Legal de NF e Análise Contábil)"
                >
                  <GraduationCap className="w-3 h-3 shrink-0 text-emerald-600 dark:text-emerald-400" /> Auxílio Estudantil
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCase('com_restricao')}
                  className="px-2 py-1.5 bg-white dark:bg-[#202326] hover:border-red-500 border border-black/10 dark:border-white/10 text-red-700 dark:text-red-300 rounded-lg text-[10px] font-bold transition-all text-center truncate flex items-center justify-center gap-1"
                  title="Serviço Comercial com Restrições (Falta de Ateste e CND Vencida)"
                >
                  <AlertTriangle className="w-3 h-3 shrink-0 text-red-600 dark:text-red-400" /> Com Ocorrência
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCase('sem_restricao')}
                  className="px-2 py-1.5 bg-white dark:bg-[#202326] hover:border-green-500 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-lg text-[10px] font-bold transition-all text-center truncate flex items-center justify-center gap-1"
                  title="Compra de Material Didático Regular"
                >
                  <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-600 dark:text-[#00FF00]" /> Sem Ocorrência
                </button>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={runAnalysis}
              disabled={isAnalyzing || !fileBase64}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                isAnalyzing || !fileBase64
                  ? 'bg-gray-200 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed shadow-none'
                  : 'bg-black dark:bg-[#00FF00] text-[#00FF00] dark:text-black hover:bg-neutral-800 dark:hover:bg-[#00DD00] active:scale-[0.98]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00FF00] dark:text-black" />
                  Auditando Processo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analisar Processo com IA
                </>
              )}
            </button>

            {isAnalyzing && (
              <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 text-center space-y-1.5 animate-pulse">
                <span className="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-widest block">
                  Auditoria Normativa em Andamento
                </span>
                <p className="text-xs text-black/80 dark:text-white/80 font-medium">
                  {analysisStep}
                </p>
              </div>
            )}
          </div>

          {/* Guidelines Box */}
          <div className="bg-white dark:bg-[#16181A] p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-2 text-xs transition-colors">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-black dark:text-white" /> Critérios de Auditoria Automática
            </h4>
            <ul className="space-y-1.5 text-[11px] text-black/70 dark:text-white/70 list-disc pl-4 leading-relaxed">
              <li><strong>Natureza de Despesa:</strong> Distinção automática entre Aquisição/Serviço (exige NF e SICAF) e Auxílios/Bolsas Estudantis (dispensa formal de NF conforme Lei 4.320/64).</li>
              <li><strong>Rigor Contábil:</strong> Auditoria minuciosa da escrita no campo OBSERVAÇÃO de NS/NL/OB conforme a Macrofunção SIAFI 020314.</li>
              <li><strong>Tributos:</strong> Exatidão de retenções da IN RFB nº 1.234/2012 e imunidade tributária de repasses estudantis.</li>
            </ul>
          </div>
        </div>

        {/* Right: Results / Detailed Audit Report */}
        <div className="lg:col-span-7 space-y-6">
          {!auditResult ? (
            <div className="bg-white dark:bg-[#16181A] p-12 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 text-center space-y-4 transition-colors">
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 text-black/30 dark:text-white/30 rounded-3xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-black/80 dark:text-white/80 uppercase tracking-wide">
                  Nenhum processo analisado ainda
                </h3>
                <p className="text-xs text-black/50 dark:text-white/50 max-w-md mx-auto leading-relaxed">
                  Carregue o arquivo PDF do processo ao lado e clique em <strong>"Analisar Processo com IA"</strong> ou selecione um caso de teste rápido abaixo:
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={() => loadDemoCase('auxilio_estudantil')}
                  className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" /> Auxílio Estudantil MNR (Sem NF)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCase('com_restricao')}
                  className="px-3 py-2 bg-white dark:bg-[#202326] hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-300 dark:border-red-800/60 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" /> Serviços com Restrições
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCase('sem_restricao')}
                  className="px-3 py-2 bg-white dark:bg-[#202326] hover:bg-gray-100 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" /> Compra Regular
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* CONTINGENCY MODE ALERT BANNER */}
              {isContingencyMode && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl flex items-start gap-3.5 text-amber-900 dark:text-amber-200 shadow-sm">
                  <div className="p-2 bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-xl shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-black text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
                      <span>Modo de Contingência Normativa Ativado</span>
                      <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900/80 rounded-full text-[9px] font-bold">
                        Alta Demanda IA 503
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-800/90 dark:text-amber-200/90">
                      Os servidores de IA do Google enfrentaram alta demanda momentânea. A auditoria deste processo foi processada com total rigor analítico pelo <strong>Motor Especialista de Regras Normativas do IFS</strong> (Leis nº 4.320/64 e 14.133/21, IN RFB nº 1.234/12 e Macrofunção SIAFI 020314).
                    </p>
                  </div>
                </div>
              )}

              {/* PRIMARY SIGNAL BANNER (SINALIZADOR DE RESTRIÇÃO) */}
              <div className={`p-6 rounded-2xl border shadow-lg transition-all ${
                auditResult.resultado === 'SEM OCORRÊNCIA'
                  ? 'bg-black text-white border-black dark:border-white/10'
                  : 'bg-amber-500 text-black border-amber-600'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${
                      auditResult.resultado === 'SEM OCORRÊNCIA'
                        ? 'bg-[#00FF00]/15 text-[#00FF00]'
                        : 'bg-black text-amber-400'
                    }`}>
                      {auditResult.resultado === 'SEM OCORRÊNCIA' ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <AlertTriangle className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          auditResult.resultado === 'SEM OCORRÊNCIA'
                            ? 'bg-[#00FF00] text-black'
                            : 'bg-black text-[#00FF00]'
                        }`}>
                          Resultado da Auditoria
                        </span>
                        {auditResult.confiancaAnalise && (
                          <span className={`text-[10px] font-bold ${
                            auditResult.resultado === 'SEM OCORRÊNCIA' ? 'text-[#00FF00]' : 'text-black/80'
                          }`}>
                            Confiabilidade: {auditResult.confiancaAnalise}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">
                        {auditResult.resultado}
                      </h3>
                      <p className={`text-xs mt-1 leading-relaxed font-medium ${
                        auditResult.resultado === 'SEM OCORRÊNCIA' ? 'text-white/80' : 'text-black/90'
                      }`}>
                        {auditResult.resultado === 'SEM OCORRÊNCIA'
                          ? 'Processo atende aos preceitos legais e documentais da Macrofunção SIAFI 020314. Apto para registro regular de conformidade de gestão.'
                          : `Foram identificadas ${auditResult.restricoesDetectadas.length} restrição(ões) técnica(s) ou documental(is). O processo necessita de saneamento prévio.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RESTRICTIONS SINALIZADAS (Highlight if COM OCORRÊNCIA) */}
              {auditResult.resultado === 'COM OCORRÊNCIA' && auditResult.restricoesDetectadas.length > 0 && (
                <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border-2 border-red-200 dark:border-red-900/60 space-y-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-red-700 dark:text-red-400">
                        Restrições Sinalizadas ({auditResult.restricoesDetectadas.length})
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/40">
                      Requer Saneamento
                    </span>
                  </div>

                  <div className="space-y-3">
                    {auditResult.restricoesDetectadas.map((restricao: ProcessRestriction, idx: number) => (
                      <div key={idx} className="p-4 bg-red-50/50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 rounded-xl space-y-2">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-black text-[#00FF00] rounded text-[9px] font-black font-mono">
                              {restricao.codigo.split(' - ')[0]}
                            </span>
                            <span className="text-xs font-bold text-black dark:text-white">
                              {restricao.titulo || restricao.codigo}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            restricao.severidade === 'Impeditiva' 
                              ? 'bg-red-600 text-white'
                              : restricao.severidade === 'Grave'
                              ? 'bg-orange-500 text-white'
                              : 'bg-yellow-500 text-black'
                          }`}>
                            {restricao.severidade}
                          </span>
                        </div>

                        <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed font-sans">
                          {restricao.descricao}
                        </p>

                        {restricao.trechoEvidencia && (
                          <div className="p-2.5 bg-white dark:bg-[#1c1f22] border border-red-100 dark:border-red-900/40 rounded-lg text-[11px] text-black/70 dark:text-white/70 space-y-0.5 font-mono">
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-800 dark:text-red-400 block">
                              Evidência encontrada no PDF:
                            </span>
                            <div>{restricao.trechoEvidencia}</div>
                          </div>
                        )}

                        {restricao.acaoRecomendada && (
                          <div className="pt-1 flex items-start gap-1.5 text-[11px] text-green-950 dark:text-emerald-300 font-medium">
                            <ArrowRight className="w-3.5 h-3.5 text-green-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span><strong>Ação Corretiva:</strong> {restricao.acaoRecomendada}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DETAIL TABS NAVIGATION */}
              <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-[#181a1d] rounded-2xl border border-black/10 dark:border-white/10 overflow-x-auto shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('visao_geral')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'visao_geral'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Visão Geral
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('calculadora_confronto')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'calculadora_confronto'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Calculadora & Confronto Legal
                  {auditResult.confrontoCalculadora?.statusConfronto === 'DIVERGENCIA_DETECTADA' || auditResult.restricoesDetectadas.some(r => r.codigo.startsWith('005')) ? (
                    <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-red-600 text-white font-mono font-black animate-pulse">
                      DIVERGÊNCIA
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-emerald-600 text-white font-mono font-black">
                      IN 1234/12
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('evidencias_encontradas')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'evidencias_encontradas'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Evidências Encontradas
                  {auditResult.evidenciasEncontradas && auditResult.evidenciasEncontradas.length > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-600 text-white font-mono font-black">
                      {auditResult.evidenciasEncontradas.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('documentos_siafi')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'documentos_siafi'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5 text-blue-500" /> Documentos SIAFI
                  {auditResult.documentosSiafiAnalisados && auditResult.documentosSiafiAnalisados.length > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-600 text-white font-mono font-black">
                      {auditResult.documentosSiafiAnalisados.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('documentos_sei')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'documentos_sei'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-neutral-500" /> Documentos SEI
                  {((auditResult.documentosProcessuaisDetalhados?.length || 0) > 0 || (auditResult.documentosIdentificados?.length || 0) > 0) && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-neutral-600 text-white font-mono font-black">
                      {auditResult.documentosProcessuaisDetalhados?.length || auditResult.documentosIdentificados?.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('parecer_tecnico')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'parecer_tecnico'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-500" /> Parecer do Conformista
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('escrita_contabil')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'escrita_contabil'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 text-amber-500" /> Escrita Contábil
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('checklist')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeDetailTab === 'checklist'
                      ? 'bg-black text-[#00FF00] dark:bg-[#00FF00] dark:text-black shadow-sm'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Checklist
                </button>
              </div>

              {/* TAB 1: VISÃO GERAL */}
              {activeDetailTab === 'visao_geral' && (
                <div className="space-y-4">
                  {/* METADATA SUMMARY CARDS */}
              <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-4 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/60 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-black dark:text-white" />
                    Dados Extraídos do Processo
                  </h4>
                  {auditResult.naturezaProcesso && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                      auditResult.naturezaProcesso === 'AUXILIO_ESTUDANTIL'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                        : auditResult.naturezaProcesso === 'TAXAS_E_CONTRIBUICOES'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300'
                        : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70'
                    }`}>
                      {auditResult.naturezaProcesso === 'AUXILIO_ESTUDANTIL' && <GraduationCap className="w-3 h-3" />}
                      {auditResult.naturezaProcesso === 'TAXAS_E_CONTRIBUICOES' && <Landmark className="w-3 h-3" />}
                      Natureza: {auditResult.naturezaProcesso.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                {/* Specific Legal Dispensation Banner for Auxílio Estudantil */}
                {auditResult.naturezaProcesso === 'AUXILIO_ESTUDANTIL' && (
                  <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-800/60 rounded-xl flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                    <GraduationCap className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-black uppercase tracking-wider text-[10px] text-emerald-800 dark:text-emerald-300">
                        Dispensa Legal de Nota Fiscal Mercantil (Arts. 62 a 64 da Lei nº 4.320/64)
                      </div>
                      <p className="text-[11px] leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
                        O processo constitui repasse pecuniário direto a discentes (elemento 3.3.90.18 - Auxílio Financeiro a Estudantes). <strong>Não se aplica a exigência de Nota Fiscal (DANFE)</strong> nem certidões fiscais/trabalhistas de fornecedor mercantil. O documento hábil legítimo de liquidação e suporte é a <strong>Lista de Credores PIX (CONLX)</strong> associada à <strong>Nota de Lançamento de Sistema (NS)</strong> e Autorização expressa do Ordenador de Despesas.
                      </p>
                    </div>
                  </div>
                )}

                {/* Specific Legal Dispensation Banner for Taxas e Contribuições (CREA-SE) */}
                {auditResult.naturezaProcesso === 'TAXAS_E_CONTRIBUICOES' && (
                  <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-300/80 dark:border-blue-800/60 rounded-xl flex items-start gap-3 text-blue-900 dark:text-blue-200">
                    <Landmark className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-black uppercase tracking-wider text-[10px] text-blue-800 dark:text-blue-300">
                        Taxas Públicas e ARTs ao CREA-SE (Leis nº 5.194/66 e 6.496/77)
                      </div>
                      <p className="text-[11px] leading-relaxed text-blue-900/90 dark:text-blue-200/90">
                        O processo refere-se ao pagamento de taxas legais e Anotações de Responsabilidade Técnica (ARTs) devidas a conselho autárquico de fiscalização profissional. <strong>Não se aplica a exigência de Nota Fiscal mercantil</strong>. A liquidação está regularmente amparada em <strong>Boletos Bancários do Banco do Brasil com QR Code PIX</strong>, <strong>espelhos/minutas das ARTs no SITAC</strong> e <strong>Atestado formal de Liquidação</strong> emitido pelo setor de engenharia. Retenções na fonte da IN RFB nº 1.234/2012 não são devidas.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                    <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block mb-0.5">
                      Processo SEI
                    </span>
                    <span className="text-xs font-bold text-black dark:text-white break-words font-mono">
                      {auditResult.processo || 'Não detectado'}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                    <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block mb-0.5">
                      Documento Principal
                    </span>
                    <span className="text-xs font-bold text-black dark:text-white break-words">
                      {auditResult.numeroDoc || 'Não detectado'}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10">
                    <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block mb-0.5">
                      Tipo Documental
                    </span>
                    <span className="text-xs font-bold text-black dark:text-white">
                      {auditResult.tipoDoc || 'Não classificado'}
                    </span>
                  </div>
                </div>

                {/* Favorecido & Financeiro */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                    <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-black/40 dark:text-white/40" /> Favorecido / Credor
                    </span>
                    <div className="text-xs font-bold text-black dark:text-white">
                      {auditResult.favorecido?.nome || 'N/A'}
                    </div>
                    <div className="text-[10px] text-black/60 dark:text-white/60 font-mono">
                      CNPJ/CPF: {auditResult.favorecido?.cnpjCpf || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 space-y-1">
                    <span className="text-[8px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-black/40 dark:text-white/40" /> Valores Calculados
                    </span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-black/60 dark:text-white/60">Valor Bruto:</span>
                      <span className="font-bold text-black dark:text-white">
                        R$ {(auditResult.valores?.valorBruto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-red-600 dark:text-red-400">
                      <span>Retenções:</span>
                      <span className="font-bold">
                        - R$ {(auditResult.valores?.retencoes || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-black text-black dark:text-white border-t border-black/5 dark:border-white/10 pt-1">
                      <span>Valor Líquido:</span>
                      <span className="text-black dark:text-white">
                        R$ {(auditResult.valores?.valorLiquido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {auditResult.valores?.detalheRetencoes && (
                      <div className="text-[9px] text-black/50 dark:text-white/50 pt-0.5 leading-tight">
                        {auditResult.valores.detalheRetencoes}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveDetailTab('calculadora_confronto')}
                      className="w-full mt-2 py-1.5 px-2.5 bg-black hover:bg-black/90 dark:bg-[#00FF00] dark:hover:bg-[#00CC00] text-[#00FF00] dark:text-black rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Calculator className="w-3.5 h-3.5" /> Confrontar com Calculadora & Normas
                    </button>
                  </div>
                </div>

                {/* Documentos Identificados no PDF */}
                {auditResult.documentosIdentificados && auditResult.documentosIdentificados.length > 0 && (
                  <div className="pt-2 border-t border-black/5 dark:border-white/10">
                    <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block mb-2">
                      Documentos Localizados no Processo ({auditResult.documentosIdentificados.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {auditResult.documentosIdentificados.map((doc, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-gray-100 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-lg text-[10px] font-medium text-black/80 dark:text-white/80">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Access to Evidencias, SIAFI and SEI detailed reports */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-black/5 dark:border-white/10">
                  {auditResult.evidenciasEncontradas && auditResult.evidenciasEncontradas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveDetailTab('evidencias_encontradas')}
                      className="p-3 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 rounded-xl text-left transition-all flex items-center justify-between group col-span-full"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        <div>
                          <div className="text-xs font-black text-blue-950 dark:text-blue-200">
                            {auditResult.evidenciasEncontradas.length} Evidências Encontradas (Valores, Datas, Assinaturas e Atestes)
                          </div>
                          <div className="text-[10px] text-blue-800/70 dark:text-blue-300/70">
                            Ver relação detalhada dos campos do documento original que embasaram o parecer técnico final
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {auditResult.documentosSiafiAnalisados && auditResult.documentosSiafiAnalisados.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveDetailTab('documentos_siafi')}
                      className="p-3 bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-100/60 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-xl text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Landmark className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        <div>
                          <div className="text-xs font-black text-blue-950 dark:text-blue-200">
                            {auditResult.documentosSiafiAnalisados.length} Documentos SIAFI Auditados
                          </div>
                          <div className="text-[10px] text-blue-800/70 dark:text-blue-300/70">
                            {auditResult.documentosSiafiAnalisados.map(d => d.tipo).join(', ')}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('parecer_tecnico')}
                    className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Scale className="w-5 h-5 text-emerald-700 dark:text-[#00FF00]" />
                      <div>
                        <div className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                          Parecer Técnico Estruturado
                        </div>
                        <div className="text-[10px] text-emerald-800/70 dark:text-emerald-300/70">
                          10 seções analíticas completas
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-[#00FF00] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

                  {/* PARECER TÉCNICO CONCLUSIVO */}
                  <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-3 transition-colors">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-black dark:text-white" />
                        Parecer Oficial do Conformista de Registro de Gestão
                      </h4>
                      <button
                        type="button"
                        onClick={copyParecer}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-black dark:text-white"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 dark:text-[#00FF00]" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copiar Parecer
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 font-serif text-xs text-black/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap">
                      {auditResult.parecerConclusivo}
                    </div>

                    {auditResult.sugestaoConformista && (
                      <div className="p-3 bg-black dark:bg-[#0C0D0E] text-[#00FF00] rounded-xl text-xs font-mono flex items-center gap-2 border border-white/10">
                        <Info className="w-4 h-4 shrink-0 text-[#00FF00]" />
                        <span><strong>Orientação SIAFI:</strong> {auditResult.sugestaoConformista}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: CALCULADORA & CONFRONTO TRIBUTÁRIO */}
              {activeDetailTab === 'calculadora_confronto' && (
                <ConfrontoCalculadoraTributaria 
                  auditResult={auditResult}
                  onApplyRestriction={handleApplyConfrontoRestriction}
                  onOpenFullCalculator={onOpenCalculator}
                />
              )}

              {/* TAB: EVIDÊNCIAS ENCONTRADAS */}
              {activeDetailTab === 'evidencias_encontradas' && (
                <ProcessEvidenceTable evidencias={auditResult.evidenciasEncontradas} />
              )}

              {/* TAB: DOCUMENTOS SIAFI */}
              {activeDetailTab === 'documentos_siafi' && (
                <SiafiDocumentsTable documentos={auditResult.documentosSiafiAnalisados} />
              )}

              {/* TAB 3: DOCUMENTOS SEI */}
              {activeDetailTab === 'documentos_sei' && (
                <ProcessDocumentsTable 
                  documentos={auditResult.documentosProcessuaisDetalhados} 
                  fallbackDocs={auditResult.documentosIdentificados} 
                />
              )}

              {/* TAB 4: PARECER TÉCNICO ESTRUTURADO */}
              {activeDetailTab === 'parecer_tecnico' && (
                <ParecerTecnicoView 
                  parecer={auditResult.parecerTecnicoEstruturado} 
                  parecerConclusivoSimples={auditResult.parecerConclusivo} 
                  sugestaoConformista={auditResult.sugestaoConformista} 
                />
              )}

              {/* TAB 5: ESCRITA CONTÁBIL (MACROFUNÇÃO SIAFI 020314) */}
              {activeDetailTab === 'escrita_contabil' && (
                <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-4 transition-colors">
                  {auditResult.analiseDescricaoContabil ? (
                    <>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
                          <PenTool className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" />
                          Análise Criteriosa da Escrita Contábil (Macrofunção SIAFI 020314)
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          auditResult.analiseDescricaoContabil.qualidadeRedacao === 'Excelente'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                            : auditResult.analiseDescricaoContabil.qualidadeRedacao === 'Regular com Ressalvas'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300'
                        }`}>
                          Qualidade: {auditResult.analiseDescricaoContabil.qualidadeRedacao}
                        </span>
                      </div>

                      {/* Transcrição da Observação */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                          Transcrição do Campo OBSERVAÇÃO (Documento SIAFI)
                        </span>
                        <div className="p-3.5 bg-gray-50 dark:bg-[#202326] border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-black/90 dark:text-white/90 leading-relaxed break-words">
                          "{auditResult.analiseDescricaoContabil.textoObservacao}"
                        </div>
                      </div>

                      {/* Avaliação Criteriosa */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                          Avaliação Técnica do Conformista
                        </span>
                        <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed font-sans">
                          {auditResult.analiseDescricaoContabil.avaliacaoCriteriosa}
                        </p>
                      </div>

                      {/* Elementos Identificados */}
                      {auditResult.analiseDescricaoContabil.elementosIdentificados?.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
                          <span className="text-[9px] uppercase font-black text-black/40 dark:text-white/40 tracking-widest block">
                            Elementos Normativos Identificados na Redação
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {auditResult.analiseDescricaoContabil.elementosIdentificados.map((el: string, i: number) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-black/80 dark:text-white/80 bg-gray-50 dark:bg-[#202326] p-2 rounded-lg border border-black/5 dark:border-white/10">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF00] shrink-0 mt-0.5" />
                                <span>{el}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Apontamentos ou Gralhas */}
                      {auditResult.analiseDescricaoContabil.apontamentosOuGralhas?.length > 0 && (
                        <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-black text-[10px] uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                            Apontamentos de Escrita e Gralhas Tipográficas
                          </div>
                          <ul className="space-y-1 text-[11px] text-amber-900/90 dark:text-amber-200/90 list-disc pl-4 leading-relaxed font-sans">
                            {auditResult.analiseDescricaoContabil.apontamentosOuGralhas.map((ap: string, i: number) => (
                              <li key={i}>{ap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-8 text-center text-xs text-black/50 dark:text-white/50 space-y-2">
                      <PenTool className="w-6 h-6 mx-auto text-black/30 dark:text-white/30" />
                      <div>Nenhum texto de observação contábil individualizado para auditoria textual direta.</div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: CHECKLIST AVALIADO */}
              {activeDetailTab === 'checklist' && (
                <div className="bg-white dark:bg-[#16181A] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-3 transition-colors">
                  <h4 className="text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/60 flex items-center justify-between">
                    <span>Itens de Conformidade Avaliados</span>
                    <span className="text-[10px] text-black/40 dark:text-white/40 font-normal">Macrofunção 020314</span>
                  </h4>

                  <div className="space-y-2">
                    {auditResult.checklistAvaliado?.map((check, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-[#202326] rounded-xl border border-black/5 dark:border-white/10 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-black/90 dark:text-white/90">{check.item}</div>
                          <div className="text-[10px] text-black/60 dark:text-white/60">{check.observacao}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                          check.status === 'CONFORME'
                            ? 'bg-[#00FF00]/20 dark:bg-[#00FF00]/15 text-emerald-800 dark:text-[#00FF00] border border-[#00FF00]/40'
                            : check.status === 'NÃO CONFORME'
                            ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50'
                            : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                        }`}>
                          {check.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INTEGRATION ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTransferToForm}
                  className="w-full sm:w-1/2 py-3.5 px-4 bg-black dark:bg-[#00FF00] text-[#00FF00] dark:text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-[#00DD00] transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  <ArrowRight className="w-4 h-4" />
                  Preencher Formulário de Registro
                </button>

                <button
                  type="button"
                  onClick={handleDirectSave}
                  disabled={isSaved}
                  className={`w-full sm:w-1/2 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm ${
                    isSaved
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40 cursor-default'
                      : 'bg-white dark:bg-[#202326] text-black dark:text-white border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 active:scale-[0.98]'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF00]" />
                      Salvo no Histórico e Excel
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Salvar Diretamente no Histórico
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
