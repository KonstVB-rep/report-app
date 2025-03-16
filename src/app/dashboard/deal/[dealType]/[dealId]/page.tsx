import MultipleSelector, { Option } from "@/components/multi-selector";
import { ProjectResponse } from "@/entities/project/types";
import React from "react";

const DealType = {
  PROJECT: "Проект",
  RETAIL: "Розница",
};

const OPTIONS: Option[] = [
  { label: 'nextjs', value: 'nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember', disable: true },
  { label: 'Gatsby', value: 'gatsby', disable: true },
  { label: 'Astro', value: 'astro' },
];

const project: ProjectResponse = {
  id: "cuid123456789",
  userId: "user123",
  type: "PROJECT", // Предполагая, что DealType — это enum
  dateRequest: new Date("2024-03-16T12:00:00Z"),
  nameObject: "Новый жилой комплекс 'Небесной город', г. Москва",
  nameDeal: "Сделка по строительству",
  direction: "Поставка оборудования", // Предполагая, что DirectionProject — это enum
  deliveryType: "Турникет", // Предполагая, что DeliveryProject — это enum
  contact: "Иван Петров",
  phone: "+7 (900) 123-45-67",
  email: "ivan.petrov@example.com",
  delta: 10000.5, // Decimal будет представлено числом
  comments: "Необходимо уточнить сроки поставки.",
  plannedDateConnection: new Date("2024-06-01T12:00:00Z"),
  createdAt: new Date(),
  updatedAt: new Date(),
  additionalContact: "Мария Иванова",
  amountCP: "500000.0",
  amountPurchase: "450000.0",
  amountWork: "100000.0",
  projectStatus: "На согласовании", // Предполагая, что StatusProject — это enum
  files: [], // Оставляем пустым, так как это массив объектов File
  user: {
    id: "user123",
    name: "Иван Петров",
    email: "ivan.petrov@example.com",
  }, // Упрощенная версия объекта User
};

const DealPageInfo = async ({
  params,
}: {
  params: Promise<{ dealType: string; dealId: string }>;
}) => {
  const { dealType, dealId } = await params;
  console.log(dealType, dealId, "jjjjjjjjj");
  return (
    <div className="p-4">
      <div>
        <h1>Название объекта: {project.nameObject}</h1>

        <div className="border p-4">
          <p>Дата запроса: {project.dateRequest.toLocaleDateString()}</p>
          <p>Название сделки: {project.nameDeal}</p>
          <p>Тип сделки: {DealType[project.type]}</p>
        </div>
        <div className="border p-4">
          <p>Направление: {project.direction}</p>
          <p>Тип поставки: {project.deliveryType}</p>
        </div>
        <div className="border p-4">
          <p>Контакт: {project.contact}</p>
          <p>Телефон: {project.phone}</p>
          <p>Email: {project.email}</p>
          <p>Дополнительный контакт: {project.additionalContact}</p>
        </div>
        <div className="border p-4">
          <p>Дельта: {project.delta}</p>
          <p>Сумма КП: {project.amountCP} </p>
          <p>Сумма закупки: {project.amountPurchase} </p>
          <p>Сумма работы: {project.amountWork} </p>
        </div>
        <div className="border p-4">
          <p>Комментарии: {project.comments}</p>
          <p> Дата создания: {project.createdAt.toLocaleDateString()}</p>
        </div>
      </div>
      <MultipleSelector
        defaultOptions={OPTIONS}
        hidePlaceholderWhenSelected
        placeholder="Select frameworks you like..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
};

export default DealPageInfo;
