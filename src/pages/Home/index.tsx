import { useAuth } from "@hooks/useAuth";

export const Home = () => {
    const { getUser } = useAuth();
    const user = getUser();

    return (
        <div>
            Home
            {user && <h2>Hello ${user.address}</h2>}
        </div>
    );
};
