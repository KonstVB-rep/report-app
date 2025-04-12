import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import {  FieldValues } from 'react-hook-form'
import { InputFormProps } from '../type'


const InputTextForm = <T extends FieldValues>({name, label,control,errorMessage, ...rest}: InputFormProps<T>)=> {
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            placeholder="Введите имя пользователя"
            {...field}
            className="w-full valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
            {...rest}
          />
        </FormControl>
        {errorMessage && (
          <FormMessage className="text-red-500">
            {errorMessage}
          </FormMessage>
        )}
      </FormItem>
    )}
  />
  )
}

export default InputTextForm;