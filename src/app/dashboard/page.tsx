const TemplateDashboard = () => {
  return (
    <div className="p-4 grid place-items-center h-full relative">
      <div className="flex flex-1 flex-col gap-4 p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full blur-sm">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min relative z-10" />
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min relative z-10" />
      </div>
      <h1 className="text-2xl text-white text-center">Начните работу с боковой панели</h1>
    </div>
  );
};

export default TemplateDashboard;
