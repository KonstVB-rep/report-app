"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { redirect } from "next/navigation";

import { motion } from "motion/react";
import { z } from "zod";

import loginImg from "@/assets/login-img";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks.tsx";
import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { login } from "@/feature/auth/login";
import { resetAllStores } from "@/shared/lib/helpers/сreate";
import { cn } from "@/shared/lib/utils";
import SubmitFormActionBtn from "@/shared/ui/Buttons/SubmitFormActionBtn";
import InputFormPassword from "@/shared/ui/Inputs/InputFormPassword";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import { TOAST } from "@/shared/ui/Toast";

import { Form } from "../../../components/ui/form";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(30),
});

export const redirectPath = (departmentId: number, userId: string) => {
  switch (departmentId) {
    case 1:
      return `/table/${departmentId}/projects/${userId}`;
    case 2:
      return `/statistics/request-source/${departmentId}/${userId}`;
    default:
      return "/";
  }
};

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction] = useActionState(login, undefined);
  const { setAuthUser, setIsAuth, isAuth, authUser } = useStoreUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const { setDepartments } = useStoreDepartment();

  const { data: departmentData } = useGetDepartmentsWithUsers(isAuth);

  const onSubmit = (formData: FormData) => {
    const isValidData = loginFormSchema.parse(Object.fromEntries(formData));
    if (!isValidData) return;
    formAction(formData);
  };

  useEffect(() => {
    if (state && state?.error) {
      TOAST.ERROR(state.message);
    }

    const isRedirected = document.cookie.includes("auth_redirected=true");

    if (isRedirected) {
      resetAllStores();
      document.cookie = "auth_redirected=; Max-Age=0; path=/"; // Удаляем флаг из куки
    } else if (state && state.data) {
      setAuthUser(state.data);
      setIsAuth(true);
    }
  }, [state, setAuthUser, setIsAuth, isAuth]);

  useEffect(() => {
    if (isAuth && departmentData) {
      setDepartments(departmentData);
      setShouldRedirect(true);
    }
  }, [isAuth, departmentData, setDepartments, setShouldRedirect]);

  if (shouldRedirect && authUser) {
    const redirectUrl = redirectPath(authUser?.departmentId, authUser?.id);
    console.log(redirectUrl);
    redirect(redirectUrl);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("flex flex-col gap-6", className)}
    >
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" action={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Добро пожаловать</h1>

                  <p className="text-balance text-muted-foreground">
                    Войдите в свою учетную запись
                  </p>
                </div>

                <InputTextForm
                  name="email"
                  label="Email"
                  control={form.control}
                  errorMessage={form.formState.errors.email?.message}
                  type="email"
                  placeholder="Введите email"
                  className="w-full valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                  required
                />

                <InputFormPassword
                  name="password"
                  label="Пароль"
                  control={form.control}
                  errorMessage={form.formState.errors.password?.message}
                  className="w-full valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                  autoComplete="current-password"
                  required
                />

                <SubmitFormActionBtn title="Войти" />
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src={loginImg}
              alt=""
              placeholder="blur"
              priority
              fill
              className="absolute inset-0 h-full w-full dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
