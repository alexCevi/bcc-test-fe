import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import SignIn from "./pages/auth/SignIn"
import HomePage from "./pages/HomePage"
import EmployeePage from "./pages/Employee"
import SupervisorPage from "./pages/Supervisor"
import { AuthProvider } from "./context/context"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import EmployeeRequestPage from "./pages/EmployeeRequestPage"
import SupervisorRequestsPage from "./pages/SupervisorRequestsPage"

function AuthPage({ children }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {children}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/sign-in/*"
            element={
              <AuthPage>
                <SignIn />
              </AuthPage>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Outlet />
                </MainLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route
              path="employee"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                  <EmployeePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="employee/requests"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                  <EmployeeRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="supervisor"
              element={
                <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
                  <SupervisorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="supervisor/requests"
              element={
                <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
                  <SupervisorRequestsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
