import ValueSpan from "./ValueSpan"

type Props = {
  data: {
    label: string
    value: string
  }[]
}

const LabelValue = ({ value }: { value: string }) => {
  return (
    <span className="min-h-10 min-w-max w-full text-sm first-letter:capitalize p-2 prop-deal-value dark:font-light">
      {value}
    </span>
  )
}

const FinanceInfo = ({ data }: Props) => {
  return (
    <div className="flex-item-contact flex flex-col">
      <div className="flex gap-2">
        <div className="h-full w-max grid gap-2">
          {data.map((item) => {
            return <LabelValue key={item.label} value={item.label} />
          })}
        </div>
        <div className="h-full grid w-full gap-2">
          {data.map((item) => {
            return <ValueSpan key={item.label}>{item.value}</ValueSpan>
          })}
        </div>
      </div>
    </div>
  )
}

export default FinanceInfo
