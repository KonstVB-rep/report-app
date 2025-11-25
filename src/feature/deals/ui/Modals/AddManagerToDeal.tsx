import type React from "react"
import { Crown } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import { cn } from "@/shared/lib/utils"
import useMananagersStore from "@/widgets/Files/hooks/useMananagersStore"

const AddManagerToDeal = ({
  managers,
  setManagers,
  firstManager,
  setFirstManager,
}: {
  managers: { userId: string | undefined }[]
  setManagers: React.Dispatch<React.SetStateAction<{ userId: string | undefined }[]>>
  firstManager: string
  setFirstManager: React.Dispatch<React.SetStateAction<string>>
}) => {
  const managersList = useMananagersStore()

  const handleChange = (value: { userId: string }) => {
    setManagers((prevManagers) => {
      const isSelected = prevManagers.some((user) => user.userId === value.userId)

      return isSelected
        ? prevManagers.filter((manager) => manager.userId !== value.userId)
        : [...prevManagers, value]
    })
  }

  const handleValueChange = (value: string) => {
    // Если выбранный менеджер уже ответственный - ничего не делаем
    if (value === firstManager) return

    setManagers((prev) => {
      // Если новый ответственный менеджер ещё не в списке - добавляем
      if (!prev.some((m) => m.userId === value)) {
        return [...prev, { userId: value }]
      }
      return prev
    })

    // Обновляем ответственного менеджера
    setFirstManager(value)
  }

  if (Object.keys(managersList).length === 0) return null

  return (
    <DialogComponent
      classNameContent="max-w-fit sm:max-w-fit"
      trigger={
        <Button aria-label="Добавить менеджера" className="ml-auto" type="button" variant="outline">
          Добавить менеджера
        </Button>
      }
    >
      <div className="flex">
        <div className="flex flex-col gap-1 h-full">
          <RadioGroup className="pt-6 gap-1" onValueChange={handleValueChange} value={firstManager}>
            {Object.entries(managersList).map(([id]) => (
              <div
                className="group flex items-center gap-3 rounded-md hover:bg-muted p-3 mb-1"
                key={id}
              >
                <Label>
                  <Crown
                    className={cn(
                      "h-6 w-6 cursor-pointer transform duration-150",
                      id === firstManager ? "fill-amber-500 scale-125" : "opacity-50",
                    )}
                  />
                  <RadioGroupItem
                    className="h-6 w-6 hidden"
                    id={id}
                    title="Сделать ответственным"
                    value={id}
                  />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex max-w-fit flex-col gap-1 pr-6 pt-6">
          {Object.entries(managersList).map(([id, name]) => {
            const isChecked = managers.some((m) => m.userId === id)

            return (
              <div
                className="group flex items-center gap-3 rounded-md hover:bg-muted p-3 mb-1"
                key={id}
              >
                <Checkbox
                  checked={isChecked}
                  className="h-6 w-6 cursor-pointer transform duration-150 border-primary group-hover:scale-120 group-focus-visible:scale-120 group-hover:border-2 group-focus-visible:border-2 active:scale-95"
                  disabled={id === firstManager}
                  id={`${id}_${name}`}
                  onCheckedChange={() => handleChange({ userId: id })} // Делаем чекбокс ответственного менеджера недоступным
                />
                <Label
                  className="capitalize cursor-pointer text-base font-normal"
                  htmlFor={`${id}_${name}`}
                >
                  {name}
                </Label>
              </div>
            )
          })}
        </div>
      </div>
    </DialogComponent>
  )
}

export default AddManagerToDeal
