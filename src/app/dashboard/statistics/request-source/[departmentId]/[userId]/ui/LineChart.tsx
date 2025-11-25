import {
  CartesianGrid,
  type LabelProps,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const CustomizedLabel = ({ x, y, stroke, value }: LabelProps) => {
  return (
    <text dy={-4} fill={stroke} fontSize={10} textAnchor="middle" x={x} y={y}>
      {value}
    </text>
  )
}

const CustomizedAxisTick = ({
  x,
  y,
  payload,
}: {
  x: string
  y: string
  payload: { value: string | number }
}) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={16} fill="#666" textAnchor="end" transform="rotate(-35)" x={0} y={0}>
        {payload.value}
      </text>
    </g>
  )
}

const CustomizedLabelLineChart = ({
  data,
}: {
  data: {
    name: string
    value: number
  }[]
}) => {
  console.log("CustomizedLabelLineChart")
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer
        className="block justify-self-center"
        height="100%"
        minHeight={480}
        minWidth={480}
        width="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 10,
          }}
          style={{
            minWidth: "100%",
            maxHeight: "70vh",
            aspectRatio: 1.618,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={CustomizedAxisTick} />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Line dataKey="value" label={CustomizedLabel} stroke="#8884d8" type="monotone" />
          {/* <Line dataKey="uv" stroke="#82ca9d" type="monotone" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomizedLabelLineChart
