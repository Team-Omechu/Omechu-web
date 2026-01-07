export default function LoadingIndicator() {
  return (
    <div className="mt-4 flex h-20 items-center justify-center">
      <div className="border-grey-dark-hover h-6 w-6 animate-spin rounded-full border-4 border-t-gray-800" />
      <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
    </div>
  );
}

//* 이삭 추가
export function LoadingSpinner({
  label = "로딩 중...",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <main className={`flex w-full items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <svg
          className="text-primary-normal h-8 w-8 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="12"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-lg font-medium text-gray-500">{label}</span>
      </div>
    </main>
  );
}
