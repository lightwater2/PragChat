import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { generateId } from '../../utils/idGenerator';
import { ChatState, Conversation, Message, ChatPreview, MessageDeliveryStatus, MessageRole } from '../../types/chat';
import { DEFAULT_MODEL } from '../../constants/llmModels';
import { generateAiResponse } from '../../api/chatService';
import { RootState } from '../store';

/**
 * 초기 채팅 상태
 */
const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  chatPreviews: [],
  selectedModelId: DEFAULT_MODEL, // 기본 모델 설정
  selectedContactId: null, // 선택된 연락처 ID
};

/**
 * 채팅 슬라이스
 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * 새 대화 생성
     */
    createConversation: (state, action: PayloadAction<{ modelId?: string; contactId?: string; addToPreview?: boolean }>) => {
      const modelId = action.payload?.modelId || state.selectedModelId;
      const contactId = action.payload?.contactId || state.selectedContactId || generateId();
      // 기본적으로 미리보기에 추가하지 않음 (이는 첫 메시지가 전송될 때 추가됨)
      const addToPreview = action.payload?.addToPreview ?? false;
      
      const newConversation: Conversation = {
        id: generateId(),
        contactId,
        title: '새 대화',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId,
      };
      
      state.conversations.push(newConversation);
      state.currentConversationId = newConversation.id;
      
      // 대화 미리보기 추가 (옵션에 따라)
      if (addToPreview) {
        const newPreview: ChatPreview = {
          id: newConversation.id,
          title: newConversation.title,
          lastMessage: '',
          timestamp: newConversation.createdAt,
          unreadCount: 0,
          modelId,
        };
        
        state.chatPreviews.push(newPreview);
      }
    },
    
    /**
     * 대화 선택
     */
    selectConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
      
      // 읽음 표시 처리
      const previewIndex = state.chatPreviews.findIndex(
        (preview) => preview.id === action.payload
      );
      
      if (previewIndex !== -1) {
        state.chatPreviews[previewIndex].unreadCount = 0;
      }
    },
    
    /**
     * 대화 제목 변경
     */
    updateConversationTitle: (
      state,
      action: PayloadAction<{ conversationId: string; title: string }>
    ) => {
      const { conversationId, title } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv.id === conversationId
      );
      
      if (conversation) {
        conversation.title = title;
        conversation.updatedAt = Date.now();
        
        // 미리보기 제목도 업데이트
        const previewIndex = state.chatPreviews.findIndex(
          (preview) => preview.id === conversationId
        );
        
        if (previewIndex !== -1) {
          state.chatPreviews[previewIndex].title = title;
        }
      }
    },
    
    /**
     * 대화 삭제
     */
    deleteConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(
        (conv) => conv.id !== conversationId
      );
      
      // 미리보기에서도 삭제
      state.chatPreviews = state.chatPreviews.filter(
        (preview) => preview.id !== conversationId
      );
      
      if (state.currentConversationId === conversationId) {
        state.currentConversationId = state.conversations.length > 0
          ? state.conversations[0].id
          : null;
      }
    },
    
    /**
     * 메시지 추가
     */
    addMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'readTimestamp' | 'deliveryStatus'>;
        forceUnread?: boolean; // 강제로 읽지 않음 상태로 설정할지 여부
      }>
    ) => {
      const { conversationId, message, forceUnread } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv.id === conversationId
      );
      
      if (conversation) {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
          isRead: forceUnread ? false : state.currentConversationId === conversationId,
          readTimestamp: forceUnread ? undefined : (state.currentConversationId === conversationId ? Date.now() : undefined),
          deliveryStatus: message.role === 'user' ? 'sent' : undefined,
        };
        
        conversation.messages.push(newMessage);
        conversation.updatedAt = Date.now();
        
        // 첫 메시지인 경우 (사용자 메시지) - 이때 채팅 목록에 추가
        const isFirstMessage = conversation.messages.length === 1 && message.role === 'user';
        
        // 미리보기에 대화 있는지 확인
        let previewIndex = state.chatPreviews.findIndex(
          (preview) => preview.id === conversationId
        );
        
        // 미리보기에 해당 대화가 없고 첫 메시지가 추가되는 경우, 미리보기에 추가
        if (previewIndex === -1 && isFirstMessage) {
          // 제목 생성 (첫 메시지 또는 대화 제목 기반)
          const title = conversation.title !== '새 대화'
            ? conversation.title
            : message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
          
          // 대화 제목 업데이트
          conversation.title = title;
          
          // 미리보기에 새로운 대화 추가
          const newPreview: ChatPreview = {
            id: conversationId,
            title: title,
            lastMessage: message.content.slice(0, 50) + (message.content.length > 50 ? '...' : ''),
            timestamp: newMessage.timestamp,
            unreadCount: 0,
            modelId: conversation.modelId,
          };
          
          state.chatPreviews.unshift(newPreview); // 최상단에 추가
          previewIndex = 0; // 추가된 위치 업데이트
        }
        // 이미 미리보기에 있는 경우 업데이트
        else if (previewIndex !== -1) {
          // 첫 메시지인 경우 대화 제목 업데이트
          if (isFirstMessage) {
            const title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
            conversation.title = title;
            state.chatPreviews[previewIndex].title = title;
          }
          
          // 마지막 메시지 및 타임스탬프 업데이트
          state.chatPreviews[previewIndex].lastMessage = newMessage.content.slice(0, 50) +
            (newMessage.content.length > 50 ? '...' : '');
          state.chatPreviews[previewIndex].timestamp = newMessage.timestamp;
          
          // 현재 선택된 대화가 아니거나 forceUnread가 true이면 읽지 않은 메시지 카운트 증가
          if ((state.currentConversationId !== conversationId || forceUnread) && message.role === 'assistant') {
            state.chatPreviews[previewIndex].unreadCount += 1;
            
            // 미리보기 목록을 최신 메시지가 있는 대화가 상단에 오도록 재정렬
            const updatedPreview = state.chatPreviews[previewIndex];
            state.chatPreviews.splice(previewIndex, 1);
            state.chatPreviews.unshift(updatedPreview);
          }
        }
      }
    },
    
    /**
     * 대화 고정/고정 해제
     */
    togglePinConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv.id === conversationId
      );
      
      if (conversation) {
        conversation.pinned = !conversation.pinned;
        
        // 미리보기에도 적용
        const previewIndex = state.chatPreviews.findIndex(
          (preview) => preview.id === conversationId
        );
        
        if (previewIndex !== -1) {
          state.chatPreviews[previewIndex].pinned = conversation.pinned;
        }
      }
    },
    
    /**
     * 대화 알림 설정 토글
     */
    toggleMuteConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const previewIndex = state.chatPreviews.findIndex(
        (preview) => preview.id === conversationId
      );
      
      if (previewIndex !== -1) {
        // 알림 설정 토글
        state.chatPreviews[previewIndex].muted = !state.chatPreviews[previewIndex].muted;
      }
    },
    
    /**
     * 모델 선택
     */
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModelId = action.payload;
    },
    
    /**
     * 로딩 상태 설정
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    /**
     * 현재 대화 ID 초기화 (새 대화 시작 시 사용)
     */
    clearCurrentConversation: (state) => {
      state.currentConversationId = null;
    },
    
    /**
     * 메시지 읽음 상태 업데이트
     */
    markMessageAsRead: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv.id === conversationId
      );
      
      if (conversation) {
        const message = conversation.messages.find(
          (msg) => msg.id === messageId
        );
        
        if (message && !message.isRead) {
          message.isRead = true;
          message.readTimestamp = Date.now();
        }
      }
    },
    
    /**
     * 대화의 모든 메시지 읽음 상태 업데이트
     */
    markAllMessagesAsRead: (
      state,
      action: PayloadAction<string>
    ) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv.id === conversationId
      );
      
      if (conversation) {
        const currentTime = Date.now();
        
        conversation.messages.forEach((message) => {
          if (!message.isRead) {
            message.isRead = true;
            message.readTimestamp = currentTime;
            
            // 사용자 메시지인 경우 전달 상태도 업데이트
            if (message.role === 'user') {
              message.deliveryStatus = 'read';
            }
          }
        });
        
        // 미리보기 읽지 않은 메시지 카운트 초기화
        const previewIndex = state.chatPreviews.findIndex(
          (preview) => preview.id === conversationId
        );
        
        if (previewIndex !== -1) {
          state.chatPreviews[previewIndex].unreadCount = 0;
        }
      }
    },
    
    /**
     * 메시지 전달 상태 업데이트
     */
    updateMessageDeliveryStatus: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        status: MessageDeliveryStatus
      }>
    ) => {
      const { conversationId, messageId, status } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv.id === conversationId
      );
      
      if (conversation) {
        const message = conversation.messages.find(
          (msg) => msg.id === messageId
        );
        
        if (message) {
          message.deliveryStatus = status;
          
          // 읽음 상태인 경우 isRead도 업데이트
          if (status === 'read' && !message.isRead) {
            message.isRead = true;
            message.readTimestamp = Date.now();
          }
        }
      }
    },
  },
});

/**
 * 메시지 전송 및 AI 응답 생성을 위한 비동기 액션 생성자
 */
export const sendMessageAndGetResponse = createAsyncThunk(
  'chat/sendMessageAndGetResponse',
  async (
    { content, conversationId }: { content: string; conversationId: string },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;
    
    // 1. 사용자 메시지 추가 (sending 상태로 시작)
    const userMessageAction = addMessage({
      conversationId,
      message: {
        content,
        role: 'user',
      },
    });
    
    dispatch(userMessageAction);
    
    // Redux 상태 업데이트를 기다림
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // 업데이트된 상태 가져오기
    const updatedState = getState() as RootState;
    const conversation = updatedState.chat.conversations.find(
      (conv) => conv.id === conversationId
    );
    
    if (!conversation) {
      throw new Error('대화를 찾을 수 없습니다.');
    }
    
    // 가장 최근 사용자 메시지 찾기
    const userMessage = conversation.messages
      .filter(msg => msg.role === 'user')
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (!userMessage) {
      throw new Error('사용자 메시지를 찾을 수 없습니다.');
    }
    
    try {
      // 2. 사용자 메시지 상태를 'delivered'로 업데이트
      dispatch(
        updateMessageDeliveryStatus({
          conversationId,
          messageId: userMessage.id,
          status: 'delivered',
        })
      );
      
      // 3. AI 응답 생성 시작
      dispatch(setLoading(true));
      
      // 현재 대화의 모든 메시지 가져오기
      const currentMessages = conversation.messages;
      
      // 현재 대화의 모델 ID 가져오기
      const modelId = conversation.modelId || updatedState.chat.selectedModelId;
      
      // 연락처 정보 가져오기
      const contactId = conversation.contactId;
      const contact = contactId ? updatedState.contacts.contacts.find(c => c.id === contactId) : undefined;
      
      // AI 응답 생성 (실제 API 호출) - 연락처 정보 전달
      const aiResponse = await generateAiResponse(currentMessages, modelId, contact);
      
      // 응답 검증
      if (!aiResponse || aiResponse.trim() === '') {
        throw new Error('빈 AI 응답을 받았습니다.');
      }
      
      // 4. AI 응답 추가
      // 현재 선택된 대화인지 확인
      const currentState = getState() as RootState;
      const isCurrentConversation = currentState.chat.currentConversationId === conversationId;
      
      // 디버깅 로그 추가
      console.log(`AI 응답 추가 시작 - 대화 ID: ${conversationId}, 현재 선택된 대화: ${isCurrentConversation}`);
      console.log(`현재 선택된 대화 ID: ${currentState.chat.currentConversationId}`);
      
      // 현재 대화 미리보기 정보 가져오기
      const previewsBefore = currentState.chat.chatPreviews;
      const previewBefore = previewsBefore.find(preview => preview.id === conversationId);
      console.log(`응답 전 unreadCount: ${previewBefore?.unreadCount || 0}`);
      
      // AI 응답 추가 (현재 선택된 대화가 아닌 경우에만 읽지 않음 상태로 설정)
      dispatch(
        addMessage({
          conversationId,
          message: {
            content: aiResponse,
            role: 'assistant',
          },
          // 현재 선택된 대화인 경우 읽음 상태로, 아니면 읽지 않음 상태로 설정
          forceUnread: !isCurrentConversation
        })
      );
      
      // 응답 후 unreadCount 확인
      const previewsAfter = (getState() as RootState).chat.chatPreviews;
      const previewAfter = previewsAfter.find(preview => preview.id === conversationId);
      console.log(`응답 후 unreadCount: ${previewAfter?.unreadCount || 0}`);
      
      // 5. 사용자 메시지 상태를 'read'로 업데이트
      dispatch(
        updateMessageDeliveryStatus({
          conversationId,
          messageId: userMessage.id,
          status: 'read',
        })
      );
      
      dispatch(setLoading(false));
      
      return { success: true, messageId: userMessage.id };
    } catch (error) {
      // 오류 발생 시 사용자 메시지 상태를 'failed'로 업데이트
      dispatch(
        updateMessageDeliveryStatus({
          conversationId,
          messageId: userMessage.id,
          status: 'failed',
        })
      );
      
      dispatch(setLoading(false));
      
      throw error;
    }
  }
);

export const {
  createConversation,
  selectConversation,
  updateConversationTitle,
  deleteConversation,
  addMessage,
  togglePinConversation,
  toggleMuteConversation,
  setSelectedModel,
  setLoading,
  clearCurrentConversation,
  markMessageAsRead,
  markAllMessagesAsRead,
  updateMessageDeliveryStatus,
} = chatSlice.actions;

export default chatSlice.reducer;