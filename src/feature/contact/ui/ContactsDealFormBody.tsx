import React from "react";
import { UseFormReturn } from "react-hook-form";

import { SingleContactSchema } from "@/entities/contact/model/schema";
import { ContactFieldError } from "@/entities/deal/types";
import InputPhoneForm from "@/shared/custom-components/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm";

const ContactsDealFormBody = ({
  form,
}: {
  form: UseFormReturn<SingleContactSchema>;
}) => {
  return (
    <div className="max-h-full overflow-hidden">
      <InputTextForm
        name="name"
        label=""
        control={form.control}
        errorMessage={form.formState.errors?.name?.message}
        placeholder="Имя"
      />

      <InputTextForm
        name="position"
        label=""
        control={form.control}
        errorMessage={form.formState.errors?.position?.message}
        placeholder="Должность"
      />

      <InputPhoneForm
        name="phone"
        label=""
        control={form.control}
        errorMessage={
          (form.formState.errors.phone as ContactFieldError)?._common?.message
        }
        placeholder="Телефон"
      />

      <InputTextForm
        name="email"
        label=""
        control={form.control}
        errorMessage={
          (form.formState.errors.email as ContactFieldError)?._common?.message
        }
        className="w-full valid:not-placeholder-shown:border-green-500 invalid:not-placeholder-shown:border-red-500"
        placeholder="Email"
        type="email"
      />
    </div>
  );
};

export default ContactsDealFormBody;
