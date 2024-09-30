import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { logoutUser } from "../actions/authActions"
import moment from "moment"
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

const FullHistory = ({ auth, logoutUser }) => {
    const [firstname, setFirstname] = useState('')
    const [readings, setReadings] = useState([])
    const [message, setMessage] = useState('')
    const [listMessage, setListMessage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReadings = async () => {
            try {
                const response = await axios.get(`/bloodsugar/${auth.user.id}`) //TODO- I may have accidentally deleted this endpoint.
                // TODO sort on the backend
                const sortedReadings = response.data.bloodSugar.sort((a, b) => new Date(b.date) - new Date(a.date))

                if (sortedReadings.length === 0) {
                    setListMessage("Your readings will display here")
                }

                setFirstname(auth.user.name)
                setReadings(sortedReadings)
            } catch (error) {
                console.error(error)
                setMessage("Error fetching data. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchReadings()
    }, [auth.user.id])

    const alertBox = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this reading?',
            buttons: [
                { label: 'Yes', onClick: () => deleteItem(id) },
                { label: 'No' }
            ]
        })
    }

    const deleteItem = async (id) => {
        try {
            const url = `/bloodsugar/${auth.user.id}/${id}`
            const res = await axios.delete(url)
            setMessage(res.data);
            if (res.data === "Reading deleted!") {
                setReadings(prev => prev.filter(reading => reading._id !== id))
            }
        } catch (error) {
            setMessage("Error deleting reading. Please try again later.")
        }
    }

    const averageReading = () => {
        if (readings.length === 0) return ""
        const total = readings.reduce((acc, reading) => acc + reading.level, 0)
        return Math.round(total / readings.length)
    }

    const renderCategory = (lev) => {
        if (lev > 140) return "High"
        if (lev < 70) return "Low"
        return "Normal"
    }

    const categoryStyle = (lev) => {
        if (lev > 140) return { color: 'red' }
        if (lev < 70) return { color: 'blue' }
        return { color: 'green' }
    }

    const renderList = () => (
        readings.map(el => (
            <div className="levelRendered2" key={el._id}>
                <li>{el.level}</li>
                <li style={categoryStyle(el.level)}>{renderCategory(el.level)}</li><br /><br />
            </div>
        ))
    )

    const renderDates = () => (
        readings.map(el => (
            <div className="dateAndTime" key={el._id}>
                <div className="dateRendered">
                    <li>{moment.utc(el.date).local().format('MMM. D, YYYY hh:mm A')}</li>
                </div>
                <div className="delete">
                    <li className="delete" onClick={() => alertBox(el._id)}><u>delete</u>&emsp;</li><br />
                </div>
            </div>
        ))
    )

    const onLogoutClick = (e) => {
        e.preventDefault();
        confirmAlert({
            title: 'Confirm Logout',
            message: 'Are you sure you want to log out?',
            buttons: [
                { label: 'Yes', onClick: logoutUser },
                { label: 'No' }
            ]
        })
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <div className="nav">
                <div className="back">
                    <a href="/loggedin">Back to submit</a>
                </div>
                <div className="logout">
                    <a href="/login" onClick={onLogoutClick}>Log out</a>
                </div>
            </div>
            <div className="info">
                <h1>Welcome {firstname.charAt(0).toUpperCase() + firstname.substring(1)}</h1>
                <p>{listMessage}</p>
                <div className="list">
                    <ul>{renderDates()}</ul>
                    <div className="listMessage">{listMessage}</div><br /><br />
                    <ul>{renderList()}</ul>
                </div>
                <p>{message}</p>
            </div>
        </div>
    )
}

FullHistory.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(FullHistory)
