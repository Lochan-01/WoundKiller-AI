import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const navigate = useNavigate();

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isForgotPassword) {
      if (!isVerifyingCode && !isSettingNewPassword) {
        // Step 1: Email
        if (!email) {
          setError("Please enter your email.");
          return;
        }
        if (!validateEmail(email)) {
          setError("Please enter a valid email.");
          return;
        }
        setLoading(true);
        setTimeout(() => {
          setSuccess("Code sent to your email!");
          setLoading(false);
          setIsVerifyingCode(true);
        }, 1000);
        return;
      }

      if (isVerifyingCode && !isSettingNewPassword) {
        // Step 2: Code verification
        if (!resetCode) {
          setError("Please enter the code.");
          return;
        }
        if (resetCode !== "123456") {
          setError("Invalid code. Please try again.");
          return;
        }
        setLoading(true);
        setTimeout(() => {
          setSuccess("Code verified! Set new password.");
          setLoading(false);
          setIsSettingNewPassword(true);
          setResetCode("");
        }, 1000);
        return;
      }

      if (isSettingNewPassword) {
        // Step 3: New password
        if (!newPassword || !confirmNewPassword) {
          setError("Please fill in all fields.");
          return;
        }
        if (newPassword !== confirmNewPassword) {
          setError("Passwords do not match.");
          return;
        }
        if (newPassword.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        setLoading(true);
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const userIndex = users.findIndex(u => u.username === email.split("@")[0]);
          if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
          }
          setLoading(false);
          setSuccess("Password reset successfully!");
          setTimeout(() => {
            setIsForgotPassword(false);
            setIsVerifyingCode(false);
            setIsSettingNewPassword(false);
            setEmail("");
            setNewPassword("");
            setConfirmNewPassword("");
            setError("");
            setSuccess("");
          }, 1500);
        }, 1000);
        return;
      }
    }

    if (isSignup) {
      if (!username || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      // Check if username already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some(user => user.username === username)) {
        setError("Username already exists. Please choose a different one.");
        return;
      }

      // Simulate signup
      setLoading(true);
      setTimeout(() => {
        // Add new user to the users array
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        setLoading(false);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setIsSignup(false);
        setSuccess("Account created successfully! Please login.");
      }, 1000);
      return;
    }

    // Login
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.length === 0) {
      setError("No account exists. Please sign up first.");
      return;
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      setError("Invalid username.");
      return;
    }

    if (password !== user.password) {
      setError("Wrong password.");
      return;
    }

    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      localStorage.setItem("loggedIn", "true");
      onLogin();
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  }

  function clearForgotStates() {
    setIsVerifyingCode(false);
    setIsSettingNewPassword(false);
    setResetCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  }

  function handleModeSwitch(newMode) {
    setError("");
    setSuccess("");
    setLoading(false);
    if (isForgotPassword) {
      clearForgotStates();
    }
    setIsForgotPassword(newMode === 'forgot');
    setIsSignup(newMode === 'signup');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Woundkiller</h1>
          <p className="text-gray-600">Advanced wound care solutions</p>
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleModeSwitch('login')}
            className={`px-4 py-2 rounded-l-lg transition ${!isSignup && !isForgotPassword ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => handleModeSwitch('signup')}
            className={`px-4 py-2 rounded-r-lg transition ${isSignup ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Signup
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          {isForgotPassword ? "Reset Password 🔑" : isSignup ? "Create Account 📝" : "Login 🔐"}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-bounce">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isForgotPassword ? (
            <>
              {!isVerifyingCode && !isSettingNewPassword ? (
                // Step 1: Email
                <>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">📧</span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </>
              ) : isVerifyingCode ? (
                // Step 2: Code
                <>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">🔢</span>
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </>
              ) : (
                // Step 3: New Password
                <>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Reset Password"}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">👤</span>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                  required={!isSignup}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isSignup && (
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (isSignup ? "Creating..." : "Logging in...") : isSignup ? "Create Account" : "Login"}
              </button>
            </>
          )}
        </form>
        {!isForgotPassword && !isSignup && (
          <div className="mt-4 text-center">
            <button
              onClick={() => handleModeSwitch('forgot')}
              className="text-blue-600 hover:underline transition"
            >
              Forgot Password?
            </button>
          </div>
        )}
        {isForgotPassword && (
          <div className="mt-4 text-center">
            <button
              onClick={() => handleModeSwitch('login')}
              className="text-blue-600 hover:underline transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
