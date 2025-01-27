import { useAuth0 } from "@auth0/auth0-react"
import React from "react"

export const LogoutButton = () => {
  const { logout } = useAuth0()

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/logout`,
      },
    })
  }

  return (
    <div className="Button Button-color--teal-1000" onClick={handleLogout}>
      Log Out
    </div>
  )
}
