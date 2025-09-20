"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { treeifyError } from "zod";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { login } from "@/feature/auth/login";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Form } from "@/shared/components/ui/form";
import SubmitFormActionBtn from "@/shared/custom-components/ui/Buttons/SubmitFormActionBtn";
import InputFormPassword from "@/shared/custom-components/ui/Inputs/InputFormPassword";
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { cn } from "@/shared/lib/utils";

import { loginFormSchema, LoginSchema } from "../model/schema";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";

type ErrorState = {
  email: string;
  user_password: string;
};

const initialErrorState = {
  email: "",
  user_password: "",
};

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      user_password: "",
    },
  });
  const [errors, setErrors] = useState<ErrorState>(() => initialErrorState);
  const [state, formAction] = useActionState(login, undefined);
  const { setAuthUser, setIsAuth } = useStoreUser();

  // const styles = useSpring({
  //   opacity: 1,
  //   transform: "translateY(0px)",
  //   from: { opacity: 0, transform: "translateY(20px)" },
  //   config: { duration: 350, easing: (t) => 1 - Math.pow(1 - t, 3) },
  // });

  const onSubmit = (formData: FormData) => {
    const parsed = loginFormSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      const flattenedErrors = treeifyError(parsed.error);
      setErrors({
        email: flattenedErrors.properties?.email?.errors[0] || "",
        user_password:
          flattenedErrors.properties?.user_password?.errors[0] || "",
      });
      return;
    }
    setErrors(initialErrorState);
    formAction(formData);
  };

  useEffect(() => {
    if (!state) return;

    if (state?.error) {
      TOAST.ERROR(state.message);
    }

    if (state?.data) {
      setAuthUser(state.data);
      setIsAuth(true);
    }
  }, [setAuthUser, setIsAuth, state]);

  return (
    <MotionDivY className={"flex flex-col gap-6"}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
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
                  errorMessage={errors.email}
                  type="email"
                  placeholder="Введите email"
                  className={cn("w-full", errors.email && "border-red-500")}
                  required
                />

                <InputFormPassword
                  name="user_password"
                  label="Пароль"
                  control={form.control}
                  errorMessage={errors.user_password}
                  className={cn(
                    "w-full",
                    errors.user_password && "border-red-500"
                  )}
                  autoComplete="current-user_password"
                  required
                />

                <SubmitFormActionBtn title="Войти" aria-label="Войти" />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MotionDivY>
  );
};

export default LoginForm;
