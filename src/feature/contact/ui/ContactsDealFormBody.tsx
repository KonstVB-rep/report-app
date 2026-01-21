import type { UseFormReturn } from "react-hook-form"
import type { SingleContactSchema } from "@/entities/contact/model/schema"
import type { ContactFieldError } from "@/entities/deal/types"
import InputPhoneForm from "@/shared/custom-components/ui/Inputs/InputPhoneForm"
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm"

const ContactsDealFormBody = ({ form }: { form: UseFormReturn<SingleContactSchema> }) => {
  return (
    <div className="max-h-full overflow-hidden">
      <InputTextForm
        control={form.control}
        errorMessage={form.formState.errors?.name?.message}
        label=""
        name="name"
        placeholder="Имя"
      />

      <InputTextForm
        control={form.control}
        errorMessage={form.formState.errors?.position?.message}
        label=""
        name="position"
        placeholder="Должность"
      />

      <InputPhoneForm
        control={form.control}
        errorMessage={(form.formState.errors.phone as ContactFieldError)?._common?.message}
        label=""
        name="phone"
        placeholder="Телефон"
      />

      <InputTextForm
        className="w-full valid:not-placeholder-shown:border-green-500 invalid:not-placeholder-shown:border-red-500"
        control={form.control}
        errorMessage={(form.formState.errors.email as ContactFieldError)?._common?.message}
        label=""
        name="email"
        placeholder="Email"
        type="email"
      />
    </div>
  )
}

export default ContactsDealFormBody
