import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logoutUser } from '../actions/authActions'
import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryPie,
  VictoryTooltip,
  VictoryLegend,
} from 'victory'
import moment from 'moment'
import "../App.css"

class Chart extends Component {
  state = {
    firstname: '',
    readings: [],
    message: '',
    id: '',
    listMessage: '',
  }

  componentDidMount() {
    const { user } = this.props.auth;
    axios
      .get(`/bloodsugar/$`)
      .then((response) => {
        // TODO sort on backend
        const sortedBloodSugarArray = response.data.bloodSugar.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )

        this.setState({
          firstname: user.name,
          id: user.id,
          readings: sortedBloodSugarArray || [],
          listMessage:
            sortedBloodSugarArray && sortedBloodSugarArray.length === 0
              ? 'Your readings will display here'
              : '',
        })
      })
      .catch((error) => console.log(error))
  }

  // TODO - avg reading on backend
  averageReading = () => {
    const { readings } = this.state;
    const total = readings.reduce((acc, { level }) => acc + level, 0)
    return readings.length ? Math.round(total / readings.length) : ''
  };

  categoryStyle = (lev) => {
    if (lev > 140) return { color: 'darkred' }
    if (lev < 70) return { color: 'blue' }
    return { color: 'green' }
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }

  formatReadings = () => {
    return this.state.readings.map((el) => ({
      ...el,
      date: moment.utc(el.date).local().format('MM-DD HH:mm'),
    }))
  }

  getPercentages = () => {
    const { readings } = this.state
    const totalReadings = readings.length

    const { normalPercent, lowPercent, highPercent } = readings.reduce(
      (acc, { level }) => {
        if (level > 140) acc.highPercent++
        else if (level < 70) acc.lowPercent++
        else acc.normalPercent++
        return acc
      },
      { normalPercent: 0, lowPercent: 0, highPercent: 0 }
    )

    return {
      normalPercent: Math.round((normalPercent / totalReadings) * 100),
      lowPercent: Math.round((lowPercent / totalReadings) * 100),
      highPercent: Math.round((highPercent / totalReadings) * 100),
    }
  }

  render() {
    const formattedReadings = this.formatReadings()
    const { normalPercent, lowPercent, highPercent } = this.getPercentages()

    const chartTheme = {
      axis: {
        style: {
          tickLabels: {
            fill: 'white',
            fontSize: 15,
          },
          grid: {
            stroke: 'none',
          },
        },
      },
    }

    const colorSwitcher = {
      fill: ({ datum }) => {
        if (datum._y > 140) return 'darkred'
        if (datum._y < 70) return 'blue'
        return 'green'
      },
    }

    return (
      <div>
        <div className="nav">
          <div className="back">
            <a href="/loggedin">Back to submit reading</a>
          </div>
          <div className="logout">
            <a href="/login" onClick={this.onLogoutClick}>
              Log out
            </a>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="average">
          <h2>{this.state.firstname}</h2>
          <h3>
            Your average blood sugar level is:{' '}
            <span style={this.categoryStyle(this.averageReading())}>
              {this.averageReading()}
            </span>
          </h3>
        </div>
        <div className="legend">
          <VictoryLegend
            orientation="vertical"
            style={{
              labels: { fontSize: 5, fill: 'white' },
              data: { stroke: 'black', strokeWidth: 0.5 },
            }}
            data={[
              { name: 'High (above 140)', symbol: { fill: 'darkred' } },
              { name: 'Normal (70-140)', symbol: { fill: 'green' } },
              { name: 'Low (below 70)', symbol: { fill: 'blue' } },
            ]}
          />
        </div>
        <div className="victoryPie">
          <VictoryPie
            style={{
              labels: { fill: 'white' },
              data: { stroke: 'black', strokeWidth: 2 },
            }}
            height={300}
            width={1500}
            colorScale={['blue', 'green', 'darkred']}
            data={[
              { x: `Low ${lowPercent}%`, y: lowPercent },
              { x: `Normal ${normalPercent}%`, y: normalPercent },
              { x: `High ${highPercent}%`, y: highPercent },
            ]}
          />
        </div>
        <br />
        <div className="victoryChart">
          <VictoryChart theme={chartTheme} height={300} width={1500} domainPadding={{ x: 45 }}>
            <VictoryBar
              style={{
                data: { ...colorSwitcher },
              }}
              labelComponent={<VictoryTooltip />}
              data={formattedReadings}
              x="date"
              y="level"
              labels={formattedReadings.map((el) => el.level)}
            />
            <VictoryLine
              style={{
                data: { stroke: 'darkred' },
              }}
              data={[
                { x: 0, y: 141 },
                { x: formattedReadings.length, y: 141 },
              ]}
            />
            <VictoryLine
              style={{
                data: { stroke: 'green' },
              }}
              data={[
                { x: 0, y: 70 },
                { x: formattedReadings.length, y: 70 },
              ]}
            />
            <VictoryLine
              style={{
                data: { stroke: 'blue' },
              }}
              data={[
                { x: 0, y: 1 },
                { x: formattedReadings.length, y: 1 },
              ]}
            />
          </VictoryChart>
        </div>
      </div>
    );
  }
}

Chart.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logoutUser })(Chart)
