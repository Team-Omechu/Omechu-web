const fs = require('fs');
const path = require('path');

// 주석을 추가할 파일 목록 및 새 위치
const filesToMigrate = [
  // (auth) 라우트 파일들
  {
    oldPath: 'src/app/(auth)/sign-in/page.tsx',
    newPath: 'src/app/(routes)/(auth)/sign-in/page.tsx',
  },
  {
    oldPath: 'src/app/(auth)/sign-in/components/SignInForm.tsx',
    newPath: 'src/app/(routes)/(auth)/sign-in/components/SignInForm.tsx',
  },
  {
    oldPath: 'src/app/(auth)/sign-up/page.tsx',
    newPath: 'src/app/(routes)/(auth)/sign-up/page.tsx',
  },
  {
    oldPath: 'src/app/(auth)/sign-up/components/SignUpForm.tsx',
    newPath: 'src/app/(routes)/(auth)/sign-up/components/SignUpForm.tsx',
  },
  {
    oldPath: 'src/app/(auth)/sign-up/components/TermsAgreement.tsx',
    newPath: 'src/app/(routes)/(auth)/sign-up/components/TermsAgreement.tsx',
  },
  {
    oldPath: 'src/app/(auth)/sign-up/components/TermsModal.tsx',
    newPath: 'src/app/(routes)/(auth)/sign-up/components/TermsModal.tsx',
  },
  {
    oldPath: 'src/app/(auth)/sign-up/components/UserInfoFields.tsx',
    newPath: 'src/app/(routes)/(auth)/sign-up/components/UserInfoFields.tsx',
  },
  {
    oldPath: 'src/app/(auth)/sign-up/api/agreements.ts',
    newPath: 'src/app/(routes)/(auth)/sign-up/api/agreements.ts',
  },
  {
    oldPath: 'src/app/(auth)/forgot-password/page.tsx',
    newPath: 'src/app/(routes)/(auth)/forgot-password/page.tsx',
  },
  {
    oldPath: 'src/app/(auth)/forgot-password/components/ForgotPasswordForm.tsx',
    newPath: 'src/app/(routes)/(auth)/forgot-password/components/ForgotPasswordForm.tsx',
  },
  {
    oldPath: 'src/app/(auth)/forgot-password/sent/page.tsx',
    newPath: 'src/app/(routes)/(auth)/forgot-password/sent/page.tsx',
  },
  {
    oldPath: 'src/app/(auth)/forgot-password/sent/components/EmailSentMessage.tsx',
    newPath: 'src/app/(routes)/(auth)/forgot-password/sent/components/EmailSentMessage.tsx',
  },
  {
    oldPath: 'src/app/(auth)/layout.tsx',
    newPath: 'src/app/(routes)/(auth)/layout.tsx',
  },
  // settings 라우트 파일들
  {
    oldPath: 'src/app/mypage/settings/page.tsx',
    newPath: 'src/app/(routes)/settings/page.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/SettingsClient.tsx',
    newPath: 'src/app/(routes)/settings/SettingsClient.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/account-settings/page.tsx',
    newPath: 'src/app/(routes)/settings/account-settings/page.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/account-settings/AccountSettingsClient.tsx',
    newPath: 'src/app/(routes)/settings/account-settings/AccountSettingsClient.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/account-settings/change-password/page.tsx',
    newPath: 'src/app/(routes)/settings/account-settings/change-password/page.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/account-settings/change-password/ChangePasswordClient.tsx',
    newPath: 'src/app/(routes)/settings/account-settings/change-password/ChangePasswordClient.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/terms/page.tsx',
    newPath: 'src/app/(routes)/settings/terms/page.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/terms/service/page.tsx',
    newPath: 'src/app/(routes)/settings/terms/service/page.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/terms/personal-info/page.tsx',
    newPath: 'src/app/(routes)/settings/terms/personal-info/page.tsx',
  },
  {
    oldPath: 'src/app/mypage/settings/terms/location-info/page.tsx',
    newPath: 'src/app/(routes)/settings/terms/location-info/page.tsx',
  },
  // ClientLayout
  {
    oldPath: 'src/app/ClientLayout.tsx',
    newPath: 'src/app/layouts/ClientLayout.tsx',
  },
];

function addMigrationComment(filePath, newPath) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  파일을 찾을 수 없습니다: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  // 이미 주석이 있는지 확인
  if (content.includes('[FSD 마이그레이션]')) {
    console.log(`⏭️  이미 주석이 있습니다: ${filePath}`);
    return;
  }

  const comment = `// TODO: [FSD 마이그레이션] 이 파일은 삭제해도 됩니다.\n// 새 위치: ${newPath}\n\n`;
  const newContent = comment + content;

  fs.writeFileSync(fullPath, newContent, 'utf8');
  console.log(`✅ 주석 추가 완료: ${filePath}`);
}

console.log('🚀 FSD 마이그레이션 주석 추가 시작...\n');

filesToMigrate.forEach(({ oldPath, newPath }) => {
  addMigrationComment(oldPath, newPath);
});

console.log('\n✨ 완료!');
