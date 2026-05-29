import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { flexRender, type Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import type { DragHandleProps } from "../lib/types"
import {
  type DataPart,
  type OfferTableItem,
  removePart,
  selectParts,
  updatePartTitle,
  useOfferStoreTable,
} from "../store"
import ButtonDndGrab from "./ButtonDndGrab"
import InputTitle from "./InputTitle"
import PartSection from "./PartSection"
import SelectedItem from "./SelectedItem"

const Part = ({
  table,
  columnSizeVars,
  dataPart,
  partId,
  partIndex,
  dragHandleProps,
}: {
  table: Table<OfferTableItem>
  columnSizeVars: { [key: string]: number }
  dataPart: DataPart
  partId: string
  partIndex: number
  dragHandleProps: DragHandleProps
}) => {
  const title = dataPart.name || ""
  const orderNumber = `${partIndex + 1}. `

  const data = useOfferStoreTable(selectParts)

  return (
    <div className="relative px-10 w-full overflow-y-auto min-w-7xl">
      <div className="relative">
        <div className="flex gap-2 justify-start items-center border-t-[4px] border-t-[#0070C0] border-b-[2px] border-b-black mb-3">
          {data.length > 1 && <ButtonDndGrab dragHandleProps={dragHandleProps} />}
          <p className="text-xl font-bold">Раздел</p>
          <div className="relative flex-1">
            <div className="flex gap-2 items-center text-xl">
              <span>{orderNumber}</span>
              <InputTitle
                className="text-xl! min-h-12! p-2 my-2 flex-1 pr-20"
                defaultTitle={title}
                updateTitleAction={(title) => updatePartTitle(partId, title, orderNumber)}
              />
            </div>
            <SelectedItem
              className="absolute top-1/2 transform -translate-y-1/2 right-14"
              partId={partId}
            />
            <Button
              className="absolute top-1/2 transform -translate-y-1/2 right-2 text-white"
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
                          "grid justify-items-center gap-1 h-full text-primary px-1 py-2 content-center",
                        )}
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

          <SortableContext
            items={dataPart?.sections.map((s) => s.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {dataPart?.sections.map((section, sectionIndex) => (
                <PartSection
                  key={section.id}
                  partId={partId}
                  partIndex={partIndex}
                  section={section}
                  sectionIndex={sectionIndex}
                  table={table}
                />
              ))}
            </div>
          </SortableContext>
        </div>
        {/* <div className="absolute top-0 left-0 a4 border-dashed border-2 border-white" /> */}
      </div>
    </div>
  )
}

export default Part
