import { createContext, FC, useState } from "react";
import { ethers } from "ethers";

interface IAuthContext {
    isLoggedIn: boolean;
    token: string | null;
    login: () => void;
    logout: () => void;
    user: User | null;
    isLoading: boolean;
}

type User = {
    address: string;
    nonce: number;
};

export const AuthContext = createContext<IAuthContext>({
    isLoggedIn: false,
    token: null,
    login: () => {},
    logout: () => {},
    user: null,
    isLoading: false,
});

export const AuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

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
                setToken(res.token);
                setUser(res.user);
                setIsLoggedIn(true);
                setIsLoading(false);
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
        setIsLoggedIn(false);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, login, logout, token, user, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
