import { useAuth } from "@hooks/useAuth";

export const Home = () => {
    const { user } = useAuth();

    return (
        <div>
            Home
            {user && <h2>Hello ${user.address}</h2>}
        </div>
    );
};
