const Loading = () => {
  const placeholders = Array(5).fill(null);

  return (
    <div className="grid gap-5">
      <div className="h-14 w-full max-w-[300px] animate-pulse rounded-md bg-muted m-auto" />
      <div className="grid gap-2">
        {placeholders.map((_, i) => (
          <div
            className="h-14 w-full max-w-[560px] animate-pulse rounded-md bg-muted m-auto"
            key={`placeholder-${i}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
