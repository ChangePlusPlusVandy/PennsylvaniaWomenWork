import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface UserContextType {
    user: { username: string; role: string; } | null;
    error: string | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { user: auth0User } = useAuth0();
    const { user, error, loading } = useCurrentUser(auth0User?.email || "");

    return (
        <UserContext.Provider value={{ user, error, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
