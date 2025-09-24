import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAdminSignUp } from "../api/internal"; // Ensure this hook is updated to not send the secret

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Use the custom hook for admin sign-up
    const { adminSignUp, loading, error } = useAdminSignUp();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Secret key validation is removed
        if (!name || !email || !password) {
            return toast.error("Please fill all the fields!");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        try {
            // The `secret` parameter is no longer passed
            await adminSignUp(name, email, password);
            toast.success("Admin account created successfully! Please sign in.");
            navigate("/login"); // Redirect to login page on success
        } catch (err) {
            toast.error(error || "Failed to create admin account.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <main className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
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
                        Join us today!
                    </h2>
                    <p className="text-xl text-gray-600">
                        Create your administrator account.
                    </p>
                </div>

                {/* Sign-Up Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
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

                    {/* REMOVED: Admin Secret Key Field */}

                    {/* Sign In Link */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                            Already have an account?
                        </span>
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
                    >
                        {loading ? "Creating Account..." : "SIGN UP"}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default SignUp;