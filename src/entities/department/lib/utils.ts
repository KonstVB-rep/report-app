import { DeptFormatted } from "../store/useStoreDepartment";

type Dept = {
  id: number;
  name: string;
  description: string;
  users: {
    id: string;
    username: string;
  }[];
};

export const formattedArr = <T extends Dept>(
  arr: T[] | null
): DeptFormatted[] | null => {
  if (!arr || arr.length === 0) return null;

  return arr.map((dept) => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    users: dept.users.map((user) => {
      return { [user.id]: user.username };
    }),
  }));
};

//   export const formattedArr = <T extends Dept>(arr: T[]): DeptFormatted[] | null => {
//     if (!arr || arr.length === 0) return null;

//     const response: DeptFormatted[] = [];

//     for (let i = 0; i < arr.length; i++) {
//       const dept = arr[i];

//       if (!dept) continue;

//       const innerObj: DeptFormatted = {};

//       innerObj[`${dept.id}`] = {
//         name: dept.name,
//         users: dept.users.map((user) => {
//             return {[user.id]: user.username};
//         })
//       };

//       response.push(innerObj);
//     }

//     return response.length ? response : null;
//   };
