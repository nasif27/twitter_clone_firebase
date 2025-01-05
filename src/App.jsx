import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import { Provider } from "react-redux";
import store from "./store";

export default function App() {
    const apiURL = 'https://73b2e477-a28f-4970-8116-232a588b3002-00-3gw52rtdl66kv.pike.replit.dev';
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/profile" element={<ProfilePage apiURL={apiURL} />} />
                    <Route path="/login" element={<AuthPage apiURL={apiURL} />} />
                    <Route path="*" element={<AuthPage />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}