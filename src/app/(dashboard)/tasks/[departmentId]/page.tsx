"use client";


import { useState } from "react";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetTasksDepartment } from "@/feature/task-manager/hooks/query";
// import { TaskWithUserInfo } from "@/feature/task-manager/types";
import LoadingView from "@/feature/task-manager/ui/LoadingView";
import СreateTaskDialog from "@/feature/task-manager/ui/Modals/СreateTaskDialog";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";

const Kanban = dynamic(
  () => import("@/feature/task-manager/ui/Kanban"),
  { ssr: false, loading: () => <LoadingView /> }
);

// const CalendarTask = dynamic(
//   () => import("@/feature/task-manager/ui/CalendarTask"),
//   { ssr: false, loading: () => <LoadingView /> }
// );

const TaskTable = dynamic(() => import("@/feature/task-manager/ui/TaskTable"), {
  ssr: false,
  loading: () => <LoadingView />,
});


// const mockTasks: TaskWithUserInfo[] = [
//   {
//     id: "task1",
//     title: "Разработка фичи",
//     description: "Создать новую фичу для календаря",
//     taskStatus: "OPEN",
//     taskPriority: "HIGH",
//     assignerId: "user1",
//     executorId: "user2",
//     departmentId: 1,
//     orderTask:1,
//     dueDate: new Date("2025-05-30T17:00:00Z"),
//     startDate: new Date("2025-05-25T09:00:00Z"),
//     createdAt: new Date("2025-05-24T10:00:00Z"),
//     updatedAt: new Date("2025-05-24T10:00:00Z"),

//     assigner: {
//       username: "Алексей Иванов",
//       position: "Тимлид",
//       email: "alexei@ertel.ru"
//     },
//     executor: {
//       username: "Мария Петрова",
//       position: "Frontend Developer",
//       email: "mariya@ertel.ru"
//     }
//   },
//   {
//     id: "task2",
//     title: "Багфиксы в системе уведомлений",
//     description: "Исправить ошибки в рассылке уведомлений",
//     taskStatus: "IN_PROGRESS",
//     taskPriority: "CRITICAL",
//     assignerId: "user3",
//     executorId: "user4",
//     orderTask:1,
//     departmentId: 2,
//     dueDate: new Date("2025-06-05T17:00:00Z"),
//     startDate: new Date("2025-06-01T09:00:00Z"),
//     createdAt: new Date("2025-05-28T11:00:00Z"),
//     updatedAt: new Date("2025-05-29T12:00:00Z"),

//     assigner: {
//       username: "Дмитрий Смирнов",
//       position: "QA Lead",
//       email: "dmitry@ertel.ru"
//     },
//     executor: {
//       username: "Ольга Кузнецова",
//       position: "Backend Developer",
//       email: "olga@ertel.ru"
//     }
//   },
//   {
//     id: "task3",
//     title: "Обновление документации",
//     description: "Добавить недостающие разделы в документацию",
//     taskStatus: "DONE",
//     taskPriority: "MEDIUM",
//     assignerId: "user5",
//     executorId: "user6",
//     orderTask:1,
//     departmentId: 3,
//     dueDate: new Date("2025-06-01T17:00:00Z"),
//     startDate: new Date("2025-05-28T09:00:00Z"),
//     createdAt: new Date("2025-05-27T10:00:00Z"),
//     updatedAt: new Date("2025-05-30T14:00:00Z"),

//     assigner: {
//       username: "Сергей Васильев",
//       position: "Tech Writer",
//       email: "sergey@ertel.ru"
//     },
//     executor: {
//       username: "Елена Новикова",
//       position: "Technical Writer",
//       email: "elena@ertel.ru"
//     }
//   },
//   {
//     id: "task4",
//     title: "Настройка CI/CD",
//     description: "Настроить деплой через GitHub Actions",
//     taskStatus: "CANCELED",
//     taskPriority: "LOW",
//     assignerId: "user7",
//     executorId: "user8",
//     departmentId: 4,
//     orderTask:1,
//     dueDate: new Date("2025-06-10T17:00:00Z"),
//     startDate: new Date("2025-06-05T09:00:00Z"),
//     createdAt: new Date("2025-06-04T10:00:00Z"),
//     updatedAt: new Date("2025-06-07T15:00:00Z"),

//     assigner: {
//       username: "Антон Борисов",
//       position: "DevOps",
//       email: "anton@ertel.ru"
//     },
//     executor: {
//       username: "Владимир Тихонов",
//       position: "System Administrator",
//       email: "vladimir@ertel.ru"
//     }
//   },
//   {
//     id: "task5",
//     title: "Подготовка отчёта по продажам",
//     description: "Собрать данные за месяц и отправить отчёт",
//     taskStatus: "IN_PROGRESS",
//     taskPriority: "MEDIUM",
//     assignerId: "user9",
//     executorId: "user10",
//     orderTask:2,
//     departmentId: 5,
//     dueDate: new Date("2025-06-12T17:00:00Z"),
//     startDate: new Date("2025-06-10T09:00:00Z"),
//     createdAt: new Date("2025-06-09T09:00:00Z"),
//     updatedAt: new Date("2025-06-09T10:00:00Z"),

//     assigner: {
//       username: "Наталья Орлова",
//       position: "Sales Manager",
//       email: "natalia@ertel.ru"
//     },
//     executor: {
//       username: "Виктор Максимов",
//       position: "Junior Sales",
//       email: "victor@ertel.ru"
//     }
//   },
//   {
//     id: "task6",
//     title: "Редизайн главной страницы",
//     description: "Обновить дизайн главной страницы",
//     taskStatus: "IN_PROGRESS",
//     taskPriority: "HIGH",
//     assignerId: "user11",
//     executorId: "user12",
//     orderTask:3,
//     departmentId: 6,
//     dueDate: new Date("2025-06-15T17:00:00Z"),
//     startDate: new Date("2025-06-10T09:00:00Z"),
//     createdAt: new Date("2025-06-10T10:00:00Z"),
//     updatedAt: new Date("2025-06-11T11:00:00Z"),

//     assigner: {
//       username: "Ксения Смирнова",
//       position: "UX/UI Designer",
//       email: "ksenia@ertel.ru"
//     },
//     executor: {
//       username: "Андрей Лебедев",
//       position: "Web Designer",
//       email: "andrey@ertel.ru"
//     }
//   },
//   {
//     id: "task7",
//     title: "Создание рекламной кампании",
//     description: "Запустить новую email-кампанию",
//     taskStatus: "DONE",
//     taskPriority: "MEDIUM",
//     assignerId: "user13",
//     executorId: "user14",
//     orderTask:2,
//     departmentId: 7,
//     dueDate: new Date("2025-06-14T17:00:00Z"),
//     startDate: new Date("2025-06-10T09:00:00Z"),
//     createdAt: new Date("2025-06-08T12:00:00Z"),
//     updatedAt: new Date("2025-06-13T16:00:00Z"),

//     assigner: {
//       username: "Евгений Фёдоров",
//       position: "Marketing Manager",
//       email: "evgeny@ertel.ru"
//     },
//     executor: {
//       username: "Алёна Соколова",
//       position: "Marketing Analyst",
//       email: "alena@ertel.ru"
//     }
//   },
//   {
//     id: "task8",
//     title: "Обучение новой команды",
//     description: "Провести обучение с новыми сотрудниками",
//     taskStatus: "OPEN",
//     taskPriority: "LOW",
//     assignerId: "user15",
//     executorId: "user16",
//     orderTask:2,
//     departmentId: 8,
//     dueDate: new Date("2025-06-20T17:00:00Z"),
//     startDate: new Date("2025-06-15T09:00:00Z"),
//     createdAt: new Date("2025-06-14T11:00:00Z"),
//     updatedAt: new Date("2025-06-14T11:00:00Z"),

//     assigner: {
//       username: "Игорь Комаров",
//       position: "HR Manager",
//       email: "igor@ertel.ru"
//     },
//     executor: {
//       username: "Оксана Дмитриева",
//       position: "Trainee",
//       email: "oksana@ertel.ru"
//     }
//   },
//   {
//     id: "task9",
//     title: "Тестирование новых функций",
//     description: "Протестировать новые модули перед релизом",
//     taskStatus: "IN_PROGRESS",
//     taskPriority: "CRITICAL",
//     assignerId: "user17",
//     executorId: "user18",
//     orderTask:4,
//     departmentId: 9,
//     dueDate: new Date("2025-06-18T17:00:00Z"),
//     startDate: new Date("2025-06-15T09:00:00Z"),
//     createdAt: new Date("2025-06-14T10:00:00Z"),
//     updatedAt: new Date("2025-06-16T12:00:00Z"),

//     assigner: {
//       username: "Максим Горский",
//       position: "QA Engineer",
//       email: "maxim@ertel.ru"
//     },
//     executor: {
//       username: "Татьяна Леонтьева",
//       position: "Senior QA",
//       email: "tatyana@ertel.ru"
//     }
//   },
//   {
//     id: "task10",
//     title: "Поддержка пользователей",
//     description: "Ответить на запросы клиентов",
//     taskStatus: "DONE",
//     taskPriority: "MEDIUM",
//     assignerId: "user19",
//     executorId: "user20",
//     orderTask:3,
//     departmentId: 10,
//     dueDate: new Date("2025-06-15T17:00:00Z"),
//     startDate: new Date("2025-06-10T09:00:00Z"),
//     createdAt: new Date("2025-06-08T14:00:00Z"),
//     updatedAt: new Date("2025-06-14T16:00:00Z"),

//     assigner: {
//       username: "Екатерина Романова",
//       position: "Support Team Lead",
//       email: "ekaterina@ertel.ru"
//     },
//     executor: {
//       username: "Артём Алексеев",
//       position: "Customer Support",
//       email: "artem@ertel.ru"
//     }
//   }
// ];

const view = [
  { id: "table", value: "Таблица" },
  { id: "kanban", value: "Канбан" },
  // { id: "calendar", value: "Календарь" },
] as const;

type ViewType = (typeof view)[number]["id"];

const TasksPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultView = searchParams.get("viewType") || "table";

  const [currentView, setCurrentView] = useState<ViewType>(
    defaultView as ViewType
  );

  const { data } = useGetTasksDepartment();

  const handleViewChange = (value: ViewType) => {
    if (value === currentView) return;
    setCurrentView(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("viewType", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="p-5">
      <h1 className="text-xl py-2">Все задачи</h1>

      <Separator />

      <div className="p-2 flex flex-wrap-reverse justify-between gap-2">
        <div className="flex gap-2">
          {view.map((item) => {
            return (
              <Button
                key={item.id}
                variant="outline"
                onClick={() => handleViewChange(item.id)}
              >
                {item.value}
              </Button>
            );
          })}
        </div>

        <СreateTaskDialog/>

      </div>

      <MotionDivY>
        {currentView === "table" && data && <TaskTable data={data} />}

        {currentView === "kanban" && data && <Kanban data={data} />}

        {/* {currentView === "calendar" && <CalendarTask />} */}
      </MotionDivY>
    </section>
  );
};

export default TasksPage;
