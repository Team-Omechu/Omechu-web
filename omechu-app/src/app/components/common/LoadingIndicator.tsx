export default function LoadingIndicator() {
  return (
    <div className="mt-4 flex h-20 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
      <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
    </div>
  );
}
