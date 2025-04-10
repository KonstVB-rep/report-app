import UserDepartmentList from "@/entities/department/ui/UserDepartmentList";
import withAuthGuard from "@/widgets/Files/libs/hoc/withAuthGuard";

const DeparmentEmployees = async () => {
  return (
    <section className="p-4">
      <UserDepartmentList />
    </section>
  );
};

export default withAuthGuard(DeparmentEmployees);
