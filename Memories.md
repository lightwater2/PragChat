# PragChat 개발 기록

## 프로젝트 개요
- **프로젝트명**: PragChat
- **목적**: 리액트 네이티브 기반 대화형 LLM을 모방하는 메신저 앱 개발
- **기술 스택**: React Native Expo, TypeScript, Redux Toolkit, Requesty API, Supabase

## 주요 개발 이력

### 2025-04-24
#### 프로젝트 초기 설정
- React Native Expo 프로젝트 생성
- TypeScript 설정
- 디렉토리 구조 설계 (src/api, components, constants, context, hooks, navigation, screens, state, styles, types, utils)

#### 상태 관리 구현
- Redux Toolkit 설정
- chatSlice 구현 (대화 및 메시지 관리)
- uiSlice 구현 (UI 상태 관리)
- 커스텀 훅 생성 (useAppDispatch, useAppSelector)

#### 채팅 인터페이스 개발
- ChatScreen 구현 (메인 채팅 화면)
- ChatBubble 컴포넌트 개발 (메시지 표시)
- MessageInput 컴포넌트 개발 (메시지 입력)
- TypingIndicator 컴포넌트 개발 (AI 응답 생성 중 표시)

#### 테마 지원
- ThemeContext 구현 (다크/라이트 모드 지원)
- Colors 상수 정의
- 테마별 스타일 적용

#### API 연동
- chatService 구현 (Requesty API 연동)
- supabaseClient 구현 (Supabase 연동)
- 환경 변수 관리 설정

#### 유틸리티 개발
- idGenerator 구현 (uuid/nanoid 대체)
- env 유틸리티 구현 (환경 변수 접근)

#### 환경 변수 관리
- react-native-dotenv 설정
- 환경 변수 타입 정의
- .env-template 생성

#### API 인증 오류 해결 (2025-04-24 추가)
- 특수 문자가 포함된 API 키 처리 로직 개선
- API 요청/응답 로깅 및 디버깅 기능 강화
- 오류 메시지 상세화 및 사용자 친화적 오류 처리
- 환경 변수 로딩 방식 개선

## 기술적 결정 사항

### 1. 고유 ID 생성
- **결정**: 외부 라이브러리(uuid/nanoid) 대신 자체 ID 생성 함수 구현
- **이유**: crypto 의존성 문제 해결 및 앱 크기 최적화
- **구현**: src/utils/idGenerator.ts

### 2. 환경 변수 관리
- **결정**: react-native-dotenv 사용
- **이유**: 보안 강화 및 설정 관리 용이성
- **구현**: babel.config.js, src/types/env.d.ts, src/utils/env.ts

### 3. 메시지 컨텍스트 제한
- **결정**: API 요청 시 최근 10개 메시지만 포함
- **이유**: 토큰 사용량 최적화 및 응답 속도 향상
- **구현**: src/api/chatService.ts의 formatMessages 함수

### 4. 응답 길이 제한
- **결정**: max_tokens를 10000으로 설정
- **이유**: 충분한 응답 길이 확보 및 다양한 모델 지원
- **구현**: src/api/chatService.ts의 generateAiResponse 함수

### 5. API 키 특수 문자 처리
- **결정**: 특수 문자(+, /, =)가 포함된 API 키 처리 로직 개선
- **이유**: Base64 인코딩된 API 키 호환성 확보
- **구현**: src/api/chatService.ts, src/utils/env.ts

## 해결한 문제들

### 1. 환경 변수 로드 문제
- **문제**: process.env를 통한 환경 변수 접근 불가
- **해결**: react-native-dotenv 설정 및 타입 정의 추가
- **파일**: babel.config.js, src/types/env.d.ts, src/utils/env.ts

### 2. 메시지 입력 UI 스타일 문제
- **문제**: 메시지 입력 칸이 제대로 표시되지 않음
- **해결**: 테두리, 패딩, 그림자 등 스타일 개선
- **파일**: src/components/chat/MessageInput.tsx

### 3. API 키 관리 문제
- **문제**: API 키의 안전한 관리 필요
- **해결**: .env 파일 및 환경 변수 접근 유틸리티 구현
- **파일**: .env-template, src/utils/env.ts

### 4. API 인증 오류 문제 (2025-04-24)
- **문제**: 특수 문자(+, /, =)가 포함된 API 키로 인한 "Invalid authorization token" 오류 발생
- **해결**:
  - API 키 처리 로직 개선 (특수 문자 처리)
  - 오류 메시지 상세화 및 디버그 로그 추가
  - 환경 변수 로딩 방식 개선
- **파일**: src/api/chatService.ts, src/utils/env.ts, babel.config.js, app.config.js, src/screens/ChatScreen.tsx

## 향후 개발 계획

### 단기 계획
- 스트리밍 응답 구현
- Supabase를 활용한 대화 기록 저장
- 설정 화면 구현 (모델 선택, 테마 설정)
- 프로필 화면 구현

### 중기 계획
- 성능 최적화
- 테스트 코드 작성
- 오프라인 모드 지원
- 대화 내보내기/가져오기 기능

### 장기 계획
- 음성 입력/출력 지원
- 이미지 처리 기능 추가
- 다국어 지원
- 플러그인 시스템 구현

## 메신저 앱 확장 (2025-04-24)

### 네비게이션 구조 변경
- TabNavigator + StackNavigator 조합 구현
- 텔레그램 스타일의 하단 탭 메뉴 추가
- ChatGPT 스타일의 대화 목록 화면 구현
- 스플래시 화면 추가

### 데이터 모델 확장
- User, ChatPreview 인터페이스 추가
- 대화 고정 기능 추가
- 모델 선택 기능 추가

### 주요 컴포넌트 추가
- ChatsScreen (대화 목록 화면)
- TabNavigator (하단 탭 메뉴)
- SplashScreen (시작 화면)
- SplashIcon (앱 로고 컴포넌트)

### 기능 개선
- 첫 메시지 전송 시 대화 인스턴스 생성 로직 구현
- 대화 목록과 개별 대화 화면 분리

### 모델 선택 기능 추가
- 다양한 AI 모델 지원 (Anthropic, OpenAI, Google, xAI, Perplexity, DeepSeek)
- 모델 선택 화면 구현
- 대화별 모델 설정 기능
- 네비게이션 히스토리 관리 개선 (대화 생성 후 모델 선택 화면으로 돌아가지 않도록)

### 향후 구현 예정
- 설정 화면
- 프로필 화면
- 대화 내보내기/가져오기 기능

## 메신저 기능 강화 설계 계획 (2025-04-24)

### 1. 데이터 모델 설계
- **Contact**: id, name, avatar, modelId, persona(description, systemPrompt, advancedSettings), lastActive, isOnline, unreadCount
- **Message**: id, content, role, timestamp, isRead, readTimestamp
- **Conversation**: id, contactId, title, messages[], createdAt, updatedAt, backgroundImage, pinned
- **Settings**: theme, language, notifications, chat(fontSize, defaultBackground), dataUsage

### 2. 네비게이션 구조 설계
- **탭 네비게이션**: Root(Splash, Main) → Main(Tabs, Chat, ContactCreation/Detail, SettingsDetail) → Tabs(Contacts, Chats, Settings)
- **네비게이션 타입**: RootStackParamList, MainStackParamList, TabParamList 정의

### 3. 주요 화면 설계
- **연락처 리스트**: LLM 모델 기반 AI 연락처 목록, 추가 버튼(FAB), 검색 기능, 프로필/이름/모델/상태 표시
- **연락처 생성**: 기본 정보(이름, 프로필, 배경), 모델 선택, 페르소나 설정(기본/상세 모드)
- **채팅 화면**: 헤더(프로필, 이름, 상태, 메뉴), 메시지 목록(읽음 확인, 배경), 입력 영역(이모티콘)
- **설정 화면**: 프로필, 앱 설정(테마, 언어, 알림, 채팅), 데이터 관리, 앱 정보

### 4. 기능 구현 계획
- **연락처 관리**: 추가/편집/삭제, 검색, 채팅방 생성
- **채팅 기능**: 읽음 확인, 배경 커스터마이징, 전송 상태 표시
- **설정 기능**: 테마 전환, 언어 설정, 알림 설정, 채팅 설정
- **광고 배너**: 채팅 목록/설정 화면에 배너 영역, AdBanner 컴포넌트

### 5. UI/UX 개선 계획
- **디자인 시스템**: 카카오톡/텔레그램 스타일 컴포넌트, 일관된 색상/타이포그래피, 애니메이션
- **반응형 디자인**: 다양한 화면 크기, 가로/세로 모드 대응
- **접근성 개선**: 스크린 리더, 고대비 모드, 글꼴 크기 조정

### 6. 구현 우선순위 및 로드맵
- **1단계**: 데이터 모델 확장, 탭 네비게이션 구조, 연락처 리스트 화면
- **2단계**: 연락처 생성 화면, 채팅 화면 개선, 설정 화면 기본 구조
- **3단계**: 설정 화면 상세 기능, 광고 배너, UI/UX 디자인 개선

### 7. 기술적 고려사항
- **상태 관리**: Redux 슬라이스 확장(contactsSlice, chatSlice, settingsSlice)
- **데이터 저장**: AsyncStorage/Supabase 활용, 이미지 캐싱/최적화
- **성능 최적화**: 메모이제이션, 가상화 리스트, 이미지 로딩 최적화

## 메신저 기능 강화 구현 현황 (2025-04-24)

### 1. 데이터 모델 확장
- Contact 모델 추가 (src/types/contact.ts)
- Message 및 Conversation 모델 확장 (src/types/chat.ts)
- Settings 모델 추가 (src/types/settings.ts)

### 2. Redux 슬라이스 확장
- contactsSlice 추가 (src/state/slices/contactsSlice.ts)
- settingsSlice 추가 (src/state/slices/settingsSlice.ts)
- Redux 스토어에 새 리듀서 등록 (src/state/store.ts)

### 3. 네비게이션 구조 개선
- 네비게이션 타입 정의 업데이트 (src/navigation/types.ts)
- TabNavigator 수정 - ContactsTab 추가 (src/navigation/TabNavigator.tsx)
- MainNavigator 수정 - 새 화면 추가 (src/navigation/MainNavigator.tsx)
- AppNavigator 수정 - 네비게이션 구조 변경 (src/navigation/AppNavigator.tsx)

### 4. 새 화면 구현
- ContactsScreen 구현 - 연락처 목록 화면 (src/screens/ContactsScreen.tsx)
- SettingsScreen 구현 - 설정 화면 (src/screens/SettingsScreen.tsx)
- ContactCreationScreen 구현 - 연락처 생성 화면 (src/screens/ContactCreationScreen.tsx)

### 5. 다음 구현 예정
- ContactDetailScreen 구현 - 연락처 상세 화면
- SettingsDetailScreen 구현 - 설정 상세 화면
- 채팅 화면 개선 (읽음 확인, 배경 커스터마이징)
- 광고 배너 컴포넌트 구현

## 메신저 기능 개선 구현 (2025-04-25)

### 1. 채팅 인터페이스 개선
- MessageInput 컴포넌트 카카오톡 스타일로 개선 (src/components/chat/MessageInput.tsx)
  - 이모티콘 및 추가 기능 버튼 추가
  - UI 디자인 개선 (둥근 모서리, 아이콘 변경)
- ChatBubble 컴포넌트 카카오톡 스타일로 개선 (src/components/chat/ChatBubble.tsx)
  - 프로필 이미지 표시 추가
  - 말풍선 디자인 개선 (노란색 배경, 모서리 처리)
  - 타임스탬프 위치 조정

### 2. 연락처 관리 기능 개선
- 샘플 연락처 데이터 추가 (src/utils/sampleData.ts)
  - 실제 사람 이름 기반 연락처 생성
  - 다양한 LLM 모델 연결
- 연락처별 고유 대화 관리 구현 (src/screens/ContactsScreen.tsx)
  - 연락처 클릭 시 기존 대화 확인 후 재사용
  - 새 대화 생성 시 연락처 이름으로 제목 설정

### 3. 채팅 화면 개선
- 대화 제목 표시 기능 추가 (src/screens/ChatScreen.tsx)
  - 연락처 이름 기반 헤더 제목 설정
  - 네비게이션 옵션 동적 업데이트

### 4. 앱 초기화 개선
- 앱 시작 시 샘플 데이터 초기화 구현 (App.tsx)
  - 연락처 목록이 비어있을 때만 샘플 데이터 추가
  - Redux 상태 초기화 로직 개선

### 5. 다음 구현 예정
- 연락처 상세 화면 구현
- 설정 화면 상세 기능 구현
- 채팅 배경 커스터마이징 기능
- 읽음 확인 기능 구현

## 메신저 기능 개선 구현 (2025-04-25 추가)

### 1. 채팅 배경 커스터마이징 기능 구현
- 배경 색상 설정 기능 추가 (src/constants/backgrounds.ts)
  - 다양한 배경 색상 옵션 제공
  - 각 배경에 ID, 색상 값, 어두운 색상 여부 정보 포함
- 채팅 화면에 배경 색상 적용 (src/screens/ChatScreen.tsx)
  - 대화별 배경 색상 설정 지원
  - 배경 투명도 조절 기능 추가
- 설정 화면에 배경 설정 옵션 추가 (src/screens/SettingsDetailScreen.tsx)
  - 배경 색상 선택 그리드 구현
  - 배경 투명도 및 흐림 효과 설정 추가

### 2. 메시지 입력 컴포넌트 개선
- 음성 입력 기능 추가 (src/components/chat/MessageInput.tsx)
  - 음성 녹음 버튼 및 애니메이션 효과 구현
  - 녹음 중 상태 표시 및 UI 변경
- 메시지 입력 필드 개선
  - 자동 높이 조절 기능 구현 (내용에 따라 높이 변경)
  - 입력 중 상태 표시 개선
- 전송 버튼 상태 관리 개선
  - 녹음 중, 입력 중 상태에 따른 버튼 스타일 변경
  - 비활성화 상태 시각적 표시 개선

### 3. 설정 기능 확장
- 채팅 설정 옵션 확장 (src/types/settings.ts)
  - 배경 흐림 효과 설정 추가
  - 배경 투명도 설정 추가
- 설정 화면 UI 개선 (src/screens/SettingsDetailScreen.tsx)
  - 슬라이더 컴포넌트 업데이트 (@react-native-community/slider 사용)
  - 설정 항목 레이아웃 및 스타일 개선

### 4. 다음 구현 예정
- 연락처 상세 화면 구현
- 설정 화면 추가 기능 구현
- 읽음 확인 기능 구현
- 광고 배너 컴포넌트 구현

## 메신저 기능 개선 구현 (2025-04-25 추가 2)

### 1. 연락처 편집 기능 구현
- ContactEditScreen 컴포넌트 생성 (연락처 정보 수정 폼, 이름/프로필/모델 수정)
- 네비게이션 타입 및 MainNavigator 업데이트 (ContactEdit 라우트 추가)
- ContactDetailScreen에서 편집 버튼 연결 (편집 아이콘 클릭 시 이동)

### 2. 읽음 확인 기능 구현
- Message 타입의 isRead/readTimestamp 필드 활용 및 UI 표시 개선
- 메시지 읽음 상태 업데이트 액션 추가 (markMessageAsRead, markAllMessagesAsRead)
- 대화 선택 및 앱 포그라운드 복귀 시 읽음 상태 자동 업데이트 (AppState 활용)
- 안 읽은 메시지 카운트 표시 기능 구현 (TabNavigator 배지, 채팅 목록 배지)
- 메시지 읽음 상태 관리 로직 개선 (forceUnread 매개변수 추가)
- 현재 선택된 대화가 아닌 경우 AI 응답을 읽지 않음 상태로 설정하여 unreadCount 증가

### 3. 메시지 전달 상태 표시 기능 구현
- Message 타입에 deliveryStatus 필드 추가 (sending/sent/delivered/read/failed)
- ChatBubble에 상태별 아이콘/텍스트 표시 및 스타일 적용
- 메시지 전달 상태 업데이트 액션 추가 (updateMessageDeliveryStatus)
- 전송 과정별 상태 변화 처리 (sending→delivered/failed→read)

### 4. 다음 구현 예정
- 메시지 삭제 및 수정 기능
- 파일 및 미디어 공유 기능
- 그룹 채팅 기능
- 알림 설정 기능

## 메신저 기능 개선 구현 (2025-04-25 추가 4)

### 1. iOS 네이티브 스타일 스와이프 액션 구현
- react-native-swipe-list-view 라이브러리 도입 (iOS 네이티브 스와이프 경험 제공)
- SwipeableItem 컴포넌트 개선 (스프링 효과, 저항감, 햅틱 피드백 추가)
- 채팅 목록 스와이프 액션 구현 (고정, 읽음 표시, 알림 설정, 삭제)
- 연락처 목록 스와이프 액션 구현 (채팅, 편집, 차단, 삭제)
- 스와이프 액션 UI 개선 (둥근 모서리, 아이콘, 텍스트 배치)

### 2. 햅틱 피드백 추가
- expo-haptics 라이브러리 도입 (촉각 피드백 제공)
- 스와이프 액션 실행 시 햅틱 피드백 제공 (Medium 강도)
- 스와이프 열림/닫힘 시 햅틱 피드백 제공 (Light 강도)
- 삭제 확인 다이얼로그 표시 시 햅틱 피드백 제공

### 3. 스와이프 액션 UX 개선
- 스와이프 저항감 및 스프링 효과 조정 (iOS 네이티브 느낌 구현)
- 스와이프 열림/닫힘 임계값 설정 (30%)
- 스와이프 최대 거리 제한 (액션 버튼 너비의 1.25배)
- 액션 버튼 모서리 둥글게 처리 (iOS 디자인 가이드라인 준수)

### 4. 다음 구현 예정
- 스와이프 액션 애니메이션 추가 개선
- 스와이프 액션 커스터마이징 기능
- 드래그 앤 드롭으로 항목 재정렬 기능
- 오프라인 모드 지원 (AsyncStorage/Redux-Persist 활용)
- Supabase 통합 (프로젝트 마지막 단계에서 구현 예정)

## 메신저 기능 개선 구현 (2025-04-25 추가 3)

### 1. 안 읽은 메시지 카운트 표시 기능 개선
- TabNavigator 배지에 안 읽은 메시지 총 수 표시 (하드코딩된 값 대신 Redux 상태 활용)
- 채팅 목록에 각 대화별 안 읽은 메시지 수 표시 (빨간색 배지로 시각화)
- 안 읽은 메시지가 있는 대화를 목록 상단으로 이동 (최신 메시지 기준 정렬)

### 2. 메시지 읽음 상태 관리 로직 개선
- addMessage 리듀서에 forceUnread 매개변수 추가 (강제로 읽지 않음 상태로 설정 가능)
- AI 응답 메시지를 항상 읽지 않은 상태로 추가하도록 수정 (현재 선택된 대화가 아닌 경우)
- 메시지의 isRead와 readTimestamp 설정 로직 개선
- unreadCount 증가 조건 수정 (현재 선택된 대화가 아니거나 forceUnread가 true인 경우)

### 3. 비동기 메시지 처리 개선
- sendMessageAndGetResponse 비동기 액션 생성자 구현
- 메시지 전송 및 AI 응답 생성 과정의 상태 관리 개선
- 사용자 메시지 상태 업데이트 로직 수정 (failed 상태로 잘못 업데이트되는 문제 해결)
- 디버깅 로그 추가로 메시지 상태 추적 용이성 향상

### 4. 다음 구현 예정
- 메시지 삭제 및 수정 기능
- 파일 및 미디어 공유 기능
- 그룹 채팅 기능
- 알림 설정 기능
- 오프라인 모드 지원 (AsyncStorage/Redux-Persist 활용)
## LLM 메신저 기능 고도화 설계 (2025-04-26)

### 1. 메신저 기능 현황 분석
- **구현된 기능**: 채팅 인터페이스, 대화 목록, 연락처 관리, 모델 선택, 읽음 확인, 메시지 전달 상태
- **개선 필요 기능**: 스트리밍 응답, 대화 기록 저장, 오프라인 모드, 알림 설정
- **미구현 기능**: 그룹 채팅, 파일/미디어 공유, 메시지 삭제/수정, 음성 메시지, 대화 내보내기/가져오기

### 2. 핵심 기능 설계

#### 2.1 스트리밍 응답 구현
- **기술 접근법**: SSE(Server-Sent Events) 활용, 토큰 단위 응답 처리
- **UI/UX**: 실시간 타이핑 효과, 중간 응답 표시, 취소 기능
- **구현 계획**:
  - chatService.ts에 스트리밍 API 호출 함수 추가
  - TypingIndicator 컴포넌트 개선 (실제 텍스트 표시)
  - 응답 취소 버튼 및 로직 구현
  - 부분 응답 상태 관리 (chatSlice 확장)

#### 2.2 그룹 채팅 기능
- **데이터 모델 확장**:
  - Conversation 모델에 participants 필드 추가
  - GroupChat 타입 정의 (id, name, avatar, participants, createdBy, createdAt)
- **UI 구현**:
  - 그룹 생성 화면 (GroupCreationScreen)
  - 그룹 정보 화면 (GroupDetailScreen)
  - 그룹 채팅 참여자 관리 기능
- **상태 관리**:
  - groupsSlice 추가 (그룹 생성, 수정, 삭제, 참여자 관리)
  - chatSlice에 그룹 대화 지원 추가

#### 2.3 파일 및 미디어 공유
- **지원 파일 유형**: 이미지, 문서(PDF, DOC), 오디오, 비디오
- **구현 방식**:
  - expo-document-picker, expo-image-picker 활용
  - 파일 업로드/다운로드 관리 (Supabase Storage 활용)
  - 미디어 미리보기 컴포넌트 구현
- **메시지 타입 확장**:
  - Message 인터페이스에 attachments 필드 추가
  - AttachmentType 정의 (image, document, audio, video)

#### 2.4 메시지 삭제 및 수정
- **기능 설계**:
  - 메시지 컨텍스트 메뉴 구현 (길게 누르기)
  - 삭제 옵션: 나에게만 삭제, 모두에게 삭제
  - 수정 이력 표시 (edited 마커)
- **상태 관리**:
  - chatSlice에 deleteMessage, editMessage 액션 추가
  - 메시지 상태 추적 (original, edited, deleted)

#### 2.5 음성 메시지
- **녹음 및 재생**:
  - expo-av 라이브러리 활용
  - 녹음 컨트롤 UI 구현 (MessageInput 확장)
  - 재생 컨트롤 UI 구현 (ChatBubble 확장)
- **데이터 처리**:
  - 오디오 파일 압축 및 최적화
  - 음성 파일 스토리지 관리 (캐싱, 자동 삭제)

### 3. 백엔드 연동 설계

#### 3.1 Supabase 데이터 모델
- **테이블 구조**:
  - users: id, name, avatar, created_at, last_active
  - contacts: id, user_id, name, avatar, model_id, persona, created_at
  - conversations: id, title, created_at, updated_at, type(single/group)
  - participants: conversation_id, user_id, joined_at
  - messages: id, conversation_id, user_id, content, role, created_at, updated_at, is_read, attachments
- **인덱스 및 관계**:
  - conversations_participants_idx (빠른 참여자 조회)
  - messages_conversation_id_idx (대화별 메시지 조회)

#### 3.2 데이터 동기화 전략
- **초기 로드**: 앱 시작 시 필수 데이터만 로드 (최근 대화, 연락처)
- **실시간 업데이트**: Supabase Realtime 구독 활용
- **오프라인 지원**: AsyncStorage에 로컬 캐시 저장, Redux-Persist 활용
- **충돌 해결**: 타임스탬프 기반 충돌 감지 및 해결

#### 3.3 인증 및 보안
- **사용자 인증**: Supabase Auth 활용 (이메일/비밀번호, 소셜 로그인)
- **메시지 보안**: E2EE(End-to-End Encryption) 구현 계획
- **API 키 관리**: 환경 변수 및 보안 스토리지 활용

### 4. 성능 최적화 계획

#### 4.1 UI 렌더링 최적화
- **메모이제이션**: React.memo, useMemo, useCallback 적극 활용
- **가상화 리스트**: FlatList 최적화, 윈도잉 기법 적용
- **이미지 최적화**: 이미지 리사이징, 프로그레시브 로딩, 캐싱

#### 4.2 상태 관리 최적화
- **선택적 구독**: useSelector 최적화, 필요한 상태만 구독
- **정규화된 상태**: 중첩 구조 최소화, 정규화된 데이터 구조 사용
- **비동기 액션 최적화**: 불필요한 API 호출 방지, 캐싱 전략 적용

#### 4.3 네트워크 최적화
- **데이터 압축**: 전송 데이터 최소화, 압축 알고리즘 적용
- **배치 처리**: 여러 요청을 배치로 처리
- **캐싱 전략**: HTTP 캐싱, 응답 캐싱, 스토리지 캐싱

### 5. 구현 로드맵

#### 5.1 1단계 (2주)
- 스트리밍 응답 구현
- 메시지 삭제 및 수정 기능
- 기본 파일 공유 기능 (이미지)

#### 5.2 2단계 (2주)
- 음성 메시지 기능
- 고급 파일 공유 (문서, 오디오, 비디오)
- Supabase 연동 기본 구현

#### 5.3 3단계 (3주)
- 그룹 채팅 기능
- 실시간 데이터 동기화
- 오프라인 모드 지원

#### 5.4 4단계 (3주)
- 보안 기능 강화 (E2EE)
- 성능 최적화
- 대화 내보내기/가져오기

### 6. 테스트 전략
- **단위 테스트**: Jest를 활용한 리듀서, 유틸리티 함수 테스트
- **컴포넌트 테스트**: React Testing Library 활용
- **E2E 테스트**: Detox 활용 (주요 사용자 흐름 테스트)
- **성능 테스트**: 메모리 사용량, 렌더링 성능, 네트워크 효율성 측정