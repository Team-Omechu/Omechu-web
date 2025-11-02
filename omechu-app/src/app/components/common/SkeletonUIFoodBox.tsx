export default function SkeletonUIFoodBox() {
  return (
    <div className="flex h-[130px] w-[100px] animate-pulse flex-col items-center justify-between rounded-xl border border-grey-dark-hover bg-gray-100 py-2">
      <div className="h-[70px] w-[70px] rounded-xl bg-gray-200"></div>
      <div className="h-[15px] w-[50px] bg-gray-200"></div>
      <div className="h-[10px] w-[30px] bg-gray-200"></div>
    </div>
  );
}
