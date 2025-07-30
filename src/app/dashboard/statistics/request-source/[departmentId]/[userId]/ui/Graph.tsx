import React from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { COLORS } from "../lib/constants";

type DataType = { name: string; value: number }[];

const Graph = ({ data, className }: { data: DataType; className: string }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, bottom: 60, left: -30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
            axisLine={true}
            tickLine={true}
            stroke="#ccc"
          />
          <YAxis tickLine={true} stroke="#ccc" />

          <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={30}>
            <LabelList dataKey="value" position="top" fill="#fff" />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
