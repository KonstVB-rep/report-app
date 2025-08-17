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
  LabelProps
} from "recharts";
import { COLORS } from "../lib/constants";
import useCurrentTheme from "@/shared/hooks/useCurrentTheme";

type DataType = { name: string; value: number }[];

interface CustomLabelProps extends LabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number | string;
}

const CustomLabel: React.FC<CustomLabelProps> = (props) => {
  const isDarkMode = useCurrentTheme();
  const { x = 0, y = 0, value, width = 0 } = props;
  const padding = 4;
  const rectWidth = 30;
  const rectHeight = 30;

  return (
    <g>
      <rect
        x={x + width / 2 - rectWidth / 2}
        y={y - rectHeight - padding}
        width={rectWidth}
        height={rectHeight}
        fill={isDarkMode ? "#fff" : "#000"}
        rx="4"
      />
      <text
        x={x + width / 2}
        y={y - rectHeight / 2 - padding}
        fill={isDarkMode ? "#000" : "#fff"}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
      >
        {value}
      </text>
    </g>
  );
};

interface GraphProps {
  data: DataType;
  className: string
}

const Graph: React.FC<GraphProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 10, bottom: 60, left: -30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
            stroke="#ccc"
          />
          <YAxis stroke="#ccc" />

          <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList 
              dataKey="value" 
              position="top" 
              content={<CustomLabel />} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;