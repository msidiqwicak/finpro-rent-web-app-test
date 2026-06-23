import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SocialLogin from "../components/auth/SocialLogin";
import Navbar from "../components/layout/Navbar";

type LoginMode = "USER" | "TENANT";

import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>("USER");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (user) {
    navigate(user.role === "TENANT" ? "/tenant/dashboard" : "/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const processLogin = async () => {
    const { default: api } = await import("../api/axiosConfig");
    const endpoint = mode === "TENANT" ? "/auth/login/tenant" : "/auth/login";
    const res = await api.post(endpoint, {
      email: form.email.trim(),
      password: form.password,
    });
    
    login({
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
    });
    navigate(res.data.user.role === "TENANT" ? "/tenant/dashboard" : "/");
  };

  const handleError = (err: any) => {
    const msg = err.response?.data?.error?.includes("Login gagal")
      ? "Login failed. Please check your email and password."
      : err.response?.data?.error || err.message || "Login failed.";
    setError(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Email and password are required.");
    
    setLoading(true);
    setError("");
    try {
      await processLogin();
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const isTenant = mode === "TENANT";

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] bg-surface-low flex items-center justify-center p-5 py-12 relative overflow-hidden">
      <div
        className={`absolute top-[-10%] ${isTenant ? "right-[-10%] bg-secondary-container/40" : "left-[-10%] bg-primary-fixed/30"} w-[500px] h-[500px] rounded-full blur-[80px] transition-all duration-700`}
      />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10">
        <AuthHeader />

        <div className="flex bg-surface-high p-1.5 rounded-xl mb-8">
          <button
            onClick={() => {
              setMode("USER");
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-bold transition-all cursor-pointer border-none ${!isTenant ? "bg-white text-primary shadow-sm" : "bg-transparent text-on-surface-variant hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              person
            </span>{" "}
            Guest
          </button>
          <button
            onClick={() => {
              setMode("TENANT");
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-bold transition-all cursor-pointer border-none ${isTenant ? "bg-secondary text-on-secondary shadow-sm" : "bg-transparent text-on-surface-variant hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              home_work
            </span>{" "}
            Tenant
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="email"
            label="Email Address"
            icon="mail"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <AuthInput
            id="password"
            label="Password"
            icon="lock"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            togglePass={{
              show: showPass,
              onClick: () => setShowPass(!showPass),
            }}
          />

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold mb-6 bg-red-50 text-red-700 border border-red-200">
              <span className="material-symbols-outlined text-[20px] shrink-0">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-on-primary font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 mt-2 cursor-pointer border-none ${isTenant ? "bg-secondary" : "bg-primary"}`}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  login
                </span>{" "}
                Sign In as {isTenant ? "Tenant" : "Guest"}
              </>
            )}
          </button>
        </form>

        <SocialLogin
          action="LOGIN"
          requestedRole={mode}
          redirectTo={isTenant ? "/tenant/dashboard" : "/"}
        />

        <div className="mt-8 pt-6 border-t border-surface-high text-center text-[14px] text-on-surface-variant">
          <p>
            Don't have an account?{" "}
            <Link
              to={isTenant ? "/tenant/register" : "/register"}
              className={`font-bold hover:underline ${isTenant ? "text-secondary" : "text-primary"}`}
            >
              Sign up {isTenant ? "as Tenant" : "now"}
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
