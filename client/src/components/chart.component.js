import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { logoutUser } from "./actions/authActions"
import { VictoryChart, VictoryBar, VictoryLine, VictoryPie, VictoryTooltip, VictoryLegend} from 'victory'
import moment from "moment"

import { getData, test } from "./functions/reused_functions"


class Chart extends Component {
    constructor(props) {
        super(props)

        this.state = {
        firstname: '',
        readings: [],
        message: '',
        id: '',
        listMessage: '',
        }
    }

    componentDidMount() {
        test()
        getData()
      
        const { user } = this.props.auth
        axios.get('/bloodsugar')
            .then(response => {
                //Match the current user with user in database
                const currentUser = response.data.filter((x) =>
                x._id === user.id
            )

                //Sort the array with readings by date so that values display in order.
                const sortedBloodSugarArray = currentUser[0].bloodSugar.sort((a,b) =>
                  new Date(a.date) - new Date(b.date) 
                )

                //If no readings are available, display a message.
                if (sortedBloodSugarArray.length === 0) {
                    this.setState({
                        listMessage: "Your readings will display here"
                    })
                }

                this.setState({
                    firstname: user.name,
                    id: user.id,
                    readings: sortedBloodSugarArray,
                })
            })
            .catch((error) => {
            console.log(error)
        })
    }

    averageReading() {
        let total = 0;
         for (var i = 0; i < this.state.readings.length; i++) {
             total += this.state.readings[i].level;
         }
     
         if (isNaN(Math.round(total / this.state.readings.length))) {
             return ""
         } else {
             return Math.round(total / this.state.readings.length)
         }
     }

    categoryStyle(lev) {
        if (lev > 140) {
            return {
                color: 'darkred'
            }
        } else if (lev < 70) {
            return {
                color: 'blue'
            }
        } else {
            return {
                color: 'green'
            }
        }
    }

    onLogoutClick = e => {
        e.preventDefault()
        this.props.logoutUser()
    }
    

    render() {
       //Format Date for VictoryBar
       this.state.readings.map(el => {
          return el.date = (moment.utc(el.date).local().format("MM-DD HH:MM"))
       })
       //Create percentages for low, normal and high for VictoryPie.
       let normalPercent = 0
       let lowPercent = 0
       let highPercent = 0

       for (var i = 0; i < this.state.readings.length; i++) {
           if (this.state.readings[i].level > 140) {
               highPercent ++
           } else if (this.state.readings[i].level < 70) {
               lowPercent ++
           } else {
               normalPercent ++
           }
       }

       highPercent = Math.round((highPercent / this.state.readings.length) * 100)
       lowPercent = Math.round((lowPercent / this.state.readings.length) * 100)
       normalPercent = Math.round((normalPercent /this.state.readings.length) * 100)

       const chartTheme = {
        axis: {
          style: {
            tickLabels: {
              fill: 'white',
              fontSize: 15
            },
            grid: { 
                stroke: "none" 
            } 
          },
        },
      }

      //Bar chart colors
      const colorSwitcher = {
          fill: (data) => {
              let color
              if (data.datum._y > 140) {
                  color = "darkred"
              } else if (data.datum._y < 70) {
                  color = "blue"
              } else {
                  color = "green"
              }

              return color
          }
      }
        return (
            <div>
                <div className = "nav">
                    <div className = "back">
                        <a href="/loggedin">Back to submit reading</a>
                    </div>
                    <div className = "logout">
                        <a href="/login" onClick={this.onLogoutClick}>Log out</a>
                    </div>
                </div>
                <br/><br/><br/>
                <div className = "average">
                    <h2>{this.state.firstname}</h2>
                    <h3>Your average blood sugar level is: <span style = {this.categoryStyle(this.averageReading())}>{this.averageReading()}</span></h3>
                </div>
                <div className = "legend">
                    <VictoryLegend
                        orientation="vertical"
                        style={{ labels: {fontSize: 5, fill: 'white' },
                                data: { stroke: "black", strokeWidth: .5}  
                                }}
                        data={[
                        { name: "High (above 140)", symbol: { fill: "darkred"} },
                        { name: "Normal (70-140)", symbol: { fill: "green" } },
                        { name: "Low (below 70)", symbol: { fill: "blue" } }
                        ]}
                    />
                </div>
                <div className = "victoryPie">
                    <VictoryPie
                        style={{ 
                                labels: { fill: 'white' },
                                data: { stroke: "black", strokeWidth: 2} 
                                }}
                        height={300} 
                        width={1500}
                        colorScale={["blue", "green", "darkred"]}
                        data={[
                            { x: "Low " + lowPercent + "%", y: lowPercent, labels: "Low" },
                            { x: "Normal " + normalPercent + "%", y: normalPercent },
                            { x: "High " + highPercent + "%", y: highPercent}
                        ]}
                    />
                </div><br />
                <div className = "victoryChart">
                    <VictoryChart
                        theme={ chartTheme } 
                        height={300} 
                        width={1500} 
                        domainPadding={{ x: 45 }}
                    >
                        <VictoryBar 
                            style={{
                                data: { ...colorSwitcher }
                                }}
                            labelComponent={<VictoryTooltip/>}
                            data={this.state.readings}
                            x="date"
                            y="level"
                            labels={this.state.readings.map(el => {
                                return el.level
                            })}
                        />
                        {/*Create lines to show low, normal, and high comparisons*/}
                        <VictoryLine 
                            style={{
                                data: {stroke: 'darkred'}, 
                            }}
                            data={[
                                { x: 0, y: 141 },
                                { x: this.state.readings.length, y: 141 },
                            ]}
                        />
                        <VictoryLine 
                            style={{
                                data: {stroke: 'green'}
                            }}
                            data={[
                                { x: 0, y: 70 },
                                { x: this.state.readings.length, y: 70 },
                            ]}
                        />
                        <VictoryLine 
                            style={{
                                data: {stroke: 'blue'}
                            }}
                            data={[
                                { x: 0, y: 1 },
                                { x: this.state.readings.length, y: 1 },
                            ]}
                        />
                   </VictoryChart>
                </div>
            </div>
        )
    }
}

Chart.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(
    mapStateToProps,
    { logoutUser }
)(Chart)