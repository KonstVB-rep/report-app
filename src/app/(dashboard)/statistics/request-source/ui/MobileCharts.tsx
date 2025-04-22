// import { useState } from "react";
// import { FC } from "react";

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { Text } from "recharts";

// interface CustomTickProps {
//   x?: number;
//   y?: number;
//   payload?: {
//     value: string;
//   };
// }

// export const CustomTick: FC<CustomTickProps> = ({ x = 0, y = 0, payload }) => {
//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text
//         x={0}
//         y={10}
//         dy={10}
//         textAnchor="middle"
//         fill="#4f46e5"
//         fontSize={12}
//         fontWeight={500}
//       >
//         📦 {payload?.value}
//       </text>
//     </g>
//   );
// };

// const COLORS = [
//   "#8884d8",
//   "#82ca9d",
//   "#ffc658",
//   "#ff8042",
//   "#a4de6c",
//   "#d0ed57",
//   "#8dd1e1",
//   "#83a6ed",
//   "#d0ed57",
//   "#ffbb28",
//   "#ff6384",
//   "#36a2eb",
// ];

// const CustomTooltip = ({
//   active,
//   payload,
// }: {
//   active?: boolean | undefined;
//   payload?: { payload: { name: string }; value: number }[];
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-background border rounded-md p-2 text-sm shadow-md">
//         <p className="font-semibold">{payload[0].payload.name}</p>
//         <p>Значение: {payload[0].value}</p>
//       </div>
//     );
//   }

//   return null;
// };

// const ticks = (max: number) =>
//   Array.from({ length: max / 10 + 1 }, (_, i) => i * 10);

// const MobileCharts = ({
//   data,
// }: {
//   data: { name: string; value: number }[];
// }) => {
//   const max = Math.ceil(Math.max(...data.map((d) => d.value)) / 10) * 10;
//   return (
//     <div className="w-full block md:hidden">
//       {/* <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={data}
//           margin={{ top: 40, right: 10, left: -20, bottom: 40 }}
//         >
//           <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//           <XAxis
//             dataKey="name"
//             tick={{ fill: "#fff", fontSize: 12 }}
//             interval={0}
//             angle={-15}
//             textAnchor="end"
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//           />

//           <YAxis
//             type="number"
//             tick={{ fill: "#444", fontSize: 12 }}
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//             domain={[0, "dataMax"]}
//             tickCount={Math.ceil(
//               (Math.max(...data.map((d) => d.value)) + 10) / 10
//             )}
//             interval={0}
//             ticks={ticks(max)}
//             className="text-red-500"
//           />

//           <Bar
//             dataKey="value"
//             barSize={30}
//             radius={[4, 4, 0, 0]}
//             label={{
//               content: ({ x, y, width, value }) => (
//                 <>

//                   <circle
//                     cx={Number(x)! + Number(width)! / 2}
//                     cy={Number(y)! - 20}
//                     r={15}
//                     fill="#225AD5"
//                     dy={15}
//                   />

//                   <text
//                     x={Number(x)! + Number(width)! / 2}
//                     y={Number(y)! - 20}
//                     textAnchor="middle"
//                     dominantBaseline="middle"
//                     fill="#fff"
//                     fontSize={14}
//                     fontWeight="bold"
//                   >
//                     {value}
//                   </text>
//                 </>
//               ),
//             }}
//           >
//             {data.map((_, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer> */}

// <ResponsiveContainer width="100%" height={300}>
//   <BarChart
//     data={data}
//     layout="vertical"
//     margin={{ top: 40, right: 10, left: 20, bottom: 40 }}
//   >
//     <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//     <XAxis
//       type="number"
//       tick={{ fill: "#444", fontSize: 12 }}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//       domain={[0, "dataMax"]}
//       tickCount={Math.ceil((Math.max(...data.map((d) => d.value)) + 10) / 10)}
//       interval={0}
//       ticks={ticks(max)}
//     />

//     <YAxis
//       type="category"
//       dataKey="name"
//       tick={{ fill: "#fff", fontSize: 12 }}
//       interval={0}
//       width={100}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//     />

//     <Bar
//       dataKey="value"
//       barSize={30}
//       radius={[0, 4, 4, 0]}
//       label={{
//         content: ({ x, y, width, height, value }) => (
//           <>
//             <circle
//               cx={x + width}
//               cy={y + height / 2}
//               r={10}
//               fill="#225AD5"
//             />
//             <text
//               x={x + width}
//               y={y + height / 2}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fill="#fff"
//               fontSize={14}
//               fontWeight="bold"
//             >
//               {value}
//             </text>
//           </>
//         ),
//       }}
//     >
//       {data.map((_, index) => (
//         <Cell
//           key={`cell-${index}`}
//           fill={COLORS[index % COLORS.length]}
//         />
//       ))}
//     </Bar>
//   </BarChart>
// </ResponsiveContainer>

//     </div>
//   );
// };

// export default MobileCharts;

"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";

import { useMemo } from "react";

import { COLORS } from "../lib/constants";

// import { useState } from "react";
// import { FC } from "react";

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { Text } from "recharts";

// interface CustomTickProps {
//   x?: number;
//   y?: number;
//   payload?: {
//     value: string;
//   };
// }

// export const CustomTick: FC<CustomTickProps> = ({ x = 0, y = 0, payload }) => {
//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text
//         x={0}
//         y={10}
//         dy={10}
//         textAnchor="middle"
//         fill="#4f46e5"
//         fontSize={12}
//         fontWeight={500}
//       >
//         📦 {payload?.value}
//       </text>
//     </g>
//   );
// };

// const COLORS = [
//   "#8884d8",
//   "#82ca9d",
//   "#ffc658",
//   "#ff8042",
//   "#a4de6c",
//   "#d0ed57",
//   "#8dd1e1",
//   "#83a6ed",
//   "#d0ed57",
//   "#ffbb28",
//   "#ff6384",
//   "#36a2eb",
// ];

// const CustomTooltip = ({
//   active,
//   payload,
// }: {
//   active?: boolean | undefined;
//   payload?: { payload: { name: string }; value: number }[];
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-background border rounded-md p-2 text-sm shadow-md">
//         <p className="font-semibold">{payload[0].payload.name}</p>
//         <p>Значение: {payload[0].value}</p>
//       </div>
//     );
//   }

//   return null;
// };

// const ticks = (max: number) =>
//   Array.from({ length: max / 10 + 1 }, (_, i) => i * 10);

// const MobileCharts = ({
//   data,
// }: {
//   data: { name: string; value: number }[];
// }) => {
//   const max = Math.ceil(Math.max(...data.map((d) => d.value)) / 10) * 10;
//   return (
//     <div className="w-full block md:hidden">
//       {/* <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={data}
//           margin={{ top: 40, right: 10, left: -20, bottom: 40 }}
//         >
//           <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//           <XAxis
//             dataKey="name"
//             tick={{ fill: "#fff", fontSize: 12 }}
//             interval={0}
//             angle={-15}
//             textAnchor="end"
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//           />

//           <YAxis
//             type="number"
//             tick={{ fill: "#444", fontSize: 12 }}
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//             domain={[0, "dataMax"]}
//             tickCount={Math.ceil(
//               (Math.max(...data.map((d) => d.value)) + 10) / 10
//             )}
//             interval={0}
//             ticks={ticks(max)}
//             className="text-red-500"
//           />

//           <Bar
//             dataKey="value"
//             barSize={30}
//             radius={[4, 4, 0, 0]}
//             label={{
//               content: ({ x, y, width, value }) => (
//                 <>

//                   <circle
//                     cx={Number(x)! + Number(width)! / 2}
//                     cy={Number(y)! - 20}
//                     r={15}
//                     fill="#225AD5"
//                     dy={15}
//                   />

//                   <text
//                     x={Number(x)! + Number(width)! / 2}
//                     y={Number(y)! - 20}
//                     textAnchor="middle"
//                     dominantBaseline="middle"
//                     fill="#fff"
//                     fontSize={14}
//                     fontWeight="bold"
//                   >
//                     {value}
//                   </text>
//                 </>
//               ),
//             }}
//           >
//             {data.map((_, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer> */}

// <ResponsiveContainer width="100%" height={300}>
//   <BarChart
//     data={data}
//     layout="vertical"
//     margin={{ top: 40, right: 10, left: 20, bottom: 40 }}
//   >
//     <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//     <XAxis
//       type="number"
//       tick={{ fill: "#444", fontSize: 12 }}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//       domain={[0, "dataMax"]}
//       tickCount={Math.ceil((Math.max(...data.map((d) => d.value)) + 10) / 10)}
//       interval={0}
//       ticks={ticks(max)}
//     />

//     <YAxis
//       type="category"
//       dataKey="name"
//       tick={{ fill: "#fff", fontSize: 12 }}
//       interval={0}
//       width={100}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//     />

//     <Bar
//       dataKey="value"
//       barSize={30}
//       radius={[0, 4, 4, 0]}
//       label={{
//         content: ({ x, y, width, height, value }) => (
//           <>
//             <circle
//               cx={x + width}
//               cy={y + height / 2}
//               r={10}
//               fill="#225AD5"
//             />
//             <text
//               x={x + width}
//               y={y + height / 2}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fill="#fff"
//               fontSize={14}
//               fontWeight="bold"
//             >
//               {value}
//             </text>
//           </>
//         ),
//       }}
//     >
//       {data.map((_, index) => (
//         <Cell
//           key={`cell-${index}`}
//           fill={COLORS[index % COLORS.length]}
//         />
//       ))}
//     </Bar>
//   </BarChart>
// </ResponsiveContainer>

//     </div>
//   );
// };

// export default MobileCharts;

// import { useState } from "react";
// import { FC } from "react";

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { Text } from "recharts";

// interface CustomTickProps {
//   x?: number;
//   y?: number;
//   payload?: {
//     value: string;
//   };
// }

// export const CustomTick: FC<CustomTickProps> = ({ x = 0, y = 0, payload }) => {
//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text
//         x={0}
//         y={10}
//         dy={10}
//         textAnchor="middle"
//         fill="#4f46e5"
//         fontSize={12}
//         fontWeight={500}
//       >
//         📦 {payload?.value}
//       </text>
//     </g>
//   );
// };

// const COLORS = [
//   "#8884d8",
//   "#82ca9d",
//   "#ffc658",
//   "#ff8042",
//   "#a4de6c",
//   "#d0ed57",
//   "#8dd1e1",
//   "#83a6ed",
//   "#d0ed57",
//   "#ffbb28",
//   "#ff6384",
//   "#36a2eb",
// ];

// const CustomTooltip = ({
//   active,
//   payload,
// }: {
//   active?: boolean | undefined;
//   payload?: { payload: { name: string }; value: number }[];
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-background border rounded-md p-2 text-sm shadow-md">
//         <p className="font-semibold">{payload[0].payload.name}</p>
//         <p>Значение: {payload[0].value}</p>
//       </div>
//     );
//   }

//   return null;
// };

// const ticks = (max: number) =>
//   Array.from({ length: max / 10 + 1 }, (_, i) => i * 10);

// const MobileCharts = ({
//   data,
// }: {
//   data: { name: string; value: number }[];
// }) => {
//   const max = Math.ceil(Math.max(...data.map((d) => d.value)) / 10) * 10;
//   return (
//     <div className="w-full block md:hidden">
//       {/* <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={data}
//           margin={{ top: 40, right: 10, left: -20, bottom: 40 }}
//         >
//           <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//           <XAxis
//             dataKey="name"
//             tick={{ fill: "#fff", fontSize: 12 }}
//             interval={0}
//             angle={-15}
//             textAnchor="end"
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//           />

//           <YAxis
//             type="number"
//             tick={{ fill: "#444", fontSize: 12 }}
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//             domain={[0, "dataMax"]}
//             tickCount={Math.ceil(
//               (Math.max(...data.map((d) => d.value)) + 10) / 10
//             )}
//             interval={0}
//             ticks={ticks(max)}
//             className="text-red-500"
//           />

//           <Bar
//             dataKey="value"
//             barSize={30}
//             radius={[4, 4, 0, 0]}
//             label={{
//               content: ({ x, y, width, value }) => (
//                 <>

//                   <circle
//                     cx={Number(x)! + Number(width)! / 2}
//                     cy={Number(y)! - 20}
//                     r={15}
//                     fill="#225AD5"
//                     dy={15}
//                   />

//                   <text
//                     x={Number(x)! + Number(width)! / 2}
//                     y={Number(y)! - 20}
//                     textAnchor="middle"
//                     dominantBaseline="middle"
//                     fill="#fff"
//                     fontSize={14}
//                     fontWeight="bold"
//                   >
//                     {value}
//                   </text>
//                 </>
//               ),
//             }}
//           >
//             {data.map((_, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer> */}

// <ResponsiveContainer width="100%" height={300}>
//   <BarChart
//     data={data}
//     layout="vertical"
//     margin={{ top: 40, right: 10, left: 20, bottom: 40 }}
//   >
//     <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//     <XAxis
//       type="number"
//       tick={{ fill: "#444", fontSize: 12 }}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//       domain={[0, "dataMax"]}
//       tickCount={Math.ceil((Math.max(...data.map((d) => d.value)) + 10) / 10)}
//       interval={0}
//       ticks={ticks(max)}
//     />

//     <YAxis
//       type="category"
//       dataKey="name"
//       tick={{ fill: "#fff", fontSize: 12 }}
//       interval={0}
//       width={100}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//     />

//     <Bar
//       dataKey="value"
//       barSize={30}
//       radius={[0, 4, 4, 0]}
//       label={{
//         content: ({ x, y, width, height, value }) => (
//           <>
//             <circle
//               cx={x + width}
//               cy={y + height / 2}
//               r={10}
//               fill="#225AD5"
//             />
//             <text
//               x={x + width}
//               y={y + height / 2}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fill="#fff"
//               fontSize={14}
//               fontWeight="bold"
//             >
//               {value}
//             </text>
//           </>
//         ),
//       }}
//     >
//       {data.map((_, index) => (
//         <Cell
//           key={`cell-${index}`}
//           fill={COLORS[index % COLORS.length]}
//         />
//       ))}
//     </Bar>
//   </BarChart>
// </ResponsiveContainer>

//     </div>
//   );
// };

// export default MobileCharts;

// import { useState } from "react";
// import { FC } from "react";

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { Text } from "recharts";

// interface CustomTickProps {
//   x?: number;
//   y?: number;
//   payload?: {
//     value: string;
//   };
// }

// export const CustomTick: FC<CustomTickProps> = ({ x = 0, y = 0, payload }) => {
//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text
//         x={0}
//         y={10}
//         dy={10}
//         textAnchor="middle"
//         fill="#4f46e5"
//         fontSize={12}
//         fontWeight={500}
//       >
//         📦 {payload?.value}
//       </text>
//     </g>
//   );
// };

// const COLORS = [
//   "#8884d8",
//   "#82ca9d",
//   "#ffc658",
//   "#ff8042",
//   "#a4de6c",
//   "#d0ed57",
//   "#8dd1e1",
//   "#83a6ed",
//   "#d0ed57",
//   "#ffbb28",
//   "#ff6384",
//   "#36a2eb",
// ];

// const CustomTooltip = ({
//   active,
//   payload,
// }: {
//   active?: boolean | undefined;
//   payload?: { payload: { name: string }; value: number }[];
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-background border rounded-md p-2 text-sm shadow-md">
//         <p className="font-semibold">{payload[0].payload.name}</p>
//         <p>Значение: {payload[0].value}</p>
//       </div>
//     );
//   }

//   return null;
// };

// const ticks = (max: number) =>
//   Array.from({ length: max / 10 + 1 }, (_, i) => i * 10);

// const MobileCharts = ({
//   data,
// }: {
//   data: { name: string; value: number }[];
// }) => {
//   const max = Math.ceil(Math.max(...data.map((d) => d.value)) / 10) * 10;
//   return (
//     <div className="w-full block md:hidden">
//       {/* <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={data}
//           margin={{ top: 40, right: 10, left: -20, bottom: 40 }}
//         >
//           <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//           <XAxis
//             dataKey="name"
//             tick={{ fill: "#fff", fontSize: 12 }}
//             interval={0}
//             angle={-15}
//             textAnchor="end"
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//           />

//           <YAxis
//             type="number"
//             tick={{ fill: "#444", fontSize: 12 }}
//             axisLine={{ stroke: "#ccc" }}
//             tickLine={{ stroke: "#ccc" }}
//             domain={[0, "dataMax"]}
//             tickCount={Math.ceil(
//               (Math.max(...data.map((d) => d.value)) + 10) / 10
//             )}
//             interval={0}
//             ticks={ticks(max)}
//             className="text-red-500"
//           />

//           <Bar
//             dataKey="value"
//             barSize={30}
//             radius={[4, 4, 0, 0]}
//             label={{
//               content: ({ x, y, width, value }) => (
//                 <>

//                   <circle
//                     cx={Number(x)! + Number(width)! / 2}
//                     cy={Number(y)! - 20}
//                     r={15}
//                     fill="#225AD5"
//                     dy={15}
//                   />

//                   <text
//                     x={Number(x)! + Number(width)! / 2}
//                     y={Number(y)! - 20}
//                     textAnchor="middle"
//                     dominantBaseline="middle"
//                     fill="#fff"
//                     fontSize={14}
//                     fontWeight="bold"
//                   >
//                     {value}
//                   </text>
//                 </>
//               ),
//             }}
//           >
//             {data.map((_, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer> */}

// <ResponsiveContainer width="100%" height={300}>
//   <BarChart
//     data={data}
//     layout="vertical"
//     margin={{ top: 40, right: 10, left: 20, bottom: 40 }}
//   >
//     <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

//     <XAxis
//       type="number"
//       tick={{ fill: "#444", fontSize: 12 }}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//       domain={[0, "dataMax"]}
//       tickCount={Math.ceil((Math.max(...data.map((d) => d.value)) + 10) / 10)}
//       interval={0}
//       ticks={ticks(max)}
//     />

//     <YAxis
//       type="category"
//       dataKey="name"
//       tick={{ fill: "#fff", fontSize: 12 }}
//       interval={0}
//       width={100}
//       axisLine={{ stroke: "#ccc" }}
//       tickLine={{ stroke: "#ccc" }}
//     />

//     <Bar
//       dataKey="value"
//       barSize={30}
//       radius={[0, 4, 4, 0]}
//       label={{
//         content: ({ x, y, width, height, value }) => (
//           <>
//             <circle
//               cx={x + width}
//               cy={y + height / 2}
//               r={10}
//               fill="#225AD5"
//             />
//             <text
//               x={x + width}
//               y={y + height / 2}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fill="#fff"
//               fontSize={14}
//               fontWeight="bold"
//             >
//               {value}
//             </text>
//           </>
//         ),
//       }}
//     >
//       {data.map((_, index) => (
//         <Cell
//           key={`cell-${index}`}
//           fill={COLORS[index % COLORS.length]}
//         />
//       ))}
//     </Bar>
//   </BarChart>
// </ResponsiveContainer>

//     </div>
//   );
// };

// export default MobileCharts;

type dataType = [{ name: string; value: number }];

export default function MobileCharts({ data }: { data: dataType }) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ParentSize>
        {({ width, height }) => {
          const margin = { top: 40, bottom: 120, left: 40, right: 10 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const xScale = scaleBand<string>({
            domain: data.map((d) => d.name),
            padding: 0.3,
            range: [0, xMax],
          });

          const yScale = scaleLinear<number>({
            domain: [0, Math.max(...data.map((d) => d.value)) + 10],
            nice: true,
            range: [yMax, 0],
          });

          return (
            <svg width={width} height={height} className="block md:hidden">
              <Group top={margin.top} left={margin.left}>
                {data.map((d, index) => {
                  const barWidth = xScale.bandwidth();
                  const barHeight = yMax - yScale(d.value);
                  const barX = xScale(d.name)!;
                  const barY = yScale(d.value);

                  return (
                    <Group key={d.name}>
                      <Bar
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={COLORS[index % COLORS.length]}
                        rx={4}
                      />
                      {/* <circle
                        cx={barX + barWidth / 2}
                        cy={barY - 16}
                        r={14}
                        fill="#225AD5"
                      />
                      <Text
                        x={barX + barWidth / 2}
                        y={barY - 16}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                        fontWeight={600}
                      >
                        {d.value}
                      </Text> */}
                      <rect
                        x={barX + barWidth / 2 - 14} // сдвигаем влево на половину ширины (28/2)
                        y={barY - 30} // немного выше, чтобы влез текст
                        width={28}
                        height={28}
                        fill="#225AD5"
                        rx={3} // скругление углов
                        ry={3}
                      />
                      <Text
                        x={barX + barWidth / 2}
                        y={barY - 16} // по центру rect (y + height/2)
                        textAnchor="middle"
                        verticalAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                        fontWeight={600}
                      >
                        {d.value}
                      </Text>
                    </Group>
                  );
                })}

                <AxisBottom
                  scale={xScale}
                  top={yMax}
                  stroke="#ccc"
                  tickComponent={({ x, y, formattedValue }) => (
                    <Text
                      x={x}
                      y={y + 10} // немного опустить вниз
                      angle={-45}
                      fill="#444"
                      fontSize={12}
                      textAnchor="end"
                    >
                      {formattedValue}
                    </Text>
                  )}
                  tickLength={0}
                />
                <AxisLeft
                  scale={yScale}
                  stroke="#ccc"
                  tickLabelProps={() => ({
                    fill: "#444",
                    fontSize: 11,
                    textAnchor: "end",
                    dx: "-0.25em",
                    dy: "0.25em",
                  })}
                />
              </Group>
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
}
