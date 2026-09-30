import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Server, 
  Key, 
  Globe, 
  Activity, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Cpu, 
  Save, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export interface GlobalAiConfig {
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
  provider: 'gemini' | 'deepseek';
}

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: GlobalAiConfig;
  onSaveConfig: (newConfig: GlobalAiConfig) => void;
}

export function GlobalSettingsModal({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig
}: GlobalSettingsModalProps) {
  // Configurações locais do modal
  const [baseUrl, setBaseUrl] = useState<string>(currentConfig.baseUrl || 'https://api.deepseek.com');
  const [apiKey, setApiKey] = useState<string>(currentConfig.apiKey || '');
  const [defaultModel, setDefaultModel] = useState<string>(currentConfig.defaultModel || 'deepseek-chat');
  const [provider, setProvider] = useState<'gemini' | 'deepseek'>(currentConfig.provider || 'deepseek');
  
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [customModelInput, setCustomModelInput] = useState<string>('');
  
  // Modelos carregados dinamicamente
  const [availableModels, setAvailableModels] = useState<string[]>([
    'deepseek-chat',
    'deepseek-reasoner',
    'deepseek-coder'
  ]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [modelsMessage, setModelsMessage] = useState<string | null>(null);

  // Estado do Teste de Conexão / Ping
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    testedUrl?: string;
    hasApiKey?: boolean;
    models?: string[];
    testedModel?: string;
    detail?: string;
  } | null>(null);

  // Status de gravação
  const [saveSuccessNotification, setSaveSuccessNotification] = useState<boolean>(false);

  // Atualiza os campos quando o modal abre ou a config externa muda
  useEffect(() => {
    if (isOpen) {
      setBaseUrl(currentConfig.baseUrl || 'https://api.deepseek.com');
      setApiKey(currentConfig.apiKey || '');
      setDefaultModel(currentConfig.defaultModel || 'deepseek-chat');
      setProvider(currentConfig.provider || 'deepseek');
      setTestResult(null);
      setSaveSuccessNotification(false);
      
      // Busca modelos iniciais do backend
      fetch('/api/deepseek/models')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data?.models) && data.models.length > 0) {
            setAvailableModels(data.models);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  // Realiza chamada de Ping/Status para validar conexão e autenticação
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/deepseek/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: baseUrl.trim(),
          apiKey: apiKey.trim(),
          modelToTest: defaultModel !== 'custom' ? defaultModel : (customModelInput.trim() || 'deepseek-chat')
        })
      });

      const data = await response.json();
      setTestResult(data);

      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        setAvailableModels(data.models);
        if (!data.models.includes(defaultModel) && defaultModel !== 'custom') {
          setDefaultModel(data.models[0]);
        }
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Erro ao se comunicar com a rota de teste: ' + (err.message || 'Falha de rede')
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Busca dinamicamente os modelos disponíveis via endpoint /models
  const handleFetchModels = async () => {
    setIsLoadingModels(true);
    setModelsMessage(null);

    try {
      const response = await fetch('/api/deepseek/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: baseUrl.trim(),
          apiKey: apiKey.trim()
        })
      });

      const data = await response.json();
      if (Array.isArray(data?.models) && data.models.length > 0) {
        setAvailableModels(data.models);
        setModelsMessage(`${data.models.length} modelos detectados no endpoint /models!`);
        if (!data.models.includes(defaultModel) && defaultModel !== 'custom') {
          setDefaultModel(data.models[0]);
        }
      } else {
        setModelsMessage(data?.error || 'Nenhum modelo retornado pelo servidor.');
      }
    } catch (err: any) {
      setModelsMessage('Erro ao consultar /models: ' + (err.message || 'Falha de conexão'));
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Salva as configurações globais
  const handleSave = () => {
    const finalModel = defaultModel === 'custom' && customModelInput.trim() 
      ? customModelInput.trim() 
      : defaultModel;

    const newConfig: GlobalAiConfig = {
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      defaultModel: finalModel,
      provider
    };

    onSaveConfig(newConfig);
    setSaveSuccessNotification(true);
    setTimeout(() => {
      setSaveSuccessNotification(false);
      onClose();
    }, 1200);
  };

  const handleResetToDefaults = () => {
    setBaseUrl('https://api.deepseek.com');
    setApiKey('');
    setDefaultModel('deepseek-chat');
    setCustomModelInput('');
    setProvider('deepseek');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#16181A] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-gray-50/80 dark:bg-[#1A1D20]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-black dark:text-white uppercase tracking-tight">
                Configurações Globais de IA & DeepSeek
              </h2>
              <p className="text-xs text-black/50 dark:text-white/50">
                Parâmetros de conexão, autenticação e modelo padrão para a análise de processos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Seletor do Provedor de IA Padrão */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" />
              Provedor Principal para Análise de Documentos
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 dark:bg-[#1E2124] rounded-2xl border border-black/5 dark:border-white/10">
              <button
                type="button"
                onClick={() => setProvider('deepseek')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  provider === 'deepseek'
                    ? 'bg-white dark:bg-[#2A2E33] text-blue-600 dark:text-blue-400 shadow-sm border border-blue-500/30'
                    : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                }`}
              >
                <Server className="w-4 h-4" /> DeepSeek / Custom Harness
              </button>
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  provider === 'gemini'
                    ? 'bg-white dark:bg-[#2A2E33] text-emerald-600 dark:text-[#00FF00] shadow-sm border border-emerald-500/30'
                    : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Google Gemini
              </button>
            </div>
          </div>

          {/* Campo DEEPSEEK_BASE_URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-black/80 dark:text-white/80 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>DEEPSEEK_BASE_URL</span>
                <span className="text-[10px] text-black/40 dark:text-white/40 font-normal">
                  (URL Base da API / Harness)
                </span>
              </label>
              <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                Padrão: https://api.deepseek.com
              </span>
            </div>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="ex: http://seu-harness:8000/v1 ou https://api.deepseek.com"
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1E2124] border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <p className="text-[11px] text-black/50 dark:text-white/40 leading-relaxed">
              Informe a URL do seu servidor local ou remoto (compatível com o padrão OpenAI / DeepSeek v1).
            </p>
          </div>

          {/* Campo DEEPSEEK_API_KEY */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-black/80 dark:text-white/80 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-500" />
                <span>DEEPSEEK_API_KEY</span>
                <span className="text-[10px] text-black/40 dark:text-white/40 font-normal">
                  (Chave de Autenticação / Bearer Token)
                </span>
              </label>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 dark:bg-[#1E2124] border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                title={showApiKey ? "Ocultar Chave" : "Exibir Chave"}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-black/50 dark:text-white/40 leading-relaxed">
              Opcional para servidores locais sem autenticação ativa. Se deixado em branco, o sistema usará a chave do arquivo <code className="font-mono text-[10px] bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">.env</code> do servidor se disponível.
            </p>
          </div>

          {/* Seção de Validação de Conexão (Botão Testar Conexão + Feedback) */}
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider text-blue-950 dark:text-blue-200">
                  Validação de Conexão
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-900/60 dark:text-blue-300/60">
                Ping na API
              </span>
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isTestingConnection ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Realizando Ping & Teste de Status...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Testar Conexão</span>
                </>
              )}
            </button>

            {/* Feedback Visual do Teste de Conexão */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 animate-in fade-in duration-150 ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-700 text-red-950 dark:text-red-100'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>{testResult.success ? 'Conexão Bem-Sucedida!' : 'Falha na Conexão'}</span>
                      {testResult.latencyMs !== undefined && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded">
                          Ping: {testResult.latencyMs}ms
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {testResult.message}
                    </p>
                    {testResult.detail && (
                      <p className="text-[10px] font-mono bg-black/5 dark:bg-white/5 p-1.5 rounded opacity-80 break-all">
                        {testResult.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seletor Dinâmico de Modelos (via endpoint /models) */}
          <div className="p-4 bg-gray-50 dark:bg-[#1E2124] border border-black/10 dark:border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-black/80 dark:text-white/80 block">
                  Modelo Padrão para Análise de Documentos
                </label>
                <span className="text-[10px] text-black/45 dark:text-white/45">
                  Modelos disponíveis via endpoint <code className="font-mono text-[9px] bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">/models</code>
                </span>
              </div>
              <button
                type="button"
                onClick={handleFetchModels}
                disabled={isLoadingModels}
                className="px-3 py-1.5 bg-white dark:bg-[#2A2E33] hover:bg-gray-100 dark:hover:bg-[#343940] border border-black/10 dark:border-white/15 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingModels ? 'animate-spin' : ''}`} />
                <span>{isLoadingModels ? 'Buscando...' : 'Buscar Modelos (/models)'}</span>
              </button>
            </div>

            {modelsMessage && (
              <div className="p-2 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-500/20">
                {modelsMessage}
              </div>
            )}

            <div>
              <select
                value={defaultModel}
                onChange={(e) => {
                  setDefaultModel(e.target.value);
                  if (e.target.value !== 'custom') setCustomModelInput('');
                }}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#141618] border border-black/15 dark:border-white/15 rounded-xl text-xs font-mono font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {availableModels.map((m) => (
                  <option key={m} value={m} className="dark:bg-[#16181A] dark:text-white font-mono">
                    {m} {m.includes('reasoner') || m.includes('r1') ? '🧠 [Raciocínio R1]' : m.includes('chat') || m.includes('v3') ? '⚡ [V3 Geral]' : m.includes('coder') ? '💻 [Código]' : ''}
                  </option>
                ))}
                <option value="custom" className="dark:bg-[#16181A] dark:text-white font-sans font-bold">
                  + Digitar outro modelo manualmente...
                </option>
              </select>
            </div>

            {(defaultModel === 'custom' || !availableModels.includes(defaultModel)) && (
              <div className="space-y-1">
                <label className="text-[10px] text-black/60 dark:text-white/60 font-bold block">
                  Identificador exato do modelo customizado:
                </label>
                <input
                  type="text"
                  value={customModelInput}
                  onChange={(e) => setCustomModelInput(e.target.value)}
                  placeholder="ex: deepseek-ai/DeepSeek-V3 ou my-checkpoint"
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#141618] border border-blue-400/60 rounded-xl text-xs font-mono text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-gray-50/80 dark:bg-[#1A1D20]/90 flex items-center justify-between flex-wrap gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3 py-2 text-xs font-bold text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-xs font-bold text-black/70 dark:text-white/70 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
                saveSuccessNotification
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white'
              }`}
            >
              {saveSuccessNotification ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
