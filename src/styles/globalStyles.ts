import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

/**
 * 앱 전체에서 사용되는 공통 스타일
 */
export const globalStyles = StyleSheet.create({
  // 컨테이너 스타일
  container: {
    flex: 1,
    backgroundColor: Colors.lightTheme.background,
  },
  
  // 중앙 정렬 컨테이너
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightTheme.background,
  },
  
  // 패딩이 있는 컨테이너
  paddedContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.lightTheme.background,
  },
  
  // 텍스트 스타일
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  
  bodyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  
  // 버튼 스타일
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
  },
  
  buttonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // 그림자 스타일
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // 채팅 관련 스타일
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.lightTheme.background,
  },
  
  messageList: {
    flex: 1,
    padding: 16,
  },
  
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: Colors.lightTheme.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.lightTheme.border,
  },
});