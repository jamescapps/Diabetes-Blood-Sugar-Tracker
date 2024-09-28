import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const resetToken = window.location.pathname.split('/').pop();

        const fetchResetToken = async () => {
            try {
                const res = await axios.get('/resetpassword/reset/', {
                    params: { resetPasswordToken: resetToken }
                });
                if (res.data.message === "Password reset link ok.") {
                    setEmail(res.data.email);
                    setMessage(res.data.message);
                } else {
                    setMessage(res.data);
                }
            } catch (err) {
                console.error(err);
                setMessage("Error fetching reset token.");
            }
        };

        fetchResetToken();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password1 !== password2) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        
        const user = { email, password1, password2 };

        try {
            const res = await axios.post('/updatePasswordViaEmail/updatePasswordViaEmail', user);
            setMessage(res.data);
            
            if (res.data === "Password updated! Redirecting you to login page!") {
                setTimeout(() => {
                    window.location = '/login';
                }, 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage("Error updating password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="outer_container">
            <br /><br /><br /><br /><br /><br /><br />
            <div className="inner_container">
                <p>Password Reset</p>
                <form onSubmit={onSubmit}>
                    <input
                        className="pword1"
                        type="password"
                        name="password1"
                        placeholder="New Password"
                        onChange={(e) => setPassword1(e.target.value)}
                    />
                    <input
                        className="pword2"
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <input type="submit" value={loading ? "Resetting..." : "Reset"} disabled={loading} />
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
