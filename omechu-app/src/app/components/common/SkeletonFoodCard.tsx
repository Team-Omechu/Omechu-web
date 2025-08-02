export default function SkeletonFoodCard() {
  return (
    <div className="flex animate-pulse flex-row gap-4 rounded-lg bg-gray-100 p-4">
      <div className="h-20 w-20 rounded-md bg-gray-200" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
