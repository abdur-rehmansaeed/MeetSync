const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registered (Demo Mode)");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Register</button>
    </form>
  );
};
export default Register;