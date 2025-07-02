## 📦 Commit Convention

협업을 위한 커밋 컨벤션입니다. 태그를 사용해 커밋의 목적을 명확히 구분합니다.

| 태그        | 설명 |
|-------------|------|
| `feat`      | 새로운 기능 추가 |
| `fix`       | 버그 수정 |
| `docs`      | 문서 수정 (README, 주석 등) |
| `style`     | 코드 스타일 변경 (세미콜론, 들여쓰기 등) |
| `design`    | 사용자 UI 디자인 변경 (CSS, Tailwind 등) |
| `test`      | 테스트 코드 작성/수정 |
| `refactor`  | 기능 변화 없는 리팩토링 (로직 개선 등) |
| `build`     | 빌드 설정 파일 수정 |
| `ci`        | CI 설정 변경 (GitHub Actions, Husky 등) |
| `perf`      | 성능 개선 (렌더링 최적화 등) |
| `chore`     | 설정, 패키지 설치 등 기타 작업 |
| `rename`    | 파일 또는 폴더 이름 변경 |
| `remove`    | 파일 또는 리소스 삭제 |
| `wip`       | 작업 중인 임시 커밋 (Work In Progress) |
| `hotfix`    | 운영 중 긴급 버그 수정 |

---

### ✅ 커밋 메시지 작성 규칙

- **한 작업 단위당 하나의 커밋**으로 나눕니다.
- 메시지는 **간결하고 명확하게** 작성합니다.
- **이슈 번호가 있다면 `#번호`를 함께 명시**합니다.

```bash
feat: 감정 선택 페이지 레이아웃 구현 #12
fix: 로그인 실패 시 에러 메시지 출력 오류 수정 #7
docs: README에 커밋 컨벤션 항목 추가 #3
style: Prettier로 코드 포맷 일괄 정리 #4
design: 감정 선택 카드 UI 개선 (hover 효과) #5
test: DiaryList 렌더링 테스트 코드 추가 #6
refactor: useDiary 훅으로 상태 로직 분리 #7
build: next.config.ts에 이미지 도메인 설정 추가 #8
ci: push 시 lint 자동 검사 추가 #9
perf: EmotionItem 렌더링 useMemo로 최적화 #10
chore: tailwind.config.js에 모바일 breakpoints 추가 #11
rename: EmotionItem → EmotionSelector로 컴포넌트 이름 변경 #12
remove: 사용하지 않는 test-data.json 삭제 #13
wip: 감정 필터 기능 작업 중 #14
hotfix: 배포 후 발견된 메뉴 추천 API 오류 긴급 수정 #15
```
