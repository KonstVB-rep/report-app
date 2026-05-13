// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import type { DataOffer } from "../dashboard/offer-constructor/store";

// export default function PrintPage() {
//   const searchParams = useSearchParams();
//   const [data, setData] = useState<DataOffer | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined" && (window as any).__PRINTER_DATA__) {
//       setData((window as any).__PRINTER_DATA__);
//       return;
//     }
//     const rawData = searchParams.get("data");
//     if (rawData) {
//       try {
//         setData(JSON.parse(decodeURIComponent(rawData)));
//       } catch (_e) {
//         console.error("Ошибка парсинга JSON для PDF");
//       }
//     }
//   }, [searchParams]);

//   if (!data)
//     return <div className="p-10 text-center">Загрузка данных КП...</div>;

//   return (
//     <div className="bg-white text-black min-h-screen">
//       {/* 1. ХЕДЕР (Копия из List.tsx) */}
//       <div className="relative py-1 flex items-center justify-end h-40">
//         <img
//           alt="header"
//           className="absolute inset-0 h-full w-full object-cover"
//           src={`${window.location.origin}/for-builder/header-bg.webp`}
//         />
//         <div className="w-[40%] text-[10px] text-left isolate text-white whitespace-pre-wrap pr-4">
//           {`Общество с ограниченной ответственностью "ЭРТЕЛ"\nЮридический адрес:127015, г. Москва, Бумажный проезд, дом 14, строение 1,\nпомещение I, комната 6 ИНН/КПП 7709407790/771401001\nЭлектронный адрес:ertel@ertel.ru Сайт www.ertel.ru\nТел. +7(495) 644-39-76`}
//         </div>
//         <div className="absolute right-2 -bottom-4 bg-white px-4 py-2 border font-bold">
//           {/* Форматируем дату, если она пришла */}
//           {data.date ? new Date(data.date).toLocaleDateString("ru-RU") : "---"}
//         </div>
//       </div>

//       <div className="p-10">
//         {/* 2. ЗАГОЛОВОК КП */}
//         <div className="pt-10 flex gap-2 justify-center items-center mb-10">
//           <p className="text-2xl font-bold uppercase tracking-widest">
//             Коммерческое предложение № {data.number}
//           </p>
//         </div>

//         {/* 3. МАПИНГ ЧАСТЕЙ (Part.tsx) */}
//         {data.parts.map((part) => (
//           <div className="mb-10 page-break-inside-avoid" key={part.id}>
//             <div className="flex my-6 gap-2 justify-start items-center border-t-[4px] border-t-blue-900 border-b-[2px] border-b-black py-2">
//               <p className="text-xl font-bold uppercase tracking-tight">
//                 Раздел: {part.name}
//               </p>
//             </div>

//             {/* 4. СЕКЦИИ И ПОДСЕКЦИИ */}
//             {part.sections.map((section) => (
//               <div className="mb-6" key={section.id}>
//                 {section.subSections.map((sub) => (
//                   <div className="mb-4" key={sub.id}>
//                     {/* Синий заголовок подраздела */}
//                     <div className="w-full bg-[#1c398e] text-white font-bold p-2 mb-2 uppercase text-sm">
//                       {sub.name || "Наименование подраздела"}
//                     </div>

//                     {/* ТАБЛИЦА (Аналог TableBody) */}
//                     <table className="w-full border-collapse">
//                       <thead>
//                         <tr className="border-b-2 border-black">
//                           <th className="text-left p-2 text-xs uppercase">
//                             Наименование
//                           </th>
//                           <th className="text-left p-2 text-xs uppercase">
//                             описание
//                           </th>
//                           <th className="text-center p-2 text-xs uppercase w-24">
//                             Цена
//                           </th>
//                           <th className="text-center p-2 text-xs uppercase w-16">
//                             Кол-во
//                           </th>
//                           <th className="text-right p-2 text-xs uppercase w-32">
//                             Итого
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {sub.rows.map((row: DataRow) => (
//                           <tr
//                             className="border-b border-gray-200 break-inside-avoid"
//                             key={row.id}
//                           >
//                             <td className="p-2 align-top">
//                               <div className="font-bold text-sm">
//                                 {row.name}
//                               </div>
//                               <div className="text-xs text-gray-600 mt-1">
//                                 {row.description}
//                               </div>
//                               {/* КАРТИНКА ТОВАРА (Base64) */}
//                               {row.image && (
//                                 <img
//                                   alt="item"
//                                   className="h-32 w-auto mt-2 rounded border"
//                                   src={row.image}
//                                 />
//                               )}
//                             </td>
//                             <td className="p-2 text-center align-top text-sm">
//                               {row.price.toLocaleString()}
//                             </td>
//                             <td className="p-2 text-center align-top text-sm">
//                               {row.count}
//                             </td>
//                             <td className="p-2 text-right align-top font-bold text-sm">
//                               {row.totalPrice.toLocaleString()}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       <style global jsx>{`
//         @media print {
//           @page {
//             size: A4;
//             margin: 0;
//           }
//           body {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
//           .page-break-inside-avoid {
//             page-break-inside: avoid;
//           }
//         }
//         .a4-preview {
//           width: 210mm;
//           background: white;
//           margin: 0 auto;
//         }
//       `}</style>
//     </div>
//   );
// }
