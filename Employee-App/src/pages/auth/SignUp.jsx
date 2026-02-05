import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword, validateMobile, validateRequired } from '../../utils/validation';
import './SignUp.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobile: '',
        dob: '',
        bloodGroup: '',
        department: '',
        designation: '',
        role: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const usernameError = validateRequired('Username', formData.username);
        if (usernameError) newErrors.username = usernameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const mobileError = validateMobile(formData.mobile);
        if (mobileError) newErrors.mobile = mobileError;

        const dobError = validateRequired('Date of Birth', formData.dob);
        if (dobError) newErrors.dob = dobError;

        const bloodGroupError = validateRequired('Blood Group', formData.bloodGroup);
        if (bloodGroupError) newErrors.bloodGroup = bloodGroupError;

        const departmentError = validateRequired('Department', formData.department);
        if (departmentError) newErrors.department = departmentError;

        const designationError = validateRequired('Designation', formData.designation);
        if (designationError) newErrors.designation = designationError;

        const roleError = validateRequired('Role', formData.role);
        if (roleError) newErrors.role = roleError;

        const addressError = validateRequired('Address', formData.address);
        if (addressError) newErrors.address = addressError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Submitted:', formData);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Create Account</h1>
                </div>

                <form className="signup-form" onSubmit={handleSubmit} noValidate>
                    <div className="signup-form-row">
                        <div className="signup-form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                className={errors.username ? 'input-error' : ''}
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        <div className="signup-form-group">
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
                    </div>

                    <div className="signup-form-row">
                        <div className="signup-form-group">
                            <label>Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Enter your mobile number"
                                value={formData.mobile}
                                onChange={handleChange}
                                className={errors.mobile ? 'input-error' : ''}
                            />
                            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                        </div>
                        <div className="signup-form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className={errors.dob ? 'input-error' : ''}
                            />
                            {errors.dob && <span className="error-message">{errors.dob}</span>}
                        </div>
                    </div>

                    <div className="signup-form-row">
                        <div className="signup-form-group">
                            <label>Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className={errors.bloodGroup ? 'input-error' : ''}
                            >
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
                        </div>
                        <div className="signup-form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                name="department"
                                placeholder="Enter your department"
                                value={formData.department}
                                onChange={handleChange}
                                className={errors.department ? 'input-error' : ''}
                            />
                            {errors.department && <span className="error-message">{errors.department}</span>}
                        </div>
                    </div>

                    <div className="signup-form-row">
                        <div className="signup-form-group">
                            <label>Designation</label>
                            <input
                                type="text"
                                name="designation"
                                placeholder="Enter your designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className={errors.designation ? 'input-error' : ''}
                            />
                            {errors.designation && <span className="error-message">{errors.designation}</span>}
                        </div>
                        <div className="signup-form-group">
                            <label>Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={errors.role ? 'input-error' : ''}
                            >
                                <option value="">Select Role</option>
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <span className="error-message">{errors.role}</span>}
                        </div>
                    </div>

                    <div className="signup-form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            placeholder="Enter your address"
                            rows="2"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? 'input-error' : ''}
                            style={{ resize: 'none' }}
                        ></textarea>
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>

                    <div className="signup-form-row">
                        <div className="signup-form-group">
                            <label>Create Password</label>
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
                        <div className="signup-form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Enter your confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'input-error' : ''}
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="signup-auth-button">Sign Up</button>
                        <div className="signup-auth-footer">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </div>
                </form>

            </div>
        </div>
    );
};

export default SignUp;
