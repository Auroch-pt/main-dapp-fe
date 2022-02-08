import { useAuth } from "@hooks/useAuth";

export const Header = () => {
    const { isLoggedIn, login, logout } = useAuth();

    return (
        <div>
            Header
            {!isLoggedIn ? (
                <button onClick={login}>Login</button>
            ) : (
                <button onClick={logout}>Logout</button>
            )}
        </div>
    );
};
