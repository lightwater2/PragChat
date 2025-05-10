import { getRequestyLlmApiKey, getRequestyBaseUrl, getRequestyModel, isDebugMode } from '../utils/env';
import { Message } from '../types/chat';
import { Contact, SystemMessage, formatSystemPrompt } from '../types/contact';
import { DEFAULT_SYSTEM_PROMPT, CHILD_FRIENDLY_SYSTEM_PROMPT, EDUCATIONAL_SYSTEM_PROMPT, PROFESSIONAL_SYSTEM_PROMPT } from '../constants/systemPrompts';

/**
 * LLM API 요청 타입
 */
interface LlmApiRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
}

/**
 * LLM API 응답 타입
 */
interface LlmApiResponse {
  choices: {
    message: {
      role?: string;
      content?: string;
    } | any; // 다양한 형식의 응답을 처리하기 위해 any 타입 허용
  }[];
}

/**
 * 모델별 최대 토큰 수 제한
 */
const MODEL_MAX_TOKENS: { [key: string]: number } = {
  // Anthropic 모델
  'anthropic/claude-3-opus-20240229': 4096,
  'anthropic/claude-3-sonnet-20240229': 4096,
  'anthropic/claude-3-haiku-20240307': 4096,
  'anthropic/claude-3-7-sonnet-latest': 4096,
  
  // 기본값 (다른 모든 모델)
  'default': 8192
};

/**
 * 모델에 맞는 최대 토큰 수 반환
 */
const getMaxTokensForModel = (model: string): number => {
  return MODEL_MAX_TOKENS[model] || MODEL_MAX_TOKENS['default'];
};

/**
 * AI 응답 생성 함수
 *
 * Requesty API를 호출하여 LLM 응답 생성
 *
 * @param messages 이전 메시지 배열
 * @param modelId 사용할 모델 ID (선택적)
 * @param contact 연락처 정보 (선택적)
 * @returns AI 응답 텍스트
 */
export const generateAiResponse = async (messages: Message[], modelId?: string, contact?: Contact): Promise<string> => {
  try {
    // 연락처 정보 디버깅 - 상세 정보 출력
    console.log('===== 연락처 정보 디버깅 =====');
    console.log('연락처 전달 여부:', contact ? '있음' : '없음');
    
    if (contact) {
      console.log('연락처 ID:', contact.id);
      console.log('연락처 이름:', contact.name);
      console.log('연락처 모델 ID:', contact.modelId);
      console.log('연락처 페르소나 존재 여부:', contact.persona ? '있음' : '없음');
      
      if (contact.persona) {
        console.log('페르소나 설명:', contact.persona.description);
        console.log('시스템 프롬프트 존재 여부:', contact.persona.systemPrompt ? '있음' : '없음');
        
        if (contact.persona.systemPrompt) {
          const promptType = typeof contact.persona.systemPrompt;
          console.log('시스템 프롬프트 타입:', promptType);
          
          if (promptType === 'string') {
            console.log('시스템 프롬프트 내용 (문자열):', 
              (contact.persona.systemPrompt as string).substring(0, 100) + '...');
          } else if (Array.isArray(contact.persona.systemPrompt)) {
            console.log('시스템 프롬프트 내용 (배열):', 
              (contact.persona.systemPrompt as SystemMessage[]).map(p => 
                `{role: ${p.role}, content: ${p.content.substring(0, 50)}...}`).join('\n'));
          } else {
            console.log('시스템 프롬프트 내용 (객체):', 
              `{role: ${(contact.persona.systemPrompt as SystemMessage).role}, content: ${(contact.persona.systemPrompt as SystemMessage).content.substring(0, 100)}...}`);
          }
        }
        
        console.log('고급 설정 존재 여부:', contact.persona.advancedSettings ? '있음' : '없음');
        if (contact.persona.advancedSettings) {
          console.log('고급 설정:', JSON.stringify(contact.persona.advancedSettings, null, 2));
        }
      }
    }
    console.log('===========================');
    
    const apiKey = getRequestyLlmApiKey();
    const baseUrl = getRequestyBaseUrl();
    const defaultModel = getRequestyModel();
    const model = modelId || defaultModel;
    
    // 디버그 모드에서 API 요청 정보 출력
    if (isDebugMode()) {
      console.log('===== API 요청 정보 =====');
      console.log('API 키 설정 여부:', apiKey ? '설정됨' : '설정되지 않음');
      console.log('Base URL:', baseUrl);
      console.log('모델:', model);
      console.log('사용자 지정 모델:', modelId ? '예' : '아니오');
      console.log('메시지 수:', messages.length);
      console.log('연락처 정보:', contact ? `${contact.name} (ID: ${contact.id})` : '없음');
      
      if (contact?.persona?.systemPrompt) {
        const promptType = typeof contact.persona.systemPrompt;
        console.log('시스템 프롬프트 타입:', promptType);
        
        if (promptType === 'string') {
          console.log('시스템 프롬프트 내용:', 
            (contact.persona.systemPrompt as string).substring(0, 50) + '...');
        } else if (Array.isArray(contact.persona.systemPrompt)) {
          console.log('시스템 프롬프트 배열:', 
            (contact.persona.systemPrompt as SystemMessage[]).map(p => 
              p.content.substring(0, 30) + '...').join(' | '));
        } else {
          console.log('시스템 프롬프트 객체:', 
            (contact.persona.systemPrompt as SystemMessage).content.substring(0, 50) + '...');
        }
      }
      
      if (contact?.persona?.advancedSettings) {
        console.log('고급 설정:', JSON.stringify(contact.persona.advancedSettings));
      }
      
      console.log('========================');
    }
    
    if (!apiKey) {
      console.warn('Requesty API 키가 설정되지 않았습니다.');
      return '죄송합니다. API 키가 설정되지 않아 응답을 생성할 수 없습니다.';
    }
    
    // 메시지 형식 변환
    const formattedMessages = [];
    
    // 시스템 메시지 추가
    if (contact?.persona?.systemPrompt) {
      // 연락처의 시스템 프롬프트 사용
      if (typeof contact.persona.systemPrompt === 'string') {
        // 문자열 앞에 "당신은 [이름] 입니다." 추가
        const enhancedPrompt = `당신은 ${contact.name} 입니다. ${contact.persona.systemPrompt}`;
        formattedMessages.push({
          role: 'system',
          content: enhancedPrompt
        });
        console.log('문자열 시스템 프롬프트 적용:', enhancedPrompt.substring(0, 50) + '...');
      } else if (Array.isArray(contact.persona.systemPrompt)) {
        // 첫 번째 시스템 프롬프트 앞에만 "당신은 [이름] 입니다." 추가
        let isFirstSystemPrompt = true;
        contact.persona.systemPrompt.forEach(prompt => {
          if (prompt.role === 'system' && isFirstSystemPrompt) {
            formattedMessages.push({
              role: prompt.role,
              content: `당신은 ${contact.name} 입니다. ${prompt.content}`
            });
            isFirstSystemPrompt = false;
          } else {
            formattedMessages.push({
              role: prompt.role,
              content: prompt.content
            });
          }
        });
        console.log('배열 시스템 프롬프트 적용:',
          '당신은 ' + contact.name + ' 입니다. ' + contact.persona.systemPrompt.map(p => p.content.substring(0, 30) + '...').join(' | '));
      } else {
        // 객체 형태의 시스템 프롬프트 앞에 "당신은 [이름] 입니다." 추가
        const enhancedContent = `당신은 ${contact.name} 입니다. ${contact.persona.systemPrompt.content}`;
        formattedMessages.push({
          role: contact.persona.systemPrompt.role,
          content: enhancedContent
        });
        console.log('객체 시스템 프롬프트 적용:', enhancedContent.substring(0, 50) + '...');
      }
      
      // 안전 가이드라인 추가 (연락처 프롬프트 뒤에 추가)
      formattedMessages.push({
        role: 'system',
        content: '다음 안전 지침을 항상 따르세요: 1) 선정적이거나 유해한 콘텐츠는 제공하지 마세요. 2) 불법적인 활동을 도울 수 있는 정보는 제공하지 마세요. 3) 개인정보 보호를 중요시하세요. 4) 응답은 간결하고 명확하게 유지하세요.'
      });
    } else {
      // 연락처 정보가 없는 경우 기본 시스템 프롬프트 사용
      let systemPrompt = DEFAULT_SYSTEM_PROMPT;
      
      // 연락처 유형에 따라 다른 시스템 프롬프트 적용 (예시)
      if (contact?.persona?.description) {
        const description = contact.persona.description.toLowerCase();
        if (description.includes('교육') || description.includes('교사') || description.includes('학습')) {
          systemPrompt = EDUCATIONAL_SYSTEM_PROMPT;
          console.log('교육용 시스템 프롬프트 사용');
        } else if (description.includes('비즈니스') || description.includes('전문가') || description.includes('컨설턴트')) {
          systemPrompt = PROFESSIONAL_SYSTEM_PROMPT;
          console.log('전문가용 시스템 프롬프트 사용');
        } else if (description.includes('어린이') || description.includes('아동') || description.includes('친구')) {
          systemPrompt = CHILD_FRIENDLY_SYSTEM_PROMPT;
          console.log('어린이 친화적 시스템 프롬프트 사용');
        }
      }
      
      formattedMessages.push({
        role: 'system',
        content: systemPrompt
      });
      console.log('시스템 프롬프트 사용:', systemPrompt.substring(0, 50) + '...');
    }
    
    // 사용자 및 어시스턴트 메시지 추가 (최근 10개 포함)
    const recentMessages = messages.slice(-10);
    recentMessages.forEach(msg => {
      formattedMessages.push({
        role: msg.role,
        content: msg.content
      });
    });
    
    // 요청 정보 로깅
    console.log('API 요청 URL:', `${baseUrl}/chat/completions`);
    console.log('API 요청 헤더:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey ? apiKey.substring(0, 5) + '...' : 'undefined'}`
    });
    
    // 모델에 맞는 최대 토큰 수 설정
    const maxTokens = getMaxTokensForModel(model);
    console.log(`모델 [${model}]의 최대 토큰 수:`, maxTokens);
    
    // 고급 설정 적용
    const requestBody: LlmApiRequest = {
      model: model,
      messages: formattedMessages,
      max_tokens: maxTokens
    };
    
    // 연락처의 고급 설정이 있는 경우 적용
    if (contact?.persona?.advancedSettings) {
      const { temperature, topP, topK } = contact.persona.advancedSettings;
      
      if (temperature !== undefined) {
        requestBody.temperature = temperature;
        console.log(`연락처 [${contact.name}]의 temperature 설정 적용:`, temperature);
      } else {
        requestBody.temperature = 0.7; // 기본값
      }
      
      if (topP !== undefined) {
        requestBody.top_p = topP;
        console.log(`연락처 [${contact.name}]의 top_p 설정 적용:`, topP);
      }
      
      if (topK !== undefined) {
        requestBody.top_k = topK;
        console.log(`연락처 [${contact.name}]의 top_k 설정 적용:`, topK);
      }
    } else {
      // 기본 temperature 설정
      requestBody.temperature = 0.7;
    }
    
    // 전체 요청 본문 로깅 (디버깅용)
    console.log('API 요청 전체 본문:', JSON.stringify(requestBody, null, 2));
    
    // 요약된 요청 본문 로깅
    console.log('API 요청 요약 본문:', JSON.stringify({
      ...requestBody,
      messages: requestBody.messages.map(m => ({
        role: m.role,
        content: m.content.substring(0, 50) + (m.content.length > 50 ? '...' : '')
      }))
    }, null, 2));
    
    // API 키 처리 - 특수 문자가 포함된 경우에도 그대로 사용
    // 단, 앞뒤 공백은 제거
    const sanitizedApiKey = apiKey.trim();
    
    // 디버그 모드에서 API 키 형식 확인 (첫 5자만 표시)
    if (isDebugMode()) {
      console.log('API 키 형식 확인:', sanitizedApiKey.substring(0, 5) + '...');
      console.log('API 키 길이:', sanitizedApiKey.length);
    }
    
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sanitizedApiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 요청 실패: ${response.status}`, errorText);
      
      // 오류 응답 분석
      try {
        const errorJson = JSON.parse(errorText);
        console.error('오류 세부 정보:', JSON.stringify(errorJson, null, 2));
        
        // 인증 오류인 경우 더 자세한 메시지 제공
        if (response.status === 401 || response.status === 403) {
          throw new Error(`인증 오류: API 키가 유효하지 않거나 만료되었습니다. 상태 코드: ${response.status}`);
        }
      } catch (parseError) {
        // JSON 파싱 실패 시 원본 텍스트 사용
        console.error('오류 응답 파싱 실패:', parseError);
      }
      
      throw new Error(`API 요청 실패: ${response.status} ${errorText}`);
    }
    
    const data = await response.json() as LlmApiResponse;
    
    // 응답 디버깅 추가
    if (isDebugMode()) {
      console.log('API 응답:', JSON.stringify(data, null, 2));
    }
    
    // 응답 검증 추가
    if (!data.choices || !data.choices[0]) {
      console.error('API 응답 형식이 올바르지 않습니다:', data);
      return '응답 형식 오류: 서버에서 올바른 응답을 받지 못했습니다.';
    }
    
    const message = data.choices[0].message;
    
    // 다양한 API 응답 형식 처리
    if (typeof message === 'object') {
      // 일반적인 OpenAI/Anthropic 형식
      if (message.content) {
        return message.content;
      }
      
      // Grok 모델 형식 (content가 다른 위치에 있을 수 있음)
      if (message.content === undefined && typeof message === 'object') {
        // message 객체를 문자열로 변환하여 반환
        return JSON.stringify(message);
      }
    }
    
    console.error('알 수 없는 응답 형식:', data);
    return '응답을 처리할 수 없습니다. 다른 모델을 시도해보세요.';
  } catch (error) {
    console.error('AI 응답 생성 중 오류 발생:', error);
    throw error; // 오류를 상위로 전파하여 UI에서 처리할 수 있도록 함
  }
};