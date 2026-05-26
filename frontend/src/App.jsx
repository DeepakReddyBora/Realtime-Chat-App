import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";

import LoginPage from "./pages/LoginPage";

import SignupPage from "./pages/SignupPage";

import VerifyOtpPage from "./pages/VerifyOtpPage";

import useAuth  from "./context/useAuth";

function App() {
  const { authUser, loading } =
    useAuth();

  // wait for auth check
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl font-bold">

        Loading...

      </div>
    );
  }

  return (
    <Routes>

      <Route
        path="/"
        element={
          authUser ? (
            <HomePage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/login"
        element={
          !authUser ? (
            <LoginPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/signup"
        element={
          !authUser ? (
            <SignupPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtpPage />}
      />

    </Routes>
  );
}

export default App;