export type DocType = 
  | "NP - Nota de Pagamento" 
  | "RP - Restos a Pagar" 
  | "DB - Documento Básico" 
  | "NC - Nota de Crédito" 
  | "NE - Nota de Empenho" 
  | "PA - Programação de Pagamento" 
  | "RC - Recibo" 
  | "DD - Documento de Despesa" 
  | "PF - Programação Financeira" 
  | "AV - Aviso Bancário" 
  | "FL - Folha de Pagamento" 
  | "ND - Nota de Débito" 
  | "PC - Programação de Crédito" 
  | "DT - Documento de Transferência" 
  | "SF - Solicitação de Fundo"
  | "OB - Ordem Bancária"
  | "DARF - Documento de Arrecadação"
  | "NS - Nota de Sistema";

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
  code: string;
  finalidade: string;
  etapaCiclo: string;
  origem: string;
  responsavel: string;
  impactoContabil: string;
  relacaoDocs: string;
  periodicidade: string;
  observacoesTecnicas: string;
  detalhamento: string;
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
  "NP - Nota de Pagamento": {
    title: "Roteiro de Análise: Nota de Pagamento (NP)",
    description: "Efetivar o pagamento de despesa liquidada.",
    code: "NP",
    finalidade: "Efetivar o pagamento de despesa liquidada.",
    etapaCiclo: "Execução Financeira",
    origem: "Tesouraria / Setor Financeiro",
    responsavel: "Ordenador de Despesa",
    impactoContabil: "Reduz 'Despesas a Pagar' e movimenta caixa.",
    relacaoDocs: "Vinculada à NE e NL.",
    periodicidade: "Conforme cronograma de desembolso.",
    observacoesTecnicas: "Deve ser conciliada com extrato bancário.",
    detalhamento: "Documento que materializa o pagamento no SIAFI. É gerado após a liquidação e vinculado à conta bancária da UG. Representa o encerramento da obrigação financeira e deve conter todos os dados de identificação do favorecido e da despesa.",
    fieldsToWatch: ["NE vinculada", "Favorecido", "Valor líquido", "Data de pagamento", "Conta de liquidação"]
  },
  "RP - Restos a Pagar": {
    title: "Roteiro de Análise: Restos a Pagar (RP)",
    description: "Controlar despesas empenhadas e não pagas até o fim do exercício.",
    code: "RP",
    finalidade: "Controlar despesas empenhadas e não pagas até o fim do exercício.",
    etapaCiclo: "Encerramento Orçamentário",
    origem: "Contabilidade / Tesouraria",
    responsavel: "Ordenador de Despesa",
    impactoContabil: "Mantém obrigação financeira para o exercício seguinte.",
    relacaoDocs: "Relaciona-se à NE e NP.",
    periodicidade: "Anual (após 31/12).",
    observacoesTecnicas: "Exige controle rigoroso para evitar prescrição.",
    detalhamento: "Representa compromissos financeiros não liquidados no exercício anterior. É essencial para o balanço patrimonial e acompanhamento da execução orçamentária residual.",
    fieldsToWatch: ["NE de origem", "Valor de inscrição", "Exercício original", "Justificativa de manutenção"]
  },
  "DB - Documento Básico": {
    title: "Roteiro de Análise: Documento Básico (DB)",
    description: "Registrar operação inicial contábil.",
    code: "DB",
    finalidade: "Registrar operação inicial contábil.",
    etapaCiclo: "Planejamento / Registro",
    origem: "Contabilidade",
    responsavel: "Responsável pelo lançamento",
    impactoContabil: "Cria lançamentos contábeis base.",
    relacaoDocs: "Origina NE, NC ou DD.",
    periodicidade: "Conforme necessidade operacional.",
    observacoesTecnicas: "Serve como referência para rastreabilidade contábil.",
    detalhamento: "Documento genérico usado para iniciar lançamentos contábeis diversos, como ajustes, correções ou registros de operações não padronizadas.",
    fieldsToWatch: ["Tipo de operação", "Valor de lançamento", "Data de registro", "UG Emitente"]
  },
  "NC - Nota de Crédito": {
    title: "Roteiro de Análise: Nota de Crédito (NC)",
    description: "Registrar acréscimos de crédito orçamentário.",
    code: "NC",
    finalidade: "Registrar acréscimos de crédito orçamentário.",
    etapaCiclo: "Planejamento Orçamentário",
    origem: "Setor de Orçamento",
    responsavel: "Gestor Orçamentário",
    impactoContabil: "Aumenta dotação orçamentária.",
    relacaoDocs: "Relaciona-se à NE e PA.",
    periodicidade: "Conforme descentralizações.",
    observacoesTecnicas: "Deve ter respaldo legal (portaria ou ofício).",
    detalhamento: "Utilizada para reforço de dotação ou descentralização de recursos entre órgãos. É documento formal de movimentação orçamentária positiva.",
    fieldsToWatch: ["Fonte de Recursos", "Valor do crédito", "UG Favorecida", "Ato autorizativo"]
  },
  "NE - Nota de Empenho": {
    title: "Roteiro de Análise: Nota de Empenho (NE)",
    description: "Reservar dotação orçamentária para despesa.",
    code: "NE",
    finalidade: "Reservar dotação orçamentária para despesa.",
    etapaCiclo: "Execução Orçamentária",
    origem: "Setor de Orçamento",
    responsavel: "Ordenador de Despesa",
    impactoContabil: "Reduz saldo da dotação orçamentária.",
    relacaoDocs: "Base para NP e DD.",
    periodicidade: "Conforme cronograma de execução.",
    observacoesTecnicas: "Documento essencial para controle da despesa pública.",
    detalhamento: "É o primeiro passo da despesa pública. Formaliza o compromisso da Administração e garante que há orçamento disponível para o gasto.",
    fieldsToWatch: ["Favorecido (CNPJ/CPF)", "Natureza de Despesa (ED)", "Valor total", "Processo SEI", "Modalidade de Licitação"]
  },
  "PA - Programação de Pagamento": {
    title: "Roteiro de Análise: Programação de Pagamento (PA)",
    description: "Planejar e agendar pagamentos futuros.",
    code: "PA",
    finalidade: "Planejar e agendar pagamentos futuros.",
    etapaCiclo: "Execução Financeira",
    origem: "Tesouraria",
    responsavel: "Responsável Financeiro",
    impactoContabil: "Organiza fluxo de caixa.",
    relacaoDocs: "Relaciona-se à NP e AV.",
    periodicidade: "Conforme cronograma financeiro.",
    observacoesTecnicas: "Deve ser compatível com disponibilidade de caixa.",
    detalhamento: "Documento de planejamento financeiro que antecipa os pagamentos previstos, permitindo controle de liquidez e gestão de desembolsos.",
    fieldsToWatch: ["Data prevista", "Valor a pagar", "Favorecido", "Ordem cronológica"]
  },
  "RC - Recibo": {
    title: "Roteiro de Análise: Recibo (RC)",
    description: "Comprovar recebimento de valores, bens ou serviços.",
    code: "RC",
    finalidade: "Comprovar recebimento de valores, bens ou serviços.",
    etapaCiclo: "Liquidação da Despesa",
    origem: "Patrimônio / Tesouraria",
    responsavel: "Favorecido",
    impactoContabil: "Comprova execução física da despesa.",
    relacaoDocs: "Vinculado à DD e NE.",
    periodicidade: "Conforme entrega ou prestação de serviço.",
    observacoesTecnicas: "Documento de comprovação física e financeira.",
    detalhamento: "É a evidência material da liquidação da despesa, servindo como prova de que o bem ou serviço foi efetivamente recebido.",
    fieldsToWatch: ["Valor comprovado", "Data de recebimento", "Assinatura do favorecido", "Descrição do serviço/material"]
  },
  "DD - Documento de Despesa": {
    title: "Roteiro de Análise: Documento de Despesa (DD)",
    description: "Detalhar despesa realizada.",
    code: "DD",
    finalidade: "Detalhar despesa realizada.",
    etapaCiclo: "Liquidação da Despesa",
    origem: "Contabilidade / Compras",
    responsavel: "Responsável pela liquidação",
    impactoContabil: "Reconhece obrigação e gera despesa contábil.",
    relacaoDocs: "Relaciona-se à NE e NP.",
    periodicidade: "Conforme execução contratual.",
    observacoesTecnicas: "Deve conter documentação comprobatória.",
    detalhamento: "Formaliza a liquidação da despesa, indicando que o serviço foi prestado ou o bem entregue, permitindo o pagamento.",
    fieldsToWatch: ["NE correspondente", "Valor bruto", "Retenções tributárias", "Justificativa/Atesto de entrega"]
  },
  "PF - Programação Financeira": {
    title: "Roteiro de Análise: Programação Financeira (PF)",
    description: "Controlar execução financeira e fluxo de caixa.",
    code: "PF",
    finalidade: "Controlar execução financeira e fluxo de caixa.",
    etapaCiclo: "Planejamento Financeiro",
    origem: "Tesouraria / Contabilidade",
    responsavel: "Gestor Financeiro",
    impactoContabil: "Permite acompanhamento da execução financeira.",
    relacaoDocs: "Relaciona-se à PA e NP.",
    periodicidade: "Mensal.",
    observacoesTecnicas: "Base para relatórios de gestão financeira.",
    detalhamento: "Documento de controle interno que consolida previsões e realizações financeiras, servindo de base para o planejamento de desembolsos.",
    fieldsToWatch: ["Período de referência", "Valores previstos", "Valores realizados", "Saldos de caixa"]
  },
  "AV - Aviso Bancário": {
    title: "Roteiro de Análise: Aviso Bancário (AV)",
    description: "Comunicar movimentações bancárias.",
    code: "AV",
    finalidade: "Comunicar movimentações bancárias.",
    etapaCiclo: "Execução Financeira",
    origem: "Tesouraria / Banco",
    responsavel: "Instituição Financeira",
    impactoContabil: "Registra entrada ou saída de recursos.",
    relacaoDocs: "Vinculado à NP e PA.",
    periodicidade: "Conforme movimentação bancária.",
    observacoesTecnicas: "Deve ser conciliado com extratos e lançamentos.",
    detalhamento: "Documento emitido pelo banco ou Tesouro informando crédito ou débito em conta, essencial para conciliação bancária.",
    fieldsToWatch: ["Data do lançamento", "Valor creditado/debita", "Tipo de operação", "Identificação da conta"]
  },
  "FL - Folha de Pagamento": {
    title: "Roteiro de Análise: Folha de Pagamento (FL)",
    description: "Consolidar pagamentos de pessoal e encargos.",
    code: "FL",
    finalidade: "Consolidar pagamentos de pessoal e encargos.",
    etapaCiclo: "Execução Orçamentária",
    origem: "RH / Tesouraria",
    responsavel: "Recursos Humanos",
    impactoContabil: "Gera despesa de pessoal e encargos sociais.",
    relacaoDocs: "Relaciona-se à NP e DD.",
    periodicidade: "Mensal.",
    observacoesTecnicas: "Deve seguir legislação trabalhista e orçamentária.",
    detalhamento: "Documento que reúne todos os pagamentos de servidores, encargos e benefícios, servindo de base para o empenho e pagamento.",
    fieldsToWatch: ["Nome/Matrícula do servidor", "Valor bruto e líquido", "Encargos sociais", "Descontos legais"]
  },
  "ND - Nota de Débito": {
    title: "Roteiro de Análise: Nota de Débito (ND)",
    description: "Registrar débitos ou ajustes negativos.",
    code: "ND",
    finalidade: "Registrar débitos ou ajustes negativos.",
    etapaCiclo: "Ajuste Contábil",
    origem: "Contabilidade",
    responsavel: "Responsável pelo ajuste",
    impactoContabil: "Reduz saldo de contas ou corrige lançamentos.",
    relacaoDocs: "Relaciona-se à NC e DB.",
    periodicidade: "Conforme necessidade de correção.",
    observacoesTecnicas: "Deve ser justificada e documentada.",
    detalhamento: "Usada para estornar lançamentos indevidos ou corrigir valores, garantindo integridade contábil.",
    fieldsToWatch: ["Documento original de origem", "Valor de ajuste", "Justificativa de erro", "Data do ajuste"]
  },
  "PC - Programação de Crédito": {
    title: "Roteiro de Análise: Programação de Crédito (PC)",
    description: "Planejar liberação de recursos financeiros.",
    code: "PC",
    finalidade: "Planejar liberação de recursos financeiros.",
    etapaCiclo: "Planejamento Financeiro",
    origem: "Tesouraria / Orçamento",
    responsavel: "Gestor Financeiro",
    impactoContabil: "Organiza fluxo de entrada de recursos.",
    relacaoDocs: "Relaciona-se à PA e PF.",
    periodicidade: "Conforme cronograma de arrecadação.",
    observacoesTecnicas: "Complementa o planejamento financeiro.",
    detalhamento: "Documento que antecipa a entrada de recursos, permitindo ajustar o fluxo de caixa e o planejamento de pagamentos.",
    fieldsToWatch: ["Valor planejado", "Data estimada de entrada", "Fonte de receita", "Dotação associada"]
  },
  "DT - Documento de Transferência": {
    title: "Roteiro de Análise: Documento de Transferência (DT)",
    description: "Registrar transferências entre unidades gestoras.",
    code: "DT",
    finalidade: "Registrar transferências entre unidades gestoras.",
    etapaCiclo: "Execução Financeira / Patrimonial",
    origem: "Tesouraria / Contabilidade",
    responsavel: "Responsável pela transferência",
    impactoContabil: "Move recursos entre contas ou UGs.",
    relacaoDocs: "Relaciona-se à NC e RP.",
    periodicidade: "Conforme necessidade operacional.",
    observacoesTecnicas: "Deve manter rastreabilidade e justificativa.",
    detalhamento: "Formaliza movimentações internas de recursos entre unidades gestoras, garantindo transparência e controle.",
    fieldsToWatch: ["UG de Origem", "UG de Destino", "Valor transferido", "Justificativa legal"]
  },
  "SF - Solicitação de Fundo": {
    title: "Roteiro de Análise: Solicitação de Fundo (SF)",
    description: "Solicitar liberação de recursos para despesas específicas.",
    code: "SF",
    finalidade: "Solicitar liberação de recursos para despesas específicas.",
    etapaCiclo: "Execução Financeira",
    origem: "Tesouraria / Setor Solicitante",
    responsavel: "Ordenador de Despesa",
    impactoContabil: "Antecede uso de suprimento de fundos.",
    relacaoDocs: "Relaciona-se à NP e DD.",
    periodicidade: "Conforme necessidade de execução imediata.",
    observacoesTecnicas: "Deve seguir regras de suprimento de fundos.",
    detalhamento: "Autoriza a liberação de valores para despesas urgentes ou de pequeno vulto, conforme legislação de suprimento de fundos.",
    fieldsToWatch: ["Valor solicitado", "Finalidade específica", "Prazo de aplicação", "Servidor responsável (suprido)"]
  },
  "OB - Ordem Bancária": {
    title: "Roteiro de Análise: Ordem Bancária (OB)",
    description: "Autorizar a transferência eletrônica de recursos da Conta Única para credores.",
    code: "OB",
    finalidade: "Efetuar pagamentos a fornecedores, servidores e outras UGs.",
    etapaCiclo: "Execução Financeira (Pagamento)",
    origem: "Tesouraria / Setor de Pagamentos",
    responsavel: "Ordenador de Despesas e Gestor Financeiro",
    impactoContabil: "Baixa o passivo financeiro e debita a conta de disponibilidades.",
    relacaoDocs: "Vinculada diretamente à NP (Nota de Pagamento) e ao documento de liquidação.",
    periodicidade: "Diária / Conforme cronograma de pagamento.",
    observacoesTecnicas: "Requer assinatura digital em conjunto (duplo fator de validação) no SIAFI/Banco.",
    detalhamento: "A Ordem Bancária (OB) é o instrumento legal que transfere recursos financeiros da Conta Única do Tesouro para a conta bancária do favorecido. Deve-se observar estritamente a titularidade do CPF/CNPJ para evitar desvios ou devoluções.",
    fieldsToWatch: ["CPF/CNPJ do Favorecido", "Banco/Agência/Conta", "Valor da transferência", "Código de favorecido SIAFI", "NP Vinculada"]
  },
  "DARF - Documento de Arrecadação": {
    title: "Roteiro de Análise: Documento de Arrecadação (DARF)",
    description: "Recolher tributos, contribuições e taxas devidas à Receita Federal.",
    code: "DARF",
    finalidade: "Quitar obrigações tributárias retidas na fonte (IRRF, CSLL, COFINS, PIS).",
    etapaCiclo: "Recolhimento Tributário",
    origem: "Setor de Contabilidade / Retenções",
    responsavel: "Contador / Responsável pelas Retenções",
    impactoContabil: "Baixa a obrigação de recolhimento tributário (passivo) contra o caixa.",
    relacaoDocs: "Vinculada ao documento de despesa (DD) e às planilhas de retenção.",
    periodicidade: "Mensal / Decendial conforme legislação federal.",
    observacoesTecnicas: "Atenção aos códigos de receita e prazos de vencimento para evitar multas.",
    detalhamento: "O DARF é utilizado para unificar o recolhimento de tributos federais incidentes sobre as contratações públicas. O preenchimento correto do período de apuração, CNPJ e código de receita é crítico para evitar pendências no cadastro fiscal da Unidade.",
    fieldsToWatch: ["Código de Receita", "Período de Apuração", "Valor do Principal", "Data de Vencimento", "CNPJ do Órgão Recolhedor"]
  },
  "NS - Nota de Sistema": {
    title: "Roteiro de Análise: Nota de Sistema (NS)",
    description: "Registrar atualizações automáticas ou lançamentos automáticos de sistema.",
    code: "NS",
    finalidade: "Registrar variações patrimoniais, apropriações de encargos e conciliações sistêmicas.",
    etapaCiclo: "Contabilidade / Ajustes de Sistema",
    origem: "SIAFI / Subsistemas de Integração",
    responsavel: "Gestor do Sistema Contábil / Contador",
    impactoContabil: "Ajustes em contas patrimoniais e de resultados gerados eletronicamente.",
    relacaoDocs: "Vinculada a relatórios mensais, folhas de pagamento ou rotinas de fechamento.",
    periodicidade: "Mensal / Encerramento do Exercício.",
    observacoesTecnicas: "Validar os parâmetros do sistema que geraram o lançamento automático.",
    detalhamento: "A Nota de Sistema (NS) é um registro eletrônico de processamento automático ou em lote dentro do SIAFI/SIAFEM. Representa operações de fechamento, depreciação, atualização cambial, ou importação de folhas que necessitam de conferência de parâmetros para evitar distorções.",
    fieldsToWatch: ["Parâmetro de lote", "UG Emitente", "Contas Debitadas/Creditadas", "Histórico automático", "Valor total registrado"]
  }
};

export const CHECKLIST_BY_TYPE: Record<DocType, ChecklistItem[]> = {
  "NP - Nota de Pagamento": [
    { id: "np_ne", label: "A Nota de Empenho (NE) vinculada está regular e com saldo suficiente?", hint: "Garantir que a despesa foi empenhada e que há cobertura para o pagamento líquido.", category: "Vínculos" },
    { id: "np_nl", label: "A Nota de Lançamento (NL) está atestada e com a liquidação aprovada?", hint: "Validar se o setor competente realizou o ateste físico e financeiro da prestação.", category: "Vínculos" },
    { id: "np_fav", label: "Os dados bancários do favorecido batem com a Nota Fiscal e cadastro SIAFI?", hint: "Evitar transferências incorretas validando banco, agência e conta do credor.", category: "Identificação" },
    { id: "np_val", label: "O valor da NP coincide exatamente com o valor líquido a pagar da liquidação?", hint: "Subtrair todas as retenções destacadas do valor bruto e verificar dízimas.", category: "Valores" },
    { id: "np_cron", label: "A ordem cronológica de pagamentos (Art. 141 da Lei 14.133/21) foi respeitada?", hint: "Verificar se não há pagamentos anteriores pendentes para a mesma classe.", category: "Conformidade" },
    { id: "np_ext", label: "A operação está devidamente programada e conciliada com o extrato da UG?", hint: "Garantir a integridade do caixa conferindo a saída de recursos vinculados.", category: "Finanças" }
  ],
  "RP - Restos a Pagar": [
    { id: "rp_evid", label: "Há evidência de execução física que ampara a manutenção do RP?", hint: "Verificar se a obra ou prestação de serviços continuou ativa no período de recesso.", category: "Execução" },
    { id: "rp_ne_orig", label: "O empenho original é válido, regular e não ultrapassou o teto de validade?", hint: "Evitar empenhos antigos inativos que necessitam de anulação fiscal.", category: "Valores" },
    { id: "rp_class", label: "O RP está corretamente classificado em Processados ou Não Processados?", hint: "Processados já estão liquidados e apenas aguardam pagamento; Não Processados dependem de liquidação.", category: "Classificação" },
    { id: "rp_just", label: "Existe justificativa robusta e assinada pelo Ordenador para prorrogar?", hint: "A manutenção de RP exige justificativa formal e fundamentação jurídica adequada.", category: "Autorização" },
    { id: "rp_caixa", label: "Há disponibilidade de caixa reservada e vinculada na conta única para este RP?", hint: "Garantir cumprimento do artigo 42 da LRF (Lei de Responsabilidade Fiscal).", category: "Finanças" }
  ],
  "DB - Documento Básico": [
    { id: "db_evcont", label: "O evento contábil e tipo de transação são corretos para este registro?", hint: "Garantir que a operação reflete com fidelidade técnica o lançamento base.", category: "Contábil" },
    { id: "db_suporte", label: "O documento de suporte técnico (Portaria, Ofício, Despacho) está anexado?", hint: "Todo lançamento contábil inicial no DB necessita de amparo documental hábil.", category: "Documentação" },
    { id: "db_autor", label: "O responsável pelo lançamento possui delegação de competência ativa?", hint: "Verificar se o operador de contabilidade está autorizado pela UG.", category: "Autorização" },
    { id: "db_reconc", label: "O DB respeita os princípios contábeis vigentes e não gera distorção?", hint: "Assegurar que as contas patrimoniais/orçamentárias debitadas e creditadas mantêm o balanço.", category: "Conformidade" }
  ],
  "NC - Nota de Crédito": [
    { id: "nc_descent", label: "Há Portaria, Decreto ou Termo de Execução Descentralizada (TED) formal?", hint: "Identificar o amparo legal que definiu a descentralização do crédito.", category: "Legalidade" },
    { id: "nc_celula", label: "A célula orçamentária (PTRES, Natureza, Fonte e PI) está idêntica ao original?", hint: "A NC não pode alterar a destinação original aprovada na Nota de Dotação.", category: "Classificação" },
    { id: "nc_teto", label: "A NC respeita os limites da Lei Orçamentária Anual (LOA)?", hint: "Evitar excesso de limite ou remanejamento sem dotação orçamentária amparada.", category: "Valores" },
    { id: "nc_fav_ug", label: "A Unidade Gestora (UG) favorecida possui competência técnica e operacional?", hint: "Validar se o órgão recebedor está devidamente qualificado no sistema.", category: "Identificação" }
  ],
  "NE - Nota de Empenho": [
    { id: "ne_mod", label: "A modalidade de licitação ou hipótese de dispensa/inexigibilidade está correta?", hint: "Comprovar enquadramento legal, enquadrando os artigos da Lei 14.133/21.", category: "Legalidade" },
    { id: "ne_cad", label: "O fornecedor está regular no SICAF, CEIS e CNEP?", hint: "Certidões de regularidade fiscal, trabalhista e previdenciária válidas na data de emissão.", category: "Regularidade" },
    { id: "ne_nat", label: "A Natureza de Despesa (ED) é adequada para o objeto empenhado?", hint: "Evitar erro de classificação (ex: registrar material permanente como consumo).", category: "Classificação" },
    { id: "ne_prec", label: "Os preços unitários e o total batem exatamente com a proposta aceita?", hint: "Validar se a quantidade multiplicada pelo preço unitário confere com o total da NE.", category: "Valores" },
    { id: "ne_cron", label: "O cronograma físico-financeiro de desembolso está realista e preenchido?", hint: "O cronograma deve prever as parcelas compatíveis com a execução do objeto.", category: "Planejamento" }
  ],
  "PA - Programação de Pagamento": [
    { id: "pa_prazo", label: "A data programada está alinhada à data de liquidação e ao contrato?", hint: "O pagamento deve ocorrer dentro dos prazos regulamentares da UG.", category: "Planejamento" },
    { id: "pa_tes", label: "O valor programado possui correspondência na cota financeira disponível?", hint: "Assegurar que a tesouraria tem cota aprovada para honrar o agendamento.", category: "Finanças" },
    { id: "pa_bloq", label: "O credor está isento de bloqueios administrativos ou judiciais no SIAFI?", hint: "Verificar se não há ordens de retenção ou penhora judicial contra o favorecido.", category: "Identificação" },
    { id: "pa_prior", label: "A prioridade de pagamento segue as regras legais e cronológicas?", hint: "Justificar formalmente caso haja quebra de ordem por motivo excepcional de interesse público.", category: "Conformidade" }
  ],
  "RC - Recibo": [
    { id: "rc_ass", label: "A assinatura do credor/prestador está formalizada e autenticada?", hint: "O recibo deve ser assinado digitalmente ou por caneta com identificação clara.", category: "Identificação" },
    { id: "rc_val", label: "O valor e a data coincidem com o documento de despesa e liquidação?", hint: "O montante deve ser idêntico ao descrito na quitação correspondente.", category: "Valores" },
    { id: "rc_obj", label: "A descrição do objeto é detalhada e idêntica ao que foi empenhado?", hint: "O recibo não pode usar termos genéricos se o contrato exigir itens específicos.", category: "Objeto" },
    { id: "rc_atest", label: "Consta atesto formal do fiscal do contrato ou comissão de recebimento?", hint: "Um servidor ou comissão deve atestar formalmente que o material/serviço foi entregue.", category: "Autorização" }
  ],
  "DD - Documento de Despesa": [
    { id: "dd_vinc", label: "A despesa possui vínculo direto com uma Nota de Empenho (NE) ativa?", hint: "Nenhum documento de despesa pode ser liquidado sem empenho prévio.", category: "Vínculos" },
    { id: "dd_atest", label: "Existe atesto de recebimento definitivo da mercadoria ou serviço?", hint: "Garantir a veracidade da liquidação antes do reconhecimento da obrigação.", category: "Valores" },
    { id: "dd_ret", label: "Os impostos e contribuições federais (IN 1234/12) foram calculados e destacados?", hint: "Calcular IRRF, CSLL, PIS e COFINS conforme a alíquota da natureza de despesa.", category: "Valores" },
    { id: "dd_reg", label: "O processo está instruído com todas as certidões e notas explicativas?", hint: "Toda liquidação de despesa pública exige comprovação de regularidade fiscal do credor.", category: "Regularidade" }
  ],
  "PF - Programação Financeira": {
    title: "Programação Financeira (PF)",
    description: "Controlar execução financeira e fluxo de caixa.",
    fieldsToWatch: ["Período de referência", "Valores previstos", "Valores realizados", "Saldos de caixa"]
  } as any, // Typed temporary object to maintain compatibility with other arrays below
  "AV - Aviso Bancário": [
    { id: "av_data", label: "A data da transação bancária confere com o extrato e tesouraria?", hint: "Manter sincronismo cronológico estrito para evitar distorção de conciliação.", category: "Datas" },
    { id: "av_valor", label: "O valor registrado é idêntico ao pagamento original ou recebimento?", hint: "Identificar diferenças de centavos ou taxas de transferência que geram resíduos.", category: "Valores" },
    { id: "av_class", label: "A natureza da movimentação está na conta contábil adequada?", hint: "Registrar corretamente ingressos ou saídas conforme o plano de contas.", category: "Classificação" },
    { id: "av_concil", label: "Divergências foram apontadas e notificadas à instituição financeira?", hint: "Registrar em termo de conciliação quaisquer erros ou tarifas indevidas.", category: "Controle" }
  ],
  "FL - Folha de Pagamento": [
    { id: "fl_serv", label: "Os valores de salário, subsídios e benefícios batem com o status ativo?", hint: "Garantir que não há pagamentos a servidores exonerados ou em licença sem vencimento.", category: "Identificação" },
    { id: "fl_ret", label: "Os cálculos de IRRF e contribuição previdenciária estão corretos?", hint: "Verificar se as tabelas de descontos de imposto de renda e previdência estão atualizadas.", category: "Valores" },
    { id: "fl_lim", label: "Os tetos constitucionais e limites de despesa com pessoal foram respeitados?", hint: "Cumprir os limites da LRF e teto salarial do funcionalismo público.", category: "Legislação" },
    { id: "fl_frequ", label: "O relatório de frequências, faltas e horas extras está anexado e assinado?", hint: "Todas as ocorrências de pessoal devem estar amparadas pela homologação da chefia.", category: "Documentação" }
  ],
  "ND - Nota de Débito": [
    { id: "nd_just", label: "A justificativa para o débito/ajuste negativo está anexada?", hint: "Garantir que a operação contábil tenha justificativa formal contra erros operacionais.", category: "Legalidade" },
    { id: "nd_orig", label: "O documento de origem ajustado está claramente referenciado?", hint: "Vincular a ND ao lançamento ou documento gerador que causou a correção.", category: "Vínculos" },
    { id: "nd_cont", label: "As contas de estorno ou readequação estão em conformidade?", hint: "Validar se os eventos contábeis estão corretos e não geram duplicidade.", category: "Contábil" },
    { id: "nd_ass", label: "A nota está devidamente visada e assinada pelo setor de contabilidade?", hint: "Garantir controle interno e segregação de funções no ajuste contábil.", category: "Autorização" }
  ],
  "PC - Programação de Crédito": [
    { id: "pc_prev", label: "A estimativa de arrecadação baseia-se em parâmetros fiscais realistas?", hint: "Evitar excesso de otimismo fiscal que possa induzir à abertura de créditos sem lastro.", category: "Planejamento" },
    { id: "pc_fonte", label: "A fonte de recursos indicada é compatível com as regras de vinculação?", hint: "Garantir destinação correta conforme a arrecadação vinculada (ex: taxas, convênios).", category: "Classificação" },
    { id: "pc_cron", label: "O cronograma de ingressos de caixa está compatível com as obrigações?", hint: "O planejamento de entrada deve suprir a programação financeira de saída.", category: "Planejamento" },
    { id: "pc_mfg", label: "O documento foi integrado com o planejamento de metas fiscais?", hint: "Assegurar que a programação do crédito cumpre as diretrizes orçamentárias (LDO).", category: "Conformidade" }
  ],
  "DT - Documento de Transferência": [
    { id: "dt_ugs", label: "Os códigos das UGs emitente e favorecida estão ativos e corretos?", hint: "Evitar transferência para unidades desativadas ou gestões incompatíveis.", category: "Identificação" },
    { id: "dt_val", label: "O valor transferido bate com o Termo de Cooperação ou solicitação?", hint: "Verificar exatidão dos valores solicitados e aprovados entre as diretorias.", category: "Valores" },
    { id: "dt_lancont", label: "Os lançamentos de débito e crédito patrimoniais estão corretos?", hint: "Garantir a simetria contábil na transferência de recursos ou bens entre UGs.", category: "Contábil" },
    { id: "dt_autor", label: "A transferência foi assinada digitalmente pelos dois gestores responsáveis?", hint: "Exigir assinatura eletrônica das autoridades de origem e destino.", category: "Autorização" }
  ],
  "SF - Solicitação de Fundo": [
    { id: "sf_sup", label: "O servidor suprido está qualificado e sem contas pendentes?", hint: "Verificar se o servidor não possui prestação de contas atrasada ou suspensa.", category: "Identificação" },
    { id: "sf_val_lim", label: "O valor solicitado respeita o teto legal de suprimento de fundos?", hint: "Verificar limites regulamentares para despesas de pequeno vulto.", category: "Valores" },
    { id: "sf_urg", label: "A finalidade descrita justifica o caráter urgente e imprevisível?", hint: "Suprimento de fundos é exceção e não pode ser usado para compras parceladas ou licitadas.", category: "Legalidade" },
    { id: "sf_aut", label: "A liberação de fundos possui despacho autorizativo do Ordenador?", hint: "O pagamento do suprimento de fundos necessita de autorização prévia de despesa.", category: "Autorização" }
  ],
  "OB - Ordem Bancária": [
    { id: "ob_fav", label: "A titularidade do CPF/CNPJ e dados bancários do favorecido coincidem com a NF/Contrato?", hint: "Evitar transferências incorretas ou fraudes na destinação de recursos públicos.", category: "Identificação" },
    { id: "ob_np_vinc", label: "A Ordem Bancária está vinculada a uma Nota de Pagamento (NP) regularizada?", hint: "Garantir a rastreabilidade do processo de pagamento no sistema SIAFI.", category: "Vínculos" },
    { id: "ob_saldo", label: "A Unidade Gestora possui saldo financeiro suficiente na respectiva fonte de recursos?", hint: "Evitar bloqueios ou rejeição da ordem por insuficiência de limite de saque.", category: "Saldos" },
    { id: "ob_aut", label: "Consta assinatura do Ordenador de Despesa e do Gestor Financeiro no documento?", hint: "Atender ao princípio da segregação de funções e dupla autorização exigida por lei.", category: "Autorização" }
  ],
  "DARF - Documento de Arrecadação": [
    { id: "darf_cod", label: "O código de receita federal utilizado é adequado à natureza do serviço contratado?", hint: "Ex: 6147 para serviços gerais, 6190 para demais serviços com retenção.", category: "Classificação" },
    { id: "darf_per", label: "O período de apuração corresponde exatamente ao mês do fato gerador (pagamento)?", hint: "A apuração tributária de órgãos federais ocorre pelo regime de caixa (data do pagamento).", category: "Datas" },
    { id: "darf_venc", label: "O recolhimento está sendo planejado/efetuado dentro do prazo legal de vencimento?", hint: "Evitar o pagamento de juros de mora e multas com recursos públicos por atraso.", category: "Prazos" },
    { id: "darf_calc", label: "Os valores de principal, multa e juros (se houver) foram recalculados e batem com o Sicalc?", hint: "Assegurar exatidão matemática nos tributos retidos e devidos.", category: "Valores" }
  ],
  "NS - Nota de Sistema": [
    { id: "ns_integ", label: "O lote de integração de sistema foi executado sem erros de processamento?", hint: "Garantir a integridade dos dados migrados de subsistemas para a contabilidade central.", category: "Sistêmico" },
    { id: "ns_param", label: "Os parâmetros e tabelas de conversão do sistema estão corretos e atualizados?", hint: "Evitar taxas de depreciação ou indexações incorretas.", category: "Parâmetros" },
    { id: "ns_concil", label: "Os saldos gerados pela NS batem com os relatórios analíticos dos subsistemas?", hint: "Confrontar os saldos da folha, almoxarifado ou patrimônio com o razão contábil.", category: "Conciliação" },
    { id: "ns_homolog", label: "Existe homologação e assinatura digital do responsável técnico do fechamento?", hint: "O lançamento automático necessita de validação por profissional contábil habilitado.", category: "Autorização" }
  ]
};

// Adjust "PF - Programação Financeira" value to be an array in CHECKLIST_BY_TYPE
CHECKLIST_BY_TYPE["PF - Programação Financeira"] = [
  { id: "pf_lim", label: "A programação respeita o limite do Decreto de Programação Financeira?", hint: "Garantir conformidade com as restrições de fluxo de caixa do governo.", category: "Legislação" },
  { id: "pf_fonte", label: "A fonte de recursos vinculada está ativa e com saldo orçamentário?", hint: "Validar se a fonte informada possui dotação apta para desembolso.", category: "Classificação" },
  { id: "pf_cron", label: "Os valores programados estão compatíveis com o cronograma de pagamentos?", hint: "Evitar divergências entre o caixa estimado e as contas a pagar no período.", category: "Valores" },
  { id: "pf_just", label: "A nota possui justificativa técnica detalhada anexada no SEI?", hint: "Todo pedido de liberação financeira deve ser motivado pelas metas da unidade.", category: "Finalização" }
];

export interface TaxRule {
  id: string;
  label: string;
  ir: number;
  csll: number;
  cofins: number;
  pis: number;
  total: number;
  darf: string;
  ddf: string;
}

export const TAX_RULES: TaxRule[] = [
  { id: "17001", label: "Alimentação", ir: 1.20, csll: 1.00, cofins: 3.00, pis: 0.65, total: 5.85, darf: "6147", ddf: "17001" },
  { id: "17002", label: "Energia Elétrica (Consumo)", ir: 1.20, csll: 1.00, cofins: 3.00, pis: 0.65, total: 5.85, darf: "6147", ddf: "17002" },
  { id: "17099", label: "Demais Serviços (Gral) / Outsourcing", ir: 4.80, csll: 1.00, cofins: 3.00, pis: 0.65, total: 9.45, darf: "6190", ddf: "17099" },
  { id: "17003", label: "Serviços com emprego de materiais", ir: 1.20, csll: 1.00, cofins: 3.00, pis: 0.65, total: 5.85, darf: "6147", ddf: "17003" },
  { id: "17004", label: "Construção Civil (Empreitada)", ir: 1.20, csll: 1.00, cofins: 3.00, pis: 0.65, total: 5.85, darf: "6147", ddf: "17004" },
  { id: "17005", label: "Serviços Hospitalares (Art. 30)", ir: 1.20, csll: 1.00, cofins: 3.00, pis: 0.65, total: 5.85, darf: "6147", ddf: "17005" },
  { id: "17006", label: "Transporte de Cargas", ir: 1.20, csll: 1.00, cofins: 3.00, pis: 0.65, total: 5.85, darf: "6147", ddf: "17006" },
  { id: "17010", label: "Combustíveis (Gasolina/Diesel/GLP)", ir: 0.24, csll: 1.00, cofins: 3.00, pis: 0.65, total: 4.89, darf: "9060", ddf: "17010" },
  { id: "17013", label: "Combustíveis (Postos) - IR/CSLL", ir: 0.24, csll: 1.00, cofins: 0.00, pis: 0.00, total: 1.24, darf: "8739", ddf: "17013" },
  { id: "17017", label: "Transporte Int. de Cargas", ir: 1.20, csll: 1.00, cofins: 0.00, pis: 0.00, total: 2.20, darf: "8767", ddf: "17017" },
  { id: "17023", label: "Passagens Aéreas/Rodoviárias", ir: 2.40, csll: 1.00, cofins: 3.00, pis: 0.65, total: 7.05, darf: "6175", ddf: "17023" },
  { id: "17024", label: "Transporte Internacional de Passageiros", ir: 2.40, csll: 1.00, cofins: 0.00, pis: 0.00, total: 3.40, darf: "8850", ddf: "17024" },
  { id: "17025", label: "Associações Profissionais/Cooperativas", ir: 0.00, csll: 1.00, cofins: 3.00, pis: 0.65, total: 4.65, darf: "8863", ddf: "17025" },
  { id: "17026", label: "Serviços Bancários / Seguros", ir: 2.40, csll: 1.00, cofins: 3.00, pis: 0.65, total: 7.05, darf: "6188", ddf: "17026" },
  { id: "17028", label: "Abastecimento de Água", ir: 4.80, csll: 1.00, cofins: 3.00, pis: 0.65, total: 9.45, darf: "6190", ddf: "17028" },
  { id: "17029", label: "Telefonia", ir: 4.80, csll: 1.00, cofins: 3.00, pis: 0.65, total: 9.45, darf: "6190", ddf: "17029" },
  { id: "17030", label: "Correio e Telégrafos", ir: 4.80, csll: 1.00, cofins: 3.00, pis: 0.65, total: 9.45, darf: "6190", ddf: "17030" },
  { id: "17031", label: "Vigilância", ir: 4.80, csll: 1.00, cofins: 3.00, pis: 0.65, total: 9.45, darf: "6190", ddf: "17031" },
  { id: "17032", label: "Limpeza", ir: 4.80, csll: 1.00, cofins: 3.00, pis: 0.65, total: 9.45, darf: "6190", ddf: "17032" },
  { id: "17033", label: "Locação de Mão de Obra", ir: 4.80, csll: 1.00, cofins: 3.00, pis: 0.65, total: 9.45, darf: "6190", ddf: "17033" }
];

export const RESTRICOES = [
  "001 - Documentação Suporte Inadequada",
  "002 - Documentação Suporte Inexistente",
  "003 - Registro não Espelha o Ato/Fato de Gestão",
  "004 - Ausência de Ateste/Recebimento na Nota Fiscal/Fatura",
  "005 - Divergência de Valores/Cálculos Tributários ou Retenções (IN 1234/12)",
  "006 - Ausência de Regularidade Fiscal/Trabalhista (SICAF/CND/FGTS)",
  "007 - Descumprimento de Prazo ou Vigência Contratual",
  "008 - Ausência de Autorização/Despacho do Ordenador de Despesa",
  "009 - Favorecido ou Dados Bancários Divergentes",
  "010 - Classificação Orçamentária/Natureza de Despesa Incorreta",
  "011 - Ausência de Nota de Empenho Vinculada Regular",
  "012 - Inobservância da Ordem Cronológica de Pagamento"
];

export interface ProcessRestriction {
  codigo: string;
  titulo: string;
  descricao: string;
  severidade: "Impeditiva" | "Grave" | "Moderada" | "Leve";
  trechoEvidencia: string;
  acaoRecomendada: string;
}

export interface ProcessChecklistItem {
  item: string;
  status: "CONFORME" | "NÃO CONFORME" | "NÃO SE APLICA";
  observacao: string;
}

export interface ProcessAuditResult {
  processo: string;
  numeroDoc: string;
  tipoDoc: DocType;
  favorecido: {
    nome: string;
    cnpjCpf: string;
  };
  valores: {
    valorBruto: number;
    retencoes: number;
    valorLiquido: number;
    detalheRetencoes?: string;
  };
  resultado: "SEM OCORRÊNCIA" | "COM OCORRÊNCIA";
  restricoesDetectadas: ProcessRestriction[];
  checklistAvaliado: ProcessChecklistItem[];
  documentosIdentificados: string[];
  parecerConclusivo: string;
  sugestaoConformista: string;
  confiancaAnalise?: string;
}
