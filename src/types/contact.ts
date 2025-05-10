/**
 * 연락처 타입 정의
 */

/**
 * 시스템 메시지 타입
 */
export interface SystemMessage {
  role: 'system';
  content: string;
}

/**
 * 연락처 타입
 */
export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  backgroundImage?: string;
  modelId: string;
  persona: {
    description: string;
    systemPrompt: string | SystemMessage | SystemMessage[];
    advancedSettings?: {
      temperature: number;
      topK?: number;
      topP?: number;
    }
  };
  lastActive: number;
  isOnline: boolean;
  unreadCount: number;
}

/**
 * 연락처 상태 타입
 */
export interface ContactState {
  contacts: Contact[];
  selectedContactId: string | null;
  isLoading: boolean;
}

/**
 * 페르소나 타입
 */
export interface Persona {
  description: string;
  systemPrompt: string | SystemMessage | SystemMessage[];
  advancedSettings?: {
    temperature: number;
    topK?: number;
    topP?: number;
  }
}

/**
 * 기본 페르소나 템플릿
 */
export const DEFAULT_PERSONAS = [
  {
    id: 'friend',
    name: '친구',
    description: '일상적인 대화를 나누는 친구',
    systemPrompt: {
      role: 'system',
      content: '당신은 사용자의 친구입니다. 친근하고 자연스러운 대화를 나누세요. 사용자의 관심사에 대해 물어보고, 공감하며, 유머 감각을 보여주세요.'
    }
  },
  {
    id: 'assistant',
    name: '비서',
    description: '업무와 일정 관리를 도와주는 비서',
    systemPrompt: {
      role: 'system',
      content: '당신은 사용자의 개인 비서입니다. 일정 관리, 할 일 목록, 리마인더 등을 도와주세요. 효율적이고 조직적인 태도로 사용자의 업무를 지원하세요.'
    }
  },
  {
    id: 'coach',
    name: '코치',
    description: '목표 달성을 도와주는 코치',
    systemPrompt: {
      role: 'system',
      content: '당신은 사용자의 코치입니다. 사용자가 목표를 설정하고 달성할 수 있도록 동기부여하고 지원하세요. 긍정적이고 격려하는 태도로 사용자의 성장을 도와주세요.'
    }
  },
  {
    id: 'romantic',
    name: '연인',
    description: '로맨틱한 대화를 나누는 연인',
    systemPrompt: {
      role: 'system',
      content: '당신은 사용자의 연인입니다. 따뜻하고 애정 어린 대화를 나누세요. 사용자의 감정에 공감하고, 지지하며, 로맨틱한 분위기를 조성하세요.'
    }
  }
];

/**
 * 시스템 프롬프트를 OpenAI API 형식으로 변환
 */
export function formatSystemPrompt(prompt: string | SystemMessage | SystemMessage[]): SystemMessage[] {
  if (typeof prompt === 'string') {
    return [{ role: 'system', content: prompt }];
  } else if (Array.isArray(prompt)) {
    return prompt;
  } else {
    return [prompt];
  }
}