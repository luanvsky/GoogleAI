import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Landmark, 
  Building2,
  Calendar,
  User,
  Scale
} from 'lucide-react';
import { Analysis, ProcessAuditResult } from '../types';
import { normalizeAnalysisForExport, exportToPdfReport } from '../utils/pdfExport';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Analysis | ProcessAuditResult | null;
  conformistaFallback?: string;
}

export function ExportPdfModal({ isOpen, onClose, data, conformistaFallback }: ExportPdfModalProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !data) return null;

  const report = normalizeAnalysisForExport(data, conformistaFallback);
  const isRegular = report.resultado === 'SEM OCORRÊNCIA';

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      exportToPdfReport(data, conformistaFallback);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Não foi possível gerar o PDF. Verifique os dados da análise.');
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const fullText = `INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS
DIRETORIA DE ORÇAMENTO E FINANÇAS | SETOR DE CONFORMIDADE DOS REGISTROS DE GESTÃO
MACROFUNÇÃO SIAFI 020314 • PORTARIA IFS Nº 1.633/2026

RELATÓRIO TÉCNICO INDIVIDUAL DE CONFORMIDADE DE REGISTRO DE GESTÃO

1. IDENTIFICAÇÃO DO PROCESSO:
- Processo SEI: ${report.processo}
- Documento Auditado: ${report.tipoDoc} | ${report.numeroDoc}
- Favorecido: ${report.favorecido || 'Não identificado'} (CNPJ/CPF: ${report.cnpjCpf || 'N/A'})
- Valores: Bruto R$ ${report.valorBruto?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'} | Retenções: R$ ${report.retencoes?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'} | Líquido: R$ ${report.valorLiquido?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
- Data do Registro: ${report.dataRegistro}
- Conformista Responsável: ${report.conformista}

2. RESULTADO DA AUDITORIA:
- Status: ${report.resultado}
${report.restricoes.length > 0 ? `- Ocorrências/Restrições:\n${report.restricoes.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}` : '- Regularidade plena atestada sem restrições.'}

3. CHECKLIST DE VERIFICAÇÃO:
${report.checklistItens.map((c, i) => `${i + 1}. [${c.status}] ${c.item}\n   Obs: ${c.observacao || 'N/A'}`).join('\n')}

4. PARECER TÉCNICO CONCLUSIVO:
${report.observacaoOuParecer}

${report.sugestaoConformista ? `5. ENCAMINHAMENTO SUGERIDO: ${report.sugestaoConformista}` : ''}

Responsável: ${report.conformista}
Setor de Conformidade dos Registros de Gestão - IFS`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:backdrop-blur-none">
      
      {/* Contêiner Principal do Modal */}
      <div className="bg-white dark:bg-[#16181A] w-full max-w-4xl rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[92vh] overflow-hidden my-auto print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Barra Superior de Ações (Oculta na Impressão) */}
        <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/80 dark:bg-[#1f2226] print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:bg-[#00FF00]/10 dark:text-[#00FF00] rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-black dark:text-white flex items-center gap-2">
                Exportar Relatório Oficial em PDF
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black text-[#00FF00] dark:bg-white/10 dark:text-[#00FF00]">
                  SIAFI 020314
                </span>
              </h3>
              <p className="text-xs text-black/50 dark:text-white/50">
                Relatório individual formatado para download, impressão ou envio processual no SEI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? 'Gerando PDF...' : 'Baixar PDF (.pdf)'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white dark:bg-[#282b30] hover:bg-gray-100 dark:hover:bg-[#32363c] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Imprimir ou Salvar em PDF via Navegador"
            >
              <Printer className="w-3.5 h-3.5 text-black/60 dark:text-white/60" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-2 bg-white dark:bg-[#282b30] hover:bg-gray-100 dark:hover:bg-[#32363c] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Copiar texto do parecer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-black/60 dark:text-white/60" />}
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualização de Pré-visualização do Relatório Oficial (Formato Folha A4) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100/70 dark:bg-[#0e0f11] print:p-0 print:bg-white">
          <div className="max-w-[800px] mx-auto bg-white text-[#141414] p-6 sm:p-10 rounded-2xl shadow-lg border border-black/10 print:border-none print:shadow-none print:p-0 space-y-6">
            
            {/* Cabeçalho Oficial do Órgão */}
            <div className="border-b-2 border-black/80 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-black uppercase tracking-wider">
                      IFS • MEC
                    </span>
                    <span className="text-[10px] uppercase font-bold text-black/60 tracking-wider">
                      República Federativa do Brasil
                    </span>
                  </div>
                  <h1 className="text-sm sm:text-base font-black uppercase text-black leading-tight">
                    Instituto Federal de Educação, Ciência e Tecnologia de Sergipe
                  </h1>
                  <p className="text-[11px] text-black/70 font-medium">
                    Diretoria de Orçamento e Finanças • Setor de Conformidade dos Registros de Gestão (CGCONFREG)
                  </p>
                  <p className="text-[10px] text-black/50 font-mono">
                    Macrofunção SIAFI 020314 • Portaria IFS nº 1.633/2026
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block p-2 bg-gray-50 border border-black/10 rounded-xl text-center">
                    <span className="text-[8px] uppercase font-black text-black/40 block">Unidade Gestora</span>
                    <span className="text-xs font-mono font-black text-black">158134</span>
                    <span className="text-[8px] text-black/50 block">Gestão 26423</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-dashed border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase text-black tracking-tight">
                    Relatório Técnico de Conformidade de Registro de Gestão
                  </h2>
                  <p className="text-[11px] text-black/60">
                    Certidão de exame contábil e documental do processo de despesa pública.
                  </p>
                </div>
                <div className="text-left sm:text-right text-[10px] text-black/50">
                  <div><strong>Emissão:</strong> {report.dataRegistro}</div>
                  <div><strong>Responsável:</strong> {report.conformista}</div>
                </div>
              </div>
            </div>

            {/* Banner de Resultado Final */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              isRegular
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}>
              <div className="flex items-center gap-3">
                {isRegular ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                )}
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest block opacity-70">
                    Resultado da Conformidade Diária
                  </span>
                  <div className="text-base font-black uppercase">
                    {report.resultado}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${
                isRegular ? 'bg-emerald-700' : 'bg-red-700'
              }`}>
                {isRegular ? 'Atestado de Regularidade' : `${report.restricoes.length} Restrições`}
              </span>
            </div>

            {/* 1. Identificação do Processo */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 border-b border-black/15 pb-1">
                <FileText className="w-3.5 h-3.5 text-black/60" />
                1. Identificação do Processo e Objeto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-gray-50 border border-black/10 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-black/50 block">Processo SEI</span>
                  <span className="font-mono font-bold text-black">{report.processo}</span>
                </div>
                <div className="p-2.5 bg-gray-50 border border-black/10 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-black/50 block">Documento Contábil / Fatura</span>
                  <span className="font-bold text-black">{report.tipoDoc} | {report.numeroDoc}</span>
                </div>
                {report.favorecido && (
                  <div className="p-2.5 bg-gray-50 border border-black/10 rounded-lg sm:col-span-2">
                    <span className="text-[9px] uppercase font-bold text-black/50 block">Credor / Favorecido</span>
                    <span className="font-bold text-black">{report.favorecido}</span>
                    {report.cnpjCpf && <span className="font-mono text-black/60 ml-2">({report.cnpjCpf})</span>}
                  </div>
                )}
                {report.valorBruto !== undefined && report.valorBruto > 0 && (
                  <div className="p-2.5 bg-gray-50 border border-black/10 rounded-lg sm:col-span-2 flex flex-wrap justify-between gap-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-black/50 block">Valor Bruto</span>
                      <span className="font-mono font-bold text-black">
                        R$ {report.valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-black/50 block">Retenções Tributárias</span>
                      <span className="font-mono font-bold text-black">
                        R$ {(report.retencoes || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-black/50 block">Valor Líquido</span>
                      <span className="font-mono font-black text-emerald-800">
                        R$ {(report.valorLiquido || (report.valorBruto - (report.retencoes || 0))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Restrições e Apontamentos (se houver) */}
            {!isRegular && report.restricoes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5 border-b border-red-200 pb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  2. Ocorrências e Restrições Detectadas
                </h3>
                <div className="space-y-1.5">
                  {report.restricoes.map((rest, i) => (
                    <div key={i} className="p-2.5 bg-red-50/70 border border-red-200 rounded-lg text-xs text-red-900 leading-snug">
                      <strong>{i + 1}.</strong> {rest}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Checklist Detalhado de Conformidade */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-between border-b border-black/15 pb-1">
                <span>3. Checklist Técnico de Verificação (Macrofunção SIAFI 020314)</span>
                <span className="text-[9px] text-black/50 font-normal">Auditado item a item</span>
              </h3>
              <div className="border border-black/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-black/70 text-[9px] uppercase font-bold">
                      <th className="p-2.5 w-8 text-center">Nº</th>
                      <th className="p-2.5">Requisito Auditado</th>
                      <th className="p-2.5 w-24 text-center">Status</th>
                      <th className="p-2.5">Observação Técnica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {report.checklistItens.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80">
                        <td className="p-2 text-center font-mono text-[10px] text-black/40">{idx + 1}</td>
                        <td className="p-2 font-medium text-black">{item.item}</td>
                        <td className="p-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            item.status === 'CONFORME' || item.status === 'SIM'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'NÃO CONFORME' || item.status === 'NÃO'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-2 text-[10px] text-black/60">{item.observacao || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Documentos SIAFI (se houver) */}
            {report.documentosSiafi && report.documentosSiafi.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-between border-b border-black/15 pb-1">
                  <span>Documentos e Notas SIAFI Vinculados</span>
                  <span className="text-[9px] text-black/50 font-normal">{report.documentosSiafi.length} registros</span>
                </h3>
                <div className="border border-black/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-black/70 text-[9px] uppercase font-bold">
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Número</th>
                        <th className="p-2">Data</th>
                        <th className="p-2 text-right">Valor (R$)</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 text-[11px]">
                      {report.documentosSiafi.map((doc, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-bold text-black">{doc.tipo}</td>
                          <td className="p-2 font-mono text-black">{doc.numero}</td>
                          <td className="p-2 text-black/60">{doc.data || '-'}</td>
                          <td className="p-2 text-right font-mono text-black">
                            {doc.valor !== undefined ? `R$ ${doc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                          </td>
                          <td className="p-2 text-center font-bold text-[9px] text-emerald-800">{doc.status || 'REGULAR'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Análise Documental Compilada (Padrão SEI / Macrofunção 020314) */}
            {report.analiseDocumentalCompilada && report.analiseDocumentalCompilada.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-between border-b border-black/15 pb-1">
                  <span>Análise Documental Compilada (Padrão SEI / Macrofunção SIAFI 020314)</span>
                  <span className="text-[9px] text-black/50 font-normal">Conferência dos Documentos da Árvore</span>
                </h3>
                <div className="border border-black/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-black/70 text-[9px] uppercase font-bold">
                        <th className="p-2.5">Documento SEI / Registros</th>
                        <th className="p-2.5 w-28 text-center">Resultado</th>
                        <th className="p-2.5">Ocorrência / Justificativa</th>
                        <th className="p-2.5">Observações Formais</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {report.analiseDocumentalCompilada.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80">
                          <td className="p-2 font-mono font-bold text-black text-[11px]">{item.documentoSeiRegistros}</td>
                          <td className="p-2 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              item.resultado === 'SEM RESTRIÇÃO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.resultado}
                            </span>
                          </td>
                          <td className="p-2 text-[11px] text-black/80">{item.ocorrenciaJustificativa}</td>
                          <td className="p-2 text-[11px] text-black/60">{item.observacoes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Parecer Técnico Conclusivo */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 border-b border-black/15 pb-1">
                <Scale className="w-3.5 h-3.5 text-black/60" />
                4. Parecer Técnico Conclusivo e Fundamentação Legal
              </h3>
              <div className="p-4 bg-gray-50 border border-black/10 rounded-xl text-xs leading-relaxed text-black/85 font-sans whitespace-pre-line">
                {report.observacaoOuParecer}
              </div>
            </div>

            {/* Encaminhamento sugerido */}
            {report.sugestaoConformista && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 font-medium">
                <strong>Encaminhamento Sugerido:</strong> {report.sugestaoConformista}
              </div>
            )}

            {/* Bloco de Assinaturas */}
            <div className="pt-8 border-t border-black/15 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                <div className="space-y-1">
                  <div className="w-4/5 mx-auto border-b border-black/60 pb-1">
                    <span className="text-xs font-bold text-black">{report.conformista}</span>
                  </div>
                  <p className="text-[10px] text-black/60 uppercase font-medium">
                    Conformista dos Registros de Gestão
                  </p>
                  <p className="text-[9px] text-black/40">
                    Portaria de Designação IFS
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="w-4/5 mx-auto border-b border-black/60 pb-1">
                    <span className="text-xs font-bold text-black">Ordenador de Despesas / Contador</span>
                  </div>
                  <p className="text-[10px] text-black/60 uppercase font-medium">
                    Diretoria de Orçamento e Finanças
                  </p>
                  <p className="text-[9px] text-black/40">
                    Instituto Federal de Sergipe
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center text-[9px] text-black/40">
                Documento emitido eletronicamente em {report.dataRegistro} com amparo na Macrofunção SIAFI 020314 e Portaria IFS nº 1.633/2026.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
