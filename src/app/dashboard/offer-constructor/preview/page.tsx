"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import MyDocument from "./MyDocument"
import { get } from "idb-keyval"

// Импортируем только для браузера
const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Загрузка превью...</p>,
})

const PreviewPDF = () => {
  //   const data = useOfferStore(selectParts);

  //   const [previewData, setPreviewData] = useState<any>(null);

  //   useEffect(() => {
  //     // 1. Настраиваемся на ту же волну
  //     const channel = new BroadcastChannel("pdf_preview_data");

  //     // 2. Кричим в рацию: "Я открылась, давай данные!"
  //     channel.postMessage("READY_TO_RECEIVE");

  //     // 3. Ловим данные
  //     channel.onmessage = (event) => {
  //       setPreviewData(event.data);
  //       channel.close(); // Можно закрыть после получения
  //     };

  //     return () => channel.close();
  //   }, []);

  //   if (!previewData) {
  //     return <div className="p-20 text-center">Загрузка данных для PDF...</div>;
  //   }

  const [previewData, setPreviewData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      // Достаем из базы
      const payload = await get("pdf_preview_payload")
      console.log(payload, "payload")
      if (payload) {
        setPreviewData(payload)
      }
    }

    loadData()
  }, [])

  if (!previewData) return <div>Загрузка из базы данных...</div>

  console.log(previewData, "previewData")
  return (
    <div className="h-screen w-full">
      <PDFViewer
        style={{ width: "100%", height: "100%" }}
        key={previewData.dataParts.number || "ready"}
      >
        <MyDocument data={previewData.dataParts} columnSizing={previewData.columnSizing} />
      </PDFViewer>
    </div>
  )
}

export default PreviewPDF
