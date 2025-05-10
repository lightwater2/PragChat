import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateId } from '../../utils/idGenerator';
import { Contact, ContactState, Persona } from '../../types/contact';
import { DEFAULT_MODEL } from '../../constants/llmModels';

/**
 * 초기 연락처 상태
 */
const initialState: ContactState = {
  contacts: [],
  selectedContactId: null,
  isLoading: false,
};

/**
 * 연락처 슬라이스
 */
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    /**
     * 새 연락처 생성
     */
    createContact: (
      state,
      action: PayloadAction<{
        name: string;
        modelId?: string;
        avatar?: string;
        backgroundImage?: string;
        persona: Persona;
      }>
    ) => {
      const { name, modelId, avatar, backgroundImage, persona } = action.payload;
      const newContact: Contact = {
        id: generateId(),
        name,
        modelId: modelId || DEFAULT_MODEL,
        avatar,
        backgroundImage,
        persona,
        lastActive: Date.now(),
        isOnline: false,
        unreadCount: 0,
      };
      
      state.contacts.push(newContact);
      state.selectedContactId = newContact.id;
    },
    
    /**
     * 연락처 선택
     */
    selectContact: (state, action: PayloadAction<string>) => {
      state.selectedContactId = action.payload;
      
      // 읽지 않은 메시지 카운트 초기화
      const contactIndex = state.contacts.findIndex(
        (contact) => contact.id === action.payload
      );
      
      if (contactIndex !== -1) {
        state.contacts[contactIndex].unreadCount = 0;
      }
    },
    
    /**
     * 연락처 업데이트
     */
    updateContact: (
      state,
      action: PayloadAction<{
        contactId: string;
        name?: string;
        modelId?: string;
        avatar?: string;
        backgroundImage?: string;
        persona?: Persona;
      }>
    ) => {
      const { contactId, ...updates } = action.payload;
      const contactIndex = state.contacts.findIndex(
        (contact) => contact.id === contactId
      );
      
      if (contactIndex !== -1) {
        state.contacts[contactIndex] = {
          ...state.contacts[contactIndex],
          ...updates,
        };
      }
    },
    
    /**
     * 연락처 삭제
     */
    deleteContact: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      state.contacts = state.contacts.filter(
        (contact) => contact.id !== contactId
      );
      
      if (state.selectedContactId === contactId) {
        state.selectedContactId = state.contacts.length > 0
          ? state.contacts[0].id
          : null;
      }
    },
    
    /**
     * 연락처 온라인 상태 설정
     */
    setContactOnlineStatus: (
      state,
      action: PayloadAction<{ contactId: string; isOnline: boolean }>
    ) => {
      const { contactId, isOnline } = action.payload;
      const contactIndex = state.contacts.findIndex(
        (contact) => contact.id === contactId
      );
      
      if (contactIndex !== -1) {
        state.contacts[contactIndex].isOnline = isOnline;
        if (isOnline) {
          state.contacts[contactIndex].lastActive = Date.now();
        }
      }
    },
    
    /**
     * 연락처 읽지 않은 메시지 카운트 증가
     */
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const contactIndex = state.contacts.findIndex(
        (contact) => contact.id === contactId
      );
      
      if (contactIndex !== -1) {
        state.contacts[contactIndex].unreadCount += 1;
      }
    },
    
    /**
     * 로딩 상태 설정
     */
    setContactsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  createContact,
  selectContact,
  updateContact,
  deleteContact,
  setContactOnlineStatus,
  incrementUnreadCount,
  setContactsLoading,
} = contactsSlice.actions;

export default contactsSlice.reducer;