import { createContext, FC, useState } from "react";

interface IAuthContext {
    isLoggedIn: boolean;
    token: string | null;
    login: () => void;
    logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
    isLoggedIn: false,
    token: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider: FC = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

    const login = () => {
        console.log("login");
    };

    const logout = () => {
        console.log("logout");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};
