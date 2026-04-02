const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registered (Demo Mode)");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;