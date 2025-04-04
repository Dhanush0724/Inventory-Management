import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/authService"; 

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      navigate(user.role === "admin" ? "/admin-dashboard" : "/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
