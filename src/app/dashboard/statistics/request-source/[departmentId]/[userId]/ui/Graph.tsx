import type React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  type LabelProps,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { v4 as uuid } from "uuid"
import useCurrentTheme from "@/shared/hooks/useCurrentTheme"
import { COLORS } from "../lib/constants"

type DataType = { name: string; value: number }[]

interface CustomLabelProps extends LabelProps {
  x?: number
  y?: number
  width?: number
  height?: number
  value?: number | string
}

const CustomLabel: React.FC<CustomLabelProps> = (props) => {
  const isDarkMode = useCurrentTheme()
  const { x = 0, y = 0, value, width = 0 } = props
  const padding = 4
  const rectWidth = 26
  const rectHeight = 26

  return (
    <g>
      <rect
        fill={isDarkMode ? "#fff" : "#000"}
        height={rectHeight}
        rx="4"
        width={rectWidth}
        x={x + width / 2 - rectWidth / 2}
        y={y - rectHeight - padding}
      />
      <text
        dominantBaseline="middle"
        fill={isDarkMode ? "#000" : "#fff"}
        fontSize={12}
        textAnchor="middle"
        x={x + width / 2}
        y={y - rectHeight / 2 - padding}
      >
        {value}
      </text>
    </g>
  )
}

interface GraphProps {
  data: DataType
  className: string
}

const Graph: React.FC<GraphProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer height="94%" width="100%">
        <BarChart data={data} margin={{ top: 30, right: 10, bottom: 60, left: -30 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis
            angle={-45}
            dataKey="name"
            height={100}
            interval={0}
            stroke="#ccc"
            textAnchor="end"
          />
          <YAxis stroke="#ccc" />

          <Bar barSize={26} dataKey="value" radius={[1, 1, 0, 0]}>
            {data.map((_, index) => (
              <Cell fill={COLORS[index % COLORS.length]} key={`cell-${uuid()}`} />
            ))}
            <LabelList content={<CustomLabel />} dataKey="value" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Graph
