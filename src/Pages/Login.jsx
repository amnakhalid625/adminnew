import React,{useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../api/internal";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login as setAuth } from "../Store/authSlice";
import { useNavigate } from "react-router-dom";

export default function ClassyShopLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const { error, loading, login } = useLogin();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return toast.error("Please fill all the fields!");
        }

        const data = await login(email, password);

        if (error) {
            return toast.error(error);
        }

        dispatch(setAuth(data.user));
        navigate("/dashboard");
    };

    return (
        <div className="min-h-max bg-gray-50">
            {/* Main Content */}
            <main className="flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    {/* Welcome Section */}
                    <div className="text-center mb-8">
                        <div className="mb-4">
                            <div className="inline-flex items-center gap-1 text-4xl mb-2">
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-xl text-gray-900">
                            Sign in with your credentials.
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Remember Me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Don't have an account?
                            </span>
                            <a
                                href="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign Up
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            {loading ? "Loading " : "SIGN IN"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
