import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const onUserRegistration = e =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    const onFormSubmit = e => {
        e.preventDefault();

        console.log(formData);
    };

    const { email, password } = formData;
    return (
        <>
            <h1 className="large text-primary">Sign Up</h1>

            <form className="form" onSubmit={onFormSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onUserRegistration}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onUserRegistration}
                        minLength="6"
                    />
                </div>

                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Login"
                />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </>
    );
};

export default Login;
