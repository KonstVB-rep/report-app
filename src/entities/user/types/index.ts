export type RoleType = "director" | "manager";
export type DepartmentTypeName = "SALES" | "TECNICAL";
export type User = {
  id: string;
  username: string;
  phone: string;
  user_password: string;
  email: string;
  position: string;
  departmentId: number; // Или может быть связано с типом Department, если это отдельная сущность
  role: string;
  lastlogin?: Date | null; // Можно сделать его опциональным или null, если требуется
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithdepartmentName = Omit<User, "user_password" | "lastlogin" | "createdAt" | "updatedAt"
> & {
  departmentName: DepartmentTypeName
}

export type UserRequest = Omit<
  User,
  "id" | "lastlogin" | "createdAt" | "updatedAt" | "departmentId"
> & {
  department: string;
};
export type UserResponse = Omit<
  User,
  "lastlogin" | "createdAt" | "updatedAt" | "user_password"
>;
