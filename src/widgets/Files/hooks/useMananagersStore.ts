import { useEffect, useState } from "react"
import { getUsers } from "@/entities/department/lib/utils"

const useMananagersStore = () => {
  const [managersList, setManagersList] = useState<Record<string, string>>({})

  useEffect(() => {
    const managers = getUsers({ onlyManagers: true })

    setManagersList(managers)
  }, [])

  return managersList
}

export default useMananagersStore
