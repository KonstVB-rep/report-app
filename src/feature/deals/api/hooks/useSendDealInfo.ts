import { useEffect, useState } from "react"
import { isValid } from "date-fns/isValid"
import { parse } from "date-fns/parse"
import { useParams } from "next/navigation"
import type { FieldValues } from "react-hook-form"
import { StatusProject, StatusRetail } from "@/entities/deal/lib/constants"
import type { Contact } from "@/entities/deal/types"
import { TOAST } from "@/shared/custom-components/ui/Toast"

const parseCommentWithDate = (comments: string): string => {
  const firstLine = comments?.split("\n")[0] || ""
  const dateInComments = firstLine.substring(0, 20)
  const dateParse = parse(dateInComments, "dd.MM.yyyy, HH:mm:ss", new Date())

  if (isValid(dateParse)) {
    return firstLine.substring(22)
  }

  return firstLine.split(" ").at(-1) || ""
}

const isRejectedStatus = (status: string | undefined): boolean => {
  return status === StatusProject.REJECT || status === StatusRetail.REJECT
}

const useSendDealInfo = <T extends FieldValues>(
  onSubmit: (data: T) => void,
  managerId: string,
  additionalContacts: Contact[] = [],
  managersIds: { userId: string }[] = [],
) => {
  const { userId } = useParams<{ userId: string }>()
  const firstManagerId = managerId || userId

  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAddFile, setIsAddFile] = useState(false)
  const [isAddContact, setIsAddContact] = useState(false)
  const [firstManager, setFirstManager] = useState<string>("")
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [managers, setManagers] = useState<{ userId: string | undefined }[]>(
    managersIds.length === 0 ? [{ userId: firstManagerId }] : managersIds,
  )

  const handleDeleteContact = (id: string) => {
    setSelectedContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id))
  }

  const toggleAddContact = () => {
    setIsAddContact((prev) => !prev)
  }

  const handleSubmit = (data: T) => {
    const lastComments = parseCommentWithDate(data.comments || "")

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
      plannedDateConnection: isRejectedStatus(data.dealStatus) ? null : data.plannedDateConnection,
      comments,
    }

    onSubmit(fullData as T)
  }

  useEffect(() => {
    if (!firstManagerId) {
      TOAST.ERROR("Не назначен ответственный менеджер")
      return
    }

    setFirstManager(firstManagerId)

    if (additionalContacts) {
      setSelectedContacts(additionalContacts)
    }

    if (managersIds?.length > 0) {
      setManagers(managersIds)
    }
  }, [additionalContacts, firstManagerId, managersIds])

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
