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
        className="flex h-screen min-h-screen w-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/image/loading-bg.svg')",
          backgroundSize: "1000px 700px",
        }}
      >
        <div
          className="animate-food-cycle h-[170px] w-[175px] -translate-y-6 bg-[url('/image/food-sprite.svg')]"
          style={{
            backgroundSize: "525px 170px",
          }}
        ></div>
      </div>
    </>
  );
};

export default MainLoading;
