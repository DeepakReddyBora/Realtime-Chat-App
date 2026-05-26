import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

import useAuth from "../context/useAuth";

function VerifyOtpPage() {
  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const navigate = useNavigate();

  const { setAuthUser } = useAuth();

  const email =
    localStorage.getItem("verifyEmail");

  // verify otp
  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        return toast.error(
          "Please enter OTP"
        );
      }

      setLoading(true);

      const res = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      setAuthUser(res.data);

      localStorage.removeItem(
        "verifyEmail"
      );

      toast.success(
        "Account verified successfully"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // resend otp
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const res = await api.post(
        "/auth/resend-otp",
        {
          email,
        }
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">

          Verify OTP

        </h1>

        <p className="text-gray-500 text-center mb-6">

          Enter the OTP sent to your email

        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3 outline-none mb-4 text-center tracking-[10px] text-xl font-semibold"
        />

        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <button
          onClick={handleResendOtp}
          disabled={resendLoading}
          className="w-full mt-4 border py-3 rounded-lg hover:bg-gray-100 transition"
        >
          {resendLoading
            ? "Resending..."
            : "Resend OTP"}
        </button>

      </div>

    </div>
  );
}

export default VerifyOtpPage;