import React, { Component } from 'react';
import axios from 'axios';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password1: '',
            password2: '',
            message: '',
            loading: false
        };
    }

    componentDidMount() {
        const resetToken = window.location.pathname.split('/').pop();

        axios.get('/resetpassword/reset/', {
            params: { resetPasswordToken: resetToken }
        })
        .then(res => {
            if (res.data.message === "Password reset link ok.") {
                this.setState({
                    email: res.data.email,
                    message: res.data.message
                });
            } else {
                this.setState({ message: res.data });
            }
        })
        .catch(err => {
            console.error(err);
            this.setState({ message: "Error fetching reset token." });
        });
    }

    onChangePassword1 = (e) => {
        this.setState({ password1: e.target.value });
    };

    onChangePassword2 = (e) => {
        this.setState({ password2: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { email, password1, password2 } = this.state;

        if (password1 !== password2) {
            this.setState({ message: "Passwords do not match." });
            return;
        }

        this.setState({ loading: true });
        
        const user = { email, password1, password2 };
       
        axios.post('/updatePasswordViaEmail/updatePasswordViaEmail', user)
            .then(res => {
                this.setState({ message: res.data });
                
                if (res.data === "Password updated! Redirecting you to login page!") {
                    setTimeout(() => {
                        window.location = '/login';
                    }, 1000);
                }
            })
            .catch(err => {
                console.error(err);
                this.setState({ message: "Error updating password." });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    render() {
        const { message, loading } = this.state;

        return (
            <div className="outer_container">
                <br /><br /><br /><br /><br /><br /><br />
                <div className="inner_container">    
                    <p>Password Reset</p>
                    <form onSubmit={this.onSubmit}>
                        <input
                            className="pword1"
                            type="password"
                            name="password1"
                            placeholder="New Password"
                            onChange={this.onChangePassword1}
                        />
                        <input
                            className="pword2"
                            type="password"
                            name="password2"
                            placeholder="Confirm Password"
                            onChange={this.onChangePassword2}
                        />
                        <input type="submit" value={loading ? "Resetting..." : "Reset"} disabled={loading} />
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        );
    }
}
