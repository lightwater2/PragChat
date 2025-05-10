import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  REQUESTY_LLM_API_KEY,
  REQUESTY_BASE_URL,
  REQUESTY_MODEL,
  APP_ENV,
  DEBUG_MODE
} from '@env';
import { DEFAULT_MODEL } from '../constants/llmModels';

/**
 * 환경 변수 접근 유틸리티
 * 
 * react-native-dotenv를 통해 환경 변수에 안전하게 접근하기 위한 유틸리티 함수들
 */

/**
 * Supabase URL 가져오기
 */
export const getSupabaseUrl = (): string => {
  return SUPABASE_URL || '';
};

/**
 * Supabase Anon Key 가져오기
 */
export const getSupabaseAnonKey = (): string => {
  return SUPABASE_ANON_KEY || '';
};

/**
 * Requesty LLM API Key 가져오기
 */
/**
 * API 키 형식 유효성 검사
 *
 * @param apiKey 검사할 API 키
 * @returns 유효한 API 키인지 여부
 */
const isValidApiKeyFormat = (apiKey: string): boolean => {
  // Requesty API 키는 일반적으로 'sk-'로 시작하고 일정 길이 이상이어야 함
  if (!apiKey || apiKey.length < 20) {
    return false;
  }
  
  if (!apiKey.startsWith('sk-')) {
    console.warn('API 키가 올바른 형식이 아닙니다. Requesty API 키는 일반적으로 sk-로 시작합니다.');
    return false;
  }
  
  // 특수 문자가 포함된 API 키도 유효함
  // +, /, = 등의 특수 문자는 Base64 인코딩에서 자주 사용됨
  return true;
};

export const getRequestyLlmApiKey = (): string => {
  // 디버그 로그 추가
  console.log('REQUESTY_LLM_API_KEY 값:', REQUESTY_LLM_API_KEY ? '설정됨 (값 숨김)' : '설정되지 않음');
  
  const apiKey = REQUESTY_LLM_API_KEY || '';
  
  // API 키 형식 검증
  if (apiKey && !isValidApiKeyFormat(apiKey)) {
    console.warn('API 키 형식이 올바르지 않습니다. 환경 변수를 확인해주세요.');
  }
  
  return apiKey;
};

/**
 * Requesty Base URL 가져오기
 */
export const getRequestyBaseUrl = (): string => {
  return REQUESTY_BASE_URL || 'https://router.requesty.ai/v1';
};

/**
 * Requesty Model 가져오기
 * 
 * 환경 변수에 설정된 모델이 없으면 기본 모델(DEFAULT_MODEL) 사용
 */
export const getRequestyModel = (): string => {
  return REQUESTY_MODEL || DEFAULT_MODEL;
};

/**
 * 개발 환경 여부 확인
 */
export const isDevelopment = (): boolean => {
  return APP_ENV === 'development';
};

/**
 * 디버그 모드 여부 확인
 */
export const isDebugMode = (): boolean => {
  return DEBUG_MODE === 'true';
};

/**
 * 환경 변수 디버그 정보 출력
 */
export const logEnvDebugInfo = (): void => {
  if (isDebugMode()) {
    console.log('===== 환경 변수 정보 =====');
    console.log('APP_ENV:', APP_ENV);
    console.log('DEBUG_MODE:', DEBUG_MODE);
    console.log('REQUESTY_BASE_URL:', getRequestyBaseUrl());
    console.log('REQUESTY_MODEL:', getRequestyModel());
    console.log('SUPABASE_URL:', getSupabaseUrl());
    console.log('API 키 설정 여부:', getRequestyLlmApiKey() ? '설정됨' : '설정되지 않음');
    console.log('========================');
  }
};