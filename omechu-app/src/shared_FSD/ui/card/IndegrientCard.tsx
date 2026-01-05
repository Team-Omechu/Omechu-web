export const IndigrentFoodCard = () => {
  return (
    <section className="bg-background-secondary h-fit w-[326px] p-5">
      <div className="w-fuill">
        <div>기본 영양 정보</div>
        <div className="flex w-full">
          <div className="text-body-4-medium text-font-high w-20">
            <span>칼로리</span>
            <span>탄수화몰</span>
            <span>단백질</span>
            <span>지방</span>
            <span>비타민</span>
          </div>
          <div className="text-body-4-regular text-font-medium w-full whitespace-pre-line">
            <span>칼로리</span>
            <span>탄수화몰</span>
            <span>단백질</span>
            <span>지방</span>
            <span>
              비타민 비타민 비타민 비타민 비타민 비타민 비타민 비타민
              비타민비타민 비타민{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="border-component-default border" />
      <div></div>
    </section>
  );
};
