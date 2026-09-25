import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Analysis, ProcessAuditResult, CHECKLIST_BY_TYPE, DOC_GUIDES, DocType } from '../types';

export interface PdfExportData {
  processo: string;
  numeroDoc: string;
  tipoDoc: string;
  conformista: string;
  dataRegistro: string;
  resultado: 'SEM OCORRÊNCIA' | 'COM OCORRÊNCIA';
  restricoes: string[];
  observacaoOuParecer: string;
  checklistItens: Array<{
    item: string;
    status: 'CONFORME' | 'NÃO CONFORME' | 'NÃO SE APLICA' | 'SIM' | 'NÃO';
    observacao?: string;
  }>;
  favorecido?: string;
  cnpjCpf?: string;
  valorBruto?: number;
  retencoes?: number;
  valorLiquido?: number;
  naturezaProcesso?: string;
  sugestaoConformista?: string;
  documentosSiafi?: Array<{
    tipo: string;
    numero: string;
    data?: string;
    valor?: number;
    status?: string;
  }>;
  analiseDocumentalCompilada?: Array<{
    documentoSeiRegistros: string;
    resultado: 'SEM RESTRIÇÃO' | 'COM RESTRIÇÃO';
    ocorrenciaJustificativa: string;
    observacoes: string;
  }>;
  conclusaoMacrofuncao?: string;
  modeloRespostaSei?: string;
}

/**
 * Normaliza qualquer objeto de análise (Analysis simples do formulário ou ProcessAuditResult da IA)
 * para um formato consolidado pronto para impressão e exportação em PDF.
 */
export function normalizeAnalysisForExport(
  data: Analysis | ProcessAuditResult,
  fallbackConformista?: string
): PdfExportData {
  // Caso seja ProcessAuditResult (Auditoria detalhada da IA/PDF)
  if ('checklistAvaliado' in data || 'parecerConclusivo' in data) {
    const audit = data as ProcessAuditResult;
    const checklistItens = (audit.checklistAvaliado || []).map(c => ({
      item: c.item,
      status: c.status,
      observacao: c.observacao
    }));

    const restricoes = (audit.restricoesDetectadas || []).map(r => 
      typeof r === 'string' ? r : `${r.codigo} - ${r.titulo} (${r.severidade}): ${r.descricao}`
    );

    let observacaoOuParecer = audit.parecerConclusivo || '';
    if (audit.parecerTecnicoEstruturado) {
      const p = audit.parecerTecnicoEstruturado;
      const secoes: string[] = [];
      if (p.resumoObjeto) secoes.push(`OBJETO: ${p.resumoObjeto}`);
      if (p.analiseInstrucaoProcessual) secoes.push(`INSTRUÇÃO PROCESSUAL: ${p.analiseInstrucaoProcessual}`);
      if (p.analiseDocumentoHabilELiquidacao) secoes.push(`LIQUIDAÇÃO E DOCUMENTO HÁBIL: ${p.analiseDocumentoHabilELiquidacao}`);
      if (p.analiseTributariaERetencoes) secoes.push(`ASPECTOS TRIBUTÁRIOS (IN RFB 1.234/12): ${p.analiseTributariaERetencoes}`);
      if (p.analiseDocumentosSiafi) secoes.push(`DOCUMENTOS SIAFI: ${p.analiseDocumentosSiafi}`);
      if (p.conclusaoEEncaminhamento) secoes.push(`CONCLUSÃO: ${p.conclusaoEEncaminhamento}`);
      if (secoes.length > 0) {
        observacaoOuParecer = secoes.join('\n\n');
      }
    }

    const docsSiafi = (audit.documentosSiafiAnalisados || []).map(d => ({
      tipo: d.tipo,
      numero: d.numero,
      data: d.data,
      valor: d.valor,
      status: d.status
    }));

    return {
      processo: audit.processo || 'Não informado',
      numeroDoc: audit.numeroDoc || 'S/N',
      tipoDoc: audit.tipoDoc || 'DD - Documento de Despesa',
      conformista: fallbackConformista || 'Conformista Responsável',
      dataRegistro: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR'),
      resultado: audit.resultado,
      restricoes,
      observacaoOuParecer,
      checklistItens,
      favorecido: audit.favorecido?.nome,
      cnpjCpf: audit.favorecido?.cnpjCpf,
      valorBruto: audit.valores?.valorBruto,
      retencoes: audit.valores?.retencoes,
      valorLiquido: audit.valores?.valorLiquido,
      naturezaProcesso: audit.naturezaProcesso,
      sugestaoConformista: audit.sugestaoConformista,
      documentosSiafi: docsSiafi,
      analiseDocumentalCompilada: audit.analiseDocumentalCompilada,
      conclusaoMacrofuncao: audit.conclusaoMacrofuncao,
      modeloRespostaSei: audit.modeloRespostaSei
    };
  }

  // Caso seja Analysis simples (salva no formulário ou histórico)
  const simple = data as Analysis;
  const tipoDoc = simple.tipoDoc as DocType;
  const guideChecklist = CHECKLIST_BY_TYPE[tipoDoc] || [];

  const checklistItens = guideChecklist.map(guideItem => {
    const isChecked = simple.checklist ? Boolean(simple.checklist[guideItem.id]) : false;
    return {
      item: guideItem.label,
      status: isChecked ? ('CONFORME' as const) : ('NÃO CONFORME' as const),
      observacao: guideItem.hint || (isChecked ? 'Atendido integralmente nos autos.' : 'Pendente de comprovação.')
    };
  });

  return {
    processo: simple.processo || 'Não informado',
    numeroDoc: simple.numeroDoc || 'S/N',
    tipoDoc: simple.tipoDoc || 'NE - Nota de Empenho',
    conformista: simple.conformista || fallbackConformista || 'Conformista de Registro',
    dataRegistro: simple.timestamp 
      ? new Date(simple.timestamp).toLocaleDateString('pt-BR') + ' às ' + new Date(simple.timestamp).toLocaleTimeString('pt-BR')
      : new Date().toLocaleDateString('pt-BR'),
    resultado: simple.resultado || 'SEM OCORRÊNCIA',
    restricoes: simple.restricoes || [],
    observacaoOuParecer: simple.observacao || 'Processo analisado de acordo com as normas da Macrofunção SIAFI 020314.',
    checklistItens
  };
}

/**
 * Gera e realiza o download do relatório oficial em PDF formatado com jsPDF e jspdf-autotable.
 */
export function exportToPdfReport(data: Analysis | ProcessAuditResult, fallbackConformista?: string): void {
  const norm = normalizeAnalysisForExport(data, fallbackConformista);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = margin;

  // Função auxiliar para rodapé e numeração de páginas
  const addHeaderAndFooter = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Rodapé oficial
      doc.setDrawColor(210, 215, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 115, 125);
      doc.text(
        'Instituto Federal de Sergipe - IFS | Setor de Conformidade de Registros de Gestão (Macrofunção SIAFI 020314 / Portaria IFS nº 1.633/2026)',
        margin,
        pageHeight - 8
      );
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );
    }
  };

  // --- CABEÇALHO OFICIAL DO ÓRGÃO ---
  // Tarja superior institucional
  doc.setFillColor(20, 24, 28); // Grafite institucional escuro
  doc.rect(margin, currentY, pageWidth - margin * 2, 22, 'F');

  // Detalhe de acento verde
  doc.setFillColor(0, 204, 102);
  doc.rect(margin, currentY, 4, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE', margin + 8, currentY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 210, 220);
  doc.text('Diretoria de Orçamento e Finanças • Setor de Conformidade dos Registros de Gestão', margin + 8, currentY + 12);
  doc.text('Macrofunção SIAFI 020314 • Portaria IFS nº 1.633/2026', margin + 8, currentY + 17);

  currentY += 26;

  // Título do Relatório
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 24, 28);
  doc.text('RELATÓRIO TÉCNICO DE CONFORMIDADE DE REGISTRO DE GESTÃO', margin, currentY);

  currentY += 5;

  // Subtítulo e data de emissão
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 110, 120);
  doc.text(`Emissão: ${norm.dataRegistro} | Responsável: ${norm.conformista}`, margin, currentY);

  currentY += 5;

  // Tarja de status do resultado (SEM OCORRÊNCIA / COM OCORRÊNCIA)
  const isRegular = norm.resultado === 'SEM OCORRÊNCIA';
  if (isRegular) {
    doc.setFillColor(235, 250, 240);
    doc.setDrawColor(46, 160, 90);
  } else {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(220, 38, 38);
  }
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  if (isRegular) {
    doc.setTextColor(22, 101, 52);
    doc.text('PARECER FINAL: SEM OCORRÊNCIA — REGULARIDADE PLENA ATESTADA', margin + 4, currentY + 7.5);
  } else {
    doc.setTextColor(153, 27, 27);
    doc.text(`PARECER FINAL: COM OCORRÊNCIA — ${norm.restricoes.length} RESTRIÇÃO(ÕES) APONTADA(S)`, margin + 4, currentY + 7.5);
  }

  currentY += 16;

  // --- SEÇÃO 1: DADOS E DETALHES DO PROCESSO ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 24, 28);
  doc.text('1. DADOS E IDENTIFICAÇÃO DO PROCESSO', margin, currentY);
  currentY += 3;

  const dadosProcessoRows: Array<[string, string]> = [
    ['Processo SEI / Protocolo', norm.processo],
    ['Documento Hábil Auditado', `${norm.tipoDoc} | ${norm.numeroDoc}`],
    ['Conformista de Registro', norm.conformista],
    ['Data do Registro / Exame', norm.dataRegistro]
  ];

  if (norm.favorecido) {
    dadosProcessoRows.push(['Credor / Favorecido', `${norm.favorecido} (CNPJ/CPF: ${norm.cnpjCpf || 'N/A'})`]);
  }

  if (norm.valorBruto !== undefined && norm.valorBruto > 0) {
    const formatMoeda = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const ret = norm.retencoes !== undefined ? formatMoeda(norm.retencoes) : 'R$ 0,00';
    const liq = norm.valorLiquido !== undefined ? formatMoeda(norm.valorLiquido) : formatMoeda(norm.valorBruto);
    dadosProcessoRows.push(['Valores Auditados', `Bruto: ${formatMoeda(norm.valorBruto)} | Retenções: ${ret} | Líquido: ${liq}`]);
  }

  if (norm.naturezaProcesso) {
    dadosProcessoRows.push(['Natureza da Despesa', norm.naturezaProcesso.replace(/_/g, ' ')]);
  }

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.2, textColor: [30, 35, 42] },
    headStyles: { fillColor: [240, 243, 246], textColor: [40, 50, 60], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, fillColor: [248, 250, 252] },
      1: { cellWidth: 'auto' }
    },
    body: dadosProcessoRows
  });

  currentY = (doc as any).lastAutoTable.finalY + 7;

  // --- SEÇÃO DE RESTRIÇÕES (SE HOUVER) ---
  if (!isRegular && norm.restricoes.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(180, 20, 20);
    doc.text('2. APONTAMENTOS E RESTRIÇÕES DE CONFORMIDADE', margin, currentY);
    currentY += 3;

    const restricoesRows = norm.restricoes.map((r, idx) => [
      `${idx + 1}`,
      r
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { fontSize: 7.8, cellPadding: 2.2, textColor: [50, 10, 10] },
      head: [['Item', 'Descrição da Inconsistência / Restrição Normativa']],
      headStyles: { fillColor: [254, 226, 226], textColor: [153, 27, 27], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      body: restricoesRows
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;
  }

  // --- SEÇÃO 3: CHECKLIST DETALHADO DE CONFORMIDADE ---
  const numSecaoChecklist = (!isRegular && norm.restricoes.length > 0) ? '3' : '2';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 24, 28);
  doc.text(`${numSecaoChecklist}. CHECKLIST TÉCNICO DE VERIFICAÇÃO (MACROFUNÇÃO SIAFI 020314)`, margin, currentY);
  currentY += 3;

  const checklistRows = norm.checklistItens.map((c, i) => [
    `${i + 1}`,
    c.item,
    c.status,
    c.observacao || '-'
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 35, 42] },
    head: [['Nº', 'Requisito Auditado', 'Resultado', 'Observações / Justificativas Técnicas']],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.8 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 75 },
      2: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 'auto' }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const val = String(data.cell.raw).toUpperCase();
        if (val === 'CONFORME' || val === 'SIM') {
          data.cell.styles.textColor = [16, 120, 60];
        } else if (val === 'NÃO CONFORME' || val === 'NÃO') {
          data.cell.styles.textColor = [190, 20, 20];
        }
      }
    },
    body: checklistRows
  });

  currentY = (doc as any).lastAutoTable.finalY + 7;

  // --- SEÇÃO 4: DOCUMENTOS SIAFI AUDITADOS (SE DISPONÍVEL) ---
  if (norm.documentosSiafi && norm.documentosSiafi.length > 0) {
    // Se estiver muito próximo do fim da página, criar nova página
    if (currentY > pageHeight - 45) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 24, 28);
    doc.text('DOCUMENTOS E REGISTROS DO SIAFI VINCULADOS AO PROCESSO', margin, currentY);
    currentY += 3;

    const siafiRows = norm.documentosSiafi.map(d => [
      d.tipo,
      d.numero,
      d.data || '-',
      d.valor !== undefined ? `R$ ${d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-',
      d.status || 'REGULAR'
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 1.8, textColor: [30, 35, 42] },
      head: [['Tipo', 'Número SIAFI', 'Data', 'Valor (R$)', 'Conformidade']],
      headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold' },
        1: { cellWidth: 50 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold' }
      },
      body: siafiRows
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;
  }

  // --- SEÇÃO: ANÁLISE DOCUMENTAL COMPILADA (MACROFUNÇÃO SIAFI 020314 / SEI) ---
  if (norm.analiseDocumentalCompilada && norm.analiseDocumentalCompilada.length > 0) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 24, 28);
    doc.text('ANÁLISE DOCUMENTAL COMPILADA (PADRÃO SEI / MACROFUNÇÃO SIAFI 020314)', margin, currentY);
    currentY += 3;

    const seiRows = norm.analiseDocumentalCompilada.map(item => [
      item.documentoSeiRegistros,
      item.resultado,
      item.ocorrenciaJustificativa,
      item.observacoes
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2, textColor: [30, 35, 42] },
      head: [['Documento SEI / Registros', 'Resultado', 'Ocorrência / Justificativa', 'Observações']],
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 28, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 55 },
        3: { cellWidth: 'auto' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const val = String(data.cell.raw).toUpperCase();
          if (val === 'SEM RESTRIÇÃO') {
            data.cell.styles.textColor = [16, 120, 60];
          } else if (val === 'COM RESTRIÇÃO') {
            data.cell.styles.textColor = [190, 20, 20];
          }
        }
      },
      body: seiRows
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;
  }

  // --- SEÇÃO 5: PARECER TÉCNICO E FUNDAMENTAÇÃO LEGAL ---
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = margin;
  }

  const numSecaoParecer = (!isRegular && norm.restricoes.length > 0) ? '4' : '3';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 24, 28);
  doc.text(`${numSecaoParecer}. PARECER TÉCNICO CONCLUSIVO E FUNDAMENTAÇÃO LEGAL`, margin, currentY);
  currentY += 4;

  const parecerBoxWidth = pageWidth - margin * 2;
  const splitParecer = doc.splitTextToSize(norm.observacaoOuParecer, parecerBoxWidth - 8);

  // Calcula a altura necessária
  const lineHeight = 4.2;
  const boxHeight = splitParecer.length * lineHeight + 8;

  // Verifica se o texto do parecer cabe na página atual ou se precisa de paginação
  if (currentY + boxHeight > pageHeight - 35) {
    // Usamos autoTable para renderizar textos longos que quebram páginas automaticamente com elegância!
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 4,
        textColor: [20, 25, 30],
        lineColor: [210, 215, 220],
        lineWidth: 0.3,
        fillColor: [248, 250, 252]
      },
      body: [[norm.observacaoOuParecer]]
    });
    currentY = (doc as any).lastAutoTable.finalY + 7;
  } else {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(210, 215, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, parecerBoxWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 35, 42);
    doc.text(splitParecer, margin + 4, currentY + 5.5);

    currentY += boxHeight + 7;
  }

  // --- SEÇÃO 6: ENCAMINHAMENTO SUGERIDO E ASSINATURAS ---
  if (currentY > pageHeight - 48) {
    doc.addPage();
    currentY = margin;
  }

  if (norm.sugestaoConformista) {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 10, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(3, 105, 161);
    doc.text(`ENCAMINHAMENTO SUGERIDO: ${norm.sugestaoConformista}`, margin + 3.5, currentY + 6.5);
    currentY += 15;
  }

  // Bloco de Assinaturas Oficiais
  const colWidth = (pageWidth - margin * 2 - 10) / 2;
  const signY = currentY + 12;

  // Assinatura 1: Conformista
  doc.setDrawColor(120, 130, 140);
  doc.setLineWidth(0.4);
  doc.line(margin + 5, signY, margin + colWidth - 5, signY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(20, 24, 28);
  doc.text(norm.conformista, margin + colWidth / 2, signY + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 110, 120);
  doc.text('Conformista dos Registros de Gestão / IFS', margin + colWidth / 2, signY + 7.5, { align: 'center' });

  // Assinatura 2: Ordenador / Contador Responsável
  const col2X = margin + colWidth + 10;
  doc.line(col2X + 5, signY, col2X + colWidth - 5, signY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(20, 24, 28);
  doc.text('Ordenador de Despesas / Contador Responsável', col2X + colWidth / 2, signY + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 110, 120);
  doc.text('Unidade Gestora IFS (UG 158134 / Gestão 26423)', col2X + colWidth / 2, signY + 7.5, { align: 'center' });

  // Adiciona rodapé e paginação final em todas as páginas
  addHeaderAndFooter();

  // Gera o nome do arquivo amigável e dispara download
  const safeProcesso = norm.processo.replace(/[^a-zA-Z0-9]/g, '_');
  const safeData = new Date().toISOString().slice(0, 10);
  const fileName = `Relatorio_Conformidade_${safeProcesso}_${safeData}.pdf`;

  doc.save(fileName);
}
