import { flexRender, type Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  type DataPart,
  type OfferTableItem,
  removePart,
  updatePartTitle,
} from "../store";
import InputTitle from "./InputTitle";
import SelectedItem from "./SelectedItem";
import PartSection from "./PartSection";

const Part = ({
  table,
  columnSizeVars,
  dataPart,
  partId,
}: {
  table: Table<OfferTableItem>;
  columnSizeVars: { [key: string]: number };
  dataPart: DataPart;
  partId: string;
}) => {
  return (
    <div className="relative px-10">
      <div className="relative w-full overflow-y-auto min-w-7xl">
        <div className="flex gap-2 justify-start items-center border-t-[4px] border-t-blue-900 border-b-[2px] border-b-black mb-3">
          <p className="text-xl font-bold">Раздел</p>
          <div className="relative flex-1">
            <InputTitle
              className="text-xl! min-h-12! p-2 my-2 flex-1 pr-20"
              defaultTitle={dataPart?.name || ""}
              updateTitleAction={(title) => updatePartTitle(partId, title)}
            />
            <SelectedItem
              className="absolute top-1/2 transform -translate-y-1/2 right-14"
              partId={partId}
            />
            <Button
              className="absolute top-1/2 transform -translate-y-1/2 right-2"
              onClick={() => removePart(partId)}
              size="icon"
              variant="destructive"
            >
              <X />
            </Button>
          </div>
        </div>
        <div
          className="w-full grid border-separate border-spacing-0 border border-border"
          style={{
            ...columnSizeVars,
            width: table.getTotalSize(),
          }}
        >
          <div className=" bg-white dark:bg-zinc-800 rounded-t-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <div className="flex w-fit" key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <div
                    className={cn(
                      "p-2! border-zinc-600 border border-solid relative h-auto",
                      {
                        "rounded-tr-sm":
                          index === headerGroup.headers.length - 1,
                        "rounded-tl-sm": index === 0,
                      },
                    )}
                    key={header.id}
                    style={{
                      width: `calc(var(--header-${header?.id}-size) * 1px)`,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "grid content-between justify-items-center gap-1 h-full text-primary px-1 py-2",
                          // header.column.getCanSort() &&
                          //   "cursor-pointer select-none",
                        )}
                        // onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="text-wrap-pretty text-xs font-semibold first-letter:capitalize text-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      </div>
                    )}
                    {header.column.getCanResize() && (
                      <Button
                        className={cn(
                          "resizer w-1 h-full p-0",
                          header.column.getIsResizing() && "isResizing",
                        )}
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {dataPart?.sections.map((section) => (
            <PartSection
              key={section.id}
              partId={partId}
              section={section}
              table={table}
            />
          ))}
        </div>
        {/* <div className="absolute top-0 left-0 a4 border-dashed border-2 border-white" /> */}
      </div>
    </div>
  );
};

export default Part;
