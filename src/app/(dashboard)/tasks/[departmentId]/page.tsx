"use client";

import { TaskPriority, TaskStatus } from "@prisma/client";

import { useState } from "react";

import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetDepartmentWithUsersAndTasks } from "@/entities/department/hooks";
import LoadongView from "@/feature/task-manager/ui/LoadongView";
import DialogComponent from "@/shared/ui/DialogComponent";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";

const Kanban = dynamic(() => import("@/feature/task-manager/ui/Kanban"), {
  ssr: false,
  loading: () => <LoadongView />,
});
const CalendarTask = dynamic(
  () => import("@/feature/task-manager/ui/CalendarTask"),
  { ssr: false, loading: () => <LoadongView /> }
);
const TaskTable = dynamic(() => import("@/feature/task-manager/ui/TaskTable"), {
  ssr: false,
  loading: () => <LoadongView />,
});

// const departmentWithTasks = [
//   {
//     id: 1,
//     name: "SALES",
//     directorId: "director1",
//     description: "Sales department responsible for increasing revenue.",
//     users: [
//       {
//         id: "user1",
//         departmentId: 1,
//         username: "alice_smith",
//         position: "Sales Manager",
//         tasks: [
//           {
//             id: "task1",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             description: "Prepare sales report",
//             title: "Sales Report",
//             taskStatus: TaskStatus.IN_PROGRESS,
//             taskPriority: TaskPriority.HIGH,
//             assignerId: "director1",
//             executorId: "user1",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//       {
//         id: "user2",
//         departmentId: 1,
//         username: "bob_jones",
//         position: "Sales Representative",
//         tasks: [],
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "SALES",
//     directorId: "director2",
//     description: "Technical team working on product development.",
//     users: [
//       {
//         id: "user3",
//         departmentId: 2,
//         username: "carol_davis",
//         position: "Lead Developer",
//         tasks: [
//           {
//             id: "task2",
//             description: "Fix critical bug",
//             title: "Bug Fix",
//             taskStatus: TaskStatus.DONE,
//             taskPriority: TaskPriority.CRITICAL,
//             assignerId: "director2",
//             executorId: "user3",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//       {
//         id: "user4",
//         departmentId: 2,
//         username: "david_evans",
//         position: "Developer",
//         tasks: [
//           {
//             id: "task3",
//             description: "Implement new feature",
//             title: "New Feature",
//             taskStatus: TaskStatus.IN_PROGRESS,
//             taskPriority: TaskPriority.MEDIUM,
//             assignerId: "director2",
//             executorId: "user4",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "SALES",
//     directorId: "director3",
//     description: "Marketing department focused on brand awareness.",
//     users: [
//       {
//         id: "user5",
//         departmentId: 3,
//         username: "emma_clark",
//         position: "Marketing Specialist",
//         tasks: [
//           {
//             id: "task4",
//             description: "Create marketing campaign",
//             title: "Campaign",
//             taskStatus: TaskStatus.OPEN,
//             taskPriority: TaskPriority.LOW,
//             assignerId: "director3",
//             executorId: "user5",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: "SALES",
//     directorId: "director1",
//     description: "Sales department focusing on product sales.",
//     users: [
//       {
//         id: "user6",
//         departmentId: 4,
//         username: "frank_wilson",
//         position: "Sales Manager",
//         tasks: [],
//       },
//       {
//         id: "user7",
//         departmentId: 4,
//         username: "grace_taylor",
//         position: "Sales Representative",
//         tasks: [
//           {
//             id: "task5",
//             description: "Meet with potential clients",
//             title: "Client Meeting",
//             taskStatus: TaskStatus.CANCELED,
//             taskPriority: TaskPriority.LOW,
//             assignerId: "director1",
//             executorId: "user7",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 5,
//     name: "SALES",
//     directorId: "director2",
//     description: "Technical support team working on client issues.",
//     users: [
//       {
//         id: "user8",
//         departmentId: 5,
//         username: "hannah_lee",
//         position: "Tech Support Specialist",
//         tasks: [
//           {
//             id: "task6",
//             description: "Resolve customer issue",
//             title: "Issue Resolution",
//             taskStatus: TaskStatus.DONE,
//             taskPriority: TaskPriority.CRITICAL,
//             assignerId: "director2",
//             executorId: "user8",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 6,
//     name: "SALES",
//     directorId: "director3",
//     description: "Social media and digital marketing department.",
//     users: [
//       {
//         id: "user9",
//         departmentId: 6,
//         username: "ian_hall",
//         position: "Social Media Manager",
//         tasks: [
//           {
//             id: "task7",
//             description: "Run ad campaign",
//             title: "Ad Campaign",
//             taskStatus: TaskStatus.DONE,
//             taskPriority: TaskPriority.HIGH,
//             assignerId: "director3",
//             executorId: "user9",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 7,
//     name: "SALES",
//     directorId: "director1",
//     description: "Sales department responsible for client relations.",
//     users: [
//       {
//         id: "user10",
//         departmentId: 7,
//         username: "jack_martin",
//         position: "Sales Representative",
//         tasks: [],
//       },
//     ],
//   },
//   {
//     id: 8,
//     name: "SALES",
//     directorId: "director2",
//     description: "Back-end development team.",
//     users: [
//       {
//         id: "user11",
//         departmentId: 8,
//         username: "karen_wood",
//         position: "Back-End Developer",
//         tasks: [
//           {
//             id: "task8",
//             description: "Develop API",
//             title: "API Development",
//             taskStatus: TaskStatus.IN_PROGRESS,
//             taskPriority: TaskPriority.LOW,
//             assignerId: "director2",
//             executorId: "user11",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 9,
//     name: "SALES",
//     directorId: "director3",
//     description: "Event planning and public relations.",
//     users: [
//       {
//         id: "user12",
//         departmentId: 9,
//         username: "lucas_garcia",
//         position: "Event Coordinator",
//         tasks: [
//           {
//             id: "task9",
//             description: "Organize company event",
//             title: "Event Planning",
//             taskStatus: TaskStatus.OPEN,
//             taskPriority: TaskPriority.MEDIUM,
//             assignerId: "director3",
//             executorId: "user12",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 10,
//     name: "SALES",
//     directorId: "director1",
//     description: "Sales department focused on international clients.",
//     users: [
//       {
//         id: "user13",
//         departmentId: 10,
//         username: "mary_james",
//         position: "Sales Manager",
//         tasks: [
//           {
//             id: "task10",
//             description: "Negotiate international deal",
//             title: "International Deal",
//             taskStatus: TaskStatus.IN_PROGRESS,
//             taskPriority: TaskPriority.MEDIUM,
//             assignerId: "director1",
//             executorId: "user13",
//             dueDate: new Date(),
//             startDate: new Date(),
//           },
//         ],
//       },
//     ],
//   },
// ];

const allTasks = [
  {
    id: "task1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Prepare sales report Prepare sales report Prepare sales report",
    title: "Sales Report",
    taskStatus: TaskStatus.IN_PROGRESS,
    taskPriority: TaskPriority.HIGH,
    assignerId: "director1",
    executorId: "user1",
    dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task2",
    description: "Fix critical bug",
    title: "Bug Fix",
    taskStatus: TaskStatus.DONE,
    taskPriority: TaskPriority.CRITICAL,
    assignerId: "director2",
    executorId: "user3",
    dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task3",
    description: "Implement new feature",
    title: "New Feature",
    taskStatus: TaskStatus.IN_PROGRESS,
    taskPriority: TaskPriority.MEDIUM,
    assignerId: "director2",
    executorId: "user4",
    dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task4",
    description: "Create marketing campaign",
    title: "Campaign",
    taskStatus: TaskStatus.OPEN,
    taskPriority: TaskPriority.LOW,
    assignerId: "director3",
    executorId: "user5",
    dueDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task5",
    description: "Meet with potential clients",
    title: "Client Meeting",
    taskStatus: TaskStatus.CANCELED,
    taskPriority: TaskPriority.LOW,
    assignerId: "director1",
    executorId: "user7",
    dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task6",
    description: "Resolve customer issue",
    title: "Issue Resolution",
    taskStatus: TaskStatus.DONE,
    taskPriority: TaskPriority.CRITICAL,
    assignerId: "director2",
    executorId: "user8",
    dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task7",
    description: "Run ad campaign",
    title: "Ad Campaign",
    taskStatus: TaskStatus.DONE,
    taskPriority: TaskPriority.HIGH,
    assignerId: "director3",
    executorId: "user9",
    dueDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task8",
    description: "Develop API",
    title: "API Development",
    taskStatus: TaskStatus.IN_PROGRESS,
    taskPriority: TaskPriority.LOW,
    assignerId: "director2",
    executorId: "user11",
    dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    startDate: new Date(),
  },
  {
    id: "task9",
    description: "Organize company event",
    title: "Event Planning",
    taskStatus: TaskStatus.OPEN,
    taskPriority: TaskPriority.MEDIUM,
    assignerId: "director3",
    executorId: "user12",
    dueDate: new Date(),
    startDate: new Date(),
  },
  {
    id: "task10",
    description: "Negotiate international deal",
    title: "International Deal",
    taskStatus: TaskStatus.IN_PROGRESS,
    taskPriority: TaskPriority.MEDIUM,
    assignerId: "director1",
    executorId: "user13",
    dueDate: new Date(),
    startDate: new Date(),
  },
];

const view = [
  { id: "table", value: "Таблица" },
  { id: "kanban", value: "Канбан" },
  { id: "calendar", value: "Календарь" },
] as const;

type ViewType = (typeof view)[number]["id"];

const TasksPage = () => {
  const { departmentId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultView = searchParams.get("viewType") || "table";
  const [currentView, setCurrentView] = useState<ViewType>(
    defaultView as ViewType
  );

  const { data } = useGetDepartmentWithUsersAndTasks(departmentId as string);

  const handleViewChange = (value: ViewType) => {
    if (value === currentView) return;
    setCurrentView(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="p-5">
      <h1 className="text-xl py-2">Все задачи</h1>

      <Separator />

      <div className="p-2 flex justify-between gap-2">
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

        <DialogComponent
          trigger={
            <Button variant="default">
              <Plus /> Новая
            </Button>
          }
        >
          <></>
        </DialogComponent>
      </div>

      <MotionDivY>
        {currentView === "table" && <TaskTable data={allTasks} />}

        {currentView === "kanban" && <Kanban />}

        {currentView === "calendar" && <CalendarTask />}
      </MotionDivY>
    </section>
  );
};

export default TasksPage;
