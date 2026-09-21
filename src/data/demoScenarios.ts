import { ProcessAuditResult } from '../types';

export const DEMO_TAXAS_CREA: ProcessAuditResult = {
  processo: "23060.001366/2026-34",
  numeroDoc: "2026NE000618 / Inexigibilidade 105/2026",
  tipoDoc: "NE - Nota de Empenho",
  naturezaProcesso: "TAXAS_E_CONTRIBUICOES",
  favorecido: {
    nome: "CONSELHO REGIONAL DE ENGENHARIA E AGRONOMIA DE SERGIPE - CREA-SE",
    cnpjCpf: "13.136.890/0001-05"
  },
  valores: {
    valorBruto: 5151.50,
    retencoes: 0.00,
    valorLiquido: 5151.50,
    detalheRetencoes: "R$ 0,00 - Dispensa legal de retenções tributárias federais da IN RFB nº 1.234/2012 para recolhimento de taxas públicas legais e ARTs devidas a autarquias federais fiscalizadoras de profissões regulamentadas (Leis nº 5.194/66 e 6.496/77)."
  },
  resultado: "SEM OCORRÊNCIA",
  restricoesDetectadas: [],
  checklistAvaliado: [
    {
      item: "Documento Hábil de Liquidação (Boleto Bancário / ART / Dispensa de Nota Fiscal)",
      status: "CONFORME",
      observacao: "Liquidação instruída regularmente por Boletos Bancários do Banco do Brasil com QR Code PIX, minutas/espelhos das Anotações de Responsabilidade Técnica (ARTs) no SITAC e Atestado de Liquidação formal do setor de engenharia (CEL/DIPOP). Não cabe emissão de Nota Fiscal comercial para taxas legais de fiscalização profissional."
    },
    {
      item: "Fundamentação Legal e Regularidade na Contratação Direta (Inexigibilidade de Licitação)",
      status: "CONFORME",
      observacao: "Contratação direta regularmente fundamentada no Art. 74, inciso I da Lei nº 14.133/2021 (Inexigibilidade nº 105/2026), com Termo de Ratificação assinado pela autoridade competente e publicação tempestiva no PNCP."
    },
    {
      item: "Nota de Empenho Prévia, Célula Orçamentária e Dotação Específica (Art. 60 da Lei 4.320/64)",
      status: "CONFORME",
      observacao: "Prévia emissão da 2026NE000618 na Célula Orçamentária de Taxas (Natureza 33904710 - Taxas), amparada pelo detalhamento de crédito 2026NC001377 e declaração de disponibilidade DDO nº 143/2026/CPO."
    },
    {
      item: "Atestado Formal de Liquidação emitido pelo Setor Técnico (Art. 63 da Lei 4.320/64)",
      status: "CONFORME",
      observacao: "Atestado de Liquidação formal emitido pela Coordenadoria de Engenharia Elétrica (CEL) e DIPOP/Reitoria, confirmando a vinculação e conformidade das ARTs às obras do IFS."
    },
    {
      item: "Análise Criteriosa da Escrita da Observação Contábil no SIAFI (Macrofunção 020314)",
      status: "CONFORME",
      observacao: "Observações contábeis da RO, NE, NS, NP e OB delimitam com clareza a finalidade (taxas de ART ao CREA-SE), a unidade demandante (CEL-REI), o processo SEI (23060.001366/2026-34) e a Inexigibilidade 105/2026, com redação íntegra e sem ambiguidades."
    },
    {
      item: "Verificação de Retenções Tributárias na Fonte (IN RFB 1.234/2012)",
      status: "CONFORME",
      observacao: "Retenções R$ 0,00 - O recolhimento de taxas públicas legais e emolumentos a conselhos profissionais federais é imune e isento de retenções de IR, CSLL, PIS e COFINS."
    }
  ],
  evidenciasEncontradas: [
    {
      campo: "Valor Global Empenhado e Estimado",
      valorOuConteudo: "R$ 5.151,50",
      documentoOrigem: "Nota de Empenho Global nº 2026NE000618 e DDO nº 143/2026 (SEI 0998004)",
      categoria: "Valores",
      impactoNoParecer: "Comprovou dotação orçamentária prévia suficiente na célula 33904710 para cobertura de todas as taxas de ART do exercício."
    },
    {
      campo: "Valores Individuais das Taxas de ART (Lote 1)",
      valorOuConteudo: "R$ 433,56 (Boletos BANESE 8204373122, 8204373125, 8204373132 e 8204373406)",
      documentoOrigem: "Boletos BANESE (SEI 1010913 a 1013113) e 2026NS007619",
      categoria: "Valores",
      impactoNoParecer: "Confirmou exata convergência entre o valor nominal dos 4 boletos e o saldo liquidado na Nota de Lançamento de Sistema nº 2026NS007619."
    },
    {
      campo: "Valores Individuais das Taxas de ART (Lote 2)",
      valorOuConteudo: "R$ 1.004,74 (Boletos BANESE 8204373408 a 8204373418)",
      documentoOrigem: "Boletos BANESE (SEI 1013113) e 2026NS007803",
      categoria: "Valores",
      impactoNoParecer: "Atestou exatidão matemática na liquidação do segundo lote de ARTs de projetos institucionais."
    },
    {
      campo: "Retenções Tributárias Federais (IN RFB 1.234/12)",
      valorOuConteudo: "R$ 0,00 (Zero)",
      documentoOrigem: "Notas de Sistema (2026NS007619 e 2026NS007803) e Comprovantes BANESE",
      categoria: "Valores",
      impactoNoParecer: "Correto reconhecimento de não incidência de retenção na fonte sobre taxas públicas e emolumentos devidos ao CREA-SE."
    },
    {
      campo: "Datas de Vencimento dos Boletos",
      valorOuConteudo: "14/07/2026 e 20/07/2026",
      documentoOrigem: "Boletos de Cobrança Bancária emitidos pelo CREA-SE / BANESE",
      categoria: "Datas",
      impactoNoParecer: "Permitiu verificar a tempestividade dos pagamentos efetuados sem mora, juros ou encargos moratórios."
    },
    {
      campo: "Datas da Efetiva Quitação Financeira",
      valorOuConteudo: "20/07/2026 (Autenticações BANESE nº 2026OB003618 e 2026OB003621)",
      documentoOrigem: "Comprovantes de Arrecadação de Convênio BANESE (SEI 1025047 a 1025160)",
      categoria: "Datas",
      impactoNoParecer: "Evidenciou a liquidação financeira antes do vencimento com quitação integral do passivo com o CREA-SE."
    },
    {
      campo: "Assinatura da Autoridade Máxima (Reitora)",
      valorOuConteudo: "Ruth Sales Gama de Andrade (Reitora do IFS)",
      documentoOrigem: "Despacho de Autorização da Inexigibilidade (SEI 1002849) e Declaração LRF Art. 16 (SEI 1001449 / 1006721)",
      categoria: "Assinaturas",
      impactoNoParecer: "Supriu com rigor o art. 16 da LRF e o art. 74 da Lei 14.133/21, autorizando formalmente o compromisso institucional da despesa."
    },
    {
      campo: "Assinatura do Responsável Técnico / Fiscal de Engenharia",
      valorOuConteudo: "Lucas Lima Conceição (Coordenador de Engenharia Elétrica - CEL)",
      documentoOrigem: "Atestados de Liquidação da Despesa (SEI 1013124 e 1062664)",
      categoria: "Assinaturas",
      impactoNoParecer: "Cumpriu expressamente o art. 63 da Lei 4.320/64, certificando que os serviços técnicos vinculados às ARTs foram regularmente executados."
    },
    {
      campo: "Assinaturas do Ordenador de Despesas e Gestor Financeiro",
      valorOuConteudo: "Ordenador de Despesas e Gestor Financeiro da Reitoria IFS",
      documentoOrigem: "Nota de Empenho 2026NE000618 e Ordens Bancárias 2026OB003618/003621",
      categoria: "Assinaturas",
      impactoNoParecer: "Confirmou a competência legal e a regularidade formal da segregação de funções nas fases de empenho e pagamento."
    },
    {
      campo: "Códigos das ARTs Registradas no Sistema SITAC",
      valorOuConteudo: "SE20260505087, SE20260505089, SE20260505096 e SE20260505157",
      documentoOrigem: "Espelhos de ARTs do CREA-SE e campo OBSERVAÇÃO da 2026NS007619",
      categoria: "Atestes e Certidões",
      impactoNoParecer: "Garantiram a individualização material inequívoca de cada projeto público abrangido pela anotação de responsabilidade técnica."
    },
    {
      campo: "Classificação Orçamentária da Despesa",
      valorOuConteudo: "Natureza 33904710 (Taxas) - Fonte 1000000000 - PTRES 231587",
      documentoOrigem: "Nota de Crédito 2026NC001377 e Empenho 2026NE000618",
      categoria: "Classificação Orçamentária",
      impactoNoParecer: "Validou o enquadramento orçamentário perfeito para obrigações contributivas públicas, afastando elemento mercantil."
    },
    {
      campo: "Regularidade Fiscal e Trabalhista do CREA-SE",
      valorOuConteudo: "Certidão SICAF nível I a VI válida, CND Estadual SE e CND Municipal Aracaju",
      documentoOrigem: "Certidões SEI 1002834, 1002839, 1002843 e 1007321",
      categoria: "Atestes e Certidões",
      impactoNoParecer: "Comprovou a plena habilitação jurídica e regularidade cadastral do favorecido para recebimento de recursos públicos federais."
    }
  ],
  documentosSiafiAnalisados: [
    {
      tipo: "NC",
      numero: "2026NC001377",
      data: "19/06/2026",
      valor: 5151.50,
      favorecido: "UG 158134 - IFS Reitoria",
      eventos: ["Detalhamento de Crédito Orçamentário"],
      classificacaoOuContas: "Esfera 1 / PTRES 231587 / Fonte 1000000000 / ND 339047 / UGR 152526 / PI VCTRBN0100N",
      descricaoOuObservacao: "DETALHAMENTO DE CRÉDITO ORÇAMENTÁRIO VISANDO DESPESAS COM contratação do CREA-SE para emissão de Anotações de Responsabilidade Técnica para as obras do IFS CONFORME Processo nº 23060.001366/2026-34",
      signatarios: ["Usuário SIAFI: Mike (***.868.535-**)"],
      status: "REGULAR",
      parecerTecnico: "Nota de Crédito orçamentária regular. Assegura a prévia dotação orçamentária na célula orçamentária de taxas (339047) em conformidade com o art. 14 da Lei nº 4.320/64 e art. 16 da LRF, amparando a DDO nº 143/2026/CPO."
    },
    {
      tipo: "RO",
      numero: "2026RO003372",
      data: "06/07/2026",
      valor: 5151.50,
      favorecido: "13.136.890/0001-05 - CREA-SE",
      eventos: ["401201 - Registro Orçamentário"],
      classificacaoOuContas: "33904710 - Taxas / Célula: 1 231587 1000000000 339047 152526 VCTRBN0100N",
      descricaoOuObservacao: "ATENDER DESPESA COM CONTRATACAO PARA O PAGAMENTO DE MULTAS E TAXAS DE ANOTACAO DE RESPONSABILIDADE TECNICA (ART) AO CONSELHO REGIONAL DE ENGENHARIA E AGRONOMIA DE SERGIPE (CREA), SOLICITADA PELA CEL-REI, INEXIGIBILIDADE 105/2026, CONFORME PROCESSO 23060.001366/2026-34",
      signatarios: ["Mike - Lançado às 15:03"],
      status: "REGULAR",
      parecerTecnico: "Registro Orçamentário prévio regular. Descreve com fidelidade o objeto, fundamentação legal (Inexigibilidade 105/2026) e vinculação processual SEI."
    },
    {
      tipo: "NE",
      numero: "2026NE000618",
      data: "06/07/2026",
      valor: 5151.50,
      favorecido: "13.136.890/0001-05 - CONSELHO REGIONAL DE ENGENHARIA E AGRONOMIA DE SERGIPE",
      eventos: ["400091 - Empenho da Despesa"],
      classificacaoOuContas: "Célula 1 231587 1000000000 339047 152526 VCTRBN0100N - Subitem 10 (Taxas)",
      descricaoOuObservacao: "ATENDER DESPESA COM CONTRATACAO PARA O PAGAMENTO DE MULTAS E TAXAS DE ANOTACAO DE RESPONSABILIDADE TECNICA (ART) AO CONSELHO REGIONAL DE ENGENHARIA E AGRONOMIA DE SERGIPE (CREA), SOLICITADA PELA CEL-REI, INEXIGIBILIDADE 105/2026, CONFORME PROCESSO 23060.001366/2026-34",
      signatarios: ["Mike - Responsável pela emissão"],
      status: "REGULAR",
      parecerTecnico: "Nota de Empenho ordinário plenamente regular. Em conformidade com o art. 60 da Lei nº 4.320/64. Modalidade de Inexigibilidade de Licitação (art. 74, I, Lei 14.133/21). Saldo orçamentário suficiente e elemento de despesa 33904710 rigorosamente adequado."
    },
    {
      tipo: "NS",
      numero: "2026NS000632",
      data: "08/07/2026",
      valor: 5151.50,
      favorecido: "13.136.890/0001-05 - CREA-SE",
      eventos: ["510101 - Liquidação de Despesa de Taxas"],
      classificacaoOuContas: "Passivo Circulante - Obrigações a Pagar / Conta de Variação Patrimonial Diminutiva (Taxas)",
      descricaoOuObservacao: "LIQUIDACAO DE DESPESA REF. PAGAMENTO DE TAXAS DE ART JUNTO AO CREA-SE CONFORME BOLETOS E MINUTAS ANEXAS AO PROCESSO 23060.001366/2026-34 E ATESTE CEL/DIPOP",
      signatarios: ["Operador de Liquidação SIAFI"],
      status: "REGULAR",
      parecerTecnico: "Nota de Lançamento de Sistema regular. Atesta o estágio de liquidação da despesa com suporte no atestado de liquidação e boletos com código de barras/PIX."
    },
    {
      tipo: "NP",
      numero: "2026NP000789",
      data: "09/07/2026",
      valor: 5151.50,
      favorecido: "13.136.890/0001-05 - CREA-SE",
      eventos: ["530001 - Autorização e Preparação de Pagamento"],
      classificacaoOuContas: "Conta Única do Tesouro Nacional / Banco do Brasil",
      descricaoOuObservacao: "PAGAMENTO DE TAXAS DE ART AO CREA-SE - VINCULADO AO EMPENHO 2026NE000618 E PROCESSO 23060.001366/2026-34",
      signatarios: ["Ordenador de Despesas e Gestor Financeiro"],
      status: "REGULAR",
      parecerTecnico: "Nota de Pagamento regular. Cumpre a exigência de autorização formal do Ordenador de Despesas nos termos do art. 64 da Lei nº 4.320/64."
    },
    {
      tipo: "OB",
      numero: "2026OB801423",
      data: "09/07/2026",
      valor: 5151.50,
      favorecido: "13.136.890/0001-05 - CREA-SE (Banco do Brasil - Agência 0017-0 / C/C Arrecadação)",
      eventos: ["540001 - Pagamento de Obrigações por Ordem Bancária"],
      classificacaoOuContas: "Crédito em Conta / Código de Barras de Arrecadação",
      descricaoOuObservacao: "PAGAMENTO DE TAXAS DE ART DE OBRAS DO IFS AO CREA-SE CONF PROC SEI 23060.001366/2026-34",
      signatarios: ["Ordenador de Despesas do IFS", "Gestor Financeiro do IFS"],
      status: "REGULAR",
      parecerTecnico: "Ordem Bancária regular com dupla assinatura eletrônica regulamentar no SIAFI. Extingue a obrigação perante o credor autárquico."
    }
  ],
  documentosProcessuaisDetalhados: [
    {
      tipo: "DFD",
      numeroSei: "Documento SEI nº 1245890",
      folhaOuPagina: "Fl. 01/03",
      descricao: "Documento de Formalização da Demanda emitido pela Coordenadoria de Engenharia Elétrica (CEL) justificando a necessidade de recolhimento das taxas de ART para as obras prediais do IFS.",
      signatarioOuSetor: "CEL / DIPOP / Reitoria",
      data: "12/06/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "TR",
      numeroSei: "Documento SEI nº 1247102",
      folhaOuPagina: "Fl. 04/09",
      descricao: "Termo de Referência especificando o quantitativo e os valores unitários tabelados das taxas de Anotação de Responsabilidade Técnica nos termos da Resolução CONFEA.",
      signatarioOuSetor: "DIPOP - Diretoria de Projetos e Obras",
      data: "15/06/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Portaria",
      numeroSei: "Portaria Reitoria nº 1032/2026",
      folhaOuPagina: "Fl. 10",
      descricao: "Designação da comissão de fiscalização e dos engenheiros responsáveis técnicos pela execução e acompanhamento dos projetos.",
      signatarioOuSetor: "Gabinete da Reitoria / IFS",
      data: "18/06/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Parecer Jurídico",
      numeroSei: "Parecer nº 00412/2026/PF-IFS/PGF/AGU",
      folhaOuPagina: "Fl. 14/18",
      descricao: "Parecer da Procuradoria Federal junto ao IFS opinando pela legalidade da contratação direta por Inexigibilidade de Licitação com base no art. 74, I da Lei 14.133/2021.",
      signatarioOuSetor: "Procuradoria Federal / AGU",
      data: "25/06/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "DDO",
      numeroSei: "Declaração nº 143/2026/CPO",
      folhaOuPagina: "Fl. 19",
      descricao: "Declaração de Disponibilidade Orçamentária e adequação financeira emitida pela Coordenadoria de Planejamento Orçamentário, vinculada à 2026NC001377.",
      signatarioOuSetor: "CPO / PROAD / IFS",
      data: "26/06/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Termo de Inexigibilidade",
      numeroSei: "Termo de Ratificação nº 105/2026",
      folhaOuPagina: "Fl. 22",
      descricao: "Ratificação e homologação da Inexigibilidade de Licitação nº 105/2026 pelo Reitor do IFS em favor do CREA-SE no valor total de R$ 5.151,50.",
      signatarioOuSetor: "Reitor do IFS",
      data: "01/07/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Publicação Oficial",
      numeroSei: "Comprovante PNCP nº 2026/00142",
      folhaOuPagina: "Fl. 23",
      descricao: "Comprovante de publicação do extrato de Inexigibilidade no Portal Nacional de Contratações Públicas (PNCP) e no Diário Oficial da União.",
      signatarioOuSetor: "DCL - Departamento de Compras e Licitações",
      data: "02/07/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Boleto Bancário / ART",
      numeroSei: "Documento SEI nº 1254100",
      folhaOuPagina: "Fl. 26/34",
      descricao: "Boletos de cobrança emitidos pelo Banco do Brasil com código de barras e QR Code PIX, acompanhados dos espelhos das minutas das ARTs geradas no SITAC/CREA-SE.",
      signatarioOuSetor: "CREA-SE / Sistema SITAC",
      data: "06/07/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Atestado de Liquidação",
      numeroSei: "Atestado SEI nº 1255300",
      folhaOuPagina: "Fl. 35",
      descricao: "Termo de conferência e ateste formal emitido pelo Engenheiro Fiscal e Diretor de Obras atestando a exatidão das ARTs e conformidade com o art. 63 da Lei nº 4.320/64.",
      signatarioOuSetor: "Engenheiro Fiscal / CEL / DIPOP",
      data: "07/07/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Despacho Autorizativo",
      numeroSei: "Despacho SEI nº 1256420",
      folhaOuPagina: "Fl. 38",
      descricao: "Despacho do Pró-Reitor de Administração (Ordenador de Despesas) autorizando o pagamento e remessa bancária no SIAFI nos termos do art. 64 da Lei nº 4.320/64.",
      signatarioOuSetor: "Pró-Reitor de Administração / PROAD",
      data: "08/07/2026",
      statusConformidade: "CONFORME"
    }
  ],
  parecerTecnicoEstruturado: {
    identificacao: {
      processoSei: "23060.001366/2026-34",
      ugGestao: "158134 / 26423 (INST. FED. DE EDUC., CIENC. E TEC. DE SERGIPE)",
      unidadeDemandante: "DIPOP / CEL - Coordenadoria de Engenharia Elétrica / Reitoria",
      favorecido: "CONSELHO REGIONAL DE ENGENHARIA E AGRONOMIA DE SERGIPE - CREA-SE",
      cnpjFavorecido: "13.136.890/0001-05 (Autarquia Federal Especial)",
      enquadramentoLegal: "Inexigibilidade de Licitação - Art. 74, inciso I da Lei nº 14.133/2021",
      valorTotalProcesso: "R$ 5.151,50 (Cinco mil, cento e cinquenta e um reais e cinquenta centavos)"
    },
    resumoObjeto: "O presente processo administrativo tem por escopo o pagamento de taxas legais de Anotações de Responsabilidade Técnica (ARTs) devidas ao Conselho Regional de Engenharia e Agronomia de Sergipe (CREA-SE), referentes a projetos e obras de engenharia elétrica e infraestrutura executadas no âmbito do Instituto Federal de Sergipe (IFS).",
    analiseInstrucaoProcessual: "A instrução processual atende com rigor aos ditames da Lei nº 14.133/2021 e às normas internas do IFS: constam dos autos o Documento de Formalização da Demanda (DFD), Termo de Referência (TR) subscrito pelo corpo técnico da DIPOP, Portaria de nomeação do fiscal técnico, Parecer Jurídico favorável nº 00412/2026 da Procuradoria Federal, Declaração de Disponibilidade Orçamentária nº 143/2026/CPO, Termo de Ratificação da Inexigibilidade nº 105/2026 firmado pelo Reitor e publicação no PNCP.",
    analiseExecucaoOrcamentariaFinanceira: "A despesa encontra-se amparada por crédito orçamentário prévio descentralizado pela Nota de Crédito 2026NC001377 (PTRES 231587, Fonte 1000000000). A Nota de Empenho ordinária 2026NE000618 foi emitida previamente à liquidação no elemento 33904710 (Taxas), atendendo ao art. 60 da Lei nº 4.320/64 e ao art. 16 da LRF.",
    analiseDocumentoHabilELiquidacao: "Tratando-se de taxas públicas de fiscalização profissional cobradas por autarquia federal especial com base nas Leis nº 5.194/66 e 6.496/77, NÃO SE APLICA a emissão de Nota Fiscal (DANFE), dado que não há relação de fornecimento mercantil ou mercadoria comercial. O documento hábil legítimo de suporte da liquidação é constituído pelos boletos bancários do Banco do Brasil com QR Code PIX, espelhos das minutas das ARTs e o Atestado formal de Liquidação emitido pelo setor de engenharia (art. 63 da Lei nº 4.320/64).",
    analiseTributariaERetencoes: "Nos termos da Instrução Normativa RFB nº 1.234/2012 e da jurisprudência consolidada dos órgãos de controle, não incidem retenções na fonte de tributos federais (IR, CSLL, PIS e COFINS) sobre o recolhimento de taxas públicas legais e emolumentos devidos a entidades de fiscalização profissional da administração pública indireta. O valor das retenções é, portanto, de R$ 0,00.",
    analiseDocumentosSiafi: "Foram analisados minuciosamente todos os documentos emitidos no SIAFI: 2026NC001377 (Nota de Crédito), 2026RO003372 (Registro Orçamentário), 2026NE000618 (Nota de Empenho), 2026NS000632 (Nota de Sistema), 2026NP000789 (Nota de Pagamento) e 2026OB801423 (Ordem Bancária). Todos os atos guardam perfeita harmonia documental, unicidade de valor (R$ 5.151,50) e assinaturas eletrônicas válidas no sistema.",
    analiseEscritaObservacoesContabeis: "As descrições e observações contábeis lançadas nos documentos SIAFI atendem plenamente aos padrões da Macrofunção SIAFI 020314 e do Manual de Conformidade do IFS: identificam com nitidez o objeto (taxas de ART), a unidade demandante (CEL-REI), a inexigibilidade (105/2026) e vinculam expressamente o processo SEI 23060.001366/2026-34, com redação de excelente clareza sintática e sem erros materiais.",
    conclusaoEEncaminhamento: "Ante o exposto, considerando que a instrução processual se apresenta regular e completa, que a liquidação da despesa encontra-se amparada em documento hábil legítimo e que todos os registros no SIAFI refletem com exatidão os atos e fatos da gestão administrativa, manifesta-se este Conformista pelo registro regular.",
    registroSugerido: "SEM OCORRÊNCIA"
  },
  analiseDescricaoContabil: {
    textoObservacao: "ATENDER DESPESA COM CONTRATACAO PARA O PAGAMENTO DE MULTAS E TAXAS DE ANOTACAO DE RESPONSABILIDADE TECNICA (ART) AO CONSELHO REGIONAL DE ENGENHARIA E AGRONOMIA DE SERGIPE (CREA), SOLICITADA PELA CEL-REI, INEXIGIBILIDADE 105/2026, CONFORME PROCESSO 23060.001366/2026-34",
    qualidadeRedacao: "Excelente",
    avaliacaoCriteriosa: "A escrita contábil constante nos documentos 2026RO003372 e 2026NE000618 atende com elevado rigor técnico às diretrizes da Macrofunção SIAFI 020314: delimita o objeto com precisão jurídica e contábil, especifica a Unidade demandante (CEL-REI), vincula a fundamentação de contratação direta (Inexigibilidade 105/2026) e referencia o número integral do Processo Administrativo SEI.",
    elementosIdentificados: [
      "Objeto bem delimitado: Pagamento de multas e taxas de ART",
      "Favorecido autárquico: Conselho Regional de Engenharia e Agronomia de Sergipe (CREA-SE)",
      "Unidade Solicitante: CEL-REI (Coordenadoria de Engenharia Elétrica / Reitoria)",
      "Modalidade de Contratação: Inexigibilidade de Licitação nº 105/2026",
      "Processo SEI vinculado: 23060.001366/2026-34",
      "Classificação Orçamentária correta: 33904710 (Taxas)"
    ],
    apontamentosOuGralhas: [
      "Nenhuma gralha ortográfica ou de digitação identificada.",
      "Redação em conformidade com o padrão oficial de lançamentos contábeis do IFS."
    ]
  },
  documentosIdentificados: [
    "Nota de Crédito nº 2026NC001377 (Fl. 19)",
    "Registro Orçamentário nº 2026RO003372 (Fl. 21)",
    "Nota de Empenho nº 2026NE000618 (Fl. 22)",
    "Termo de Ratificação da Inexigibilidade 105/2026 (Fl. 22)",
    "Publicação no PNCP e DOU (Fl. 23)",
    "Boletos Bancários BB com QR Code PIX e Minutas SITAC (Fl. 26 a 34)",
    "Atestado de Liquidação CEL/DIPOP (Fl. 35)",
    "Despacho Autorizativo de Pagamento do Ordenador de Despesas (Fl. 38)"
  ],
  parecerConclusivo: "Processo de pagamento de taxas de ART ao CREA-SE (Processo SEI 23060.001366/2026-34) instruído com integral regularidade fiscal, orçamentária e procedimental. Conforme a Lei nº 14.133/2021 (Inexigibilidade 105/2026), Lei nº 4.320/64 (Arts. 60 a 64) e Macrofunção SIAFI 020314, a liquidação encontra-se devidamente comprovada por Boletos Bancários com QR Code PIX, espelhos das minutas das ARTs no SITAC e Atestado formal do setor de engenharia. Não incidem retenções tributárias da IN RFB 1.234/12 sobre taxas públicas autárquicas e é dispensada legalmente a emissão de nota fiscal mercantil. Todos os documentos emitidos pelo SIAFI (NC, RO, NE, NS, NP e OB) guardam perfeita higidez documental. Parecer favorável ao registro de conformidade de gestão SEM OCORRÊNCIA.",
  sugestaoConformista: "Registrar no SIAFI a Conformidade dos Registros de Gestão SEM OCORRÊNCIA e certificar a regularidade no SEI.",
  confiancaAnalise: "Motor Especialista Normativo IFS (Auditado)"
};

export const DEMO_DIVERGENCIA_CALCULO: ProcessAuditResult = {
  processo: "23060.002891/2026-15",
  numeroDoc: "DANFE NF-e nº 2.890",
  tipoDoc: "DD - Documento de Despesa",
  naturezaProcesso: "AQUISIÇÃO_OU_SERVIÇO",
  favorecido: {
    nome: "INFRAESTRUTURA E GESTÃO DE DADOS TECNOLOGIA S/A",
    cnpjCpf: "21.904.382/0001-77"
  },
  valores: {
    valorBruto: 50000.00,
    retencoes: 600.00, // Fornecedor destacou apenas 1.2% (R$ 600,00) em vez de 9.45% (R$ 4.725,00)
    valorLiquido: 49400.00,
    detalheRetencoes: "ALERTA RIGOROSO: Destacado apenas R$ 600,00 (IR 1,2%) na NF. Conforme IN RFB nº 1.234/2012 (Código 17099 - Demais Serviços), a alíquota correta é 9,45% (IR 4,8% + CSLL 1,0% + COFINS 3,0% + PIS 0,65%), totalizando R$ 4.725,00. Divergência a menor de R$ 4.125,00."
  },
  resultado: "COM OCORRÊNCIA",
  restricoesDetectadas: [
    {
      codigo: "005 - Divergência de Valores/Cálculos Tributários ou Retenções (IN 1234/12)",
      titulo: "Retenção Tributária a Menor na Nota Fiscal (Divergência de R$ 4.125,00)",
      descricao: "Na NF-e nº 2.890, o prestador destacou indevidamente retenção de apenas R$ 600,00 (alíquota 1,2%), omitindo a retenção integral compulsória exigida de órgãos públicos federais de 9,45% (R$ 4.725,00: IRRF R$ 2.400,00, CSLL R$ 500,00, COFINS R$ 1.500,00 e PIS/PASEP R$ 325,00). Violação expressa ao Art. 2º da IN RFB nº 1.234/2012 e ao Art. 63 da Lei nº 4.320/1964. O pagamento com retenção a menor acarreta responsabilidade funcional do gestor.",
      severidade: "Impeditiva",
      trechoEvidencia: "Folha 14: Campo Retenções Federais da NF-e nº 2.890 indica R$ 600,00. Cálculo exato da IN 1234/12: R$ 4.725,00. Diferença apurada: R$ 4.125,00.",
      acaoRecomendada: "Diligenciar urgentemente a empresa contratada para emissão de Carta de Correção Eletrônica / NF retificadora ou promover a retenção integral de 9,45% diretamente na Nota de Lançamento de Sistema (NS) e Ordem Bancária no SIAFI antes de qualquer transferência financeira."
    }
  ],
  checklistAvaliado: [
    { item: "Nota de Empenho prévia vinculada e com saldo suficiente", status: "CONFORME", observacao: "Empenho 2026NE000512 regular" },
    { item: "Ateste formal de execução do serviço ou recebimento do material", status: "CONFORME", observacao: "Termo de Recebimento Provisório e Definitivo atestado pelo fiscal do contrato" },
    { item: "Cálculo de retenções federais nos termos da IN RFB 1234/2012", status: "NÃO CONFORME", observacao: "Divergência grave: Retenção destacada de R$ 600,00 diverge da exigência legal de R$ 4.725,00 (alíquota 9,45%)" },
    { item: "Certidões de regularidade fiscal e trabalhista vigentes", status: "CONFORME", observacao: "SICAF nível I a VI válido" },
    { item: "Despacho autorizativo do Ordenador de Despesa", status: "CONFORME", observacao: "Autorização de pagamento assinada" }
  ],
  documentosIdentificados: [
    "Nota de Empenho 2026NE000512 (Fl. 05)",
    "DANFE NF-e nº 2.890 (Fl. 14)",
    "Termo de Ateste da Equipe de Fiscalização (Fl. 19)",
    "Relatório Mensal de Execução de TI (Fl. 22)",
    "Certidão SICAF Integral (Fl. 27)",
    "Nota de Lançamento de Sistema preliminar (Fl. 31)"
  ],
  confrontoCalculadora: {
    valorBrutoProcesso: 50000.00,
    retencaoProcesso: 600.00,
    valorLiquidoProcesso: 49400.00,
    regraId: "17099",
    regraLabel: "Demais Serviços em Geral",
    aliquotaTotal: 9.45,
    irCalculado: 2400.00,
    csllCalculado: 500.00,
    cofinsCalculado: 1500.00,
    pisCalculado: 325.00,
    issCalculado: 0.00,
    inssCalculado: 0.00,
    retencoesLegaisTotais: 4725.00,
    valorLiquidoCalculado: 45275.00,
    diferencaRetencao: 4125.00,
    diferencaLiquido: -4125.00,
    statusConfronto: "DIVERGENCIA_DETECTADA",
    justificativaNormativa: "Divergência Tributária Grave Identificada: Pela IN RFB nº 1.234/2012, o montante legal devido para serviços de TI é de R$ 4.725,00 (alíquota ampla de 9,45%). Na NF-e do processo foi retido apenas R$ 600,00 (1,2%), gerando uma retenção a menor de R$ 4.125,00 aos cofres federais.",
    restricaoAplicada: "005 - Divergência de Valores/Cálculos Tributários ou Retenções (IN 1234/12)"
  },
  evidenciasEncontradas: [
    {
      campo: "Valor Total da Fatura de Serviços de TI",
      valorOuConteudo: "R$ 50.000,00",
      documentoOrigem: "DANFE NF-e nº 2.890 (Fl. 14)",
      categoria: "Valores",
      impactoNoParecer: "Base de cálculo imponível sujeita à retenção integral da IN RFB nº 1.234/2012."
    },
    {
      campo: "Destaque de Tributos na Nota Fiscal",
      valorOuConteudo: "R$ 600,00 (Apenas 1,2% de IR, sem CSLL, COFINS ou PIS)",
      documentoOrigem: "NF-e nº 2.890 (Quadro de Retenções Federais, Fl. 14)",
      categoria: "Valores",
      impactoNoParecer: "Evidência material irrefutável do erro tributário do prestador em desacordo com a IN 1.234/2012."
    },
    {
      campo: "Retenção Legal Exigida pelos Cofres Públicos",
      valorOuConteudo: "R$ 4.725,00 (Alíquota 9,45%: IR 4,8%, CSLL 1,0%, COFINS 3,0%, PIS 0,65%)",
      documentoOrigem: "Confronto da Calculadora Contábil e IN RFB 1.234/2012",
      categoria: "Valores",
      impactoNoParecer: "Motivação imperiosa da Restrição 005 e vedação de emissão de Conformidade Regular sem o ajuste tributário."
    }
  ],
  parecerConclusivo: "Examinada a documentação que instrui o presente processo, identifica-se DIVERGÊNCIA TRIBUTÁRIA GRAVE: o fornecedor emitiu a NF-e nº 2.890 com retenção federal destacada a menor (apenas R$ 600,00 correspondente a 1,2% de IRRF), quando a legislação federal (IN RFB nº 1.234/2012, Código 17099) exige a retenção integral de 9,45% (R$ 4.725,00) abrangendo IR, CSLL, COFINS e PIS. Nos termos da Macrofunção SIAFI 020314, da Lei nº 4.320/64 (Art. 63) e da Portaria IFS nº 1.633/2026, impõe-se a aplicação rigorosa da RESTRIÇÃO 005 - Divergência de Valores/Cálculos Tributários ou Retenções (IN 1234/12), com classificação de conformidade COM OCORRÊNCIA até que a liquidação no SIAFI efetue a retenção compulsória dos R$ 4.125,00 pendentes.",
  sugestaoConformista: "Registrar no SIAFI a Conformidade Diária COM OCORRÊNCIA (Restrição 005 - Impeditiva) e reter os tributos devidos via Nota de Sistema.",
  confiancaAnalise: "Motor Especialista Normativo IFS (Auditado Rigoroso)"
};

export const DEMO_MULHERES_MIL_JULHO2026: ProcessAuditResult = {
  processo: "23060.002402/2026-87",
  numeroDoc: "2026NS009337 / 2026OB004475",
  tipoDoc: "FL - Folha de Pagamento",
  naturezaProcesso: "FOLHA_OU_BENEFICIOS",
  favorecido: {
    nome: "19 Docentes Externos Bolsistas - Programa Mulheres Mil (Ciclo IV - Julho/2026)",
    cnpjCpf: "Lista de Credores PIX - 2026LX000615 (19 Pessoas Físicas)"
  },
  valores: {
    valorBruto: 21785.71,
    retencoes: 3485.71,
    valorLiquido: 18300.00,
    detalheRetencoes: "R$ 3.485,71 retidos: INSS Pessoa Física (11% Contribuinte Individual): R$ 2.396,43 (declarado eSocial cód. 1099 como R$ 2.396,37) + ISSQN Municipal Retido (5%): R$ 1.089,29 (recolhido aos municípios de Aracaju, Lagarto, Propriá, Estância, São Cristóvão via DAMs e Listas de Faturas 2026LF000871 a 2026LF000898). Encargos Patronais de 20% (cód. 1138): R$ 4.357,14."
  },
  resultado: "SEM OCORRÊNCIA",
  restricoesDetectadas: [],
  checklistAvaliado: [
    {
      item: "Atestes de Frequência dos 19 Docentes Externos (Art. 63 da Lei 4.320/64)",
      status: "CONFORME",
      observacao: "Folhas de frequência individualizadas (SEI 1050380 e 1050382) devidamente assinadas pelos 19 docentes externos colaboradores e atestadas pelas Coordenadoras de Curso e de Polo do Programa Mulheres Mil."
    },
    {
      item: "Enquadramento Legal e Homologação dos Editais de Seleção Pública",
      status: "CONFORME",
      observacao: "Despesa amparada na Lei nº 12.513/2011, Portaria MEC nº 817/2015 e Resoluções CD/FNDE. Docentes selecionados regularmente pelos Editais nº 37/2024, 35/2025 e 01/2026 com editais e homologações acostados aos autos."
    },
    {
      item: "Vinculação à Nota de Empenho Prévia e Célula Orçamentária Adequada",
      status: "CONFORME",
      observacao: "Liquidação vinculada à Nota de Empenho 2025NE000820 inscrita regularmente em Restos a Pagar em 18/01/2026, Natureza 33903606 (Outros Serviços de Terceiros - PF), UGR 152523, Fonte 1000A0008U."
    },
    {
      item: "Autorização Expressa do Ordenador de Despesas e da Reitora (Art. 64 da Lei 4.320/64)",
      status: "CONFORME",
      observacao: "Autorização de pagamento formalizada pelo Gabinete da Reitoria (Despacho SEI 1051572 de Ruth Sales Gama de Andrade) e Pró-Reitoria de Administração (Despacho PROAD 1050594 de Alexandre Melo Diniz)."
    },
    {
      item: "Retenções Previdenciárias e Tributárias na Fonte (INSS 11% e ISS 5%)",
      status: "CONFORME",
      observacao: "Correta retenção de INSS Contribuinte Individual (11% s/ base tributável = R$ 2.396,43 / eSocial 1099 R$ 2.396,37) e ISSQN retido (5% = R$ 1.089,29) recolhido tempestivamente aos municípios das alunas."
    },
    {
      item: "Segregação de Funções e Fidedignidade dos Registros SIAFI (Macrofunção 020314)",
      status: "CONFORME",
      observacao: "Segregação estrita observada: Liquidação contábil por Tereza Cristina Freire e Graziana Olinda; Ordenação de pagamento por Alexandre Melo Diniz; e Gestão Financeira por Reinaldo Santos Junior."
    }
  ],
  documentosIdentificados: [
    "Solicitação de Pagamento da Folha de Bolsas - Julho/2026 (SEI 1050337)",
    "Editais de Seleção Pública nº 37/2024, 35/2025 e 01/2026 e Termos de Homologação",
    "Folhas de Frequência Individuais com Ateste dos Polos (SEI 1050380 e 1050382)",
    "Planilha Consolidada de Cálculos de INSS (11%) e ISSQN (5%) - SEI 1060386",
    "Despacho Autoritativo da Reitora do IFS - Portaria nº 1051572 (SEI 1051572)",
    "Despacho Autoritativo do Ordenador de Despesa / PROAD (SEI 1050594)",
    "Comprovantes de Transmissão ao eSocial (Códigos 1099 e 1138 - SEI 1067415)",
    "Documentos de Arrecadação Municipal - DAMs de ISSQN (Aracaju, Lagarto, Propriá, Estância)",
    "Nota de Lançamento de Sistema da Folha - SIAFI 2026NS009337",
    "Título de Pagamento - SIAFI 2026NP001456",
    "Ordem Bancária PIX aos Bolsistas - SIAFI 2026OB004475 (Lista 2026LX000615)",
    "Listas de Faturas de Tributos ISS - 2026LF000871 a 2026LF000886 e 2026LF000898",
    "Notas de Sistema de Retenção de ISS - 2026NS010191 a 2026NS010316",
    "Ordens Bancárias de Recolhimento de ISS - 2026OB004859 a 2026OB004875",
    "Despacho de Encaminhamento à Conformidade dos Registros de Gestão (SEI 1070269)"
  ],
  evidenciasEncontradas: [
    {
      campo: "Valor Bruto Global da Folha de Julho/2026",
      valorOuConteudo: "R$ 21.785,71",
      documentoOrigem: "Solicitação SEI 1050337 e Planilha Tributária SEI 1060386",
      categoria: "Valores",
      impactoNoParecer: "Base de cálculo imponível correspondente ao somatório da remuneração e horas-aula dos 19 docentes colaboradores do programa."
    },
    {
      campo: "Valor Líquido Efetivamente Creditado aos Bolsistas",
      valorOuConteudo: "R$ 18.300,00",
      documentoOrigem: "2026NS009337 e Ordem Bancária 2026OB004475 (Lista 2026LX000615)",
      categoria: "Valores",
      impactoNoParecer: "Comprovou exata congruência matemática entre o valor bruto deduzido das retenções e o montante repassado via PIX aos docentes."
    },
    {
      campo: "Retenção Previdenciária INSS Segurado (11%)",
      valorOuConteudo: "R$ 2.396,43 (Declarado no eSocial código 1099 como R$ 2.396,37)",
      documentoOrigem: "Planilha SEI 1060386 e Despacho eSocial SEI 1067415",
      categoria: "Valores",
      impactoNoParecer: "Demonstrou a retenção compulsória e tempestivo repasse à Seguridade Social com base na Lei 8.212/91 e IN RFB 2.110/2022."
    },
    {
      campo: "Retenção Tributária de ISSQN Municipal (5%)",
      valorOuConteudo: "R$ 1.089,29 (Distribuído entre Aracaju, Lagarto, Propriá, Estância, etc.)",
      documentoOrigem: "Guias DAM e Listas de Faturas 2026LF000871 a 2026LF000898",
      categoria: "Valores",
      impactoNoParecer: "Evidenciou o cumprimento da obrigação tributária perante os municípios onde as aulas foram ministradas pelos docentes."
    },
    {
      campo: "Encargo Patronal da União - INSS 20%",
      valorOuConteudo: "R$ 4.357,14",
      documentoOrigem: "Planilha Orçamentária e Despacho eSocial código 1138",
      categoria: "Valores",
      impactoNoParecer: "Calculou com exatidão a obrigação patronal orçada na célula orçamentária do programa para recolhimento à Previdência."
    },
    {
      campo: "Assinatura da Autoridade Máxima (Reitora)",
      valorOuConteudo: "Ruth Sales Gama de Andrade (Reitora do IFS)",
      documentoOrigem: "Despacho SEI nº 1051572",
      categoria: "Assinaturas",
      impactoNoParecer: "Autorizou formalmente a realização da despesa institucional em cumprimento ao art. 64 da Lei nº 4.320/64."
    },
    {
      campo: "Assinatura do Ordenador de Despesas e Pró-Reitor",
      valorOuConteudo: "Alexandre Melo Diniz (Pró-Reitor de Administração / Ordenador)",
      documentoOrigem: "Despacho PROAD SEI nº 1050594 e 2026OB004475",
      categoria: "Assinaturas",
      impactoNoParecer: "Garantiu a autorização legítima de pagamento e segregação funcional dos agentes de conformidade."
    },
    {
      campo: "Atestes das Folhas de Frequência dos Cursos",
      valorOuConteudo: "Coordenadoras de Polo e Curso do Programa Mulheres Mil",
      documentoOrigem: "Folhas de Ponto/Frequência SEI 1050380 e 1050382",
      categoria: "Atestes e Certidões",
      impactoNoParecer: "Certificou a efetiva prestação dos serviços e cumprimento da carga horária didática de cada um dos 19 docentes."
    },
    {
      campo: "Classificação Orçamentária e Empenho em Restos a Pagar",
      valorOuConteudo: "Empenho 2025NE000820 / Natureza 33903606 / Fonte 1000A0008U / UGR 152523",
      documentoOrigem: "2025NE000820 e Espelho SIAFI de Restos a Pagar",
      categoria: "Classificação Orçamentária",
      impactoNoParecer: "Validou a correta classificação de Outros Serviços de Terceiros - Pessoa Física para pagamento de bolsas a docentes."
    },
    {
      campo: "Relação Bancária e Lista de Credores PIX",
      valorOuConteudo: "Lista de Credores nº 2026LX000615 (19 contas bancárias)",
      documentoOrigem: "2026LX000615 e 2026OB004475",
      categoria: "Atestes e Certidões",
      impactoNoParecer: "Comprovou o crédito direto nas contas individualizadas dos 19 bolsistas sem retenção indevida ou intermediação."
    }
  ],
  documentosSiafiAnalisados: [
    {
      tipo: "NE",
      numero: "2025NE000820",
      data: "18/01/2026 (Inscrição RP)",
      valor: 336440.00,
      favorecido: "UG 158134 - IFS Reitoria",
      eventos: ["Inscrição de Restos a Pagar Não Processados"],
      classificacaoOuContas: "Fonte 1000A0008U / UGR 152523 / ND 33903606 (Outros Serviços de Terceiros - PF)",
      descricaoOuObservacao: "ATENDER DESPESAS COM CONCESSÃO DE BOLSAS AOS DOCENTES EXTERNOS COLABORADORES DO PROGRAMA MULHERES MIL - PRONATEC/FIC/FNDE, REFERENTE AOS EDITAIS 37/2024, 35/2025 E 01/2026.",
      signatarios: ["Ordenador de Despesas e Gestor Financeiro"],
      status: "REGULAR",
      parecerTecnico: "Nota de Empenho inscrita em Restos a Pagar com saldo suficiente para amparar a folha de Julho/2026. Natureza 33903606 estritamente adequada."
    },
    {
      tipo: "NS",
      numero: "2026NS009337",
      data: "10/08/2026",
      valor: 18300.00,
      favorecido: "RB0000050 - FOLHA DE BOLSAS MULHERES MIL (19 BOLSISTAS)",
      eventos: ["401002 - Liquidação da Despesa", "521288 - Apropriação de Passivo", "511072 - Contabilização"],
      classificacaoOuContas: "33903606 / 214121401 / 371220100",
      descricaoOuObservacao: "LIQUIDAÇÃO DA FOLHA DE PAGAMENTO DE BOLSAS/REMUNERAÇÃO REFERENTE AO MÊS DE JULHO/2026 AOS 19 DOCENTES EXTERNOS DO PROGRAMA MULHERES MIL, EDITAIS 37/2024, 35/2025 E 01/2026, CONFORME PROCESSO SEI 23060.002402/2026-87.",
      signatarios: ["Tereza Cristina Freire (Contabilidade)", "Graziana Olinda (Supervisão)"],
      status: "REGULAR",
      parecerTecnico: "Liquidação plenamente regular. Demonstra o valor líquido de R$ 18.300,00 amparado pelas folhas de frequência com ateste e cálculo de retenções."
    },
    {
      tipo: "NP",
      numero: "2026NP001456",
      data: "10/08/2026",
      valor: 18300.00,
      favorecido: "RB0000050 - BOLSISTAS PROGRAMA MULHERES MIL",
      eventos: ["Programação Financeira de Pagamento"],
      status: "REGULAR",
      parecerTecnico: "Nota de Pagamento emitida no SIAFI vinculada à 2026NS009337 para disparo da Ordem Bancária via PIX."
    },
    {
      tipo: "OB",
      numero: "2026OB004475",
      data: "12/08/2026",
      valor: 18300.00,
      favorecido: "RB0000050 - 19 DOCENTES EXTERNOS (LISTA 2026LX000615)",
      eventos: ["401003 - Pagamento da Despesa", "531388 - Baixa de Passivo", "561602 - Saída de Recursos"],
      classificacaoOuContas: "33903606 / 214121401 / 1000A0008U",
      descricaoOuObservacao: "PAGAMENTO DA FOLHA DE BOLSAS REFERENTE A JULHO/2026 DOS DOCENTES DO PROGRAMA MULHERES MIL VIA LISTA DE CREDORES 2026LX000615.",
      signatarios: ["Alexandre Melo Diniz (Ordenador)", "Reinaldo Santos Oliveira Junior (Gestor Financeiro)"],
      status: "REGULAR",
      parecerTecnico: "Ordem Bancária regular com quitação integral e tempestiva através de remessa PIX ao Banco do Brasil com a Lista de Credores 2026LX000615."
    },
    {
      tipo: "NS",
      numero: "2026NS010191",
      data: "18/08/2026",
      valor: 642.86,
      favorecido: "MUNICÍPIO DE ARACAJU - SECRETARIA MUNICIPAL DA FAZENDA",
      eventos: ["401002 - Liquidação de Retenção de ISSQN"],
      descricaoOuObservacao: "RECOLHIMENTO DO ISSQN RETIDO DOS DOCENTES COM AULAS MINISTRADAS EM ARACAJU/SE, CONFORME DAM E PROCESSO 23060.002402/2026-87.",
      status: "REGULAR",
      parecerTecnico: "Nota de Sistema regular de liquidação de ISS retido dos docentes domiciliados ou com prestação no município sede."
    },
    {
      tipo: "OB",
      numero: "2026OB004859",
      data: "19/08/2026",
      valor: 642.86,
      favorecido: "PREFEITURA MUNICIPAL DE ARACAJU (DAM)",
      eventos: ["Pagamento de Obrigação Tributária Municipal"],
      status: "REGULAR",
      parecerTecnico: "Repasse do ISS retido à Fazenda Municipal tempestivamente antes do vencimento legal."
    }
  ],
  documentosProcessuaisDetalhados: [
    {
      tipo: "Solicitação",
      numeroSei: "1050337",
      folhaOuPagina: "Fls. 1-3",
      descricao: "Solicitação de Pagamento da Folha de Bolsas dos 19 docentes externos (Julho/2026) da Coordenação do Programa Mulheres Mil",
      signatarioOuSetor: "Coordenação Geral do Programa Mulheres Mil / PROPEX",
      data: "01/08/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Editais e Homologação",
      numeroSei: "Editais 37/24, 35/25, 01/26",
      folhaOuPagina: "Fls. 4-48",
      descricao: "Editais de Seleção Pública de Bolsistas Externos e seus respectivos Termos de Homologação de Resultado Final",
      signatarioOuSetor: "Comissão de Seleção / Direção Geral PROPEX",
      data: "2024-2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Folha de Frequência",
      numeroSei: "1050380 / 1050382",
      folhaOuPagina: "Fls. 49-88",
      descricao: "Folhas de Ponto e Frequência dos 19 docentes colaboradores com assinaturas e atestes das Coordenadoras de Polos",
      signatarioOuSetor: "Docentes Colaboradores e Coordenadoras de Curso",
      data: "Julho/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Planilha de Cálculos",
      numeroSei: "1060386",
      folhaOuPagina: "Fls. 89-94",
      descricao: "Memória de Cálculo de Remuneração, Dedução de INSS 11% (R$ 2.396,43) e ISS 5% (R$ 1.089,29) e Encargo Patronal (R$ 4.357,14)",
      signatarioOuSetor: "Coordenação Financeira Mulheres Mil",
      data: "04/08/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Despacho Reitoria",
      numeroSei: "1051572",
      folhaOuPagina: "Fl. 96",
      descricao: "Despacho da Reitora Ruth Sales Gama de Andrade autorizando a liquidação e pagamento da despesa",
      signatarioOuSetor: "Ruth Sales Gama de Andrade (Reitora)",
      data: "05/08/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Despacho PROAD",
      numeroSei: "1050594",
      folhaOuPagina: "Fl. 98",
      descricao: "Despacho do Pró-Reitor de Administração autorizando o prosseguimento da execução financeira",
      signatarioOuSetor: "Alexandre Melo Diniz (Pró-Reitor PROAD)",
      data: "06/08/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Comprovante eSocial",
      numeroSei: "1067415",
      folhaOuPagina: "Fls. 102-110",
      descricao: "Comprovantes de Transmissão ao eSocial (códigos 1099 - R$ 2.396,37 e 1138 - R$ 4.357,14) com protocolo de envio da Receita Federal",
      signatarioOuSetor: "Setor de eSocial e Folha / IFS",
      data: "14/08/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Guias DAM",
      numeroSei: "Guias ISS Municipais",
      folhaOuPagina: "Fls. 111-135",
      descricao: "Documentos de Arrecadação Municipal emitidos pelos municípios de atuação com comprovantes de quitação bancária autenticados",
      signatarioOuSetor: "Prefeituras Municipais / Setor Financeiro IFS",
      data: "Agosto/2026",
      statusConformidade: "CONFORME"
    },
    {
      tipo: "Despacho de Envio",
      numeroSei: "1070269",
      folhaOuPagina: "Fl. 140",
      descricao: "Despacho do Diretor de Contabilidade e Finanças encaminhando os autos à CGCONFREG para conformidade de registro de gestão",
      signatarioOuSetor: "Reinaldo Santos Oliveira Junior (Diretor DICOF)",
      data: "20/08/2026",
      statusConformidade: "CONFORME"
    }
  ],
  analiseDescricaoContabil: {
    textoObservacao: "LIQUIDAÇÃO DA FOLHA DE PAGAMENTO DE BOLSAS/REMUNERAÇÃO REFERENTE AO MÊS DE JULHO/2026 AOS 19 DOCENTES EXTERNOS DO PROGRAMA MULHERES MIL, EDITAIS 37/2024, 35/2025 E 01/2026, CONFORME PROCESSO SEI 23060.002402/2026-87.",
    qualidadeRedacao: "Excelente",
    avaliacaoCriteriosa: "A descrição contábil inserida na Nota de Lançamento de Sistema nº 2026NS009337 e Ordem Bancária nº 2026OB004475 atende com máxima fidelidade às determinações da Macrofunção SIAFI 020314: identifica o objeto específico (folha de bolsas docentes de Julho/2026), o programa institucional (Mulheres Mil - PRONATEC/FNDE), os atos convocatórios de seleção pública (Editais 37/2024, 35/2025 e 01/2026) e vincula expressamente o número do processo administrativo SEI nº 23060.002402/2026-87.",
    elementosIdentificados: [
      "Objeto bem delimitado: Pagamento de bolsas/remuneração a docentes externos",
      "Período de competência: Mês de Julho/2026",
      "Programa e fontes: Programa Mulheres Mil (FNDE/PRONATEC)",
      "Editais reguladores: Editais nº 37/2024, 35/2025 e 01/2026",
      "Processo SEI vinculado: 23060.002402/2026-87",
      "Célula orçamentária correta: Natureza 33903606 e Empenho 2025NE000820"
    ],
    apontamentosOuGralhas: []
  },
  parecerTecnicoEstruturado: {
    identificacao: {
      processoSei: "23060.002402/2026-87",
      ugGestao: "158134 / 26423 (IFS - Instituto Federal de Sergipe / Reitoria)",
      unidadeDemandante: "Pró-Reitoria de Extensão (PROPEX) / Coordenação do Programa Mulheres Mil",
      favorecido: "19 Docentes Externos Selecionados (Lista de Credores PIX 2026LX000615)",
      cnpjFavorecido: "Docentes Externos - Pessoas Físicas (CPFs nos autos)",
      enquadramentoLegal: "Lei nº 12.513/2011, Portaria MEC nº 817/2015, Resoluções CD/FNDE, Lei nº 4.320/1964 e Macrofunção SIAFI 020314",
      valorTotalProcesso: "R$ 21.785,71 (Líquido Pago: R$ 18.300,00 | Retenções: R$ 3.485,71 | Encargos Patronais: R$ 4.357,14)"
    },
    resumoObjeto: "Exame e auditoria contábil dos atos de liquidação e pagamento da folha de bolsas/remuneração referente ao mês de Julho/2026, devida a 19 docentes externos colaboradores vinculados ao Programa Mulheres Mil (Ciclo IV - PRONATEC/FIC/FNDE), selecionados mediante os Editais nº 37/2024, 35/2025 e 01/2026, com vistas à emissão de Conformidade dos Registros de Gestão no SIAFI nos termos da Macrofunção 020314.",
    analiseInstrucaoProcessual: "O processo administrativo SEI nº 23060.002402/2026-87 encontra-se instruído de forma exemplar. Constam nos autos a solicitação inicial da Coordenação do Programa (SEI 1050337), os editais de abertura e termos de homologação do resultado final das seleções públicas simplificadas, as folhas de frequência individuais dos 19 docentes devidamente assinadas e atestadas pelas Coordenadoras de Polos (SEI 1050380 e 1050382), a planilha de cálculos tributários detalhada (SEI 1060386), autorização expressa do Gabinete da Reitoria (SEI 1051572) e do Pró-Reitor de Administração (SEI 1050594), e os comprovantes de transmissão ao eSocial e pagamento tempestivo das guias municipais de ISSQN.",
    analiseExecucaoOrcamentariaFinanceira: "A despesa encontra-se regularmente empenhada através da Nota de Empenho nº 2025NE000820, inscrita em Restos a Pagar em 18/01/2026 com saldo suficiente de R$ 336.440,00, na Natureza de Despesa 33903606 (Outros Serviços de Terceiros - Pessoa Física), UGR 152523 e Fonte 1000A0008U. A liquidação no montante líquido de R$ 18.300,00 (2026NS009337) e a emissão da Ordem Bancária (2026OB004475) observaram rigorosamente os estágios da despesa previstos nos arts. 58 a 64 da Lei nº 4.320/1964.",
    analiseDocumentoHabilELiquidacao: "Tratando-se de pagamento de bolsas e remuneração de docentes externos pessoas físicas amparadas pela Lei nº 12.513/2011 e Portaria MEC nº 817/2015, o documento hábil de liquidação é consubstanciado pelas Folhas de Frequência atestadas pelas coordenações pedagógicas, Memória de Cálculo de Horas-Aula e Lista de Credores PIX (2026LX000615), dispensando formalmente emissão de Nota Fiscal mercantil, em estrita conformidade com a legislação financeira pública.",
    analiseTributariaERetencoes: "A análise tributária e previdenciária atesta perfeita regularidade: sobre o valor bruto de R$ 21.785,71 incidiu a retenção previdenciária de 11% (Contribuinte Individual) no valor total de R$ 2.396,43 (declarado no eSocial código 1099 como R$ 2.396,37 em razão dos arredondamentos normativos por CPF), além do encargo patronal da União de 20% (R$ 4.357,14, código 1138). Houve ainda a retenção do ISSQN municipal à alíquota de 5% no valor global de R$ 1.089,29, formalmente liquidado e pago às prefeituras competentes mediante DAMs autenticadas.",
    analiseDocumentosSiafi: "Foram examinados todos os registros efetuados no SIAFI: a Nota de Empenho 2025NE000820, a Nota de Sistema de Liquidação 2026NS009337, o Título de Pagamento 2026NP001456, a Ordem Bancária 2026OB004475, as Listas de Faturas 2026LF000871 a 2026LF000898, as Notas de Sistema de retenção 2026NS010191 a 2026NS010316 e as Ordens Bancárias de repasse municipal 2026OB004859 a 2026OB004875. Todos os atos apresentam conformidade cronológica, perfeita congruência de valores e correta segregação de funções contábeis e ordenadoras.",
    auditoriaSiafiProfunda: {
      estagioOrcamentario: "Empenho prévio 2025NE000820 em Restos a Pagar na célula 33903606, com saldo remanescente suficiente para cobertura da folha.",
      estagioLiquidacao: "Liquidação efetuada via 2026NS009337 pelo valor líquido de R$ 18.300,00, amparada pelas folhas de frequência com ateste tempestivo.",
      estagioPagamento: "Ordem Bancária 2026OB004475 transmitida com sucesso ao Banco do Brasil com a Lista de Credores PIX 2026LX000615 (19 beneficiários).",
      conformidadeTributaria: "Retenções de R$ 3.485,71 (INSS 11% R$ 2.396,43 e ISS 5% R$ 1.089,29) integralmente recolhidas e informadas ao eSocial.",
      fidedignidadeEscritaContabil: "Texto do campo OBSERVAÇÃO explicita os 19 docentes, os Editais reguladores, o mês de referência Julho/2026 e o Processo SEI.",
      segregacaoFuncoes: "Segregação respeitada entre agentes lançadores (Tereza Cristina/Graziana), Ordenador de Despesas (Alexandre Melo) e Gestor Financeiro (Reinaldo Junior).",
      totalDocumentosSiafiAuditados: 16,
      documentosSiafiApurados: [
        "2025NE000820", "2026NS009337", "2026NP001456", "2026OB004475",
        "2026LF000871", "2026LF000872", "2026LF000875", "2026LF000886", "2026LF000898",
        "2026NS010191", "2026NS010192", "2026NS010215", "2026NS010219", "2026NS010316",
        "2026OB004859", "2026OB004875"
      ]
    },
    analiseEscritaObservacoesContabeis: "As descrições inseridas nos campos OBSERVAÇÃO de todos os atos contábeis auditados cumprem com primor a Macrofunção SIAFI 020314, garantindo a rastreabilidade incontestável entre a contabilidade pública federal e os autos do processo administrativo SEI.",
    normasAplicaveis: [
      {
        norma: "Lei nº 12.513/2011 e Portaria MEC nº 817/2015",
        esferaOuOrgao: "Federal / Ministério da Educação",
        aplicacaoNoProcesso: "Regulamentação do Programa Mulheres Mil e remuneração/bolsas de docentes colaboradores.",
        fundamentacaoLegal: "Legitimidade do pagamento de bolsas a profissionais externos selecionados por edital público.",
        statusAtendimento: "CONFORME"
      },
      {
        norma: "Lei nº 4.320/1964, Arts. 58 a 64",
        esferaOuOrgao: "Federal / Direito Financeiro",
        aplicacaoNoProcesso: "Estágios da despesa pública: empenho, liquidação comprovada e autorização de pagamento.",
        fundamentacaoLegal: "Cumprimento estrito dos atestes de frequência e autorização das autoridades ordenadoras.",
        statusAtendimento: "CONFORME"
      },
      {
        norma: "Macrofunção SIAFI 020314",
        esferaOuOrgao: "Tesouro Nacional / STN",
        aplicacaoNoProcesso: "Conformidade dos Registros de Gestão dos atos no SIAFI.",
        fundamentacaoLegal: "Fidedignidade dos registros contábeis, regularidade dos eventos e segregação de funções.",
        statusAtendimento: "CONFORME"
      },
      {
        norma: "Instrução Normativa RFB nº 2.110/2022 e Legislações Municipais de ISSQN",
        esferaOuOrgao: "Receita Federal do Brasil / Fazendas Municipais",
        aplicacaoNoProcesso: "Retenção na fonte de 11% de INSS de autônomos e 5% de ISS retido via DAM.",
        fundamentacaoLegal: "Retenção e recolhimento tempestivo de todas as obrigações previdenciárias e tributárias.",
        statusAtendimento: "CONFORME"
      }
    ],
    inconsistenciasDetectadas: [
      {
        item: "Auditoria Global da Folha e Retenções",
        tipoInconsistencia: "SEM INCONSISTÊNCIA",
        descricao: "Não foi detectada nenhuma inconsistência material, orçamentária, fiscal ou de segregação de funções nos autos.",
        fundamentacaoLegal: "Lei nº 4.320/64, Lei 12.513/11 e Macrofunção SIAFI 020314.",
        impactoRisco: "NENHUM / CONFORME",
        acaoSaneadoraOuJustificativa: "Processo apto ao registro regular de conformidade de gestão diária no SIAFI."
      }
    ],
    conclusaoEEncaminhamento: "Ante o exposto, considerando a regularidade da instrução processual, a existência de empenho prévio com saldo suficiente em Restos a Pagar, o ateste tempestivo da prestação dos serviços didáticos pelas coordenações, a exatidão das retenções previdenciárias e tributárias recolhidas aos cofres públicos e a perfeita observância da Macrofunção SIAFI 020314, este auditor conclui que o processo administrativo SEI nº 23060.002402/2026-87 encontra-se plenamente REGULAR e APTO ao registro de conformidade de gestão SEM OCORRÊNCIA.",
    registroSugerido: "SEM OCORRÊNCIA"
  },
  parecerConclusivo: "Auditado o processo SEI nº 23060.002402/2026-87 referente ao pagamento de bolsas/remuneração a 19 docentes externos do Programa Mulheres Mil (Julho/2026), constata-se a integral conformidade documental, orçamentária e tributária. Os serviços foram regularmente atestados pelas coordenações de polos, o empenho em Restos a Pagar (2025NE000820) possui saldo hábil, as retenções de INSS 11% (R$ 2.396,43) e ISSQN 5% (R$ 1.089,29) foram apuradas e recolhidas tempestivamente, e os atos no SIAFI observam a Macrofunção 020314. Parecer favorável à homologação SEM OCORRÊNCIA.",
  sugestaoConformista: "Registrar no SIAFI a Conformidade Diária dos atos de gestão sob o status SEM OCORRÊNCIA (Conforme), em cumprimento à Macrofunção SIAFI 020314.",
  confiancaAnalise: "Motor Especialista Normativo IFS (Auditado Rigoroso)"
};

export const DEMO_UNIR_POCO_REDONDO: ProcessAuditResult = {
  processo: "23856.000189/2026-12",
  numeroDoc: "NFS-e 2026001316 / 2026NE000035 / 2026NS010548",
  tipoDoc: "DD - Documento de Despesa",
  naturezaProcesso: "AQUISIÇÃO_OU_SERVIÇO",
  favorecido: {
    nome: "UNIR LOCACOES E SERVICOS LTDA",
    cnpjCpf: "15.454.009/0001-40"
  },
  valores: {
    valorBruto: 15031.40,
    retencoes: 6184.73,
    valorLiquido: 8846.67,
    detalheRetencoes: "R$ 6.184,73 (Deduções discriminadas: ISSQN Poço Redondo 5% R$ 751,57 pago via 2026OB005030 / LF 2026LF000909; Retenção de Conta Vinculada R$ 2.269,12 depositada em garantia no Banco do Brasil via 2026OB005032; Retenções tributárias federais no GERCOMP vinculadas à 2026NP001637: DARF IR/PIS/COFINS/CSLL no montante de R$ 3.164,04)."
  },
  resultado: "SEM OCORRÊNCIA",
  restricoesDetectadas: [],
  documentosIdentificados: [
    "NFS-e 2026001316 (R$ 15.031,40 - Prefeitura de Lagarto)",
    "Contrato Administrativo nº 52/2025 (Limpeza e Conservação)",
    "Termo de Atestado de Liquidação assinado pelo Fiscal Técnico (Fl. 41)",
    "Instrumento de Medição de Resultado - IMR Nota 97 (Fls. 38-40)",
    "Relatório Mensal Circunstanciado de Acompanhamento (Fl. 33)",
    "Folha de Pagamento dos Terceirizados e Comprovantes Salariais SISBB (Fls. 5-21)",
    "Nota de Empenho 2026NE000035 (UG 158134 / UGR 154626)",
    "Nota de Lançamento de Sistema 2026NS010548",
    "Nota de Programação de Pagamento 2026NP001637",
    "Lista de Fatura SIAFI 2026LF000114 (ISSQN Poço Redondo)",
    "Ordem Bancária 2026OB005030 (R$ 8.846,67 - Líquido Favorecido)",
    "Ordem Bancária 2026OB005031 (R$ 751,57 - ISSQN Prefeitura Municipal)",
    "Ordem Bancária 2026OB005032 (R$ 2.269,12 - Depósito em Conta Vinculada Bloqueada)",
    "Guia de FGTS Digital Paga de R$ 21.298,65 (Fl. 52)",
    "Certidões de Regularidade Fiscal e Trabalhista (SICAF, CND Federal, CNDT e CRF/FGTS)"
  ],
  checklistAvaliado: [
    {
      item: "Nota de Empenho Prévia e Suficiência Orçamentária (Art. 60 da Lei nº 4.320/64)",
      status: "CONFORME",
      observacao: "Nota de Empenho 2026NE000035 emitida tempestivamente em 13/01/2026 na célula orçamentária 33903702 (Limpeza e Conservação), UG 158134 e UGR 154626 (Poço Redondo), com saldo hábil para suportar a fatura mensal."
    },
    {
      item: "Documento Hábil de Despesa e Nota Fiscal de Serviços (Art. 63 da Lei nº 4.320/64)",
      status: "CONFORME",
      observacao: "NFS-e nº 2026001316 emitida pela Prefeitura Municipal de Lagarto/SE em 14/09/2026 no valor de R$ 15.031,40, detalhando os 4 postos de trabalho de limpeza do Campus Poço Redondo (3 sem insalubridade e 1 com insalubridade)."
    },
    {
      item: "Fiscalização Técnica, Relatório Mensal e Atesto de Liquidação (Arts. 62 e 63 da Lei 4.320/64)",
      status: "CONFORME",
      observacao: "Atestado de Liquidação SEI nº 1073756 firmado pelo fiscal de contrato Gabriel Cruz em 16/09/2026, com Relatório Mensal SEI nº 1073725 e Instrumento de Medição de Resultado - IMR (SEI 1073751) com nota 97 (Conceito BOM)."
    },
    {
      item: "Comprovação de Pagamento de Salários, Ponto e Encargos Trabalhistas dos Terceirizados",
      status: "CONFORME",
      observacao: "Folha de ponto de agosto/2026, contracheques individuais e comprovantes de transferência bancária SISBB Banco do Brasil comprovando pagamento tempestivo dos salários e vale-alimentação aos 4 colaboradores (Fls. 5-21)."
    },
    {
      item: "Escrituração e Fidedignidade da Nota de Sistema no SIAFI (Macrofunção 020314)",
      status: "CONFORME",
      observacao: "Nota de Sistema 2026NS010548 emitida pelo contador Jean Claude Sauthier em 16/09/2026, com eventos de apropriação 521214, liquidação 401002 e segregação das contas de passivo e deduções tributárias."
    },
    {
      item: "Retenção da Conta Vinculada e Depósito de Garantia no Banco do Brasil",
      status: "CONFORME",
      observacao: "Retenção de 31,82% sobre a mão de obra no valor de R$ 2.269,12 devidamente transferida em garantia para a Conta Vinculada nº 3500128311573 no Banco do Brasil via Ordem Bancária 2026OB005032."
    },
    {
      item: "Retenção e Recolhimento de ISSQN Municipal e Tributos Federais (IN RFB 1.234/12)",
      status: "CONFORME",
      observacao: "ISSQN de 5% (R$ 751,57) quitado à Fazenda de Poço Redondo via 2026OB005030 / 2026LF000909. Tributos federais agendados no GERCOMP através do título 2026NP001637 para liquidação tempestiva."
    },
    {
      item: "Regularidade Fiscal, Previdenciária e Trabalhista (SICAF, FGTS, CNDT e Fazendas)",
      status: "CONFORME",
      observacao: "SICAF com nível de credenciamento válido até 2027 (Fl. 52), CNDT trabalhista até 15/03/2027, FGTS com Certificado de Regularidade até 04/10/2026 acompanhado da Guia GFD paga (R$ 21.298,65), e certidões fazendárias federal, estadual e municipal todas regulares."
    }
  ],
  evidenciasEncontradas: [
    {
      campo: "Valor Faturado da NFS-e",
      valorOuConteudo: "R$ 15.031,40 (NFS-e 2026001316)",
      documentoOrigem: "NFS-e nº 2026001316 emitida em 14/09/2026 (Fl. 1)",
      categoria: "Valores",
      impactoNoParecer: "Documento fiscal emitido com CNPJ correto do fornecedor e tomador, correspondendo à exata medição contratual."
    },
    {
      campo: "Nota de Empenho Vinculada",
      valorOuConteudo: "2026NE000035 (R$ 16.156,63 global)",
      documentoOrigem: "SIAFI 2026NE000035 emitida em 13/01/2026 (Fls. 42-43)",
      categoria: "Classificação Orçamentária",
      impactoNoParecer: "Empenho prévio e regular na Natureza 33903702, UGR 154626 (Campus Poço Redondo)."
    },
    {
      campo: "Atestado de Liquidação e IMR",
      valorOuConteudo: "Atestado SEI 1073756 / IMR Nota 97",
      documentoOrigem: "SEI nº 1073756 assinado pelo fiscal Gabriel Cruz em 16/09/2026 (Fl. 41)",
      categoria: "Atestes e Certidões",
      impactoNoParecer: "Atendimento formal e material ao Art. 63 da Lei nº 4.320/64 e termos do Contrato 52/2025."
    },
    {
      campo: "Pagamento Líquido à Contratada",
      valorOuConteudo: "R$ 8.846,67 (2026OB005031)",
      documentoOrigem: "SIAFI 2026OB005031 emitida em 17/09/2026 (Fl. 57)",
      categoria: "Valores",
      impactoNoParecer: "Ordem Bancária com crédito direto na conta do Banco Sicredi da empresa UNIR Locações."
    },
    {
      campo: "Depósito em Conta Vinculada",
      valorOuConteudo: "R$ 2.269,12 (2026OB005032)",
      documentoOrigem: "SIAFI 2026OB005032 no Banco do Brasil Ag. 3500 c/c 128311573 (Fl. 58)",
      categoria: "Valores",
      impactoNoParecer: "Retenção de garantia das verbas rescisórias trabalhistas (férias e 13º) em conformidade com a IN SEGES/MP nº 05/2017."
    },
    {
      campo: "Recolhimento do ISSQN Municipal",
      valorOuConteudo: "R$ 751,57 (2026OB005030 / 2026LF000909)",
      documentoOrigem: "SIAFI 2026OB005030 para Prefeitura de Poço Redondo (Fl. 56)",
      categoria: "Valores",
      impactoNoParecer: "Quitação regular da retenção tributária municipal na fonte."
    },
    {
      campo: "Programação de Tributos Federais",
      valorOuConteudo: "R$ 3.164,04 agendados no GERCOMP",
      documentoOrigem: "SIAFI 2026NP001637 e Consulta GERCOMP (Fls. 48 e 55)",
      categoria: "Normativo / Autorizativo",
      impactoNoParecer: "Compromisso formalizado para compensação dos DARFs de IRRF, PIS, COFINS e CSLL."
    },
    {
      campo: "Regularidade Trabalhista e Previdenciária",
      valorOuConteudo: "SICAF válido até 2027 / FGTS regular / CNDT válida",
      documentoOrigem: "SICAF (Fl. 52), CRF FGTS (Fl. 28) e CNDT (Fl. 26)",
      categoria: "Atestes e Certidões",
      impactoNoParecer: "Comprovação plena da regularidade fiscal e trabalhista exigida pelo art. 68 da Lei 14.133/21."
    }
  ],
  documentosSiafiAnalisados: [
    {
      tipo: "NE",
      numero: "2026NE000035",
      data: "13/01/2026",
      valor: 16156.63,
      favorecido: "15.454.009/0001-40 - UNIR LOCACOES E SERVICOS LTDA",
      eventos: ["401201 - Empenho de Despesa Orçamentária"],
      classificacaoOuContas: "33903702 - Limpeza e Conservação / UG 158134 / UGR 154626",
      descricaoOuObservacao: "ATENDER DESPESA COM PRESTACAO DE SERVICOS CONTINUADOS DE LIMPEZA E CONSERVACAO PREDIAL DO IFS CAMPUS POCO REDONDO, CONFORME CONTRATO 52/2025 E PROCESSO SEI 23856.000189/2026-12.",
      signatarios: ["Ordenador de Despesas IFS"],
      status: "REGULAR",
      parecerTecnico: "Empenho prévio emitido tempestivamente no início do exercício financeiro com saldo orçamentário suficiente."
    },
    {
      tipo: "NS",
      numero: "2026NS010548",
      data: "16/09/2026",
      valor: 15031.40,
      favorecido: "15.454.009/0001-40 - UNIR LOCACOES E SERVICOS LTDA",
      eventos: ["401002 - Liquidação da Despesa", "521214 - Apropriação de Serviços Terceiros", "521494 - Retenção Previdenciária", "521472 - Retenção ISSQN", "521010 - Depósito Conta Vinculada"],
      classificacaoOuContas: "33903702 / 214121401 (Fornecedores a Pagar) / 218810100 (Obrigações Fiscais e Retenções)",
      descricaoOuObservacao: "REGISTRO CONTABIL DA DESPESA REF. AO SERVICO DE LIMPEZA, ASSEIO E CONSERVACAO PARA O IFS/POCO REDONDO NO MES 08/2026, NFSE 2026001316 NO VALOR DE R$ 15.031,40, CONTRATO 52/2025, UNIR LOCACOES E SERVICOS LTDA - CNPJ 15.454.009/0001-40 E PROC. 23856.000189/2026-12.",
      signatarios: ["Jean Claude Sauthier (Contador IFS)"],
      status: "REGULAR",
      parecerTecnico: "Liquidação efetuada com rigor contábil amparada no Atestado SEI nº 1073756 e NFS-e nº 2026001316."
    },
    {
      tipo: "NP",
      numero: "2026NP001637",
      data: "16/09/2026",
      valor: 15031.40,
      favorecido: "15.454.009/0001-40 - UNIR LOCACOES E SERVICOS LTDA",
      eventos: ["401004 - Programação de Pagamento de Título de Crédito"],
      classificacaoOuContas: "214121401 / Vencimento: 30/09/2026",
      descricaoOuObservacao: "TITULO DE CREDITO PROGRAMADO NO SIAFI PARA LIQUIDACAO DO SALDO LIQUIDO E RETENCOES DA NFS-E 2026001316.",
      signatarios: ["Setor de Tesouraria e Finanças"],
      status: "REGULAR",
      parecerTecnico: "Nota de Pagamento emitida regularmente com agendamento no GERCOMP para as retenções tributárias federais."
    },
    {
      tipo: "OB",
      numero: "2026OB005030",
      data: "17/09/2026",
      valor: 751.57,
      favorecido: "PREFEITURA MUNICIPAL DE POÇO REDONDO / BANCO DO BRASIL",
      eventos: ["401003 - Pagamento de Retenção Tributária Municipal", "561602 - Saída Financeira"],
      classificacaoOuContas: "218810100 / Lista Fatura 2026LF000909",
      descricaoOuObservacao: "RECOLHIMENTO DE ISSQN RETIDO DA NFS-E 2026001316 - UNIR LOCACOES, CONTRATO 52/2025, COMPETENCIA 08/2026.",
      signatarios: ["Ordenador de Despesa", "Gestor Financeiro"],
      status: "REGULAR",
      parecerTecnico: "Ordem Bancária com acate pelo Banco Central efetuando o repasse tempestivo do ISS municipal retido."
    },
    {
      tipo: "OB",
      numero: "2026OB005031",
      data: "17/09/2026",
      valor: 8846.67,
      favorecido: "15.454.009/0001-40 - UNIR LOCACOES E SERVICOS LTDA",
      eventos: ["401003 - Pagamento de Despesa Liquidada", "531388 - Baixa de Obrigação Fornecedor"],
      classificacaoOuContas: "Conta Única do Tesouro / Banco Sicredi (Ag. 2102, C/C 55336)",
      descricaoOuObservacao: "PAGAMENTO LIQUIDO DA FATURA NFS-E 2026001316 REF. SERVICOS DE LIMPEZA E CONSERVACAO PREDIAL POCO REDONDO - AGOSTO/2026.",
      signatarios: ["Ordenador de Despesas IFS", "Gestor Financeiro"],
      status: "REGULAR",
      parecerTecnico: "Ordem Bancária de liquidação com quitação bancária efetivada em favor da contratada."
    },
    {
      tipo: "OB",
      numero: "2026OB005032",
      data: "17/09/2026",
      valor: 2269.12,
      favorecido: "BANCO DO BRASIL S.A. - CONTA VINCULADA BLOQUEADA PARA MOVIMENTAÇÃO",
      eventos: ["401003 - Depósito de Retenção Trabalhista em Garantia", "561602 - Saída Financeira"],
      classificacaoOuContas: "Agência 3500 / Conta Vinculada nº 3500128311573",
      descricaoOuObservacao: "DEPOSITO EM CONTA VINCULADA DO IFS REF. ENCARGOS TRABALHISTAS RESCISORIOS (31,82% DA MO) - FATURA 2026001316, UNIR LOCACOES.",
      signatarios: ["Ordenador de Despesas IFS", "Gestor Financeiro"],
      status: "REGULAR",
      parecerTecnico: "Depósito em conta corrente vinculada bloqueada para movimentação, resguardando os direitos sociais dos trabalhadores."
    }
  ],
  documentosProcessuaisDetalhados: [
    {
      tipo: "NFS-e",
      numeroSei: "NFS-e 2026001316",
      folhaOuPagina: "Fl. 1",
      descricao: "Nota Fiscal de Serviços Eletrônica emitida pela Prefeitura de Lagarto/SE em 14/09/2026, no valor de R$ 15.031,40.",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Prefeitura Municipal de Lagarto / Emitida por UNIR Locações"
    },
    {
      tipo: "Atestado de Liquidação",
      numeroSei: "SEI 1073756",
      folhaOuPagina: "Fl. 41",
      descricao: "Atestado formal assinado eletronicamente pelo Fiscal de Contrato Gabriel Cruz em 16/09/2026.",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Gabriel Cruz - Fiscal Técnico do Contrato nº 52/2025"
    },
    {
      tipo: "IMR e Relatório Técnico",
      numeroSei: "SEI 1073751 e 1073725",
      folhaOuPagina: "Fls. 33 e 38-40",
      descricao: "Instrumento de Medição de Resultado com nota 97 (Conceito BOM) e Relatório Mensal de Acompanhamento.",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Comissão de Fiscalização / Fiscal Técnico"
    },
    {
      tipo: "Folha e Comprovantes Salariais",
      numeroSei: "Processo SEI Fls. 5-21",
      folhaOuPagina: "Fls. 5 a 21",
      descricao: "Espelhos de ponto, contracheques e comprovantes SISBB de quitação salarial e vale-alimentação dos 4 funcionários.",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Setor Financeiro / Fiscalização Trabalhista"
    },
    {
      tipo: "Nota de Empenho",
      numeroSei: "2026NE000035",
      folhaOuPagina: "Fls. 42-43",
      descricao: "Nota de Empenho SIAFI no valor de R$ 16.156,63 na dotação 33903702, UGR 154626.",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Coordenação de Execução Orçamentária - IFS"
    },
    {
      tipo: "Nota de Sistema",
      numeroSei: "2026NS010548",
      folhaOuPagina: "Fls. 48-50",
      descricao: "Nota de Lançamento de Sistema no SIAFI apropriando a fatura de R$ 15.031,40 e registrando as deduções legais.",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Coordenação de Contabilidade e Finanças - IFS"
    },
    {
      tipo: "Ordens Bancárias",
      numeroSei: "2026OB005030 / 005031 / 005032",
      folhaOuPagina: "Fls. 56-58",
      descricao: "Ordens Bancárias SIAFI quitando o líquido à contratada (R$ 8.846,67), ISSQN (R$ 751,57) e Conta Vinculada (R$ 2.269,12).",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Ordenador de Despesas / Tesouraria do IFS"
    },
    {
      tipo: "Certidões de Regularidade",
      numeroSei: "SICAF / CND Federal / CNDT / FGTS",
      folhaOuPagina: "Fls. 22-30 e 52",
      descricao: "Certidões negativas fiscais, trabalhistas e previdenciárias acompanhadas da guia de FGTS Digital paga de R$ 21.298,65.",
      statusConformidade: "CONFORME",
      signatarioOuSetor: "Fiscal Administrativo / Consulta SICAF"
    }
  ],
  analiseDescricaoContabil: {
    textoObservacao: "REGISTRO CONTABIL DA DESPESA REF. AO SERVICO DE LIMPEZA, ASSEIO E CONSERVACAO PARA O IFS/POCO REDONDO NO MES 08/2026, NFSE 2026001316 NO VALOR DE R$ 15.031,40, CONTRATO 52/2025, UNIR LOCACOES E SERVICOS LTDA - CNPJ 15.454.009/0001-40 E PROC. 23856.000189/2026-12.",
    qualidadeRedacao: "Excelente",
    avaliacaoCriteriosa: "O campo OBSERVAÇÃO da Nota de Lançamento de Sistema nº 2026NS010548 e dos demais atos contábeis no SIAFI cumpre exemplarmente os ditames da Macrofunção 020314. O texto descreve com total precisão: a) A natureza do serviço (limpeza, asseio e conservação predial); b) O campus atendido (Poço Redondo); c) O mês de competência (Agosto/2026); d) O número da NFS-e (2026001316) e valor exato; e) O número do Contrato (52/2025); f) A razão social e CNPJ da empresa; g) A vinculação inequívoca ao Processo SEI nº 23856.000189/2026-12.",
    elementosIdentificados: [
      "Objeto bem delimitado: Serviço de limpeza, asseio e conservação predial",
      "Campus de destino: IFS Campus Poço Redondo",
      "Mês de competência: Agosto/2026",
      "Documento fiscal de suporte: NFS-e 2026001316 no valor de R$ 15.031,40",
      "Vínculo contratual: Contrato nº 52/2025",
      "Fornecedor: UNIR LOCACOES E SERVICOS LTDA (CNPJ 15.454.009/0001-40)",
      "Processo SEI vinculado: 23856.000189/2026-12"
    ],
    apontamentosOuGralhas: []
  },
  parecerTecnicoEstruturado: {
    identificacao: {
      processoSei: "23856.000189/2026-12",
      ugGestao: "158134 / 26423 (IFS - Campus Poço Redondo)",
      unidadeDemandante: "Direção Geral do IFS Campus Poço Redondo",
      favorecido: "UNIR LOCACOES E SERVICOS LTDA",
      cnpjFavorecido: "15.454.009/0001-40",
      enquadramentoLegal: "Lei nº 14.133/2021, Lei nº 4.320/1964, IN SEGES/MP nº 05/2017 e Macrofunção SIAFI 020314",
      valorTotalProcesso: "R$ 15.031,40 (Líquido: R$ 8.846,67 | Retenções Tributárias e Garantias: R$ 6.184,73)"
    },
    resumoObjeto: "Auditoria contábil e de conformidade documental dos atos de liquidação e pagamento referentes à prestação dos serviços contínuos de limpeza, asseio e conservação predial, com dedicação exclusiva de mão de obra (4 postos), nas dependências do IFS Campus Poço Redondo, correspondente à competência de Agosto/2026, amparado pelo Contrato nº 52/2025.",
    analiseInstrucaoProcessual: "O processo administrativo SEI nº 23856.000189/2026-12 encontra-se perfeitamente autuado e instruído. Constam nos autos a NFS-e nº 2026001316 (Fl. 1), os cartões de ponto, recibos salariais e comprovantes SISBB de pagamento aos 4 funcionários terceirizados (Fls. 5-21), atestado de regularidade perante o SICAF e certidões negativas válidas (Fls. 22-30), Relatório de Acompanhamento Mensal SEI nº 1073725 (Fl. 33), Instrumento de Medição de Resultado - IMR com nota 97 (SEI 1073751, Fls. 38-40), Atestado de Liquidação assinado pelo fiscal de contrato Gabriel Cruz (SEI 1073756, Fl. 41), Nota de Empenho 2026NE000035 (Fl. 42), Nota de Sistema 2026NS010548 (Fl. 48), Nota de Pagamento 2026NP001637 (Fl. 48 e 55), Ordens Bancárias 2026OB005030, 2026OB005031 e 2026OB005032 (Fls. 56-58) e Despacho de Encaminhamento da Coordenadora Tereza Freire (SEI 1076687, Fl. 60).",
    analiseExecucaoOrcamentariaFinanceira: "A despesa foi empenhada previamente através da Nota de Empenho 2026NE000035 emitida em 13/01/2026, na Natureza de Despesa 33903702 (Locação de Mão de Obra / Limpeza e Conservação), UG 158134 e UGR 154626 (Campus Poço Redondo), em total observância ao art. 60 da Lei nº 4.320/64. A execução financeira obedeceu ao encadeamento dos estágios da despesa pública, culminando com o pagamento líquido à empresa e o repasse das retenções.",
    analiseDocumentoHabilELiquidacao: "A liquidação da despesa cumpriu integralmente os arts. 62 e 63 da Lei nº 4.320/64. O documento hábil é a NFS-e nº 2026001316 no valor bruto de R$ 15.031,40, lastreada no Atestado de Liquidação firmado pelo fiscal do contrato Gabriel Cruz, no Relatório de Fiscalização e no IMR (nota 97). Restou devidamente comprovada a efetiva prestação dos serviços e o cumprimento das obrigações salariais dos 4 funcionários.",
    analiseTributariaERetencoes: "A segregação dos tributos e garantias rescisórias foi realizada de maneira exemplar: o ISSQN de 5% no valor de R$ 751,57 foi retido e pago ao Município de Poço Redondo via 2026OB005030 / 2026LF000909; a retenção para a Conta Vinculada de férias, 13º e rescisões no valor de R$ 2.269,12 foi depositada no Banco do Brasil via 2026OB005032; os tributos federais (IRRF, PIS, COFINS e CSLL) no valor de R$ 3.164,04 foram agendados no GERCOMP via 2026NP001637 para recolhimento em DARF.",
    analiseDocumentosSiafi: "Foram analisados todos os atos emitidos no SIAFI: Nota de Empenho 2026NE000035, Nota de Sistema 2026NS010548 (emitida por Jean Claude Sauthier), Nota de Pagamento 2026NP001637, Lista de Fatura 2026LF000909 e as Ordens Bancárias 2026OB005030, 2026OB005031 e 2026OB005032. Todos os registros apresentam perfeita conformidade de valores, eventos e cronologia contábil.",
    auditoriaSiafiProfunda: {
      estagioOrcamentario: "Nota de Empenho prévia 2026NE000035 emitida em 13/01/2026 na natureza 33903702, UGR 154626, com saldo orçamentário suficiente.",
      estagioLiquidacao: "Liquidação efetuada na 2026NS010548 pelo valor bruto de R$ 15.031,40 com apropriação exata dos 4 postos de limpeza e retenções legais.",
      estagioPagamento: "Três Ordens Bancárias emitidas e acatadas pelo Banco Central: 2026OB005031 (Líquido à empresa R$ 8.846,67), 2026OB005030 (ISSQN Poço Redondo R$ 751,57) e 2026OB005032 (Conta Vinculada BB R$ 2.269,12).",
      conformidadeTributaria: "Retenção e quitação regular de ISSQN de 5% (R$ 751,57), retenção e depósito de garantia em Conta Vinculada (R$ 2.269,12) e agendamento de tributos federais no GERCOMP (R$ 3.164,04).",
      fidedignidadeEscritaContabil: "Campo OBSERVAÇÃO da NS 2026NS010548 descreve com total precisão o serviço, campus Poço Redondo, mês 08/2026, contrato 52/2025, NFS-e 2026001316 e processo SEI 23856.000189/2026-12.",
      segregacaoFuncoes: "Segregação rigorosa observada entre o Fiscal Técnico do Contrato (Gabriel Cruz), o Contador emissor dos atos no SIAFI (Jean Claude Sauthier), o Ordenador de Despesas e os Gestores Financeiros.",
      totalDocumentosSiafiAuditados: 7,
      documentosSiafiApurados: [
        "2026NE000035", "2026NS010548", "2026NP001637", "2026LF000909",
        "2026OB005030", "2026OB005031", "2026OB005032"
      ]
    },
    analiseEscritaObservacoesContabeis: "As descrições inseridas nos campos OBSERVAÇÃO de todos os atos contábeis no SIAFI cumprem rigorosamente os padrões da Macrofunção SIAFI 020314, proporcionando transparência e rastreabilidade fidedigna aos autos do processo SEI nº 23856.000189/2026-12.",
    normasAplicaveis: [
      {
        norma: "Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos)",
        esferaOuOrgao: "Federal / Licitações e Contratos",
        aplicacaoNoProcesso: "Execução regular do Contrato nº 52/2025 e verificação da manutenção das condições de habilitação da contratada.",
        fundamentacaoLegal: "Cumprimento tempestivo dos serviços e apresentação de certidões negativas regulares.",
        statusAtendimento: "CONFORME"
      },
      {
        norma: "Lei nº 4.320/1964, Arts. 58 a 64",
        esferaOuOrgao: "Federal / Normas Gerais de Direito Financeiro",
        aplicacaoNoProcesso: "Encadeamento dos estágios da despesa pública: Empenho (NE 35), Liquidação (NS 10548) e Pagamento (OBs 5030/5031/5032).",
        fundamentacaoLegal: "Ateste formal do fiscal e documento fiscal hábil de comprovação da despesa.",
        statusAtendimento: "CONFORME"
      },
      {
        norma: "Macrofunção SIAFI 020314 e Portaria IFS nº 1.633/2026",
        esferaOuOrgao: "Tesouro Nacional / STN e IFS",
        aplicacaoNoProcesso: "Conformidade dos Registros de Gestão, exame documental tempestivo e fidedignidade contábil.",
        fundamentacaoLegal: "Todos os 7 documentos SIAFI emitidos na UG 158134 encontram-se regulares e sem ressalvas.",
        statusAtendimento: "CONFORME"
      },
      {
        norma: "Instrução Normativa SEGES/MP nº 05/2017 (Conta Vinculada)",
        esferaOuOrgao: "Federal / Ministério do Planejamento",
        aplicacaoNoProcesso: "Retenção e depósito de garantias trabalhistas (31,82%) na conta vinculada bloqueada para movimentação no Banco do Brasil.",
        fundamentacaoLegal: "Preservação dos direitos rescisórios dos 4 trabalhadores terceirizados alocados no Campus Poço Redondo.",
        statusAtendimento: "CONFORME"
      },
      {
        norma: "Código Tributário Municipal de Poço Redondo / ISSQN",
        esferaOuOrgao: "Municipal / Fazenda de Poço Redondo",
        aplicacaoNoProcesso: "Retenção do ISSQN de 5% sobre a base de cálculo da NFS-e e recolhimento via 2026OB005030.",
        fundamentacaoLegal: "Recolhimento aos cofres municipais tempestivamente através de Lista de Fatura do SIAFI.",
        statusAtendimento: "CONFORME"
      }
    ],
    inconsistenciasDetectadas: [
      {
        item: "Auditoria Geral do Processo e Documentos",
        tipoInconsistencia: "SEM INCONSISTÊNCIA",
        descricao: "Inexistência de qualquer vício, pendência ou inconsistência material, formal, orçamentária ou fiscal no processo.",
        fundamentacaoLegal: "Leis nº 4.320/64, 14.133/21, Macrofunção SIAFI 020314 e Contrato 52/2025.",
        impactoRisco: "NENHUM / CONFORME",
        acaoSaneadoraOuJustificativa: "Processo plenamente regular e instruído para registro de conformidade e posterior arquivamento."
      }
    ],
    conclusaoEEncaminhamento: "Auditado o processo administrativo SEI nº 23856.000189/2026-12 referente à prestação de serviços de limpeza e conservação predial no IFS Campus Poço Redondo (competência Agosto/2026), conclui-se pela sua integral REGULARIDADE. Os serviços foram regularmente executados e atestados com nota 97 no IMR, a Nota de Empenho 2026NE000035 possui saldo hábil, os pagamentos aos 4 funcionários foram comprovados, o líquido à contratada (R$ 8.846,67) e as retenções de ISSQN (R$ 751,57) e Conta Vinculada (R$ 2.269,12) foram devidamente emitidas no SIAFI. Parecer favorável ao registro de conformidade de gestão diária sob a modalidade SEM OCORRÊNCIA e subsequente arquivamento.",
    registroSugerido: "SEM OCORRÊNCIA"
  },
  parecerConclusivo: "Processo regularmente instruído. Conforme os arts. 62 e 63 da Lei nº 4.320/1964, a Instrução Normativa RFB nº 1.234/2012, a Macrofunção SIAFI 020314 e os termos do Contrato nº 52/2025, a prestação do serviço continuado de limpeza e conservação predial referente ao mês de agosto/2026 encontra-se plenamente comprovada pela NFS-e nº 2026001316, Atestado de Liquidação SEI 1073756, IMR (97 pontos) e comprovação das obrigações trabalhistas e previdenciárias dos 4 terceirizados. Todos os documentos obrigatórios do SIAFI (NE 2026NE000035, NS 2026NS010548, NP 2026NP001637 e OBs 2026OB005030, 2026OB005031 e 2026OB005032) foram examinados e encontram-se em total regularidade contábil e fiscal. A retenção do ISSQN (R$ 751,57) e o depósito da conta vinculada (R$ 2.269,12) foram devidamente processados. Parecer técnico: SEM OCORRÊNCIA, apto para arquivamento regular.",
  sugestaoConformista: "Registrar no SIAFI a Conformidade Diária dos Registros de Gestão com o status SEM OCORRÊNCIA para a Unidade Gestora 158134, validando os atos de gestão da despesa e procedendo ao arquivamento dos autos conforme Despacho SEI 1076687.",
  confiancaAnalise: "Motor Especialista Normativo IFS (Auditado Rigoroso)"
};

