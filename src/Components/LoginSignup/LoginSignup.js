import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginSignup.css';

// Function to validate username
const validateUsername = (username) => {
  const usernameRegex = /^(?=.*[A-Z])(?=.*\d)/;
  return usernameRegex.test(username);
};

// Function to validate password
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

const LoginSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    isLogin: true,
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword, isLogin } = formData;
    let newErrors = { username: '', password: '', confirmPassword: '' };

    if (!validateUsername(username)) {
      alert('Invalid Username: Must contain at least one capital letter and one number.');
      return;
    }

    if (!validatePassword(password)) {
      alert('Invalid Password: Must contain at least one capital letter, one number, and one special symbol.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.104:5005//${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleForm = () => {
    setFormData({
      ...formData,
      isLogin: !formData.isLogin,
      password: '',
      confirmPassword: '',
    });
    setErrors({ username: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="form-container">
      <h2>{formData.isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            placeholder="Username"
          />
        </div>

        <div className="password-input-container">
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Password"
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {!formData.isLogin && (
          <div className="password-input-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm Password"
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        )}

        <div>
          <button type="submit">{formData.isLogin ? 'Login' : 'Signup'}</button>
        </div>
      </form>

      <button onClick={toggleForm}>
        {formData.isLogin ? 'Need an account? Signup' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default LoginSignup;
