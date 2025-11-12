import React from "react";
import "./assets/scss/style.scss";
import Routing from "./Routes";
import { Toaster } from "react-hot-toast";
import { MainProvider } from "./context/useMainContext";

function App() {
    return (
        <MainProvider>
            <Routing />
            <Toaster position="top-right" reverseOrder={false} />
        </MainProvider>
    );
}

export default App;
