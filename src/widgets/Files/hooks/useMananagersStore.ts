import { useEffect, useState } from "react"
import { getManagers } from "@/entities/department/lib/utils"

const useMananagersStore = () => {
  const [managersList, setManagersList] = useState<Record<string, string>>({})

  useEffect(() => {
    const managers = getManagers()

    setManagersList(managers)
  }, [])

  return managersList
}

export default useMananagersStore
