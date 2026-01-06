export function SkeletonUIFoodBox() {
  return (
    <div className="border-grey-dark-hover flex h-[130px] w-[100px] animate-pulse flex-col items-center justify-between rounded-xl border bg-gray-100 py-2">
      <div className="h-[70px] w-[70px] rounded-xl bg-gray-200"></div>
      <div className="h-[15px] w-[50px] bg-gray-200"></div>
      <div className="bg-gray-200ㄴ h-[10px] w-[30px]"></div>
    </div>
  );
}
