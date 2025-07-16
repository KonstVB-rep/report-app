
import Graph from "./Graph";

type DataType = { name: string; value: number }[];

export default function MobileCharts({ data }: { data: DataType }) {
  return (
    <div className="sm:hidden">
      <Graph data={data} className="block w-full h-[400px]"/>
    </div>
  );
}
