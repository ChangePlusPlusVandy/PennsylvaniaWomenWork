import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { api } from "../api"

interface User {
  _id: string
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
}

interface UserContextType {
  user: User | null
  error: string | null
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: auth0User } = useAuth0() // Get user from Auth0
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      if (!auth0User?.sub || user) return

      console.log("Fetching user data for Auth0 user:", auth0User)

      try {
        const response = await api.get(
          `/api/user/current-userid/${encodeURIComponent(auth0User.sub)}`
        )

        console.log("Fetched user data:", response.data)

        if (response.data && response.data._id) {
          setUser(response.data)
          localStorage.setItem("user", JSON.stringify(response.data))
        } else {
          setError("User not found")
        }
      } catch (err) {
        console.error("Error fetching user:", err)
        setError("Failed to fetch user information")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [auth0User]) // ✅ Re-run when auth0User updates

  return (
    <UserContext.Provider value={{ user, error, loading }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
