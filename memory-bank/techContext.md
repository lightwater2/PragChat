# PragChat 기술 컨텍스트

## 기술 스택

### 핵심 기술
- **React Native**: Expo SDK 52가 포함된 v0.72.x
- **TypeScript**: 타입 안전성을 위한 v5.x
- **Redux Toolkit**: 상태 관리용
- **React Navigation**: 네비게이션을 위한 v6.x

### UI 프레임워크
- **React Native Elements**: UI 컴포넌트용
- **React Native Paper**: 추가 UI 컴포넌트용 (필요 시)

### 백엔드 서비스
- **Requesty API**: LLM API 통신용
- **Supabase**: 인증, 데이터베이스 및 스토리지 계획

### 개발 도구
- **Expo CLI**: 개발 및 빌드용
- **ESLint**: 코드 린팅용
- **Prettier**: 코드 포맷팅용

## 개발 설정

### 환경 변수
- 환경 변수 관리를 위한 react-native-dotenv 사용
- API 키는 .env 파일에 저장 (버전 관리에 커밋되지 않음)
- 환경 변수 타입은 src/types/env.d.ts에 정의됨

### 프로젝트 구조
```
/src
  /api         - API 서비스
  /components  - UI 컴포넌트
  /constants   - 앱 상수
  /context     - React 컨텍스트
  /hooks       - 커스텀 훅
  /navigation  - 네비게이션 구성
  /screens     - 앱 화면
  /state       - Redux 상태 관리
  /styles      - 전역 스타일
  /types       - TypeScript 타입
  /utils       - 유틸리티 함수
```

## 기술적 제약

### API 제한사항
- LLM API 속도 제한 및 토큰 할당량
- 응답 시간 가변성
- API 키의 특수 문자 처리

### React Native 제한사항
- 플랫폼별 동작 차이
- 추가 라이브러리 없이 네이티브 기능에 대한 제한된 접근
- 복잡한 UI에 대한 성능 고려사항

### 상태 관리 복잡성
- 복잡한 중첩 상태 관리
- 일관된 상태 업데이트 보장
- 비동기 작업 처리

## 의존성

### 핵심 의존성
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs
- @reduxjs/toolkit
- react-redux
- react-native-elements
- expo-haptics
- react-native-swipe-list-view

### 개발 의존성
- typescript
- @types/react
- @types/react-native
- react-native-dotenv
- eslint
- prettier

## 도구 사용 패턴

### 상태 관리
- 기능 기반 상태를 위한 Redux 슬라이스
- 비동기 작업을 위한 Thunk
- 파생 상태를 위한 셀렉터
- 상태 접근을 위한 커스텀 훅

### 네비게이션
- 화면 흐름을 위한 스택 네비게이터
- 주요 섹션을 위한 탭 네비게이터
- 사용자 정의를 위한 화면 옵션
- 데이터 전달을 위한 네비게이션 매개변수

### 스타일링
- 테마 기반 스타일링
- 일관성을 위한 전역 스타일
- 컴포넌트별 스타일
- 다크/라이트 모드 지원

### API 통신
- 서비스 기반 접근 방식
- 오류 처리 및 재시도
- 응답 포맷팅
- 환경 변수 사용