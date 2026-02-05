import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validation';
import './SignIn.css';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            return;
        }

        console.log('Login Attempt:', formData);
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <div className="signin-header">
                    <h1>Sign in</h1>
                </div>

                <form className="signin-form" onSubmit={handleSubmit} noValidate>
                    <div className="signin-form-group">
                        <label>Email ID</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="signin-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Forgot password?</a>
                    </div>

                    <button type="submit" className="signin-auth-button">Sign In</button>
                </form>

                <div className="signin-auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
