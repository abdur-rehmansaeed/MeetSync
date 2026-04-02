import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    alert("Logged in (Demo Mode)");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  );
};
export default Login;