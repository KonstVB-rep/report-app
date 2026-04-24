"use client"
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { DataOffer } from "../store"

// // 1. Регистрация шрифтов (Убедись, что файлы .ttf лежат в public/fonts/)
Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: 700 },
  ],
})

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 12,
//     fontFamily: "Roboto",
//     backgroundColor: "#FFFFFF",
//   },

//   // ХЕДЕР
//   headerContainer: {
//     position: "relative",
//     height: 80,
//     overflow: "hidden",
//     marginBottom: 20,
//   },
//   headerBg: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: 80,
//     objectFit: "cover",
//     objectPosition: "center",
//   },
//   addressText: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     width: "40%",
//     fontSize: 8,
//     color: "#FFFFFF",
//     textAlign: "left",
//     lineHeight: 1.2,
//   },

//   title: {
//     fontSize: 22,
//     marginBottom: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     textTransform: "uppercase",
//   },

//   // СТРУКТУРА
//   section: { marginBottom: 15 },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textTransform: "uppercase",

//     // ВЕРХНЯЯ ГРАНИЦА
//     borderTopWidth: 4, // Толщина как у твоего несостоявшегося boxShadow
//     borderTopColor: "#1c398e",
//     borderTopStyle: "solid",

//     // НИЖНЯЯ ГРАНИЦА (если нужна, как в твоем коде было)
//     borderBottomWidth: 2,
//     borderBottomColor: "#1c398e",

//     paddingTop: 8,
//     paddingBottom: 4,
//     marginBottom: 8,
//     color: "#000000",
//   },
//   subSectionTitle: {
//     backgroundColor: "#1c398e",
//     color: "white",
//     padding: 6,
//     fontSize: 10,
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },

//   // ТАБЛИЦА
//   table: {
//     display: "flex",
//     width: "100%",
//     // borderWidth: 1,
//     // borderColor: "#000",
//   },
//   tableHeader: {
//     display: "flex",
//     flexDirection: "row",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottom: "1px solid black",
//     borderRight: "1px solid black",
//     // width: "fit-content",
//     minHeight: 25,
//     alignItems: "stretch", // Чтобы все колонки в строке были одной высоты
//   },
//   tableColHeader: {
//     // backgroundColor: "#f0f0f0",
//   },
//   tableCol: {
//     padding: 5,
//     borderLeft: "1px solid black",
//     // borderRightWidth: 1,
//     // borderColor: "#000",
//   },
//   tableColLast: {
//     padding: 5,
//   },

//   // ТЕКСТ В ЯЧЕЙКАХ
//   cellText: { fontSize: 9 },
//   cellBold: { fontSize: 9, fontWeight: "bold" },
//   image: {
//     width: "100%",
//     marginTop: 5,
//     borderRadius: 2,
//     maxHeight: 120, // Ограничиваем высоту, чтобы не выталкивало строки
//     objectFit: "contain",
//   },
// });

// const MyDocument = ({
//   data,
//   columnSizing,
// }: {
//   data: DataOffer;
//   columnSizing: {
//     name: number;
//     description: number;
//     price: number;
//     count: number;
//     totalPrice: number;
//   };
// }) => {
//   console.log("ВХОД В MyDocument, data:", data);

//   // 2. Используй опциональную цепочку (?.) и дефолтные значения (0)
//   const totalPx =
//     (columnSizing?.name || 200) +
//     (columnSizing?.description || 250) +
//     (columnSizing?.price || 100) +
//     (columnSizing?.count || 60) +
//     (columnSizing?.totalPrice || 100);

//   const getW = (px: number | undefined, def: number) => {
//     // Безопасный расчет процентов
//     const currentPx = px || def;
//     return `${(currentPx / (totalPx || 1)) * 100}%`;
//   };

//   const widths = {
//     name: getW(columnSizing.name, 200),
//     description: getW(columnSizing.description, 250),
//     price: getW(columnSizing.price, 100),
//     count: getW(columnSizing.count, 60),
//     totalPrice: getW(columnSizing.totalPrice, 100),
//   };

//   console.log(data, "data");

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.headerContainer}>
//           <Image src="/for-builder/header-img.png" style={styles.headerBg} />
//           <Text style={styles.addressText}>
//             {`Общество с ограниченной ответственностью "ЭРТЕЛ"\nЮридический адрес: 127015, г. Москва, Бумажный проезд, дом 14, строение 1,\nпомещение I, комната 6 ИНН/КПП 7709407790/771401001\nЭлектронный адрес: ertel@ertel.ru Сайт www.ertel.ru\nТел. +7(495) 644-39-76`}
//           </Text>
//         </View>

//         <Text style={styles.title}>
//           Коммерческое предложение № {data.number}
//         </Text>

//         {data.parts.map((part) => (
//           <View key={part.id} style={styles.section}>
//             {/* minPresenceAhead гарантирует, что заголовок не останется один внизу страницы */}
//             <Text
//               style={styles.sectionTitle}
//               // minPresenceAhead={20}
//             >
//               Раздел: {part.name || "---"}
//             </Text>

//             {part.sections.map((section) => (
//               <View key={section.id}>
//                 {section.subSections.map((sub) => (
//                   <View key={sub.id} style={{ marginBottom: 15 }}>
//                     <View style={styles.table}>
//                       {/* ШАПКА ТАБЛИЦЫ - будет повторяться на новых страницах благодаря fixed */}
//                       <View
//                         style={[styles.tableHeader, styles.tableColHeader]}
//                         fixed
//                       >
//                         <View
//                           style={[
//                             {
//                               width: widths.name,
//                               display: "flex",
//                               textAlign: "center",
//                               justifyContent: "center",
//                             },
//                           ]}
//                         >
//                           <Text style={[styles.cellBold]}>Наименование</Text>
//                         </View>
//                         <View
//                           style={[
//                             {
//                               width: widths.description,
//                               display: "flex",
//                               textAlign: "center",
//                               justifyContent: "center",
//                             },
//                           ]}
//                         >
//                           <Text style={[styles.cellBold]}>Описание</Text>
//                         </View>
//                         <View
//                           style={[
//                             {
//                               width: widths.price,
//                               display: "flex",
//                               textAlign: "center",
//                               justifyContent: "center",
//                             },
//                           ]}
//                         >
//                           <Text style={[styles.cellBold]}>Цена</Text>
//                         </View>
//                         <View
//                           style={[
//                             {
//                               width: widths.count,
//                               display: "flex",
//                               textAlign: "center",
//                               justifyContent: "center",
//                             },
//                           ]}
//                         >
//                           <Text style={[styles.cellBold]}>Кол-во</Text>
//                         </View>
//                         <View
//                           style={[
//                             styles.tableColLast,
//                             {
//                               width: widths.totalPrice,
//                               display: "flex",
//                               textAlign: "center",
//                               justifyContent: "center",
//                             },
//                           ]}
//                         >
//                           <Text
//                             style={[
//                               styles.cellBold,
//                               { textAlign: "center", justifyContent: "center" },
//                             ]}
//                           >
//                             Итого
//                           </Text>
//                         </View>
//                       </View>
//                       <Text
//                         style={styles.subSectionTitle}
//                         minPresenceAhead={50}
//                       >
//                         {sub.name || "Подраздел"}
//                       </Text>
//                       {/* СТРОКИ ТАБЛИЦЫ */}
//                       {sub.rows.map((row: DataRow) => (
//                         <View
//                           key={row.id}
//                           style={[
//                             styles.tableRow,
//                             { borderTop: "1px solid black" },
//                           ]}
//                           wrap={false}
//                         >
//                           <View
//                             style={[styles.tableCol, { width: widths.name }]}
//                           >
//                             <Text style={styles.cellBold}>{row.name}</Text>
//                             {row.image && (
//                               <Image
//                                 src={row.image}
//                                 style={styles.image}
//                                 cache={false}
//                               />
//                             )}
//                           </View>
//                           <View
//                             style={[
//                               styles.tableCol,
//                               { width: widths.description },
//                             ]}
//                           >
//                             <Text style={styles.cellText}>
//                               {row.description}
//                             </Text>
//                           </View>
//                           <View
//                             style={[styles.tableCol, { width: widths.price }]}
//                           >
//                             <Text
//                               style={[styles.cellText, { textAlign: "center" }]}
//                             >
//                               {row.price?.toLocaleString()}
//                             </Text>
//                           </View>
//                           <View
//                             style={[styles.tableCol, { width: widths.count }]}
//                           >
//                             <Text
//                               style={[styles.cellText, { textAlign: "center" }]}
//                             >
//                               {row.count}
//                             </Text>
//                           </View>
//                           <View
//                             style={[
//                               styles.tableCol,
//                               { width: widths.totalPrice },
//                             ]}
//                           >
//                             <Text
//                               style={[styles.cellBold, { textAlign: "right" }]}
//                             >
//                               {row.totalPrice?.toLocaleString()}
//                             </Text>
//                           </View>
//                         </View>
//                       ))}
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             ))}
//           </View>
//         ))}
//       </Page>
//     </Document>
//   );
// };

// export default MyDocument;
// ("use client");
// import {
//   Document,
//   Font,
//   Image,
//   Page,
//   StyleSheet,
//   Text,
//   View,
// } from "@react-pdf/renderer";
// import { DataOffer, DataRow } from "../store";

// 1. Регистрация шрифтов (Должны лежать в public/fonts/)
// Font.register({
//   family: "Roboto",
//   fonts: [
//     { src: "/fonts/Roboto-Regular.ttf", fontWeight: 400 },
//     { src: "/fonts/Roboto-Bold.ttf", fontWeight: 700 },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: "#FFFFFF",
  },

  // ХЕДЕР КОМПАНИИ (Только на 1-й странице)
  headerContainer: {
    position: "relative",
    height: 80,
    overflow: "hidden",
    marginBottom: 20,
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 80,
    objectFit: "cover",
  },
  addressText: {
    position: "absolute",
    top: 10,
    right: 10,
    width: "40%",
    fontSize: 8,
    color: "#FFFFFF",
    textAlign: "left",
    lineHeight: 1.2,
  },

  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },

  // СТРУКТУРА РАЗДЕЛА
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    // ТВОЯ ВЕРХНЯЯ ГРАНИЦА (вместо boxShadow)
    borderTopWidth: 4,
    borderTopColor: "#1c398e",
    borderTopStyle: "solid",
    // НИЖНЯЯ ГРАНИЦА
    borderBottomWidth: 2,
    borderBottomColor: "#1c398e",
    paddingTop: 8,
    paddingBottom: 4,
    marginBottom: 8,
  },
  subSectionTitle: {
    backgroundColor: "#1c398e",
    color: "white",
    padding: 6,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 0,
  },

  // ТАБЛИЦА
  table: {
    display: "flex",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  // СТИЛИ ШАПКИ (ИДЕНТИЧНО ТВОЕМУ HTML)
  tableColHeader: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
  },
  headerCell: {
    padding: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
    color: "#000000",
  },

  // СТИЛИ СТРОК С ДАННЫМИ
  dataRow: {
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableCol: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000000",
  },
  tableColLast: {
    padding: 5,
  },
  cellText: { fontSize: 9 },
  cellBold: { fontSize: 9, fontWeight: "bold" },
  image: {
    width: "100%",
    marginTop: 5,
    borderRadius: 2,
    maxHeight: 100, // Чтобы не разрывало страницу
    objectFit: "contain",
  },
})

const MyDocument = ({ data, columnSizing }: { data: DataOffer; columnSizing: any }) => {
  // Предохранитель
  if (!data || !data.parts) return null

  // Расчет ширин колонок
  const totalPx =
    (columnSizing?.name || 200) +
    (columnSizing?.description || 250) +
    (columnSizing?.price || 100) +
    (columnSizing?.count || 60) +
    (columnSizing?.totalPrice || 100)

  const getW = (px: number | undefined, def: number) => {
    return `${((px || def) / totalPx) * 100}%`
  }

  const widths = {
    name: getW(columnSizing.name, 200),
    description: getW(columnSizing.description, 250),
    price: getW(columnSizing.price, 100),
    count: getW(columnSizing.count, 60),
    totalPrice: getW(columnSizing.totalPrice, 100),
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ХЕДЕР */}
        <View style={styles.headerContainer}>
          <Image src="/for-builder/header-img.png" style={styles.headerBg} />
          <Text style={styles.addressText}>
            {`Общество с ограниченной ответственностью "ЭРТЕЛ"\nЮридический адрес: 127015, г. Москва, Бумажный проезд, дом 14, строение 1,\nпомещение I, комната 6 ИНН/КПП 7709407790/771401001\nЭлектронный адрес: ertel@ertel.ru Сайт www.ertel.ru\nТел. +7(495) 644-39-76`}
          </Text>
        </View>

        <Text style={styles.title}>Коммерческое предложение № {data.number}</Text>

        {data.parts.map((part) => (
          <View key={part.id} style={styles.section}>
            {/* Заголовок раздела (разрыв разрешен по умолчанию) */}
            <Text style={styles.sectionTitle}>Раздел: {part.name || "---"}</Text>

            {part.sections.map((section) => (
              <View key={section.id}>
                {section.subSections.map((sub) => (
                  <View key={sub.id} style={{ marginBottom: 15 }}>
                    {/* Заголовок подраздела */}

                    <View style={[styles.table]}>
                      {/* ШАПКА ТАБЛИЦЫ (БЕЗ ГРАНИЦ) */}
                      <View
                        style={[
                          styles.tableRow,
                          styles.tableColHeader,
                          { borderBottom: "1px solid black" },
                        ]}
                        fixed
                      >
                        <View style={[styles.headerCell, { width: widths.name }]}>
                          <Text style={styles.headerText}>Наименование</Text>
                        </View>
                        <View style={[styles.headerCell, { width: widths.description }]}>
                          <Text style={styles.headerText}>Описание</Text>
                        </View>
                        <View style={[styles.headerCell, { width: widths.price }]}>
                          <Text style={styles.headerText}>Цена</Text>
                        </View>
                        <View style={[styles.headerCell, { width: widths.count }]}>
                          <Text style={styles.headerText}>Кол-во</Text>
                        </View>
                        <View style={[styles.headerCell, { width: widths.totalPrice }]}>
                          <Text style={styles.headerText}>Итого</Text>
                        </View>
                      </View>

                      <Text style={styles.subSectionTitle}>{sub.name || "Подраздел"}</Text>

                      {/* СТРОКИ ТАБЛИЦЫ (wrap={false} только тут!) */}
                      {sub.rows.map((row) => (
                        <View key={row.id} style={[styles.tableRow, styles.dataRow]} wrap={false}>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                width: widths.name,
                                borderLeft: "1px solid black",
                              },
                            ]}
                          >
                            <Text style={[styles.cellBold]}>{row.name}</Text>
                            {row.image && <Image src={row.image} style={styles.image} />}
                          </View>
                          <View style={[styles.tableCol, { width: widths.description }]}>
                            <Text style={styles.cellText}>{row.description}</Text>
                          </View>
                          <View
                            style={[styles.tableCol, { width: widths.price, textAlign: "center" }]}
                          >
                            <Text style={styles.cellText}>{row.price?.toLocaleString()}</Text>
                          </View>
                          <View
                            style={[styles.tableCol, { width: widths.count, textAlign: "center" }]}
                          >
                            <Text style={styles.cellText}>{row.count}</Text>
                          </View>
                          <View
                            style={[
                              styles.tableColLast,
                              {
                                width: widths.totalPrice,
                                borderRight: "1px solid black",
                              },
                            ]}
                          >
                            <Text style={styles.cellBold}>{row.totalPrice?.toLocaleString()}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  )
}

export default MyDocument
