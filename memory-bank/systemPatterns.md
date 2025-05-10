# PragChat 시스템 패턴

## 시스템 아키텍처
PragChat은 다음과 같은 주요 구성 요소를 가진 클라이언트 측 아키텍처를 따릅니다:

1. **UI 레이어**: 기능별로 구성된 React Native 컴포넌트
2. **상태 관리**: 기능 기반 슬라이스가 있는 Redux 스토어
3. **API 레이어**: 외부 API 통신을 위한 서비스
4. **네비게이션**: 화면 관리를 위한 React Navigation
5. **스토리지**: 향후 Supabase 통합을 갖춘 로컬 스토리지

## 주요 기술적 결정

### 상태 관리
- 전역 상태 관리를 위한 **Redux Toolkit**
- 기능 기반 슬라이스 (채팅, 연락처, 설정, UI)
- 상태 접근을 위한 커스텀 훅 (useAppDispatch, useAppSelector)
- 효율적인 업데이트를 위한 정규화된 상태 구조

### 컴포넌트 설계
- UI 컴포넌트를 위한 아토믹 디자인 패턴
- 공유 디렉토리의 공통 컴포넌트
- 도메인 디렉토리의 기능별 컴포넌트
- 상속보다 구성 선호
- 컴포넌트 구성을 위한 Props

### 네비게이션
- 주요 섹션을 위한 탭 기반 네비게이션 (채팅, 연락처, 설정)
- 상세 화면을 위한 스택 네비게이션
- TypeScript를 사용한 타입 안전 네비게이션
- 타입에 정의된 화면 매개변수

### API 통신
- API 호출을 위한 서비스 기반 접근 방식
- 오류 처리 및 재시도 로직
- 구성을 위한 환경 변수
- LLM API를 위한 메시지 포맷팅

### 데이터 흐름
1. 사용자 액션이 Redux 액션을 트리거
2. 액션은 리듀서 또는 thunk에 의해 처리됨
3. Thunk는 비동기 작업 및 API 호출 처리
4. 상태 업데이트가 컴포넌트 재렌더링 트리거
5. UI는 현재 애플리케이션 상태를 반영

## 컴포넌트 관계

### 네비게이션 구조
- AppNavigator (루트)
  - SplashScreen
  - MainNavigator
    - TabNavigator
      - ChatsScreen
      - ContactsScreen
      - SettingsScreen
    - ChatScreen
    - ContactCreationScreen
    - ContactDetailScreen
    - ContactEditScreen
    - SettingsDetailScreen
    - ModelSelectionScreen

### 상태 관리 구조
- Redux 스토어
  - chatSlice (대화, 메시지)
  - contactsSlice (AI 연락처)
  - settingsSlice (앱 설정)
  - uiSlice (UI 상태)

### 컴포넌트 계층
- 화면
  - 공통 컴포넌트
  - 도메인별 컴포넌트
    - 채팅 컴포넌트
    - 연락처 컴포넌트
    - 설정 컴포넌트

## 구현 패턴

### 메시지 처리
1. 사용자가 MessageInput에 메시지 입력
2. 메시지가 Redux 스토어로 디스패치됨
3. Thunk가 LLM API로 메시지 전송
   - 시스템 프롬프트에 "당신은 [이름] 입니다." 문장이 추가되어 AI가 자신의 이름 인식 가능
   - 문자열, 배열, 객체 형태의 모든 시스템 프롬프트에 이름 정보 적용
4. 응답이 대화에 추가됨
5. UI가 새 메시지로 업데이트됨

### 연락처 관리
1. 사용자가 ContactCreation/EditScreen에서 연락처 생성/편집
   - 연락처 생성/편집 시 시스템 프롬프트에 "당신은 [이름] 입니다." 문장 자동 추가
   - 이를 통해 AI가 자신의 이름을 인식하고 사용자가 이름을 부를 때 응답 가능
2. 연락처 데이터가 Redux 스토어로 디스패치됨
3. 연락처가 contactsSlice에 저장됨
4. UI가 새로운/업데이트된 연락처로 업데이트됨

### 설정 관리
1. 사용자가 SettingsScreen에서 설정 변경
2. 설정이 Redux 스토어로 디스패치됨
3. 설정이 앱 동작에 적용됨
4. UI가 새 설정을 반영하도록 업데이트됨