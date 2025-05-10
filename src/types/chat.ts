/**
 * 메시지 역할 타입
 */
export type MessageRole = 'user' | 'assistant';

/**
 * 메시지 전달 상태 타입
 */
export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * 메시지 타입
 */
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: number;
  isRead: boolean;
  readTimestamp?: number;
  deliveryStatus?: MessageDeliveryStatus;
}

/**
 * 대화 세션 타입
 */
export interface Conversation {
  id: string;
  contactId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId?: string; // 사용된 AI 모델 ID
  pinned?: boolean; // 고정된 대화 여부
  muted?: boolean; // 알림 음소거 여부
  backgroundImage?: string; // 채팅방 배경 이미지
}

/**
 * 사용자 타입
 */
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

/**
 * 대화 미리보기 타입 (목록 표시용)
 */
export interface ChatPreview {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
  modelId?: string;
  pinned?: boolean;
  muted?: boolean; // 알림 음소거 여부
}

/**
 * 채팅 상태 타입
 */
export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  chatPreviews: ChatPreview[];
  selectedModelId: string;
  selectedContactId: string | null;
}