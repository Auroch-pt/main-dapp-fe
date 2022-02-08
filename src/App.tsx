import { Routes, Route } from "react-router-dom";
import { Home } from "@pages";
import { Header } from "@components";
import { AuthProvider } from "@contexts/authContext";

function App() {
    return (
        <AuthProvider>
            <Header />
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
