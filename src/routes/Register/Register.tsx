import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../../utils/types';
import { BASE_URL } from '../../utils/backend-conf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

type RegisterProps = {
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
};

interface RegistrationForm {
  Email: string;
  FirstName: string;
  LastName: string;
  Address: string;
  City: string;
  PostalCode: string;
  PhoneNumber: string;
  Password: string;
  userName: string;
}

const Register = ({ setUserData }: RegisterProps) => {
  const [formData, setFormData] = useState<RegistrationForm>({
    Email: '',
    FirstName: '',
    LastName: '',
    Address: '',
    City: '',
    PostalCode: '',
    PhoneNumber: '',
    Password: '',
    userName: '',
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/account/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const notify = () => toast.success('The reisgtration was successful!', { autoClose: 2000 });

      if (response.status === 200) {
        notify();
        const userData: User = await response.json();
        setUserData(userData);
        
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed.');
      }

      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Fill in your details to register</p>
        </div>

          {/*error && <div className="error-message">{error}</div>*/}

        <form className="register-form" onSubmit={handleSubmit}>
         

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="Email"
              type="email"
              autoComplete="email"
              required
              value={formData.Email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="Password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.Password}
              onChange={handleChange}
            />
          </div>

          <div className="name-fields">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="FirstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.FirstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="LastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.LastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="PhoneNumber"
              type="tel"
              autoComplete="tel"
              required
              value={formData.PhoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="Address"
              type="text"
              autoComplete="street-address"
              required
              value={formData.Address}
              onChange={handleChange}
            />
          </div>

          <div className="location-fields">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="City"
                type="text"
                autoComplete="address-level2"
                required
                value={formData.City}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                name="PostalCode"
                type="text"
                autoComplete="postal-code"
                required
                value={formData.PostalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="register-button">
            Register
          </button>

          <Link to="/login" className="login-link">
            Already have an account? Sign in
          </Link>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;