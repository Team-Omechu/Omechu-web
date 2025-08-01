export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-20 mt-4">
      <div className="w-6 h-6 border-4 border-gray-300 rounded-full animate-spin border-t-gray-800" />
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
          className="w-8 h-8 animate-spin text-primary-normal"
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
