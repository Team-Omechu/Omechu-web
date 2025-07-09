import React from "react";

const MainLoading = () => {
  return (
    <>
      <style>
        {`
          @keyframes cycle {
            0% { background-position: 0 0; }
            100% { background-position: -525px 0; }
          }
          .animate-food-cycle {
            animation: cycle 0.5s steps(3) infinite;
          }
        `}
      </style>
      <div
        className="h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/loading-bg.png')" }}
      >
        <div className="relative h-full w-full">
          <div
            className="
              absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2
              w-[175px] h-[170px]
              bg-[url('/food-sprite.png')]
              animate-food-cycle
            "
            style={{
              backgroundSize: "525px 170px",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default MainLoading;
