interface RestaurantNameInputProps {
  restaurantName: string;
  setRestaurantName: (name: string) => void;
}

export default function RestaurantNameInput({
  restaurantName,
  setRestaurantName,
}: RestaurantNameInputProps) {
  return (
    <>
      <div className="mb-1 text-sm font-medium text-gray-700">식당명</div>
      <input
        type="text"
        placeholder="식당명을 입력하세요"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
    </>
  );
}
