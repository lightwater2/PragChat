/**
 * 간단한 고유 ID 생성 함수
 * 
 * @param length ID 길이 (기본값: 10)
 * @returns 생성된 고유 ID 문자열
 */
export const generateId = (length: number = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // 현재 시간을 밀리초 단위로 포함하여 고유성 증가
  const timestamp = Date.now().toString();
  result += timestamp.slice(-6);
  
  // 나머지 길이만큼 랜덤 문자 추가
  const remainingLength = Math.max(0, length - result.length);
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
};