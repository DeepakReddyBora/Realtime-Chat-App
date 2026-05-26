import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

function SignupPage() {
  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // validations
      if (
        !username ||
        !email ||
        !password
      ) {
        return toast.error(
          "Please fill all fields"
        );
      }

      if (password.length < 6) {
        return toast.error(
          "Password must be at least 6 characters"
        );
      }

      setLoading(true);

      const res = await api.post(
        "/auth/signup",
        {
          username,
          email,
          password,
        }
      );

      toast.success(res.data.message);

      localStorage.setItem(
        "verifyEmail",
        email
      );

      navigate("/verify-otp");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center mb-2">

          Create Account

        </h1>

        <p className="text-center text-gray-500 mb-6">

          Join the real-time chat app

        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3 outline-none mb-4 focus:ring-2 focus:ring-black"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3 outline-none mb-4 focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3 outline-none mb-6 focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading
            ? "Creating Account..."
            : "Sign Up"}
        </button>

        <p className="text-center mt-5 text-gray-600">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-black"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default SignupPage;