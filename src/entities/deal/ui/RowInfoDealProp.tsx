import ValueSpan from "@/feature/deals/ui/ValueSpan"

const RowInfoDealProp = ({
  label,
  value,
  direction = "row",
}: {
  label: string
  value: string | undefined
  direction?: "row" | "column"
}) => {
  if (!value) {
    return null
  }
  return (
    <p
      className={`${direction === "column" ? "flex flex-col" : "items-center flex flex-wrap"} gap-2`}
    >
      <span className="text-sm first-letter:capitalize p-2 prop-deal-value dark:font-light">
        {label}
      </span>

      <ValueSpan>{value}</ValueSpan>
    </p>
  )
}

export default RowInfoDealProp
