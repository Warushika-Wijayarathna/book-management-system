import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/useAuth"

interface AdminRoutesProps {
  children: React.ReactNode
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ children }) => {
  const { isLoggedIn, isAdmin, isAuthenticating } = useAuth()

  if (isAuthenticating) return null
  if (!isLoggedIn || !isAdmin) return <Navigate to='/home' />
  return <>{children}</>
}

export default AdminRoutes
