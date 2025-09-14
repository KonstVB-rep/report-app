interface UserTableHeaderProps {
  title: string;
}

const TableCaption = ({ title }: UserTableHeaderProps) => {
  return (
    <h1 className="text-xl font-semi-bold text-center p-2 border-t border-b uppercase">
      {title}
    </h1>
  );
};

export default TableCaption;
