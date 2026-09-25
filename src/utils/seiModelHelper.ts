import { AnaliseDocumentalCompiladaItem, ProcessAuditResult } from '../types';

/**
 * Constrói ou normaliza a Análise Documental Compilada e o Modelo de Resposta Oficial SEI
 * em conformidade estrita com as etapas de análise do SEI e a Macrofunção SIAFI 020314:
 * 
 * CRITÉRIOS DE RESTRIÇÃO:
 * - SÓ COM RESTRIÇÃO se a inconsistência representar risco material ou comprometer a liquidação/pagamento:
 *   - Ausência de documento hábil ou planilha detalhada que origine os valores;
 *   - Divergência de valores entre planilha/doc hábil e SIAFI (NE, NS, OB) sem justificativa;
 *   - Ausência de assinatura/autorização das instâncias exigidas no fluxo;
 *   - Pagamento executado sem liquidação prévia ou em desacordo com cronograma/fórmula;
 *   - Indício de duplicidade de pagamento, erro material de soma ou vício grave de instrução.
 * 
 * CRITÉRIOS DE OBSERVAÇÃO (SEM RESTRIÇÃO):
 * - Divergências formais em campos automáticos de sistemas integrados;
 * - Variações de código CATMAT/CATSER ou padronização de nomenclatura no texto da NE/NS;
 * - Pequenos erros gramaticais, variações em títulos de Despachos ou formatação;
 * - Divergências formais já sanadas ou justificadas expressamente em despacho posterior.
 */
export function buildSeiCompiledAnalysis(audit: ProcessAuditResult): {
  analiseDocumentalCompilada: AnaliseDocumentalCompiladaItem[];
  conclusaoMacrofuncao: 'Sem Restrição' | 'Com Restrição' | 'Pendente de Instrução';
  modeloRespostaSei: string;
} {
  // Se a análise já contém a compilação gerada pela IA, valida e formata
  let itens: AnaliseDocumentalCompiladaItem[] = [];

  if (audit.analiseDocumentalCompilada && audit.analiseDocumentalCompilada.length > 0) {
    itens = audit.analiseDocumentalCompilada;
  } else {
    // Sintetizar a partir dos documentos processuais detalhados e documentos SIAFI auditados
    const restricoes = audit.restricoesDetectadas || [];
    const temRestricaoImpeditiva = restricoes.some(r => r.severidade === 'Impeditiva' || r.severidade === 'Grave');

    if (audit.documentosProcessuaisDetalhados && audit.documentosProcessuaisDetalhados.length > 0) {
      itens = audit.documentosProcessuaisDetalhados.map(doc => {
        const isRestrito = doc.statusConformidade === 'COM PENDÊNCIA' || temRestricaoImpeditiva;
        const restricaoRelacionada = restricoes.find(r => 
          r.descricao.toLowerCase().includes(doc.tipo.toLowerCase()) || 
          r.trechoEvidencia?.toLowerCase().includes(doc.tipo.toLowerCase())
        );

        return {
          documentoSeiRegistros: `${doc.tipo} ${doc.numeroSei}${doc.folhaOuPagina ? ` (${doc.folhaOuPagina})` : ''}`,
          resultado: isRestrito && restricaoRelacionada ? 'COM RESTRIÇÃO' : 'SEM RESTRIÇÃO',
          ocorrenciaJustificativa: isRestrito && restricaoRelacionada 
            ? `${restricaoRelacionada.codigo} - ${restricaoRelacionada.descricao}`
            : 'Regularidade verificada. Documento hábil autuado e assinado em consonância com as normas de execução da despesa.',
          observacoes: doc.descricao || 'Conferência efetuada com base na Macrofunção SIAFI 020314.'
        };
      });
    }

    // Se ainda vazio, montar a partir de documentos SIAFI e identificados
    if (itens.length === 0) {
      const docsSiafi = audit.documentosSiafiAnalisados || [];
      if (docsSiafi.length > 0) {
        itens = docsSiafi.map(d => ({
          documentoSeiRegistros: `Documento SIAFI ${d.tipo} ${d.numero} (Data: ${d.data || 'Registrada'})`,
          resultado: d.status === 'IRREGULAR' ? 'COM RESTRIÇÃO' : 'SEM RESTRIÇÃO',
          ocorrenciaJustificativa: d.status === 'IRREGULAR' 
            ? (d.parecerTecnico || 'Divergência apurada nos registros SIAFI.') 
            : 'Valores contábeis e apropriação conferem estritamente com os autos do processo.',
          observacoes: d.descricaoOuObservacao || d.parecerTecnico || 'Registro contábil fidedigno.'
        }));
      } else {
        itens = [
          {
            documentoSeiRegistros: `Documento Principal ${audit.numeroDoc || 'S/N'} (${audit.tipoDoc})`,
            resultado: audit.resultado === 'COM OCORRÊNCIA' ? 'COM RESTRIÇÃO' : 'SEM RESTRIÇÃO',
            ocorrenciaJustificativa: audit.resultado === 'COM OCORRÊNCIA' 
              ? (restricoes.map(r => r.descricao).join('; ') || 'Divergência apontada na instrução processual.')
              : 'Valores, atestes e documentação hábil conferem exatamente com a autorização e registros contábeis.',
            observacoes: audit.analiseDescricaoContabil?.textoObservacao || 'Conformidade examinada nos moldes da Macrofunção SIAFI 020314.'
          }
        ];
      }
    }
  }

  // Determinar a conclusão da Macrofunção
  const hasRestricaoItem = itens.some(i => i.resultado === 'COM RESTRIÇÃO') || 
                           (audit.restricoesDetectadas && audit.restricoesDetectadas.length > 0 && audit.resultado === 'COM OCORRÊNCIA');
  
  let conclusaoMacrofuncao: 'Sem Restrição' | 'Com Restrição' | 'Pendente de Instrução' = 'Sem Restrição';
  if (hasRestricaoItem) {
    const isPendente = audit.restricoesDetectadas?.some(r => 
      r.codigo.includes('001') || r.codigo.includes('002') || r.codigo.includes('008') || r.descricao.toLowerCase().includes('ausência')
    );
    conclusaoMacrofuncao = isPendente ? 'Pendente de Instrução' : 'Com Restrição';
  }

  // Assunto/Objeto sucinto
  let assuntoObjeto = audit.parecerTecnicoEstruturado?.resumoObjeto || '';
  if (!assuntoObjeto) {
    if (audit.naturezaProcesso === 'AUXILIO_ESTUDANTIL') {
      assuntoObjeto = 'Concessão de auxílio financeiro eventual a estudantes para participação em evento acadêmico/científico.';
    } else if (audit.naturezaProcesso === 'TAXAS_E_CONTRIBUICOES') {
      assuntoObjeto = 'Pagamento de taxas públicas e Anotações de Responsabilidade Técnica (ARTs) devidas a conselho profissional fiscalizador.';
    } else if (audit.naturezaProcesso === 'FOLHA_OU_BENEFICIOS') {
      assuntoObjeto = 'Pagamento de folha de bolsas de docentes formadores colaboradores de programas institucionais.';
    } else {
      assuntoObjeto = `Execução orçamentária e financeira referente a ${audit.tipoDoc} em favor de ${audit.favorecido?.nome || 'Credor'}.`;
    }
  }

  const valorTotalFormatado = audit.valores?.valorBruto !== undefined
    ? `R$ ${audit.valores.valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Líquido pago: R$ ${(audit.valores.valorLiquido || audit.valores.valorBruto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`
    : 'Não especificado';

  // Montagem do texto em formato oficial solicitado
  let modeloRespostaSei = `**RESUMO DO PROCESSO**
- **Nº do Processo:** ${audit.processo || 'Não informado'}
- **Assunto/Objeto:** ${assuntoObjeto}
- **Valor Total:** ${valorTotalFormatado}

**ANÁLISE DOCUMENTAL COMPILADA**
`;

  itens.forEach(item => {
    modeloRespostaSei += `Para cada documento relevante da árvore do processo:
- **Documento SEI / Registros:** ${item.documentoSeiRegistros}
- **Resultado:** ${item.resultado}
- **Ocorrência / Justificativa:** ${item.ocorrenciaJustificativa}
- **Observações:** ${item.observacoes}

`;
  });

  modeloRespostaSei += `**PARECER FINAL DA CONFORMIDADE**
${conclusaoMacrofuncao}`;

  return {
    analiseDocumentalCompilada: itens,
    conclusaoMacrofuncao,
    modeloRespostaSei: modeloRespostaSei.trim()
  };
}
