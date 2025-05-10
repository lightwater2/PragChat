import { Contact } from '../../types/contact';
import { EXPERT_CONTACTS } from './expertContacts';
import { PERSONAL_CONTACTS } from './personalContacts';

/**
 * 모든 샘플 연락처 데이터를 통합
 */
export const SAMPLE_CONTACTS: Contact[] = [
  ...EXPERT_CONTACTS,
  ...PERSONAL_CONTACTS
];

/**
 * 샘플 데이터 초기화 함수
 */
export const initializeSampleData = (dispatch: any) => {
  // 연락처 추가
  SAMPLE_CONTACTS.forEach(contact => {
    dispatch({
      type: 'contacts/createContact',
      payload: {
        name: contact.name,
        modelId: contact.modelId,
        avatar: contact.avatar,
        backgroundImage: contact.backgroundImage,
        persona: contact.persona
      }
    });
  });
};

// 개별 카테고리 연락처 내보내기
export { EXPERT_CONTACTS } from './expertContacts';
export { PERSONAL_CONTACTS } from './personalContacts';