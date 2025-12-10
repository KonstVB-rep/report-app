import { createPortal } from "react-dom"

const ExitAppScreen = () => {
  return (
    <>
      {createPortal(
        <div className="absolute inset-0 h-full w-full min-h-screen grid place-items-center z-50 bg-black">
          <p className="text-2xl sm:text-4xl text-white">Завершение сессии...</p>
        </div>,
        document.body,
      )}
    </>
  )
}

export default ExitAppScreen
