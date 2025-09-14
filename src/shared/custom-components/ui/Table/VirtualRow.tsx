import { Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import useHydrateDataTable from "@/shared/hooks/useHydrateDataTable";

import { SkeletonTable } from "../Skeletons/SkeletonTable";

interface Props<T> {
  rows: Row<T>[];
  virtualItems: VirtualItem[];
  renderRow: (props: {
    row: Row<T>;
    virtualRow: VirtualItem;
  }) => React.ReactNode;
}

const VirtualRow = <T,>({ rows, virtualItems, renderRow }: Props<T>) => {
  const isHydrating = useHydrateDataTable();
  return (
    <>
      {isHydrating && <SkeletonTable />}
      {rows.length > 0 &&
        !isHydrating &&
        virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index];
          return renderRow({
            row,
            virtualRow,
          });
        })}
    </>
  );
};

export default VirtualRow;
