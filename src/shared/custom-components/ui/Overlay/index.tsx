import { createPortal } from "react-dom"

export const OverlayLocal = ({
  className = "",
  isPending,
}: {
  className?: string
  isPending: boolean
}) => {
  if (!isPending) return null
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: this overlay he must be div
    <div
      className={`absolute inset-0 z-1000 flex items-center justify-center bg-black/20 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      style={{
        pointerEvents: "auto", // <- важно: блокирует взаимодействие с подложкой
      }}
    />
  )
}

const Overlay = ({ className = "", isPending }: { className?: string; isPending: boolean }) => {
  if (!isPending) return null
  return (
    <>
      {createPortal(
        // biome-ignore lint/a11y/noStaticElementInteractions: this overlay he must be div
        <div
          className={`fixed inset-0 z-1000 flex items-center justify-center bg-black/20 ${className}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          style={{
            pointerEvents: "auto", // <- важно: блокирует взаимодействие с подложкой
          }}
        />,
        document.body,
      )}
    </>
  )
}

export default Overlay
