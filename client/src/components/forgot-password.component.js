import React, { Component } from 'react'
import axios from 'axios'

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.onChangeEmail = this.onChangeEmail.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            email: '',
            message: '',
            loading: false // New loading state
        }
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex
        return re.test(String(email).toLowerCase());
    }

    onSubmit(e) {
        e.preventDefault()

        const { email } = this.state;

        // Validate email format
        if (email === '') {
            this.setState({
                message: "Please enter your email address."
            })
            return;
        }

        if (!this.validateEmail(email)) {
            this.setState({
                message: "Please enter a valid email address."
            })
            return;
        }

        this.setState({ loading: true }); // Start loading

        axios.post('/forgotpassword/forgotpassword', { email })
            .then(res => {
                this.setState({
                    message: res.data,
                    loading: false // Stop loading
                })
            })
            .catch(err => {
                this.setState({
                    message: "Error processing request. Please try again later.",
                    loading: false // Stop loading
                });
            });
    }

    render() {
        return (
            <div>
                <div className="outer_container">
                    <div className="inner_container">
                        <h1>Forgot your password?</h1>
                        <form onSubmit={this.onSubmit}>
                            <input
                                className="email"
                                type="email" // Changed type to email
                                name="email"
                                placeholder="Email"
                                onChange={this.onChangeEmail}
                                style={{ textAlign: 'center' }}
                                required // HTML5 validation
                            />
                            <input
                                type="submit"
                                value={this.state.loading ? "Resetting..." : "Reset"} // Change button text while loading
                                disabled={this.state.loading} // Disable button while loading
                            />
                        </form>
                        <p>{this.state.message}</p>
                    </div>
                </div>
            </div>
        )
    }
}
