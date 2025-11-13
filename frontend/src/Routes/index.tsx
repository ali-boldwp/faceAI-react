import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouteProps, nonAuthRoutes, routes } from "./routes";
import ThemeLayout from "../ThemeLayout";
import NonLayout from "ThemeLayout/NonLayout";
import ProtectedRoute from "./ProtectedRoute";

const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Non-auth routes */}
                {(nonAuthRoutes || []).map((item: RouteProps, key: number) => (
                    <Route
                        key={key}
                        path={item.path}
                        element={
                            <NonLayout>
                                {item.component}
                            </NonLayout>
                        }
                    />
                ))}

                {/* Protected (authenticated) routes */}
                {(routes || []).map((item: RouteProps, key: number) => (
                    <Route
                        key={key}
                        path={item.path}
                        element={
                            <ProtectedRoute>
                                <ThemeLayout>
                                    {item.component}
                                </ThemeLayout>
                            </ProtectedRoute>
                        }
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
};

export default Routing;
