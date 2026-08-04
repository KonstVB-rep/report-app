import { X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"

export const SearchResult = ({
  isOpen,
  onClose,
  renderContent,
}: {
  isOpen: boolean
  onClose: () => void
  renderContent: () => React.ReactNode
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
        <DialogContent className="sm:max-w-[min(900px,95vw)] rounded-2xl p-0 border-border/60 shadow-2xl max-h-[80dvh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b bg-background/50 backdrop-blur-sm shrink-0">
            <DialogTitle className="text-lg font-semibold">Результаты поиска</DialogTitle>
            <Button className="rounded-full" onClick={onClose} size="icon" variant={"ghost"}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-5 flex-1 min-h-0 bg-muted/10">{renderContent()}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DrawerContent className="rounded-t-2xl px-0 flex flex-col data-[vaul-drawer-direction=bottom]:max-h-[90dvh]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 my-3 shrink-0" />

        <DrawerHeader className="text-left px-5 pt-1 pb-3 shrink-0 border-b">
          <DrawerTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Поиск организации
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 p-4 min-h-0 bg-muted/10">{renderContent()}</div>
      </DrawerContent>
    </Drawer>
  )
}
