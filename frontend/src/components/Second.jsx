import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Second = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:5000/api/auth", data);
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
        <>
        <div className="signup_container">
            <div className="signup_form_container">
                <div className="left">
                    <h1>New Here?</h1>
                    <Link to="/signup">
                        <button type="button" className="white_btn">
                            Sign Up
                        </button>
                    </Link>
                </div>
                <div className="right">
                    <form className="form_container" onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={data.email}
                            required
                            className="input"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={data.password}
                            required
                            className="input"
                            onChange={handleChange}
                        />
                        {error && <div className="error_msg">{error}</div>}
                        <button type="submit" className="green_btn">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default Second;
