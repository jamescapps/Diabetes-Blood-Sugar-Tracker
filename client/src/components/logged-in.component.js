import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "./actions/authActions";
import moment from "moment";

const Dashboard = ({ auth, logoutUser }) => {
    const [firstname, setFirstname] = useState('');
    const [id, setId] = useState('');
    const [level, setLevel] = useState(0);
    const [date, setDate] = useState(new Date());
    const [allReadings, setAllReadings] = useState([]);
    const [readings, setReadings] = useState([]);
    const [message, setMessage] = useState('');
    const [listMessage, setListMessage] = useState('');

    useEffect(() => {
        const { user } = auth;
        
        const fetchData = async () => {
            try {
                const response = await axios.get('/bloodsugar');
                const currentUser = response.data.find(x => x._id === user.id);
                const sortedBloodSugarArray = currentUser.bloodSugar.sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                );

                setFirstname(user.name);
                setId(user.id);
                setAllReadings(sortedBloodSugarArray);
                setReadings(sortedBloodSugarArray.slice(0, 5));
                
                if (sortedBloodSugarArray.length === 0) {
                    setListMessage("Your readings will display here");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [auth]);

    const renderCategory = (lev) => {
        if (lev > 140) return "High";
        if (lev < 70) return "Low";
        return "Normal";
    };

    const categoryStyle = (lev) => {
        if (lev > 140) return { color: 'red' };
        if (lev < 70) return { color: 'blue' };
        return { color: 'green' };
    };

    const renderList = () => {
        return readings.map((el) => (
            <div className="levelRendered" key={el._id}>
                <li>{el.level}</li>
                <li style={categoryStyle(el.level)}>{renderCategory(el.level)}</li><br />
            </div>
        ));
    };

    const renderDates = () => {
        return readings.map((el) => (
            <div className="dateAndTime" key={el._id}>
                <div className="dateRendered">
                    <li>{moment.utc(el.date).local().format('MMM. D, YYYY  hh:mm A').substr(0, 13)}</li>
                </div>
                <div className="timeRendered">
                    <li>{moment.utc(el.date).local().format('MMM. D, YYYY  hh:mm A').substr(13, 20)}</li><br />
                </div>
            </div>
        ));
    };

    const averageReading = () => {
        const total = allReadings.reduce((sum, reading) => sum + reading.level, 0);
        const avg = total / allReadings.length;
        return isNaN(Math.round(avg)) ? "" : Math.round(avg);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const reading = { id, level, date };

        try {
            const res = await axios.post('/bloodsugar/add', reading);
            setMessage(res.data);
            if (res.data === "Reading added!") {
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error) {
            console.error("Error submitting reading:", error);
        }
    };

    const onLogoutClick = (e) => {
        e.preventDefault();
        logoutUser();
    };

    return (
        <div className="main">
            <div className="nav">
                <div className="back" style={{ visibility: 'hidden' }}>
                    <a href="/loggedin">Back to submit reading</a>
                </div>
                <div className="logout">
                    <a href="/login" onClick={onLogoutClick}>Log out</a>
                </div>
            </div>
            <div className="info">
                <h1>Welcome {firstname.charAt(0).toUpperCase() + firstname.substring(1)}</h1>
                <p style={{ visibility: listMessage === "Your readings will display here" ? 'hidden' : 'visible' }}>
                    Here are your most recent readings
                </p><br />
                <div className="list" style={{ justifyContent: listMessage === "Your readings will display here" ? 'center' : 'flex-start' }}>
                    <div className="dates">
                        <ul>
                            {renderDates()}
                        </ul>
                    </div>
                    <div className="listMessage">
                        {listMessage}
                    </div><br /><br /><br /><br /><br />
                    <div className="level">
                        <ul>
                            {renderList()}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="outer_container_list">
                <p style={{ visibility: listMessage === "Your readings will display here" ? 'hidden' : 'visible' }}>
                    Your average blood sugar level is: <span style={categoryStyle(averageReading())}>{averageReading()}</span>
                </p>
                <p>View your <a href="/chart">charts</a>.</p>
                <p>View your <a href="/fullhistory">full history</a>.</p><br />
                <div className="inner_container">
                    <p>New Reading</p>
                    <form onSubmit={onSubmit}>
                        <div className="dateform">
                            <label>Date: </label>
                            <div className="datepicker">
                                <DatePicker
                                    selected={date}
                                    onChange={setDate}
                                    showTimeSelect
                                />
                            </div>
                        </div>
                        <input className="newreading" type="text" name="newreading" placeholder="Level" onChange={(e) => setLevel(e.target.value)} style={{ textAlign: 'center' }} />
                        <input type="submit" value="Submit" />
                    </form>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
