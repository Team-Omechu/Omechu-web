# Infrastructure Notes

> 서비스 운영/배포와 관련된 최소한의 정보를 정리합니다.

## Deployment

- Frontend: Vercel
- Environment variables are managed in Vercel Project Settings.

## Environments

- Production: https://omechu.log8.kr/

## CI

- GitHub Actions: Develop Branch CI
- 주요 체크: Prettier(format:check), ESLint(lint), build

## Runtime

- Node.js: 프로젝트/CI 설정에 따름
- Package manager: pnpm (packageManager 필드 기준)

## Notes

- 인증/프록시 설정은 `omechu-app/proxy.ts` 기준으로 관리합니다.
- 이미지 업로드는 S3를 사용합니다.
