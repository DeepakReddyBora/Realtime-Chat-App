import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

import useAuth  from "../context/useAuth";

function LoginPage() {
  const navigate = useNavigate();

  const { setAuthUser } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // validations
      if (
        !formData.email ||
        !formData.password
      ) {
        return toast.error(
          "Please fill all fields"
        );
      }

      setLoading(true);

      const res = await api.post(
        "/auth/login",
        formData
      );

      setAuthUser(res.data);

      toast.success(
        "Login successful"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center mb-2">

          Welcome Back

        </h1>

        <p className="text-center text-gray-500 mb-6">

          Login to continue chatting

        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 outline-none mb-4 focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 outline-none mb-6 focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <p className="text-center mt-5 text-gray-600">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="font-semibold text-black"
          >
            Signup
          </Link>

        </p>

      </form>

    </div>
  );
}

export default LoginPage;