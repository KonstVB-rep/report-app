import { Column } from "@tanstack/react-table";
import DebouncedInput from "../DebouncedInput";

const FilterQuery = ({ column }: { column: Column<unknown, unknown> }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value: string | number) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-36 rounded border shadow"
    />
  );
};

export default FilterQuery;
