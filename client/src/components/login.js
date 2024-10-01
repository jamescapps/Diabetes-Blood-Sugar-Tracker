import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { loginUser } from "../actions/authActions"


const Login = ({ auth, loginUser, history }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (auth.isAuthenticated) {
            history.push("/loggedin")
        }
    }, [auth.isAuthenticated, history])

    const onSubmit = async (e) => {
        e.preventDefault()

        const userData = {
            email: email.toLowerCase(),
            password,
        }

        try {
            const res = await axios.post('/login/login', userData)
            if (res.data.success) {
                loginUser(userData)
            } else {
                setMessage(res.data.toString())
            }
        } catch (error) {
            setMessage("There was an error attempting to login.")
        }
    }

    return (
        <div>
            <div className="outer_container">
                <div className="inner_container">
                    <h1>Blood Sugar Tracker</h1>
                    <p>An app for diabetics</p>
                    <form onSubmit={onSubmit}>
                        <input
                            className="email"
                            type="text"
                            name="email"
                            placeholder="email"
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ textAlign: 'left' }}
                        />
                        <input
                            className="pword"
                            type="password"
                            name="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input type="submit" value="Login" />
                    </form>
                    <p><a href="/forgotpassword">Forgot</a> my password.</p>
                    <p><a href="/createuser">Create</a> an account.</p>
                </div>
                <p>{message}</p>
            </div>
        </div>
    )
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, { loginUser })(Login)
