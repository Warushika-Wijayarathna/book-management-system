import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { signUp } from "../../services/authService";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!fname || !lname || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!email.toLowerCase().endsWith('@bookclub.com')) {
      setError("unauthorized email.");
      return;
    }

    setLoading(true);
    try {
      const name = `${fname} ${lname}`;
      await signUp({ name, email, password });
      setSuccess("Sign up successful! You can now sign in.");
      setFname("");
      setLname("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/signin"), 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-2xl sm:text-title-sm dark:text-white/90 lg:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Enter your email and password to sign up!
          </p>
        </div>
        <div>
          <div className="relative py-3 sm:py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
          </div>
          <form onSubmit={handleSignUp} className="space-y-5 sm:space-y-6">
            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div className="sm:col-span-1">
                  <Label>
                    First Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="Enter your first name"
                    value={fname}
                    onChange={e => setFname(e.target.value)}
                    className="mt-1"
                  />
                </div>
                {/* Last Name */}
                <div className="sm:col-span-1">
                  <Label>
                    Last Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="lname"
                    name="lname"
                    placeholder="Enter your last name"
                    value={lname}
                    onChange={e => setLname(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              {/* Email */}
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              {/* Password */}
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-3 sm:right-4 top-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Button */}
              <div>
                <button
                  className="flex items-center justify-center w-full px-4 py-3 sm:py-2.5 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
              {error && <div className="text-error-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">{error}</div>}
              {success && <div className="text-success-500 text-sm p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">{success}</div>}
            </div>
          </form>

          <div className="mt-6 sm:mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account? {" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
