/**
 * Requesty API에서 사용 가능한 LLM 모델 목록
 */
export const REQUESTY_MODELS = {
  // Anthropic 모델
  CLAUDE_3_OPUS: 'anthropic/claude-3-opus-20240229',
  CLAUDE_3_SONNET: 'anthropic/claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU: 'anthropic/claude-3-haiku-20240307',
  CLAUDE_3_SONNET_LATEST: 'anthropic/claude-3-7-sonnet-latest',
  
  // OpenAI 모델
  GPT_4: 'openai/gpt-4',
  GPT_4_TURBO: 'openai/gpt-4-turbo-preview',
  GPT_4_VISION: 'openai/gpt-4-vision-preview',
  GPT_3_5_TURBO: 'openai/gpt-3.5-turbo',
  GPT_4O_LATEST: 'openai/chatgpt-4o-latest',
  GPT_4_1: 'openai/gpt-4.1',
  O4_MINI_HIGH: 'openai/o4-mini:high',
  O3_2025_04_16: 'openai/o3-2025-04-16',
  
  // Google 모델
  GEMINI_PRO: 'google/gemini-pro',
  GEMINI_PRO_VISION: 'google/gemini-pro-vision',
  GEMINI_2_5_FLASH: 'google/gemini-2.5-flash-preview-04-17',
  
  // Meta 모델
  LLAMA_3_70B: 'meta/llama-3-70b-instruct',
  LLAMA_3_8B: 'meta/llama-3-8b-instruct',
  
  // Mistral 모델
  MISTRAL_LARGE: 'mistral/mistral-large-latest',
  MISTRAL_MEDIUM: 'mistral/mistral-medium-latest',
  MISTRAL_SMALL: 'mistral/mistral-small-latest',
  
  // xAI 모델
  GROK_1: 'xai/grok-1',
  GROK_2: 'xai/grok-2',
  GROK_3_MINI: 'xai/grok-3-mini-beta',
  GROK_3_MINI_HIGH: 'xai/grok-3-mini-beta:high',
  
  // Perplexity 모델
  PERPLEXITY_SONAR: 'perplexity/sonar',
  
  // DeepSeek 모델
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat',
};

/**
 * 기본 LLM 모델
 */
export const DEFAULT_MODEL = REQUESTY_MODELS.CLAUDE_3_SONNET_LATEST;

/**
 * 모델 선택 화면에 표시할 모델 목록
 */
export const FEATURED_MODELS = [
  {
    id: REQUESTY_MODELS.CLAUDE_3_SONNET_LATEST,
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    description: '최신 Claude 모델, 균형 잡힌 성능과 속도',
  },
  {
    id: REQUESTY_MODELS.GPT_4O_LATEST,
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'OpenAI의 최신 멀티모달 모델',
  },
  {
    id: REQUESTY_MODELS.GPT_4_1,
    name: 'GPT-4.1',
    provider: 'OpenAI',
    description: 'GPT-4의 개선된 버전',
  },
  {
    id: REQUESTY_MODELS.O4_MINI_HIGH,
    name: 'O4 Mini (High)',
    provider: 'OpenAI',
    description: '경량화된 GPT-4o 모델, 높은 품질',
  },
  {
    id: REQUESTY_MODELS.O3_2025_04_16,
    name: 'O3 (2025-04-16)',
    provider: 'OpenAI',
    description: 'OpenAI의 O3 모델',
  },
  {
    id: REQUESTY_MODELS.GROK_3_MINI_HIGH,
    name: 'Grok 3 Mini (High)',
    provider: 'xAI',
    description: 'xAI의 Grok 3 Mini 모델, 높은 품질',
  },
  {
    id: REQUESTY_MODELS.PERPLEXITY_SONAR,
    name: 'Sonar',
    provider: 'Perplexity',
    description: 'Perplexity의 Sonar 모델',
  },
  {
    id: REQUESTY_MODELS.DEEPSEEK_CHAT,
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    description: 'DeepSeek의 대화 모델',
  },
  {
    id: REQUESTY_MODELS.GEMINI_2_5_FLASH,
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: 'Google의 Gemini 2.5 Flash 모델',
  },
];