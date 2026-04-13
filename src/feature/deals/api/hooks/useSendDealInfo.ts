import { useCallback, useEffect, useState } from "react"
import { StatusProject, StatusRetail } from "@prisma/client"
import { isValid } from "date-fns/isValid"
import { parse } from "date-fns/parse"
import { useParams } from "next/navigation"
import type { FieldValues } from "react-hook-form"
import type { Contact } from "@/entities/deal/types"
import { TOAST } from "@/shared/custom-components/ui/Toast"

const useSendDealInfo = <T extends FieldValues>(
  onSubmit: (data: T) => void,
  managerId: string,
  additionalContacts: Contact[] = [],
  managersIds: {
    userId: string
  }[] = [],
) => {
  const { userId } = useParams<{ userId: string }>()

  const firstManagerId = managerId || userId

  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAddFile, setIsAddFile] = useState(false)

  const [managers, setManagers] = useState<{ userId: string | undefined }[]>(
    managersIds.length === 0 ? [{ userId: firstManagerId }] : managersIds,
  )
  const [firstManager, setFirstManager] = useState<string>("")
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [isAddContact, setIsAddContact] = useState(false)

  const handleDeleteContact = useCallback((id: string) => {
    setSelectedContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id))
  }, [])

  const toggleAddContact = () => {
    setIsAddContact((prev) => !prev)
  }

  const handleSubmit = (data: T) => {
    const firstLine = data?.comments?.split("\n")[0] || ""

    let lastComments = firstLine.substring(22)
    const dateInComents = firstLine.substring(0, 20)
    const dateParse = parse(dateInComents, "dd.MM.yyyy, HH:mm:ss", new Date())

    if (!isValid(dateParse)) {
      lastComments = firstLine.split(" ").at(-1) || ""
    }

    const isNewComment =
      data.commentsLastConnection !== "" && data.commentsLastConnection !== lastComments

    const comments = isNewComment
      ? `${new Date().toLocaleString()}: ${data.commentsLastConnection}\n${data.comments}`
      : data.comments

    const fullData = {
      ...data,
      userId: firstManager,
      contacts: selectedContacts,
      managersIds: managers,
      plannedDateConnection:
        data.dealStatus !== StatusProject.REJECT && data.dealStatus !== StatusRetail.REJECT
          ? data.plannedDateConnection
          : null,
      comments,
    }

    onSubmit(fullData)
  }

  useEffect(() => {
    if (!firstManagerId) {
      TOAST.ERROR("Не назначен ответвенный менеджер")
      return
    }
    setFirstManager(firstManagerId)
    if (additionalContacts) {
      setSelectedContacts(additionalContacts)
    }
  }, [additionalContacts, firstManagerId])

  useEffect(() => {
    if (managersIds?.length > 0) {
      setManagers(managersIds)
    }
  }, [managersIds])

  return {
    contacts,
    setContacts,
    selectedContacts,
    setSelectedContacts,
    handleDeleteContact,
    handleSubmit,
    isAddContact,
    toggleAddContact,
    setManagers,
    managers,
    firstManager,
    setFirstManager,
    isAddFile,
    setIsAddFile,
  }
}

export default useSendDealInfo
