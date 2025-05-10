import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseAnonKey } from '../utils/env';

/**
 * Supabase 클라이언트 인스턴스
 * 
 * 환경 변수에서 URL과 Anon Key를 가져와 Supabase 클라이언트를 생성합니다.
 * 실제 사용 시 .env 파일에 SUPABASE_URL과 SUPABASE_ANON_KEY를 설정해야 합니다.
 */
const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

/**
 * Supabase 클라이언트가 올바르게 설정되었는지 확인
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL 또는 Anon Key가 설정되지 않았습니다. ' +
    '.env 파일에 SUPABASE_URL과 SUPABASE_ANON_KEY를 설정해주세요.'
  );
}

/**
 * Supabase 클라이언트 생성
 * 
 * 환경 변수가 설정되지 않은 경우에도 앱이 실행될 수 있도록 기본값 사용
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Supabase 연결 상태 확인
 * 
 * @returns Supabase 연결 상태 (true: 연결됨, false: 연결되지 않음)
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('health_check').select('*').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase 연결 확인 중 오류 발생:', error);
    return false;
  }
};