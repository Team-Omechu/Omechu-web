export const handleLocation = async (
  setX: (x: number) => void,
  setY: (y: number) => void,
) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setX(latitude);
      setY(longitude);
      console.log(latitude, longitude);
    },
    (error) => {
      console.error("위치 정보를 가져오는 중 오류 발생", error);
    },
  );
};
