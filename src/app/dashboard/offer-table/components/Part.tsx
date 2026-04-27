import { flexRender, type Table } from "@tanstack/react-table"
import PartSection from "@/app/dashboard/offer-table/components/PartSection"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { type DataPart, type OfferTableItem, updatePartTitle } from "../store"
import InputTitle from "./InputTitle"

// // const canHiddenColumns = ["purchasePrice", "purchaseAmount", "delta"] as const

// const storageKey = "offer-table";

// const colsListNotHidden = [
//   "name",
//   "description",
//   "price",
//   "count",
//   "totalPrice",
// ];

const Part = ({
  table,
  columnSizeVars,
  dataPart,
  partId,
  columnSizing,
  columnVisibility,
}: {
  table: Table<OfferTableItem>
  columnSizeVars: { [key: string]: number }
  dataPart: DataPart
  partId: string
  columnSizing: { [key: string]: number }
  columnVisibility: { [key: string]: boolean }
}) => {
  return (
    <div className="h-screen overflow-y-auto relative p-10">
      <div></div>

      <div className="relative w-full overflow-auto">
        <div className="flex gap-2 justify-start items-center border-t-[4px] border-t-blue-900 border-b-[2px] border-b-black">
          <p className="text-xl font-bold">Раздел</p>
          <InputTitle
            className="text-xl! h-10!"
            defaultTitle={dataPart?.name || ""}
            updateTitleAction={(title) => updatePartTitle(partId, title)}
          />
        </div>
        <div
          className="w-full grid border-separate border-spacing-0 border border-border"
          style={{
            ...columnSizeVars,
            width: table.getTotalSize(),
          }}
        >
          {/* <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 rounded-t-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <div className="flex" key={headerGroup.id}>
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
                          "resizer",
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
          </div> */}
          <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 rounded-t-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <div className="flex w-fit" key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <div
                    className={cn("p-2! border-zinc-600 border border-solid relative h-auto", {
                      "rounded-tr-sm": index === headerGroup.headers.length - 1,
                      "rounded-tl-sm": index === 0,
                    })}
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
                          {flexRender(header.column.columnDef.header, header.getContext())}
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
              columnSizing={columnSizing}
              columnVisibility={columnVisibility}
              key={section.id}
              partId={partId}
              section={section}
              table={table}
            />
            // <OfferSubSection
            //   data={section.subSections}
            //   key={section.id}
            //   partId={partId}
            //   sectionId={section.id}
            //   table={table}
            // />
          ))}
          {/* <MemoizedTableBody
                table={table}
                columnVisibility={columnVisibility}
                columnSizing={columnSizing}
                dataTable={dataTable}
              />
              <TableBodyOffer table={table} />
              <TableFooterOffer table={table} /> */}
        </div>
        {/* <div className="absolute top-0 left-0 a4 border-dashed border-2 border-white" /> */}
      </div>
    </div>
  )
}

export default Part
