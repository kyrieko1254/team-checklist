# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 프로젝트

팀장 한 명이 혼자 쓰는 팀 업무 체크리스트 웹앱.

## 작업 규칙

- **기능 설계는 `PRD.md`를 따른다.** 요구사항·화면 구성·데이터 구조·1차 범위의 기준이므로 기능을 만들거나 바꾸기 전에 먼저 읽는다. PRD의 "1차 버전에서 하지 않는 것"(로그인, DB, 업무 수정, 필터 등)은 요청이 없으면 추가하지 않는다
- **사용자는 개발 초보자다.** 작업을 시작하기 전에 무엇을 할지 쉬운 말로 먼저 설명한다. 설명은 한국어로, 전문 용어는 풀어서 한다
- **기능 하나가 끝나면 커밋할지 먼저 물어본다.** 사용자가 승인하기 전에는 커밋하지 않는다

## 명령어

```
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드 — 변경 후 검증용
npm run lint    # ESLint (eslint-config-next core-web-vitals)
```

테스트 도구는 아직 설정되어 있지 않다.

## 기술 스택

- Next.js 16.4 (App Router, Turbopack), React 19, **JavaScript만** 사용 (TypeScript 없음)
- 스타일은 일반 CSS: 전역은 `app/globals.css`, 그 외에는 CSS Modules. Tailwind 없음. 지금은 모든 컴포넌트가 `app/page.module.css` 하나를 함께 쓴다
- import 별칭 `@/*` → 프로젝트 루트 (`jsconfig.json`)
- `next.config.mjs`에 `cacheComponents`, `partialPrefetching`이 켜져 있다. 학습 데이터와 동작이 다를 수 있으니 관련 코드는 `node_modules/next/dist/docs/`를 확인한다

## 화면 구조

- 페이지는 `app/page.js` 하나. `ChecklistLoader` → `Checklist` → `TeamMembers` / `TaskForm` / `TaskList`
- 상태(팀원·업무 배열)와 추가·삭제·완료 처리 함수는 모두 `Checklist`에 있고, 하위 컴포넌트는 props(`onAdd`, `onDelete`, `onToggle`)로 받아 호출만 한다
- 업무 묶음 나누기(지난 마감 / 이번 주 / 다음 주 이후 / 완료된 지난 업무)와 정렬은 `TaskList`가 렌더링할 때마다 계산한다. 따로 저장하지 않는다
- 팀원을 지워도 그 팀원의 업무는 남는다. 담당자 이름을 못 찾으면 "(삭제된 팀원)"으로 보여 준다

## 데이터 저장

- 서버·DB 없이 브라우저 `localStorage`에만 저장한다. 키는 `teamChecklist.members`, `teamChecklist.tasks`이고 읽기·쓰기는 `app/lib/storage.js`를 거친다
- `localStorage`와 "오늘 날짜"는 브라우저에서만 알 수 있다. 그래서 `ChecklistLoader`가 `next/dynamic`의 `ssr: false`로 `Checklist`를 브라우저에서만 그리고, `Checklist`는 `useState(loadTasks)`처럼 처음부터 저장소를 읽는다. 저장은 상태가 바뀔 때마다 `useEffect`에서 한다. 저장소나 오늘 날짜를 쓰는 새 컴포넌트는 `Checklist` 아래에 두어야 서버 렌더링 결과와 어긋나지 않는다
- 날짜는 `YYYY-MM-DD` 문자열로 저장하고, 날짜 앞뒤 비교는 문자열 비교로 한다. 날짜 계산은 `app/lib/date.js`에 모으고, 주 단위는 월요일 시작·일요일 끝으로 계산한다 (PRD 4장)

## 코딩 스타일

- 변수·함수 이름은 카멜 케이스, 들여쓰기 2칸, 주석은 한글
