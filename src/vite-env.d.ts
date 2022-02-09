/// <reference types="vite/client" />

interface Window {
    ethereum: any;
}

interface ImportMetaEnv {
    readonly VITE_APP_API_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
