import { createContext, FC, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useCookies } from "react-cookie";
interface IAuthContext {
    isLoggedIn: boolean;
    getToken: () => string | null;
    login: () => void;
    logout: () => void;
    getUser: () => User | null;
    isLoading: boolean;
}

type User = {
    address: string;
    nonce: number;
};

export const AuthContext = createContext<IAuthContext>({
    isLoggedIn: false,
    getToken: () => null,
    login: () => {},
    logout: () => {},
    getUser: () => null,
    isLoading: false,
});

export const AuthProvider: FC = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {
        setIsLoading(true);
        let token = cookies["token"];
        let user = cookies["user"];
        if (token && user) {
            setIsLoggedIn(true);
        }
        setIsLoading(false);
    }, []);

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const getNonce = async (address: string) => {
        const nonce = await fetch(
            `${import.meta.env.VITE_APP_API_URI}auth/${address}/nonce`
        )
            .then((res) => res.json())
            .then((res: { nonce: string }) => res.nonce);

        return nonce;
    };

    const signMessage = async ({ address, nonce }: User) => {
        const signature = await provider
            .getSigner(address)
            .signMessage(`Nonce: ${nonce}`);

        return signature;
    };

    const authenticate = async (address: string, signature: string) => {
        await fetch(
            `${
                import.meta.env.VITE_APP_API_URI
            }auth/${address}/signature/${signature}`
        )
            .then((res) => res.json())
            .then((res: { token: string; user: User }) => {
                setCookie("token", res.token);
                setCookie("user", res.user);
                setIsLoggedIn(true);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setIsLoading(false));
    };

    const login = async () => {
        setIsLoading(true);

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const nonce = await getNonce(address);

        const signature = await signMessage({
            address,
            nonce: parseInt(nonce),
        });

        authenticate(address, signature);
    };

    const logout = () => {
        removeCookie("token");
        removeCookie("user");
        setIsLoggedIn(false);
    };

    const getUser = (): User => {
        return cookies["user"];
    };

    const getToken = (): string => {
        return cookies["token"];
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, login, logout, getToken, getUser, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
