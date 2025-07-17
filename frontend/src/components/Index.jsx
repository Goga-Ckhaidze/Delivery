import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';

const Index = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "" // added role
  });

  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://deliveryback-y8wi.onrender.com/api/users", data);
      const { token } = response.data;

      localStorage.setItem("token", token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_form_container">
        <div className="left">
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className="white_btn">
              Sign in
            </button>
          </Link>
        </div>
        <div className="right">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="First Name"
              name='firstName'
              value={data.firstName}
              required
              className="input"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              name='lastName'
              value={data.lastName}
              required
              className="input"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name='email'
              value={data.email}
              required
              className="input"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name='password'
              value={data.password}
              required
              className="input"
              onChange={handleChange}
            />

            {/* Role select input */}
            <select
              name="role"
              value={data.role}
              required
              onChange={handleChange}
              className="input"
              style={{ marginBottom: '15px' }}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="customer">Customer</option>
              <option value="delivery">Delivery Person</option>
            </select>

            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="green_btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
