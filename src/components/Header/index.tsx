import { useAuth } from "@hooks/useAuth";

export const Header = () => {
    const { isLoggedIn, login, logout, isLoading } = useAuth();

    return (
        <div>
            Header
            {isLoading ? (
                <button disabled> Loading... </button>
            ) : !isLoggedIn ? (
                <button onClick={login}>Login</button>
            ) : (
                <button onClick={logout}>Logout</button>
            )}
        </div>
    );
};
