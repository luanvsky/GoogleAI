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
