import { PermissionProvider } from "./provider/permission-provider"

const RootTemplate = ({ children }: { children: React.ReactNode }) => {
  return <PermissionProvider>{children}</PermissionProvider>
}

export default RootTemplate
