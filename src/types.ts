export type DocType = 
  | "ND - Nota de Dotação" 
  | "NC - Nota de Crédito" 
  | "NE - Nota de Empenho" 
  | "NL - Nota de Lançamento" 
  | "OB - Ordem Bancária" 
  | "GPS - Guia de Previdência Social" 
  | "DARF - Doc. de Arrecadação de Receitas Federais" 
  | "PF - Nota de Programação Financeira" 
  | "PE - Pré-Empenho" 
  | "NS - Nota de Lançamento de Sistema" 
  | "DAR - Documento de Arrecadação Municipal" 
  | "GR/GRU - Guia de Recolhimento da União"
  | "DH - Documento de Habilitação"
  | "CPR - Contas a Pagar e a Receber"
  | "GFIP - Guia de Recolhimento do FGTS"
  | "RP - Restos a Pagar"
  | "Nota Fiscal" 
  | "SCDP (Diárias)" 
  | "RMA (Almoxarifado)" 
  | "RMB (Bens Móveis)";

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
  category?: string;
}

export interface DocGuide {
  title: string;
  description: string;
  fieldsToWatch: string[];
}

export interface Analysis {
  id: string;
  timestamp: string;
  conformista: string;
  processo: string;
  numeroDoc: string;
  tipoDoc: DocType;
  resultado: "SEM OCORRÊNCIA" | "COM OCORRÊNCIA";
  checklist: Record<string, boolean>;
  restricoes: string[];
  observacao: string;
}

export const DOC_GUIDES: Record<DocType, DocGuide> = {
  "ND - Nota de Dotação": {
    title: "Roteiro de Análise: Nota de Dotação (ND)",
    description: "A Nota de Dotação registra o detalhamento do crédito orçamentário e sua descentralização interna ou externa. A análise de conformidade deve focar na estrita observância à Lei Orçamentária Anual (LOA) e aos créditos adicionais. É imperativo verificar se a célula orçamentária (PTRES, Natureza de Despesa, Fonte de Recurso e Plano Interno) está tecnicamente correta. Deve-se assegurar que o ato autorizativo ampara a movimentação e que a dotação respeita o teto de gastos e as prioridades do PDI. A análise deve prevenir a fragmentação indevida e garantir a correta classificação quanto ao Resultado Primário (RP).",
    fieldsToWatch: [
      "UG/Gestão Emitente e Favorecida (Verificar competência legal)",
      "PTRES (Programa de Trabalho Resumido) - Alinhamento com a Ação Orçamentária",
      "Natureza de Despesa (ED) - Nível de detalhamento e adequação ao objeto",
      "Fonte de Recurso (Vínculo) - Origem do recurso (Tesouro, Próprios, Convênios)",
      "Plano Interno (PI) - Rastreabilidade da despesa em nível de projeto/atividade",
      "Esfera Orçamentária (Fiscal ou Seguridade Social)",
      "Tipo de Crédito (Inicial, Suplementar, Especial ou Extraordinário)",
      "Ato Autorizativo (Número e data da Portaria ou Decreto)",
      "Justificativa no Histórico (Clareza, nexo causal e fundamentação)",
      "Saldo da Dotação (Disponibilidade orçamentária prévia)",
      "Indicador de Resultado Primário (RP) - Classificação correta",
      "Vínculo com o Plano Plurianual (PPA) e Plano de Contratações Anual (PCA)",
      "Identificação de emendas parlamentares (Individuais ou Bancada)",
      "Observância aos limites de empenho (Decreto de Contingenciamento)",
      "Análise de impacto no teto de gastos (EC 95/2016)",
      "Consistência com o cronograma de desembolso da STN",
      "Verificação de dotação para despesas de exercícios anteriores (DEA)"
    ]
  },
  "NC - Nota de Crédito": {
    title: "Roteiro de Análise: Nota de Crédito (NC)",
    description: "A Nota de Crédito registra a movimentação de crédito orçamentário entre Unidades Gestoras (UGs). É fundamental distinguir entre 'Provisão' e 'Destaque'. A análise deve validar se a UG favorecida possui competência e se o evento contábil reflete a natureza da operação. É vital conferir se a NC mantém a integridade da célula orçamentária original da ND. Em casos de TED, deve-se verificar a conformidade com o Decreto 10.426/2020.",
    fieldsToWatch: [
      "Tipo de Movimentação (Provisão ou Destaque)",
      "UG/Gestão Emitente e Favorecida (Competência)",
      "PTRES/ED/Fonte/PI (Consistência absoluta com a ND de origem)",
      "Evento Contábil utilizado (Fato gerador)",
      "Valor da Movimentação (Compatibilidade com o cronograma)",
      "Finalidade da Descentralização (Histórico detalhado)",
      "Documento de Amparo (Portaria, TED ou Convênio)",
      "Vínculo de Pagamento e Disponibilidade Financeira",
      "Data de Emissão (Tempestividade)",
      "Observância aos limites de empenho estabelecidos",
      "Identificação do TED e seu plano de trabalho",
      "Verificação de saldos remanescentes para reversão",
      "Indicador de Resultado Primário (RP) - Manutenção",
      "Conformidade com as normas da STN sobre descentralização",
      "Verificação de autorização da STN para destaques externos",
      "Análise de saldo de empenho vinculado",
      "Conformidade com o MCASP (Manual de Contabilidade)"
    ]
  },
  "NE - Nota de Empenho": {
    title: "Roteiro de Análise: Nota de Empenho (NE)",
    description: "A Nota de Empenho formaliza o compromisso do Estado com um credor, reservando o orçamento para uma despesa específica. É o estágio inicial da execução da despesa e exige rigor extremo. A análise deve garantir a correta aplicação da legislação (Lei 14.133/21 ou 8.666/93), validar a regularidade fiscal, trabalhista e técnica do favorecido no SICAF, CEIS e CNEP. Deve-se conferir a modalidade de empenho (Ordinário, Global ou Estimativo) e assegurar que a descrição do objeto seja técnica, completa e idêntica ao termo de referência. É essencial verificar se o empenho não ultrapassa o saldo da dotação e se há cronograma de desembolso realista.",
    fieldsToWatch: [
      "Modalidade de Licitação e Inciso de Dispensa/Inexigibilidade (Enquadramento legal preciso)",
      "Processo Administrativo SEI (Referência correta, completa e com acesso ao processo)",
      "CNPJ/CPF do Favorecido e Regularidade no SICAF (Certidões de FGTS, INSS e Tributos Federais)",
      "Consulta ao CEIS, CNEP e CEPIM (Verificar impedimentos de contratar com a União)",
      "Modalidade de Empenho (Ordinário para entrega única, Global para parcelada, Estimativo para variável)",
      "Natureza de Despesa (ED) - Estrita adequação ao objeto (Material vs. Serviço)",
      "PTRES e Fonte de Recursos (Saldo disponível, compatibilidade e RP)",
      "Cronograma de Desembolso (Mês a mês conforme execução prevista e disponibilidade financeira)",
      "Descrição Técnica Detalhada (Marca, Modelo, Quantidade, Unidade, Preço Unitário e Total)",
      "Vínculo de Pagamento e Plano Interno (PI) - Rastreabilidade e controle de custos",
      "Indicação de Contrato, Ata de Registro de Preços ou Convênio (Número e vigência)",
      "Local de Entrega ou Prestação do Serviço (Clareza e responsabilidade pelo recebimento)",
      "Prazo de Vigência e Execução (Conformidade com o edital, proposta e contrato)",
      "Justificativa para empenho estimativo (Memória de cálculo baseada em consumos anteriores)",
      "Verificação de subelemento de despesa para detalhamento contábil adequado",
      "Indicação de empenho para 'Restos a Pagar' se for o caso"
    ]
  },
  "NL - Nota de Lançamento": {
    title: "Roteiro de Análise: Nota de Lançamento (NL)",
    description: "A Nota de Lançamento registra fatos contábeis, apropriações de despesas e ajustes patrimoniais. Na liquidação, a análise deve confirmar se o serviço foi prestado ou o material entregue, com atesto formal. Deve-se validar o evento contábil, garantindo que reconheça a VPD e a obrigação de pagar. A NL deve espelhar com precisão as retenções tributárias e glosas.",
    fieldsToWatch: [
      "Evento Contábil (Fato gerador e subsistema)",
      "Campos de Inscrição 1 (CPF/CNPJ) e Inscrição 2 (Referência)",
      "Documento de Suporte (Nota Fiscal, Relatório de Medição)",
      "Classificação por Natureza de Despesa (Consistência com NE)",
      "Valor do Lançamento (Conferência com cálculos de suporte)",
      "Histórico Detalhado (Quem, O que, Quando, Onde, Por que)",
      "Regularidade Fiscal do Favorecido (SICAF válido)",
      "Retenções Tributárias (IR, CSLL, PIS, COFINS, ISS, INSS)",
      "Atesto de Recebimento (Assinatura e data)",
      "Data de Vencimento da Obrigação (Conformidade contratual)",
      "Identificação de glosas, multas ou descontos",
      "Consistência entre objeto liquidado e empenhado",
      "Registro de depreciação ou amortização",
      "Verificação de 'Passivo Anterior' (DEA)",
      "Análise de conformidade com a IN RFB 1234/2012",
      "Verificação de retenção de ISS no local da prestação",
      "Conferência de cálculos de reajuste de preços"
    ]
  },
  "OB - Ordem Bancária": {
    title: "Roteiro de Análise: Ordem Bancária (OB)",
    description: "A Ordem Bancária autoriza o pagamento de credores através da Conta Única. A análise deve assegurar que o domicílio bancário confere com o SIAFI e a NF. Deve-se validar o valor líquido após retenções e garantir que as guias (DARF/GPS/DAR) foram vinculadas. O pagamento deve respeitar a ordem cronológica (Lei 14.133/21).",
    fieldsToWatch: [
      "Domicílio Bancário do Favorecido (Conferência SICAF)",
      "Tipo de OB (OBC, OBA, OBT, OBP, OBG)",
      "Valor Líquido vs. Valor Bruto (Memória de cálculo)",
      "Retenções Tributárias (DARF, GPS, DAR vinculados)",
      "Documento de Liquidação de Origem (NL ou NS)",
      "Vínculo de Pagamento e Disponibilidade de Cota",
      "Finalidade do Pagamento (Histórico completo)",
      "Assinatura do Ordenador e Gestor Financeiro",
      "Observância à Ordem Cronológica de Pagamentos",
      "Verificação de suspensão por ordem judicial",
      "Tipo de Moeda e Taxa de Câmbio",
      "Confirmação de dados cadastrais no domicílio",
      "Verificação de 'Pagamento Indevido' ou duplicidade",
      "Identificação de pagamentos a 'Suprimento de Fundos'",
      "Análise de conformidade com o Decreto 9.203/2017",
      "Verificação de limites de saque diário da UG",
      "Conferência de autorização para pagamentos urgentes"
    ]
  },
  "GPS - Guia de Previdência Social": {
    title: "Roteiro de Análise: GPS (Previdência Social)",
    description: "A GPS é o documento para o recolhimento das contribuições previdenciárias (INSS). A análise deve focar na correção do código de pagamento, na competência e na base de cálculo. É fundamental verificar se os valores retidos e a parte patronal estão calculados conforme a legislação. Com a DCTFWeb, deve-se observar a transição para o DARF Previdenciário.",
    fieldsToWatch: [
      "Código de Pagamento (ex: 2100, 2631)",
      "Competência (Mês/Ano do fato gerador)",
      "Identificador (CNPJ da UG ou CEI/CNO)",
      "Valor do INSS (Segurados, Retidos e Patronal)",
      "Valor de Outras Entidades (Sistema S)",
      "ATM/Multa/Juros (Cálculo automático)",
      "Base de Cálculo (Valor bruto da NF ou Folha)",
      "Consistência com a Retenção na NL/OB",
      "Data de Vencimento (Dia 20)",
      "Deduções permitidas (Salário Família/Maternidade)",
      "Informações na DCTFWeb/eSocial/EFD-Reinf",
      "Certidão Negativa de Débitos (CND) do prestador",
      "Verificação de retenção de 11% ou 3,5% (Desoneração)",
      "Identificação de serviços via cessão de mão de obra",
      "Análise de enquadramento no FPAS e RAT",
      "Verificação de compensações previdenciárias informadas",
      "Conferência de retenção em notas de cooperativas"
    ]
  },
  "DARF - Doc. de Arrecadação de Receitas Federais": {
    title: "Roteiro de Arrecadação: DARF (Tributos Federais)",
    description: "O DARF é utilizado para o recolhimento de tributos federais (IRRF, CSLL, PIS, COFINS). A análise deve validar se a alíquota aplicada está em conformidade com a IN RFB 1234/2012. Deve-se conferir o código da receita, o período de apuração e garantir o recolhimento nos prazos legais. É essencial verificar se a retenção foi sobre o valor bruto.",
    fieldsToWatch: [
      "Código da Receita (ex: 1708, 5952, 6147, 0211)",
      "Período de Apuração (Data do fato gerador)",
      "CNPJ do Contribuinte (Favorecido)",
      "Valor Principal (Cálculo exato)",
      "Alíquota Aplicada (IN RFB 1234/2012)",
      "Data de Vencimento (Tempestividade)",
      "Referência Legal no Histórico (Fundamentação)",
      "Identificação de isenções ou decisões judiciais",
      "Consistência com lançamentos na NL e OB",
      "Verificação de DARF Comum vs. Numerado",
      "Cálculo de encargos (Multa/Juros)",
      "Vínculo com o processo e nota fiscal",
      "Verificação de retenção para Simples Nacional",
      "Tratamento de retenções para entidades imunes",
      "Análise de compensações via PER/DCOMP",
      "Verificação de retenção em pagamentos a cooperativas",
      "Conferência de códigos para serviços de engenharia"
    ]
  },
  "PF - Nota de Programação Financeira": {
    title: "Roteiro de Análise: Programação Financeira (PF)",
    description: "A PF é um documento de fluxo financeiro que solicita ou registra a liberação de recursos. A análise deve verificar se a vinculação de pagamento está correta e se a operação respeita os limites do Decreto de Programação Financeira. Deve-se observar o equilíbrio entre disponibilidade orçamentária e financeira.",
    fieldsToWatch: [
      "Vinculação de Pagamento (ex: 400, 401, 402)",
      "Mês de Referência da Programação",
      "UG/Gestão Emitente e Favorecida",
      "Valor Solicitado/Liberado",
      "Tipo de Recurso (Cota, Repasse, Sub-repasse)",
      "Justificativa da Necessidade Financeira",
      "Saldo de Cota Disponível na UG",
      "Cronograma de Desembolso Mensal",
      "Vínculo com o PI e Fonte de Recursos",
      "Identificação de excesso de arrecadação",
      "Prazos para solicitação e liberação",
      "Impacto no Resultado Primário",
      "Verificação de recursos vinculados",
      "Análise de 'Restos a Pagar'",
      "Conformidade com o Decreto de Contingenciamento",
      "Verificação de limites de saque para pessoal",
      "Análise de prioridades de pagamento (Sentenças, etc.)"
    ]
  },
  "PE - Pré-Empenho": {
    title: "Roteiro de Análise: Pré-Empenho (PE)",
    description: "O Pré-Empenho é uma reserva prévia de dotação orçamentária para futura contratação. A análise deve assegurar a célula orçamentária correta, validar o processo licitatório e monitorar a validade. É um instrumento de planejamento que evita o início de certames sem cobertura, cumprindo a LRF.",
    fieldsToWatch: [
      "Finalidade da Reserva (Objeto detalhado)",
      "Número do Processo Licitatório",
      "PTRES/ED/Fonte/PI (Adequação orçamentária)",
      "Prazo de Validade (Cronograma previsto)",
      "Valor Reservado (Estimativa de mercado)",
      "Saldo da Dotação Orçamentária",
      "Justificativa para a Reserva Prévia",
      "Indicador de Resultado Primário (RP)",
      "Vínculo com o PCA e PDI",
      "Possibilidade de cancelamento ou reforço",
      "Identificação da modalidade de licitação",
      "Conformidade com o PPA",
      "Verificação de dotações continuadas",
      "Análise de impacto orçamentário-financeiro",
      "Verificação de autorização da autoridade competente",
      "Análise de adequação ao teto de gastos",
      "Conferência de reserva para encargos sociais"
    ]
  },
  "NS - Nota de Lançamento de Sistema": {
    title: "Roteiro de Análise: Nota de Sistema (NS)",
    description: "A NS é gerada automaticamente pelo SIAFI. A análise deve focar na consistência dos dados importados, verificando se os reflexos contábeis estão corretos. A NS é fundamental para a integridade do balancete, automatizando lançamentos e controle de disponibilidades (DDR).",
    fieldsToWatch: [
      "Documento Gerador de Origem (OB, NL, CPR, DH, GRU)",
      "Evento Automático Gerado (Tabela de Eventos)",
      "Consistência de Valores (Bruto, Retenções, Líquido)",
      "Data do Registro e Competência Contábil",
      "Reflexo Patrimonial (Ativo, Passivo, VPD/VPA)",
      "UG/Gestão Responsável pelo Registro",
      "Subsistema de Contabilidade",
      "Identificação de erros de interface",
      "Verificação de lançamentos de encerramento",
      "Consistência com o PCASP e manuais STN",
      "Impacto nos demonstrativos contábeis",
      "Lançamentos de controle (DDR)",
      "Verificação de estornos automáticos",
      "Análise de 'Apropriação de Custos'",
      "Verificação de integridade do subsistema orçamentário",
      "Análise de conciliação de contas de suprimento",
      "Verificação de lançamentos de variação cambial"
    ]
  },
  "DAR - Documento de Arrecadação Municipal": {
    title: "Roteiro de Arrecadação: DAR (ISS e Taxas)",
    description: "O DAR é utilizado para o recolhimento de tributos municipais, principalmente o ISS. A análise deve validar se a retenção foi feita para o município correto (LC 116/03), se a alíquota respeita o CTM local e se os dados do prestador estão corretos. Deve-se atentar para a responsabilidade tributária do órgão público.",
    fieldsToWatch: [
      "Município Favorecido (Local da prestação)",
      "Inscrição Municipal do Contribuinte",
      "Código do Serviço (LC 116/03)",
      "Base de Cálculo (Valor bruto)",
      "Alíquota Municipal Aplicada (2% a 5%)",
      "Valor do Imposto Retido",
      "Data de Vencimento (Calendário Fiscal)",
      "Identificação de isenções ou regimes especiais",
      "Consistência com a retenção na NL e OB",
      "Verificação de taxas municipais (TFF, etc.)",
      "Dados do Tomador (CNPJ da UG)",
      "Vínculo com a NFS-e",
      "Tratamento de retenção para Simples Nacional",
      "Verificação de CPOM se exigido",
      "Análise de bitributação e local do fato gerador",
      "Verificação de cadastro de prestadores de fora",
      "Conferência de validade da certidão municipal"
    ]
  },
  "GR/GRU - Guia de Recolhimento da União": {
    title: "Roteiro de Arrecadação: GRU (Receitas da União)",
    description: "A GRU é o documento padronizado para o recolhimento de receitas ao Tesouro. A análise deve ser rigorosa quanto ao Código de Recolhimento e ao Número de Referência. Deve-se conferir se a classificação da receita está correta para o balanço da União.",
    fieldsToWatch: [
      "Código de Recolhimento (Natureza da Receita)",
      "Número de Referência (Identificação específica)",
      "Competência (Mês/Ano do fato gerador)",
      "CNPJ/CPF do Recolhedor",
      "Valor Bruto, Descontos e Valor Líquido",
      "UG/Gestão Favorecida (Unidade Arrecadadora)",
      "Classificação da Receita (Fonte e RP)",
      "Data de Vencimento (Prazo fatal)",
      "Autenticação Bancária ou Comprovante",
      "Vínculo com o processo administrativo",
      "Identificação de GRU Cobrança vs. Simples",
      "Verificação de estornos no SISGRU",
      "Tratamento de devoluções de diárias",
      "Análise de receitas próprias",
      "Verificação de recolhimento de multas contratuais",
      "Análise de ressarcimento de despesas de pessoal",
      "Verificação de depósitos judiciais via GRU"
    ]
  },
  "Nota Fiscal": {
    title: "Roteiro de Análise: Nota Fiscal / Fatura",
    description: "Documento fiscal que comprova a execução da despesa. A análise deve verificar a validade jurídica (Chave de Acesso), a correspondência com o empenho (NE), a regularidade fiscal e as retenções (IN RFB 1234/2012). O 'Atesto' deve ser realizado por servidor designado.",
    fieldsToWatch: [
      "Chave de Acesso (Portal Nacional)",
      "Data de Emissão vs. Execução",
      "CNPJ Emitente vs. Empenhado",
      "Descrição Detalhada dos Itens",
      "Valores Unitários, Totais e Fretes",
      "Retenções Tributárias (Alíquotas corretas)",
      "Dados Bancários para Pagamento",
      "Certidões de Regularidade (FGTS, Tributos)",
      "Assinatura e Data do Atesto",
      "Indicação da NE e Processo SEI",
      "Natureza da Operação",
      "Verificação de Substituição Tributária",
      "Validação de Cartas de Correção",
      "Conferência de quantidades físicas",
      "Manifestação do Destinatário",
      "Análise de faturas de serviços contínuos",
      "Verificação de glosas por descumprimento de SLA",
      "Conferência de medições em serviços de engenharia",
      "Verificação de validade de selos e lacres"
    ]
  },
  "SCDP (Diárias)": {
    title: "Roteiro de Análise: SCDP (Diárias e Passagens)",
    description: "O SCDP gerencia a concessão de diárias e passagens. A conformidade deve validar o nexo causal e o interesse público. Deve-se conferir o período, o cálculo, o relatório e os comprovantes de embarque. A prestação de contas deve ser tempestiva.",
    fieldsToWatch: [
      "Número da PCDP",
      "Nome, CPF e Cargo do Proposto",
      "Motivo e Justificativa da Viagem",
      "Trechos, Datas e Horários",
      "Relatório de Viagem detalhado",
      "Bilhetes e Canhotos de Embarque",
      "Cálculo do Valor Total",
      "Restituição de Valores",
      "Aprovação da Autoridade Superior",
      "Evidências de Participação",
      "Verificação de choque de horários",
      "Tempestividade (5 dias)",
      "Uso de veículo oficial ou próprio",
      "Conformidade com o Decreto vigente",
      "Análise de diárias em fins de semana",
      "Verificação de antecedência mínima",
      "Análise de ressarcimento de bagagem",
      "Verificação de seguro viagem internacional",
      "Conferência de taxas de câmbio para exterior"
    ]
  },
  "RMA (Almoxarifado)": {
    title: "Roteiro de Análise: RMA (Relatório de Almoxarifado)",
    description: "O RMA demonstra a movimentação mensal de materiais de consumo. A análise deve garantir a perfeita conciliação entre as entradas (Notas Fiscais), saídas (Requisições) e os saldos físicos/financeiros. É obrigatória a conciliação com os saldos contábeis do SIAFI (Classe 1.1.5) e a existência de termo de conferência física mensal assinado por comissão designada. Deve-se observar o método de avaliação (Preço Médio Ponderado) e a integridade do armazenamento.",
    fieldsToWatch: [
      "Saldo Anterior (Físico e Financeiro - Consistência absoluta com o mês anterior)",
      "Entradas no Período (Conferência total com Notas Fiscais e NLs de estoque)",
      "Saídas no Período (Requisições de Material autorizadas, assinadas e datadas)",
      "Saldo Atual para o Próximo Período (Cálculo matemático: Saldo Ant + Ent - Sai)",
      "Conciliação Contábil com o Balancete do SIAFI (Contas 1.1.5.xx.xx - Estoques)",
      "Termo de Conferência Física Mensal (Assinado pela Comissão de Inventário)",
      "Assinatura do Almoxarife e do Gestor da Unidade (Responsabilidade técnica)",
      "Identificação de Materiais com Prazo de Validade Próximo, Vencidos ou Danificados",
      "Materiais sem movimentação (Inservíveis, Obsoletos ou Ociosos - Avaliação)",
      "Ajustes de Inventário (NLs de acerto com justificativa robusta e processo)",
      "Organização, Limpeza e Acondicionamento (Aspectos de controle e conservação)",
      "Segurança, Acesso Restrito e Controle de Chaves do Almoxarifado",
      "Verificação de 'Materiais em Trânsito' ou pendentes de recebimento definitivo",
      "Análise de consumo médio mensal para fins de reposição de estoque (Planejamento)",
      "Identificação de desvios, perdas ou avarias com abertura de processo apuratório"
    ]
  },
  "RMB (Bens Móveis)": {
    title: "Roteiro de Análise: RMB (Relatório de Bens Móveis)",
    description: "O RMB registra a movimentação do patrimônio mobiliário. A análise foca na incorporação de novos bens, na regularidade das baixas e na conciliação com o SIAFI (Classe 1.2.3), incluindo a depreciação acumulada. Deve-se garantir a plaqueta e o termo de responsabilidade.",
    fieldsToWatch: [
      "Incorporações no Mês (Notas Fiscais)",
      "Número de Inventário (Plaqueta)",
      "Baixas e Alienações (Processos)",
      "Transferências Internas e Externas",
      "Cálculo da Depreciação Mensal",
      "Conciliação com o Saldo no SIAFI",
      "Relatório de Inventário Periódico",
      "Estado de Conservação e Localização",
      "Bens em manutenção ou com terceiros",
      "Identificação de Bens Inservíveis",
      "Atualização do Valor (Reavaliação)",
      "Seguro de Bens e Proteção",
      "Verificação de bens doados",
      "Análise de 'Bens de Pequeno Valor'",
      "Identificação de responsabilidade por dano",
      "Verificação de bens em almoxarifado (estoque)",
      "Análise de vida útil econômica vs. contábil",
      "Conferência de termos de cessão de uso"
    ]
  },
  "DH - Documento de Habilitação": {
    title: "Roteiro de Análise: DH (Documento de Habilitação)",
    description: "O DH é utilizado no subsistema CPR para habilitar pagamentos e registrar obrigações. A análise deve focar na correta vinculação com o credor, na validade das informações de suporte e na conformidade com o fato gerador.",
    fieldsToWatch: [
      "Identificação do Credor (CNPJ/CPF)",
      "Valor da Obrigação (Bruto e Líquido)",
      "Data de Vencimento e Competência",
      "Documento de Origem (NF, Contrato, etc.)",
      "Evento Contábil e Lógica de Registro",
      "Justificativa para a Habilitação",
      "Vinculação com o Empenho (NE)",
      "Verificação de Retenções Tributárias",
      "Análise de inconsistências no CPR",
      "Rastreabilidade do processo administrativo"
    ]
  },
  "CPR - Contas a Pagar e a Receber": {
    title: "Roteiro de Análise: CPR (Subsistema de Contas)",
    description: "O subsistema CPR gerencia o fluxo de obrigações e direitos da União. A análise deve garantir a integridade dos registros de liquidação, a correta apropriação dos custos e o controle de prazos de pagamento.",
    fieldsToWatch: [
      "Cronograma de Pagamento (Fluxo de caixa)",
      "Vinculação de Recurso (Fonte/Vínculo)",
      "Identificação de Credores e Devedores",
      "Valor Bruto, Retenções e Valor Líquido",
      "Status da Obrigação (A pagar, Pago, Cancelado)",
      "Apropriação de Custos por Centro de Custo",
      "Verificação de duplicidade de registros",
      "Análise de pendências de liquidação",
      "Conciliação com o subsistema orçamentário",
      "Tratamento de glosas e descontos no CPR"
    ]
  },
  "GFIP - Guia de Recolhimento do FGTS": {
    title: "Roteiro de Análise: GFIP (FGTS e Previdência)",
    description: "A GFIP é utilizada para o recolhimento do FGTS e prestação de informações à Previdência. A análise deve validar a base de cálculo, a tempestividade do recolhimento e a conformidade com a folha de pagamento.",
    fieldsToWatch: [
      "Base de Cálculo do FGTS (Remuneração)",
      "Valor do Depósito (8% ou conforme lei)",
      "Competência (Mês/Ano do fato gerador)",
      "Código de Recolhimento (ex: 115, 150)",
      "CNPJ/CEI/CNO do Empregador",
      "Relação de Trabalhadores (RE)",
      "Data de Vencimento (Dia 7)",
      "Consistência com a SEFIP",
      "Verificação de encargos por atraso",
      "Análise de retificações (GFIP de acerto)"
    ]
  },
  "RP - Restos a Pagar": {
    title: "Roteiro de Análise: RP (Restos a Pagar)",
    description: "Restos a Pagar são despesas empenhadas mas não pagas até 31 de dezembro. A análise deve focar na validade do empenho, na existência de saldo, na justificativa para a manutenção e na diferenciação entre Processados e Não Processados.",
    fieldsToWatch: [
      "Número da Nota de Empenho (NE) original",
      "Saldo de RP (Processado vs. Não Processado)",
      "Justificativa para Manutenção do Saldo",
      "Prazo de Validade (Decreto de Encerramento)",
      "Liquidação Pendente (Para RP Não Processados)",
      "Verificação de prescrição (5 anos)",
      "Análise de necessidade de cancelamento",
      "Vínculo com a disponibilidade financeira",
      "Rastreabilidade da execução física",
      "Conformidade com as normas da STN sobre RP"
    ]
  }
};

export const CHECKLIST_BY_TYPE: Record<DocType, ChecklistItem[]> = {
  "ND - Nota de Dotação": [
    { id: "nd_ug", label: "UG e Gestão emitentes estão corretas?", category: "Identificação" },
    { id: "nd_ptres", label: "PTRES condiz com a ação orçamentária do processo?", category: "Classificação" },
    { id: "nd_ed", label: "Elemento de Despesa (ED) está no nível de detalhamento exigido?", category: "Classificação" },
    { id: "nd_fonte", label: "Fonte de Recursos é compatível com a destinação?", category: "Classificação" },
    { id: "nd_pi", label: "Plano Interno (PI) está corretamente preenchido?", category: "Classificação" },
    { id: "nd_valor", label: "Valor da ND coincide com o cronograma/solicitação?", category: "Valores" },
    { id: "nd_obs", label: "Observação descreve claramente a finalidade do crédito?", category: "Finalização" },
    { id: "nd_pca", label: "A dotação está prevista no Plano de Contratações Anual (PCA)?", category: "Planejamento" },
    { id: "nd_rp", label: "O Indicador de Resultado Primário (RP) está correto?", category: "Classificação" },
    { id: "nd_limite", label: "A movimentação respeita os limites de empenho quadrimestrais?", category: "Controle" }
  ],
  "NC - Nota de Crédito": [
    { id: "nc_tipo_mov", label: "Tipo de movimentação (Provisão/Destaque) está correto?", category: "Classificação" },
    { id: "nc_ug_fav", label: "UG Favorecida e Gestão estão corretas?", category: "Identificação" },
    { id: "nc_ptres", label: "PTRES e Fonte de Recursos conferem com o processo?", category: "Classificação" },
    { id: "nc_evento", label: "Evento contábil utilizado é o adequado?", category: "Contábil" },
    { id: "nc_valor", label: "Valor da movimentação está dentro do limite disponível?", category: "Valores" },
    { id: "nc_finalidade", label: "Finalidade descrita justifica a descentralização?", category: "Finalização" },
    { id: "nc_ted", label: "Em caso de TED, o plano de trabalho foi aprovado?", category: "Documentação" },
    { id: "nc_stn", label: "Houve autorização da STN para destaque externo?", category: "Autorização" }
  ],
  "NE - Nota de Empenho": [
    { id: "ne_modalidade", label: "Modalidade de Licitação e Inciso estão corretos?", hint: "Verificar se o inciso da dispensa ou inexigibilidade condiz com o valor e objeto.", category: "Documentação" },
    { id: "ne_processo", label: "Número do processo administrativo consta na NE?", hint: "O número do processo SEI deve estar idêntico ao registrado no SIAFI.", category: "Documentação" },
    { id: "ne_favorecido", label: "CNPJ/CPF do favorecido confere com a proposta/contrato?", hint: "Validar se o credor não possui restrições no SICAF.", category: "Documentação" },
    { id: "ne_ptres_ed", label: "PTRES e Elemento de Despesa estão corretos?", hint: "Conferir se a natureza de despesa (ex: 339030) é adequada ao material/serviço.", category: "Classificação" },
    { id: "ne_valor_unit", label: "Preços unitários e totais conferem com a licitação/ata?", hint: "Multiplicar quantidade por valor unitário para validar o total empenhado.", category: "Valores" },
    { id: "ne_cronograma", label: "Cronograma de desembolso foi preenchido corretamente?", hint: "Verificar se os meses de pagamento previstos são realistas.", category: "Valores" },
    { id: "ne_obs", label: "Observação contém a descrição clara do objeto?", hint: "Deve conter marca, modelo ou detalhamento técnico conforme o termo de referência.", category: "Finalização" },
    { id: "ne_assinatura", label: "Existe autorização do Ordenador de Despesas?", hint: "Conferir assinatura digital ou despacho no processo SEI.", category: "Finalização" },
    { id: "ne_sicaf", label: "A regularidade no SICAF foi verificada na data da emissão?", category: "Regularidade" },
    { id: "ne_ceis", label: "Foi realizada consulta ao CEIS/CNEP para o favorecido?", category: "Regularidade" },
    { id: "ne_fracionamento", label: "Há indícios de fracionamento indevido de despesa?", category: "Conformidade" },
    { id: "ne_lei14133", label: "O enquadramento na Lei 14.133/21 está correto?", category: "Legislação" }
  ],
  "NL - Nota de Lançamento": [
    { id: "nl_evento", label: "Evento contábil reflete fielmente o fato gerador?", category: "Contábil" },
    { id: "nl_inscricao", label: "Campos de Inscrição 1 e 2 estão preenchidos corretamente?", category: "Identificação" },
    { id: "nl_favorecido", label: "Credor/Favorecido identificado corretamente?", category: "Identificação" },
    { id: "nl_valor", label: "Valor do lançamento confere com o documento suporte?", category: "Valores" },
    { id: "nl_suporte", label: "Documentação de suporte (NF, Relatório, etc.) está anexada?", category: "Documentação" },
    { id: "nl_obs", label: "Observação detalha o motivo do lançamento/ajuste?", category: "Finalização" },
    { id: "nl_atesto", label: "O atesto de recebimento está assinado e datado?", category: "Autorização" },
    { id: "nl_retencoes", label: "As retenções tributárias foram calculadas corretamente?", category: "Valores" },
    { id: "nl_glosa", label: "Eventuais glosas ou multas foram registradas?", category: "Conformidade" }
  ],
  "OB - Ordem Bancária": [
    { id: "ob_favorecido", label: "Dados bancários do favorecido conferem com o cadastro?", hint: "Banco, Agência e Conta devem ser os mesmos da Nota Fiscal/Contrato.", category: "Favorecido" },
    { id: "ob_valor_liq", label: "Valor líquido coincide com a liquidação (NF - Retenções)?", hint: "Subtrair todos os impostos retidos do valor bruto da nota.", category: "Valores" },
    { id: "ob_tipo", label: "Tipo de OB (OBC, OBA, OBT) adequado ao pagamento?", hint: "OBC para bancos comerciais, OBT para transferências entre contas do tesouro.", category: "Classificação" },
    { id: "ob_paguese", label: "Despacho 'Pague-se' assinado pelo Ordenador no processo?", hint: "O pagamento só pode ocorrer após a autorização formal do ordenador.", category: "Autorização" },
    { id: "ob_retencoes", label: "Retenções tributárias foram devidamente apropriadas?", hint: "Validar se os DARFs/GPS foram gerados no mesmo momento da OB.", category: "Valores" },
    { id: "ob_finalidade", label: "Finalidade do pagamento está clara na observação?", hint: "Ex: 'Pagamento ref. NF 123, ref. ao empenho 2024NE000123'.", category: "Finalização" },
    { id: "ob_cronologica", label: "A ordem cronológica de pagamentos foi respeitada?", category: "Conformidade" },
    { id: "ob_domicilio", label: "O domicílio bancário foi confirmado no SICAF?", category: "Favorecido" }
  ],
  "GPS - Guia de Previdência Social": [
    { id: "gps_codigo", label: "Código de pagamento do INSS está correto?", category: "Classificação" },
    { id: "gps_competencia", label: "Mês/Ano de competência confere com o fato gerador?", category: "Datas" },
    { id: "gps_identificador", label: "Identificador (CNPJ) está correto?", category: "Identificação" },
    { id: "gps_valor_base", label: "Base de cálculo confere com a folha/nota fiscal?", category: "Valores" },
    { id: "gps_valor_inss", label: "Valor do INSS (Patronal/Retido) calculado corretamente?", category: "Valores" },
    { id: "gps_outras_ent", label: "Valores de Outras Entidades (Terceiros) estão corretos?", category: "Valores" },
    { id: "gps_vencimento", label: "A guia foi paga até o dia 20 do mês subsequente?", category: "Datas" },
    { id: "gps_sincronismo", label: "Os dados conferem com a DCTFWeb/eSocial?", category: "Conformidade" },
    { id: "gps_cnd", label: "A CND previdenciária do prestador está válida?", category: "Regularidade" }
  ],
  "DARF - Doc. de Arrecadação de Receitas Federais": [
    { id: "darf_codigo", label: "Código da Receita (ex: 1708, 5952) está correto?", category: "Classificação" },
    { id: "darf_periodo", label: "Período de apuração condiz com a emissão da NF?", category: "Datas" },
    { id: "darf_cnpj", label: "CNPJ do contribuinte/favorecido está correto?", category: "Identificação" },
    { id: "darf_valor", label: "Valor do tributo confere com a alíquota e base de cálculo?", category: "Valores" },
    { id: "darf_vencimento", label: "Data de vencimento respeita a legislação vigente?", category: "Datas" },
    { id: "darf_aliquota", label: "A alíquota aplicada segue a IN RFB 1234/2012?", category: "Legislação" },
    { id: "darf_bruto", label: "A base de cálculo utilizada foi o valor bruto da nota?", category: "Valores" },
    { id: "darf_numerado", label: "Em caso de DCTFWeb, foi utilizado o DARF numerado?", category: "Documentação" }
  ],
  "PF - Nota de Programação Financeira": [
    { id: "pf_vinculacao", label: "Vinculação de pagamento está correta (ex: 400, 401)?", category: "Classificação" },
    { id: "pf_mes", label: "Mês de referência da programação está correto?", category: "Datas" },
    { id: "pf_ug_fav", label: "UG Favorecida identificada corretamente?", category: "Identificação" },
    { id: "pf_valor", label: "Valor solicitado condiz com a necessidade de desembolso?", category: "Valores" },
    { id: "pf_justificativa", label: "Existe justificativa para a solicitação de recursos?", category: "Finalização" },
    { id: "pf_decreto", label: "A solicitação respeita o Decreto de Programação Financeira?", category: "Conformidade" },
    { id: "pf_saldo", label: "Há saldo de cota suficiente para a liberação?", category: "Controle" }
  ],
  "PE - Pré-Empenho": [
    { id: "pe_ptres_ed", label: "PTRES e Elemento de Despesa estão corretos?", category: "Classificação" },
    { id: "pe_fonte", label: "Fonte de Recursos possui saldo suficiente?", category: "Valores" },
    { id: "pe_finalidade", label: "Finalidade da reserva de crédito está bem descrita?", category: "Finalização" },
    { id: "pe_validade", label: "Prazo de validade do pré-empenho é adequado?", category: "Datas" },
    { id: "pe_processo", label: "Número do processo licitatório/administrativo informado?", category: "Documentação" },
    { id: "pe_estimativa", label: "O valor reservado baseia-se em estimativa de mercado?", category: "Valores" },
    { id: "pe_lrf", label: "A reserva cumpre os requisitos da LRF?", category: "Legislação" }
  ],
  "NS - Nota de Lançamento de Sistema": [
    { id: "ns_origem", label: "Documento que originou a NS é válido e legal?", category: "Documentação" },
    { id: "ns_evento", label: "Evento automático gerado é o esperado para a operação?", category: "Contábil" },
    { id: "ns_valor", label: "Valores (bruto/líquido/retenções) estão consistentes?", category: "Valores" },
    { id: "ns_data", label: "Data do registro condiz com o fato ocorrido?", category: "Datas" },
    { id: "ns_reflexo", label: "O reflexo patrimonial (VPD/VPA) está correto?", category: "Contábil" },
    { id: "ns_ddr", label: "Houve o correto registro da DDR (Controle)?", category: "Controle" }
  ],
  "DAR - Documento de Arrecadação Municipal": [
    { id: "dar_municipio", label: "Município favorecido está identificado corretamente?", category: "Identificação" },
    { id: "dar_codigo", label: "Código do tributo (ISS/Taxas) está correto?", category: "Classificação" },
    { id: "dar_base", label: "Base de cálculo e alíquota conferem com a legislação local?", category: "Valores" },
    { id: "dar_valor", label: "Valor total da guia confere com a retenção na NF?", category: "Valores" },
    { id: "dar_lc116", label: "O local da prestação segue a LC 116/03?", category: "Legislação" },
    { id: "dar_vencimento", label: "A data de vencimento segue o calendário municipal?", category: "Datas" }
  ],
  "GR/GRU - Guia de Recolhimento da União": [
    { id: "gru_codigo", label: "Código de recolhimento (ex: 28830-6) está correto?", category: "Classificação" },
    { id: "gru_ug_fav", label: "UG e Gestão favorecidas estão corretas?", category: "Identificação" },
    { id: "gru_referencia", label: "Número de referência preenchido conforme exigência?", category: "Identificação" },
    { id: "gru_valor", label: "Valor recolhido confere com o montante devido?", category: "Valores" },
    { id: "gru_competencia", label: "Mês/Ano de referência está correto?", category: "Datas" },
    { id: "gru_tipo", label: "O tipo de GRU (Simples/Cobrança) está adequado?", category: "Classificação" },
    { id: "gru_autenticacao", label: "Há comprovante de pagamento ou autenticação?", category: "Documentação" }
  ],
  "Nota Fiscal": [
    { id: "nf_chave", label: "Chave de acesso válida e confirmada no portal nacional?", hint: "Consultar no site da SEFAZ ou Portal da NF-e para garantir que não foi cancelada.", category: "Validação" },
    { id: "nf_emissao", label: "Data de emissão dentro do período de competência?", hint: "A nota deve ser emitida no mês da prestação do serviço ou entrega do material.", category: "Datas" },
    { id: "nf_cnpj_fav", label: "CNPJ do emitente confere com o Empenho/Contrato?", hint: "Verificar se a filial que emitiu a nota é a mesma que foi empenhada.", category: "Dados Fiscais" },
    { id: "nf_cnpj_dest", label: "CNPJ do destinatário é o do IFS (UG correta)?", hint: "O CNPJ deve ser o da Reitoria ou do Campus específico que realizou a compra.", category: "Dados Fiscais" },
    { id: "nf_descricao", label: "Descrição dos produtos/serviços condiz com o Empenho?", hint: "A descrição na NF deve ser idêntica ou superior em detalhamento à da NE.", category: "Objeto" },
    { id: "nf_valores", label: "Preços unitários e totais conferem com a NE?", hint: "Validar se não houve arredondamentos indevidos que alterem o valor total.", category: "Valores" },
    { id: "nf_retencoes", label: "Retenções (IR, CSLL, PIS, COFINS, ISS, INSS) destacadas?", hint: "Conferir se as alíquotas aplicadas estão de acordo com a IN RFB 1234.", category: "Valores" },
    { id: "nf_atesto", label: "Atesto de recebimento assinado por servidor competente?", hint: "O atesto deve ser datado e assinado por quem recebeu o material/serviço.", category: "Autorização" },
    { id: "nf_certidoes", label: "Certidões de regularidade (SICAFI/CND) válidas na data?", hint: "Verificar se a empresa estava regular no momento da emissão e do atesto.", category: "Validação" },
    { id: "nf_manifestacao", label: "Foi realizada a manifestação do destinatário?", category: "Conformidade" },
    { id: "nf_glosa", label: "Houve aplicação de glosa por descumprimento contratual?", category: "Conformidade" }
  ],
  "SCDP (Diárias)": [
    { id: "scdp_pcdp_num", label: "Número da PCDP consta no processo e sistema?", category: "Documentação" },
    { id: "scdp_proposto", label: "Dados do proposto (CPF/Cargo) estão corretos?", category: "Identificação" },
    { id: "scdp_motivo", label: "Motivo da viagem justifica a concessão de diárias?", category: "Finalização" },
    { id: "scdp_datas", label: "Datas de ida e volta conferem com o bilhete/evento?", category: "Datas" },
    { id: "scdp_valores", label: "Cálculo das diárias (nacional/internacional) está correto?", category: "Valores" },
    { id: "scdp_passagens", label: "Comprovantes de embarque anexados ao relatório?", category: "Documentação" },
    { id: "scdp_relatorio", label: "Relatório de viagem detalhado e aprovado pela chefia?", category: "Finalização" },
    { id: "scdp_tempestividade", label: "A prestação de contas foi feita em até 5 dias?", category: "Datas" },
    { id: "scdp_restituicao", label: "Houve necessidade de restituição de valores?", category: "Valores" }
  ],
  "RMA (Almoxarifado)": [
    { id: "rma_conciliacao", label: "Saldos do RMA batem com o Grande Livro (SIAFI)?", category: "Contábil" },
    { id: "rma_movimentacao", label: "Entradas e saídas devidamente documentadas (Notas/Requisições)?", category: "Documentação" },
    { id: "rma_inventario", label: "Existe termo de conferência física assinado pela comissão?", category: "Finalização" },
    { id: "rma_periodo", label: "Relatório refere-se ao mês de competência analisado?", category: "Datas" },
    { id: "rma_vencimento", label: "Foram identificados materiais com prazo de validade vencido?", category: "Controle" },
    { id: "rma_ocioso", label: "Há materiais sem movimentação (ociosos/inservíveis)?", category: "Controle" }
  ],
  "RMB (Bens Móveis)": [
    { id: "rmb_conciliacao", label: "Saldos do RMB batem com as contas patrimoniais no SIAFI?", category: "Contábil" },
    { id: "rmb_incorporacao", label: "Novas aquisições foram devidamente tombadas?", category: "Patrimônio" },
    { id: "rmb_baixas", label: "Baixas por desfazimento/leilão possuem processo legal?", category: "Patrimônio" },
    { id: "rmb_inventario", label: "Inventário anual/periódico realizado e assinado?", category: "Finalização" },
    { id: "rmb_plaqueta", label: "Os bens possuem plaqueta de identificação física?", category: "Patrimônio" },
    { id: "rmb_depreciacao", label: "A depreciação mensal foi calculada e registrada?", category: "Contábil" }
  ],
  "DH - Documento de Habilitação": [
    { id: "dh_credor", label: "O credor está corretamente identificado no DH?", category: "Identificação" },
    { id: "dh_valor", label: "O valor habilitado confere com o documento de suporte?", category: "Valores" },
    { id: "dh_vencimento", label: "A data de vencimento está correta conforme o contrato?", category: "Datas" },
    { id: "dh_evento", label: "O evento contábil utilizado é o adequado para a obrigação?", category: "Contábil" },
    { id: "dh_suporte", label: "Existe documento de suporte válido para a habilitação?", category: "Documentação" }
  ],
  "CPR - Contas a Pagar e a Receber": [
    { id: "cpr_integridade", label: "O registro no CPR reflete fielmente a liquidação?", category: "Contábil" },
    { id: "cpr_prazos", label: "Os prazos de pagamento estão sendo observados?", category: "Datas" },
    { id: "cpr_retencoes", label: "As retenções tributárias foram apropriadas no CPR?", category: "Valores" },
    { id: "cpr_custos", label: "Houve a correta apropriação de custos no registro?", category: "Controle" },
    { id: "cpr_duplicidade", label: "Foi verificada a inexistência de duplicidade no CPR?", category: "Controle" }
  ],
  "GFIP - Guia de Recolhimento do FGTS": [
    { id: "gfip_base", label: "A base de cálculo do FGTS confere com a folha?", category: "Valores" },
    { id: "gfip_competencia", label: "A competência informada está correta?", category: "Datas" },
    { id: "gfip_codigo", label: "O código de recolhimento é o adequado para a UG?", category: "Classificação" },
    { id: "gfip_vencimento", label: "O recolhimento foi feito dentro do prazo legal (dia 7)?", category: "Datas" },
    { id: "gfip_trabalhadores", label: "A relação de trabalhadores (RE) está completa?", category: "Documentação" }
  ],
  "RP - Restos a Pagar": [
    { id: "rp_validade", label: "O empenho em RP ainda é válido e necessário?", category: "Conformidade" },
    { id: "rp_saldo", label: "O saldo de RP confere com os registros do SIAFI?", category: "Valores" },
    { id: "rp_justificativa", label: "Existe justificativa robusta para a manutenção do RP?", category: "Finalização" },
    { id: "rp_prescricao", label: "O RP corre risco de prescrição (5 anos)?", category: "Datas" },
    { id: "rp_execucao", label: "Há evidência de execução física que ampare o RP?", category: "Documentação" }
  ]
};

export const RESTRICOES = [
  "001 - Documentação Suporte Inadequada",
  "002 - Documentação Suporte Inexistente",
  "003 - Registro não Espelha o Ato/Fato de Gestão"
];
