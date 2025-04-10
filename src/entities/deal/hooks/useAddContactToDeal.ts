import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { ContactSchema, ContactFormSchema } from '../model/schema';

const useAddContactToDeal = (contacts: ContactSchema["contacts"], onContactsChange: (contacts: ContactSchema["contacts"]) => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<ContactSchema>({
      resolver: zodResolver(ContactFormSchema),
      defaultValues: {
        contacts: contacts.length > 0 ? [...contacts] : [{
          name: "",
          email: "",
          phone: "",
          position: "",
          id: crypto.randomUUID(),
        }],
      },
    });
  
  
    useEffect(() => {
      if (isOpen) {
        form.reset({ contacts: contacts.length > 0 ? [...contacts] : [{
          name: "",
          email: "",
          phone: "",
          position: "",
          id: crypto.randomUUID(),
        }] });
      }
    }, [isOpen, contacts, form]);
  
  
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "contacts",
    });

    const handleAddNewContactForm =() => {
        return append({
          id: crypto.randomUUID(),
          name: "",
          phone: "",
          email: "",
          position: "",
        })
    }
  
  
    const handleRemove = (index: number) => {
      remove(index);
  
      if (fields.length === 1) {
        append({
          id: crypto.randomUUID(),
          name: "",
          phone: "",
          email: "",
          position: "",
        });
        onContactsChange([])
      }
    };
  
    return { isOpen, setIsOpen, form, handleRemove, handleAddNewContactForm, fields }
 
}

export default useAddContactToDeal