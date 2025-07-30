"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { animated, useSpring } from "@react-spring/web";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";

import { z } from "zod";

import loginImg from "@/assets/login-img";
import { Card, CardContent } from "@/components/ui/card";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { login } from "@/feature/auth/login";
import SubmitFormActionBtn from "@/shared/ui/Buttons/SubmitFormActionBtn";
import InputFormPassword from "@/shared/ui/Inputs/InputFormPassword";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import { TOAST } from "@/shared/ui/Toast";

import { Form } from "../../../components/ui/form";

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(30),
});

const LoginForm = ({ className }: React.ComponentProps<"div">) => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction] = useActionState(login, undefined);
  const { setAuthUser, setIsAuth } = useStoreUser();

  const styles = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 350, easing: (t) => 1 - Math.pow(1 - t, 3) }, // Эквивалент "easeOut"
  });

  const onSubmit = (formData: FormData) => {
    const parsed = loginFormSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return;
    formAction(formData);
  };

  useEffect(() => {
    if (state?.error) {
      TOAST.ERROR(state.message);
    }

    if (state?.data) {
      setAuthUser(state.data);
      setIsAuth(true);
    }
  }, [setAuthUser, setIsAuth, state]);

  return (
    <animated.div style={styles} className={`flex flex-col gap-6 ${className}`}>
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

                <SubmitFormActionBtn title="Войти" aria-label="Войти" />
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src={loginImg}
              alt="Login"
              placeholder="blur"
              priority
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute inset-0 h-full w-full dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </animated.div>
  );
};

export default LoginForm;
