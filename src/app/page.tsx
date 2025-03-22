const TemplateDashboard = () => {
  return (
    <div className="relative grid h-full place-items-center p-4">
      <div className="absolute left-1/2 top-1/2 flex h-full w-full flex-1 -translate-x-1/2 -translate-y-1/2 transform flex-col gap-4 p-4 blur-sm">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="relative z-10 min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        <div className="relative z-10 min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
      <div>
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-2xl text-white">
          Начните работу с боковой панели
        </h1>
      </div>
    </div>
  );
};

export default TemplateDashboard;
