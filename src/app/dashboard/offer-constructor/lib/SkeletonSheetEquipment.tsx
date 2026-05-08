const skeletonItems = Array.from({ length: 12 }, (_, index) => (
  <div className="h-12 animate-pulse rounded-md bg-muted" key={index} />
));

const SkeletonSheetEquipment = () => {
  return (
    <>
      <div className="flex gap-2 justify-end">
        <div className="w-[50] h-9 animate-pulse rounded-md bg-muted" />
        <div className="w-[192px] h-9 animate-pulse rounded-md bg-muted" />{" "}
      </div>
      <div className="rounded-md grid gap-2 overflow-x-auto overflow-y-auto max-h-[calc(100vh-10rem)">
        <div className="h-20 animate-pulse rounded-md bg-muted" />
        {skeletonItems}
      </div>
      <div className="flex gap-2 justify-end">
        <div className="w-28 h-9 animate-pulse rounded-md bg-muted" />
        <div className="w-28 h-9 animate-pulse rounded-md bg-muted" />
        <div className="w-28 h-9 animate-pulse rounded-md bg-muted" />
      </div>
    </>
  );
};

export default SkeletonSheetEquipment;
