"use client";

import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { login } from "@/feature/auth/login";
import SubmitFormActionBtn from "@/shared/ui/Buttons/SubmitFormActionBtn";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/entities/user/ui/Toast";
import InputEmail from "@/shared/ui/Inputs/InputEmail";
import InputPassword from "@/shared/ui/Inputs/InputPassword";
import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks.tsx";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(30),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
  const { data: departmentData } = useGetDepartmentsWithUsers();

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
      setIsAuth(false);
      document.cookie = "auth_redirected=; Max-Age=0; path=/"; // Удаляем флаг из куки
    } else if (state && state.data) {
      setAuthUser(state.data);
      setIsAuth(true);
    }

    // if (isAuth) {
    //   setShouldRedirect(true);
    // }
  }, [state, setAuthUser, setIsAuth, isAuth]);

  useEffect(() => {
    if (isAuth && departmentData) {
      setDepartments(departmentData);
      setShouldRedirect(true);
    }
  }, [isAuth, departmentData, setDepartments]);

  if (shouldRedirect) {
    redirect(`/table/projects/${authUser?.id}`);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <InputEmail
                          {...field}
                          required
                          className="valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputPassword
                          {...field}
                          minLength={6}
                          maxLength={30}
                          className="valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitFormActionBtn title="Войти" />
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login-img.webp"
              alt="Image"
              width={400}
              height={400}
              quality={70}
              priority
              className="absolute inset-0 h-full w-full dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
