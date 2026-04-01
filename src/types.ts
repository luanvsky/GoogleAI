export type DocType = 
  | "ND - Nota de Dotação" 
  | "NC - Nota de Crédito" 
  | "NE - Nota de Empenho" 
  | "NL - Nota de Lançamento" 
  | "OB - Ordem Bancária" 
  | "GP/GPS - Guia de Previdência" 
  | "DF/DARF - Arrecadação Federal" 
  | "PF - Programação Financeira" 
  | "PE - Pré-Empenho" 
  | "NS - Lançamento de Sistema" 
  | "DAR - Arrecadação Municipal" 
  | "GR/GRU - Guia de Recolhimento"
  | "Nota Fiscal" 
  | "SCDP (Diárias)" 
  | "RMA (Almoxarifado)" 
  | "RMB (Bens Móveis)";

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Analysis {
  id: string;
  timestamp: string;
  conformador: string;
  processo: string;
  tipoDoc: DocType;
  resultado: "SEM RESTRIÇÃO" | "COM RESTRIÇÃO";
  checklist: Record<string, boolean>;
  restricoes: string[];
  observacao: string;
}

export const CHECKLIST_BY_TYPE: Record<DocType, ChecklistItem[]> = {
  "ND - Nota de Dotação": [
    { id: "nd_desdobramento", label: "Desdobramento por plano interno/fonte está correto?" },
    { id: "nd_loa", label: "Créditos estão previstos na LOA ou créditos adicionais?" },
    { id: "nd_tipo", label: "Tipo de ND (NB, DETAORC, NDSOF) adequado à finalidade?" },
    { id: "nd_valor", label: "Valor registrado confere com o documento de origem?" }
  ],
  "NC - Nota de Crédito": [
    { id: "nc_movimentacao", label: "Movimentação entre UGs da mesma esfera de governo?" },
    { id: "nc_tipo", label: "Provisão (interna) ou Destaque (externa) corretamente identificado?" },
    { id: "nc_favorecido", label: "UG favorecida está correta conforme o processo?" }
  ],
  "NE - Nota de Empenho": [
    { id: "ne_compromisso", label: "Comprometimento do crédito condiz com a despesa contraída?" },
    { id: "ne_ordenador", label: "Existe autorização expressa do Ordenador de Despesas?" },
    { id: "ne_favorecido", label: "Dados do favorecido (CNPJ/CPF) conferem com o processo?" },
    { id: "ne_valor", label: "Valor e dotação orçamentária estão corretos?" }
  ],
  "NL - Nota de Lançamento": [
    { id: "nl_ajuste", label: "O ajuste é de natureza contábil não vinculada a outro documento?" },
    { id: "nl_evento", label: "Evento contábil utilizado é adequado ao fato gerador?" },
    { id: "nl_suporte", label: "Existe documentação de suporte que justifique o lançamento?" }
  ],
  "OB - Ordem Bancária": [
    { id: "ob_favorecido", label: "Favorecido e conta bancária conferem com a liquidação?" },
    { id: "ob_valor", label: "Valor líquido confere com a Nota Fiscal e retenções?" },
    { id: "ob_paguese", label: "Existe o despacho de 'Pague-se' assinado pelo Ordenador?" }
  ],
  "GP/GPS - Guia de Previdência": [
    { id: "gp_calculo", label: "Cálculo das obrigações/retenções do INSS está correto?" },
    { id: "gp_favorecido", label: "Favorecido (INSS) e competência estão corretos?" }
  ],
  "DF/DARF - Arrecadação Federal": [
    { id: "df_receita", label: "Código da receita (RFB/PGFN) está correto?" },
    { id: "df_valor", label: "Valor da retenção tributária confere com a Nota Fiscal?" }
  ],
  "PF - Programação Financeira": [
    { id: "pf_aprovacao", label: "Programação aprovada pela setorial/órgão central?" },
    { id: "pf_limite", label: "Valores estão dentro do cronograma financeiro?" }
  ],
  "PE - Pré-Empenho": [
    { id: "pe_bloqueio", label: "Bloqueio de dotação para projeto específico identificado?" },
    { id: "pe_justificativa", label: "Existe decisão administrativa que fundamente o pré-empenho?" }
  ],
  "NS - Lançamento de Sistema": [
    { id: "ns_automatico", label: "Evento gerado automaticamente condiz com o ato no SIAFI Web?" },
    { id: "ns_valor", label: "Valor bruto e retenções foram gerados corretamente?" }
  ],
  "DAR - Arrecadação Municipal": [
    { id: "dar_tributo", label: "Tributo municipal/estadual identificado corretamente?" },
    { id: "dar_transferencia", label: "Registro de transferência intra-SIAFI para Conta Única?" }
  ],
  "GR/GRU - Guia de Recolhimento": [
    { id: "gr_receita", label: "Código de recolhimento e UG beneficiária corretos?" },
    { id: "gr_finalidade", label: "Finalidade (receita própria ou devolução) identificada?" }
  ],
  "Nota Fiscal": [
    { id: "nf_validade", label: "NF emitida dentro do prazo e não cancelada (SEFAZ)?" },
    { id: "nf_dados", label: "Razão Social, CNPJ e Endereço conferem com a NE?" },
    { id: "nf_atesto", label: "Existe carimbo/assinatura de 'Atesto' no verso ou digital?" },
    { id: "nf_valores", label: "Preços unitários e totais conferem com o Empenho?" },
    { id: "nf_iss", label: "Se serviço, taxa de ISS destacada corretamente?" }
  ],
  "SCDP (Diárias)": [
    { id: "scdp_pcdp", label: "PCDP autorizada e assinada no sistema SCDP?" },
    { id: "scdp_datas", label: "Datas e trechos conferem com o bilhete/processo?" },
    { id: "scdp_relatorio", label: "Relatório de viagem apresentado no prazo legal?" }
  ],
  "RMA (Almoxarifado)": [
    { id: "rma_periodo", label: "Dados relativos ao mês e exercício estão corretos?" },
    { id: "rma_siafi", label: "Saldos compatibilizados entre SIAFI e RMA?" },
    { id: "rma_assinatura", label: "Relatório datado e assinado pelo responsável?" }
  ],
  "RMB (Bens Móveis)": [
    { id: "rmb_periodo", label: "Dados relativos ao mês e exercício estão corretos?" },
    { id: "rmb_siafi", label: "Saldos compatibilizados entre SIAFI e RMB?" },
    { id: "rmb_assinatura", label: "Relatório assinado pelo responsável do patrimônio?" }
  ]
};

export const RESTRICOES = [
  "002 - Erro UG/Gestão",
  "011 - Erro Observação",
  "118 - Falta de Retenção",
  "910 - Documento sem Atesto",
  "951 - Documentação não analisada",
  "999 - Outros (especificar em observação)"
];
