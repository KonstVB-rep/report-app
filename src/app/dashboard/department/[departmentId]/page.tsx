import { getDepartmentName } from "@/entities/department/api";
import UserDepartmentList from "@/entities/department/ui/UserDepartmentList";
import { getAllUsersByDepartment } from "@/entities/user/api";

const DeparmentEmployees = async ({
  params,
}: {
  params: Promise<{ departmentId: number }>;
}) => {
  try {
    const { departmentId } = await params;
    const [persons, depatmentName] = await Promise.all([
      getAllUsersByDepartment(departmentId),
      getDepartmentName(departmentId),
    ]);

    return (
      <section className="p-4">
        <h1 className="text-center text-2xl font-bold p-4">
           {depatmentName}
        </h1>
        <UserDepartmentList persons={persons}/>
      </section>
    );
  } catch (error) {
    console.error("Ошибка в DeparmentEmployees:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return (
      <section className="p-4">
        <h1 className="text-center text-2xl font-bold p-4">
          Отдел не найден
        </h1>
        <p>Ошибка загрузки данных: {errorMessage}</p>
      </section>
    );
  }
};

export default DeparmentEmployees;
