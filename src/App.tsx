import { Routes, Route } from "react-router-dom";
import { Home } from "@pages";
import { Header } from "@components";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </>
    );
}

export default App;
