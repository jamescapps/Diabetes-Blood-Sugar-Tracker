import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from "prop-types"
import { connect } from "react-redux"

class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password1: '',
            password2: '',
            message: ''
        }

        this.onChangeFirstname = this.onChangeFirstname.bind(this)
        this.onChangeLastname = this.onChangeLastname.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this)
        this.onChangePassword1 = this.onChangePassword1.bind(this)
        this.onChangePassword2 = this.onChangePassword2.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/loggedin")
        }
    }

    onChangeFirstname(e) {
        this.setState({ firstname: e.target.value })
    }

    onChangeLastname(e) {
        this.setState({ lastname: e.target.value })
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value })
    }

    onChangePassword1(e) {
        this.setState({ password1: e.target.value })
    }

    onChangePassword2(e) {
        this.setState({ password2: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()

        const { firstname, lastname, email, password1, password2 } = this.state

        // Validate inputs
        if (!firstname || !lastname || !email || !password1 || !password2) {
            this.setState({ message: "All fields are required." })
            return
        }

        if (password1 !== password2) {
            this.setState({ message: "Passwords do not match." })
            return
        }

        const user = {
            firstname,
            lastname,
            email: email.toLowerCase(),
            password1,
            password2
        }

        axios.post('/users/add', user)
            .then(res => {
                this.setState({ message: res.data })
                // TODO change this
                if (res.data === "User added! Redirecting you to login page!") {
                    setTimeout(() => {
                        this.props.history.push('/login'); // Redirect using history
                    }, 1000);
                }
            })
            .catch(err => {
                this.setState({ message: "Error creating user. Please try again." })
            })
    }

    render() {
        return (
            <div>
                <div className="info">
                    <h1>Sign Up</h1>
                    <p>Start tracking your blood sugar levels</p><br />
                    <div style={{ textAlign: 'left' }} className="listCreate">
                        <ol>
                            <li>Create a profile.</li>
                            <li>Log in.</li>
                            <li>Enter your blood sugar level and click submit.</li>
                            <li>Your reading will be saved.</li>
                            <li>Repeat whenever you are required to take a reading.</li>
                        </ol>
                    </div>
                </div>
                <div className="outer_container_create">
                    <div className="inner_container">
                        <p>Profile</p>
                        <form onSubmit={this.onSubmit}>
                            <input className="firstname" type="text" name="firstname" placeholder="First Name" onChange={this.onChangeFirstname} />
                            <input className="lastname" type="text" name="lastname" placeholder="Last Name" onChange={this.onChangeLastname} />
                            <input className="email" type="text" name="email" placeholder="Email" onChange={this.onChangeEmail} />
                            <input className="pword1" type="password" name="password1" placeholder="Password" onChange={this.onChangePassword1} />
                            <input className="pword2" type="password" name="password2" placeholder="Confirm Password" onChange={this.onChangePassword2} />
                            <input type="submit" value="Create" />
                        </form>
                    </div>
                    <p>{this.state.message}</p>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Register)
