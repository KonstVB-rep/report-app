import React from "react";

const Loading = () => {
  const placeholders = Array(5).fill(null); // 5 блоков с анимацией

  return (
    <div className="grid gap-5">
      <div className="h-14 w-full max-w-[300px] animate-pulse rounded-md bg-muted m-auto" />
      <div className="grid gap-2">
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className="h-14 w-full max-w-[560px] animate-pulse rounded-md bg-muted m-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
