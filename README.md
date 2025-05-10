# PragChat

메신저 앱과 유사한 인터페이스에서 LLM 모델과 대화할 수 있는 React Native 애플리케이션입니다.

## 개요

PragChat은 텔레그램이나 카카오톡과 같은 인기 있는 메시징 앱과 유사한 UI/UX를 제공하면서 다양한 AI 페르소나와 대화할 수 있는
앱입니다. 사용자는 다양한 페르소나와 LLM 모델을 가진 AI 연락처를 생성하고, 친숙한 메시징 인터페이스에서 대화할 수 있습니다.

## 주요 기능

- 메시지 버블 및 타이핑 표시기가 있는 채팅 인터페이스
- 다중 대화 관리
- AI 페르소나가 있는 연락처 목록 (생성, 편집, 상세 정보)
- LLM 모델 선택
- 테마 지원 (라이트/다크 모드)
- 메시지 읽음 상태 및 전송 표시기
- 사용자 정의 가능한 채팅 배경
- 채팅 및 연락처에 대한 스와이프 액션
- iOS 스타일 햅틱 피드백

## 기술 스택

- **React Native**: Expo SDK 52
- **TypeScript**: v5.x
- **상태 관리**: Redux Toolkit
- **네비게이션**: React Navigation v6.x
- **API 통신**: Requesty API (LLM 통합)
- **스토리지**: 향후 Supabase 통합 예정

## 시작하기

### 전제 조건

- Node.js (v18 이상)
- npm 또는 yarn
- Expo CLI

### 설치

1. 저장소 클론
   ```bash
   git clone https://github.com/lightwater2/PragChat.git
   cd PragChat
   ```

2. 종속성 설치
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 환경 변수 설정
   - `.env-template` 파일을 복사하여 `.env` 파일을 생성하고 필요한 API 키를 설정합니다.
   ```bash
   cp .env-template .env
   ```

4. 애플리케이션 실행
   ```bash
   npm start
   # 또는
   yarn start
   ```

## 프로젝트 구조

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

## 향후 개발 계획

- 더 자연스러운 대화 흐름을 위한 스트리밍 응답
- 메시지 삭제 및 편집 기능
- 파일 및 미디어 공유
- 음성 메시지 녹음 및 재생
- 데이터 지속성을 위한 Supabase 통합
- 오프라인 모드 지원

## 참여하기

기여는 언제나 환영합니다! 버그 제보, 기능 요청, 또는 코드 개선 제안은 GitHub 이슈를 통해 해주세요.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.