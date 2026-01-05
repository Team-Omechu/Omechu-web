// ! 26.01.04 작업 완료

interface IngredientCardProps {
  kcal?: string;
  carbohydrate?: string;
  protein?: string;
  fat?: string;
  vitamin?: string;
  allergies?: string;
  onCardClick?: () => void;
}

const IngredientCard = ({
  kcal,
  carbohydrate,
  protein,
  fat,
  vitamin,
  allergies,
  onCardClick,
}: IngredientCardProps) => {
  return (
    <section
      className="bg-background-secondary h-fit w-81.5 rounded-2xl p-5"
      onClick={onCardClick}
      role="button"
      aria-pressed={undefined}
      tabIndex={0}
    >
      <div className="w-full">
        <div className="mb-2 text-base font-medium text-[#bdbdbd]">
          기본 영양 정보
        </div>
        <div className="flex">
          <div className="text-body-4-medium text-font-high flex w-20 flex-col gap-1.5 font-bold">
            <div>칼로리</div>
            <div>탄수화몰</div>
            <div>단백질</div>
            <div>지방</div>
            <div>비타민</div>
          </div>
          <div className="text-body-4-regular text-font-medium flex flex-1 flex-col gap-1.5">
            <div>{`${kcal ? kcal : ""} kcal`}</div>
            <div>{`${carbohydrate ? carbohydrate : ""} g`} </div>
            <div>{`${protein ? protein : ""} g`} </div>
            <div>{`${fat ? fat : ""} g`}</div>
            <div>{vitamin}</div>
          </div>
        </div>
      </div>
      <div className="border-component-default my-3 border" />
      <div>
        <div className="mb-2 text-base font-medium text-[#bdbdbd]">
          알레르기 유발 성분
        </div>
        <div className="text-body-4-medium text-font-high flex w-56 flex-col">
          {allergies ? [allergies] : "없음"}
        </div>
      </div>
    </section>
  );
};

export default IngredientCard;
