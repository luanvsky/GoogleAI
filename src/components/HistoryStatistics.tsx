import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { Analysis } from '../types';

interface HistoryStatisticsProps {
  analyses: Analysis[];
  theme?: 'light' | 'dark';
}

export function HistoryStatistics({ analyses, theme = 'light' }: HistoryStatisticsProps) {
  const isDark = theme === 'dark';
  // Cálculo de KPIs e dados agregados
  const stats = useMemo(() => {
    const total = analyses.length;
    if (total === 0) {
      return {
        total: 0,
        semOcorrencia: 0,
        comOcorrencia: 0,
        taxaConformidade: '0.0',
        resultadoData: [],
        tipoDocData: [],
        topRestricoes: []
      };
    }

    const semOcorrencia = analyses.filter(a => a.resultado === 'SEM OCORRÊNCIA').length;
    const comOcorrencia = analyses.filter(a => a.resultado === 'COM OCORRÊNCIA').length;
    const taxaConformidade = ((semOcorrencia / total) * 100).toFixed(1);

    // Gráfico de Resultado (Pie/Donut)
    const resultadoData = [
      {
        name: 'Sem Ocorrência',
        value: semOcorrencia,
        color: '#10B981', // Verde esmeralda
        pct: ((semOcorrencia / total) * 100).toFixed(1)
      },
      {
        name: 'Com Ocorrência',
        value: comOcorrencia,
        color: '#EF4444', // Vermelho alerta
        pct: ((comOcorrencia / total) * 100).toFixed(1)
      }
    ].filter(item => item.value > 0);

    // Gráfico de Tipos de Documento
    const tipoMap = new Map<string, { total: number; semOcorrencia: number; comOcorrencia: number }>();
    
    // Contabilização de restrições mais frequentes
    const restricoesCount = new Map<string, number>();

    analyses.forEach(a => {
      const tipo = a.tipoDoc || 'Outros';
      const current = tipoMap.get(tipo) || { total: 0, semOcorrencia: 0, comOcorrencia: 0 };
      current.total += 1;
      if (a.resultado === 'SEM OCORRÊNCIA') {
        current.semOcorrencia += 1;
      } else {
        current.comOcorrencia += 1;
      }
      tipoMap.set(tipo, current);

      if (a.restricoes && Array.isArray(a.restricoes)) {
        a.restricoes.forEach(r => {
          if (r) {
            restricoesCount.set(r, (restricoesCount.get(r) || 0) + 1);
          }
        });
      }
    });

    const tipoDocData = Array.from(tipoMap.entries()).map(([tipo, counts]) => {
      // Extrai sigla curta para os eixos (ex: "NE", "NP", "DD", "OB")
      const sigla = tipo.split(' - ')[0] || tipo;
      return {
        tipo,
        sigla,
        total: counts.total,
        semOcorrencia: counts.semOcorrencia,
        comOcorrencia: counts.comOcorrencia
      };
    }).sort((a, b) => b.total - a.total);

    const topRestricoes = Array.from(restricoesCount.entries())
      .map(([codigo, count]) => ({ codigo, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return {
      total,
      semOcorrencia,
      comOcorrencia,
      taxaConformidade,
      resultadoData,
      tipoDocData,
      topRestricoes
    };
  }, [analyses]);

  if (analyses.length === 0) {
    return (
      <div className="p-8 bg-gray-50/70 dark:bg-[#16181A] border border-black/5 dark:border-white/10 rounded-2xl text-center space-y-3 mb-6 transition-colors">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-white dark:bg-[#202326] border border-black/5 dark:border-white/10 flex items-center justify-center text-black/30 dark:text-white/30 shadow-xs">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-black/70 dark:text-white/80">Estatísticas do Histórico</h4>
        <p className="text-xs text-black/40 dark:text-white/40 max-w-md mx-auto">
          Os gráficos de distribuição por resultado e tipos de documentos serão gerados automaticamente assim que as análises forem registradas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total Analisado */}
        <div className="bg-white dark:bg-[#16181A] p-4.5 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-black/40 dark:text-white/40 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Analisado</span>
            <FileText className="w-4 h-4 text-black/30 dark:text-white/30" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-black dark:text-white">{stats.total}</div>
            <p className="text-[11px] text-black/40 dark:text-white/40 mt-0.5">Processos auditados</p>
          </div>
        </div>

        {/* Sem Ocorrência */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4.5 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sem Ocorrência</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-emerald-800 dark:text-emerald-300">{stats.semOcorrencia}</div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium mt-0.5">
              {stats.taxaConformidade}% do total
            </p>
          </div>
        </div>

        {/* Com Ocorrência */}
        <div className="bg-red-50/50 dark:bg-red-950/20 p-4.5 rounded-2xl border border-red-200/60 dark:border-red-800/40 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-red-700 dark:text-red-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Com Ocorrência</span>
            <AlertOctagon className="w-4 h-4 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-red-800 dark:text-red-300">{stats.comOcorrencia}</div>
            <p className="text-[11px] text-red-700/80 dark:text-red-400/80 font-medium mt-0.5">
              {stats.total > 0 ? (((stats.comOcorrencia / stats.total) * 100).toFixed(1)) : 0}% com restrição
            </p>
          </div>
        </div>

        {/* Tipos Distintos */}
        <div className="bg-white dark:bg-[#16181A] p-4.5 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-black/40 dark:text-white/40 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tipos de Documento</span>
            <BarChart3 className="w-4 h-4 text-black/30 dark:text-white/30" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-black dark:text-white">{stats.tipoDocData.length}</div>
            <p className="text-[11px] text-black/40 dark:text-white/40 mt-0.5">Categorias SIAFI auditadas</p>
          </div>
        </div>
      </div>

      {/* Grid de Gráficos (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico 1: Processos por Resultado (Donut Chart) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#16181A] p-5 md:p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs flex flex-col transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-lg">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">Processos por Resultado</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-black/50 dark:text-white/60">
              Conformidade
            </span>
          </div>

          <div className="relative flex-1 flex flex-col items-center justify-center min-h-[260px]">
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.resultadoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {stats.resultadoData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={isDark ? '#16181A' : '#ffffff'} 
                        strokeWidth={2} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#141414] dark:bg-[#202326] text-white p-2.5 rounded-xl text-xs shadow-xl border border-white/10">
                            <div className="font-bold">{data.name}</div>
                            <div className="text-white/70 mt-0.5">
                              {data.value} processo{data.value > 1 ? 's' : ''} ({data.pct}%)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Texto no Centro do Donut */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-10px]">
              <div className="text-xl font-black text-black dark:text-white tracking-tight">{stats.taxaConformidade}%</div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Regular</div>
            </div>
          </div>

          {/* Legenda Customizada */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-black/5 dark:border-white/10 mt-auto">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-[#202326]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-black/60 dark:text-white/60 truncate">Sem Ocorrência</p>
                <p className="text-xs font-black text-black dark:text-white">{stats.semOcorrencia} <span className="text-[10px] font-normal text-black/40 dark:text-white/40">({stats.taxaConformidade}%)</span></p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-[#202326]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-black/60 dark:text-white/60 truncate">Com Ocorrência</p>
                <p className="text-xs font-black text-black dark:text-white">
                  {stats.comOcorrencia} <span className="text-[10px] font-normal text-black/40 dark:text-white/40">
                    ({stats.total > 0 ? ((stats.comOcorrencia / stats.total) * 100).toFixed(1) : 0}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico 2: Distribuição por Tipos de Documento (BarChart) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#16181A] p-5 md:p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs flex flex-col transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">Distribuição por Tipos de Documento</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-black/50 dark:text-white/60">
              Total por Tipo
            </span>
          </div>

          <div className="w-full h-64 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.tipoDocData}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke={isDark ? '#272B30' : '#E5E7EB'} 
                />
                <XAxis 
                  dataKey="sigla" 
                  tick={{ fontSize: 11, fill: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}
                  axisLine={{ stroke: isDark ? '#272B30' : '#E5E7EB' }}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: isDark ? '#9CA3AF' : '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#141414] dark:bg-[#202326] text-white p-3 rounded-xl text-xs shadow-xl border border-white/10 max-w-xs space-y-1.5">
                          <div className="font-bold text-white leading-tight">{data.tipo}</div>
                          <div className="pt-1.5 border-t border-white/10 space-y-1 text-white/80">
                            <div className="flex justify-between gap-4">
                              <span>Total de Processos:</span>
                              <span className="font-mono font-bold text-white">{data.total}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-emerald-400">
                              <span>Sem Ocorrência:</span>
                              <span className="font-mono font-bold">{data.semOcorrencia}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-red-400">
                              <span>Com Ocorrência:</span>
                              <span className="font-mono font-bold">{data.comOcorrencia}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="semOcorrencia" 
                  name="Sem Ocorrência" 
                  stackId="a" 
                  fill="#10B981" 
                  radius={[0, 0, 4, 4]} 
                />
                <Bar 
                  dataKey="comOcorrencia" 
                  name="Com Ocorrência" 
                  stackId="a" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legenda de Tipos de Documento */}
          <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10 mt-auto text-xs text-black/60 dark:text-white/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
                <span className="text-[11px] font-medium">Regular</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-red-500"></span>
                <span className="text-[11px] font-medium">Com Ocorrência</span>
              </div>
            </div>
            <span className="text-[10px] text-black/40 dark:text-white/40 italic">
              Passe o cursor sobre as barras para ver detalhes
            </span>
          </div>
        </div>
      </div>

      {/* Destaque de Restrições Mais Frequentes (se houver) */}
      {stats.topRestricoes.length > 0 && (
        <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 rounded-2xl transition-colors">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 mb-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Restrições SIAFI Mais Recorrentes no Histórico</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.topRestricoes.map((item, idx) => (
              <div 
                key={idx} 
                className="px-3 py-1.5 bg-white dark:bg-[#202326] border border-amber-300/80 dark:border-amber-700/50 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-center gap-2 shadow-2xs"
              >
                <span className="font-bold font-mono text-amber-700 dark:text-amber-400">{item.codigo}</span>
                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded-md text-[10px] font-black">
                  {item.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
