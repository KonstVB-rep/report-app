module.exports = {
  "semi": true,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
    plugins: ["prettier-plugin-tailwindcss","@trivago/prettier-plugin-sort-imports"],
    importOrder: [
      "^react", // React первым
      "^next", // Потом Next.js
      "^[a-z]", // Внешние библиотеки (axios, lodash)
      "^@/hooks", // Потом хуки
      "^@/", // Абсолютные пути (например, @/components)
      "./provider", // Потом провайдеры
      "^[./]", // Относительные пути (./ и ../)
      "^.+\\.s?css$", // CSS файлы в конце
    ],
    importOrderSeparation: true, // Разделять группы пустыми строками
    importOrderSortSpecifiers: true, // Сортировать {} по алфавиту
    importOrderCaseInsensitive: true, // Игнорировать регистр при сортировке
  };
  