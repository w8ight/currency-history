import React from 'react';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import config from '../cfg';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            exchangeRates: [],
            daysToShow: config.app.daysToShow,
            ...props.initialState
        };
    }

    componentDidMount() {
        this.Chart = require('chart.js');
        Loader({days: this.state.daysToShow}).then(exchangeRates => {
            this.setState({exchangeRates}, this.initChart);
        });
    }

    filters = [
        {label: '1 Week', days: 7},
        {label: '2 Weeks', days: 14},
        {label: '3 Weeks', days: 21},
        {label: '4 Weeks', days: 28},
    ];

    prepareChartData = (exchangeRates) => {
        return exchangeRates.reverse().map(exchange => exchange.rates.EUR);
    };

    prepareChartLabels = (exchangeRates) => {
        return exchangeRates.reverse().map(exchange => moment(exchange.date).format('DD. MMM'));
    };

    calculateMaxTick = (exchangeRates) => {
        return Math.max(...exchangeRates.map(exchange => exchange.rates.EUR)) + 0.01;
    };

    calculateMinTick = (exchangeRates) => {
        return Math.min(...exchangeRates.map(exchange => exchange.rates.EUR)) - 0.01;
    };

    handleFilterClick = (days) => {
        Loader({days}).then(exchangeRates => {
            this.setState({exchangeRates, daysToShow: days}, () => {
                const {exchangeRates} = this.state;

                this.myChart.data.labels = this.prepareChartLabels(exchangeRates);
                this.myChart.data.datasets[0].data = this.prepareChartData(exchangeRates);
                this.myChart.options.scales.yAxes[0].ticks.max = this.calculateMaxTick(exchangeRates);
                this.myChart.options.scales.yAxes[0].ticks.min = this.calculateMinTick(exchangeRates);

                this.myChart.update();
            });
        });
    };

    initChart = () => {
        const {exchangeRates} = this.state;

        const ctx = document.getElementById("myChart");

        this.myChart = new this.Chart(ctx, {
            type: 'line',
            data: {
                labels: this.prepareChartLabels(exchangeRates),
                datasets: [
                    {
                        label: "",
                        fill: true,
                        lineTension: 0.5,
                        backgroundColor: "#252631",
                        borderColor: 'transparent',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "white",
                        pointBackgroundColor: "#252631",
                        pointBorderWidth: 3,
                        pointRadius: 8,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: "#252631",
                        pointHoverBorderColor: "white",
                        pointHoverBorderWidth: 4,
                        pointHitRadius: 10,
                        pointHitBackground: 'red',
                        data: this.prepareChartData(exchangeRates),
                        spanGaps: false,
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                animation: {
                    easing: 'easeOutQuart'
                },
                responsive: true,
                maintainAspectRatio: true,
                bezierCurve: true,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleMarginBottom: 0,
                    titleSpacing: 0,
                    bodySpacing: 0,
                    bodyFontSize: 30,
                    bodyFontStyle: 'bold',
                    bodyFontColor: '#fff',
                    titleFontSize: 0,
                    displayColors: false
                },
                scales:
                    {
                        yAxes: [{
                            display: false,
                            ticks: {
                                max: this.calculateMaxTick(exchangeRates),
                                min: this.calculateMinTick(exchangeRates)
                            }
                        }],
                        xAxes: [
                            {
                                gridLines: {
                                    display: false,
                                    drawBorder: false,
                                    tickMarkLength: 0
                                },
                                scaleLabel: {
                                    display: false
                                },
                                ticks: {
                                    display: false
                                }
                            }
                        ]
                    }
            }
        });

    };

    render() {
        return (
            <div>
                <header>
                    <nav>
                        <ul>
                            {this.filters.map((filter, i) => <li className={this.state.daysToShow == filter.days ? 'active' : null} onClick={() => this.handleFilterClick(filter.days)} key={i}>{filter.label}</li>)}
                        </ul>
                    </nav>
                </header>
                <div className="content">
                    <div className="canvas-wrapper">
                        <canvas height="400" id="myChart"></canvas>
                    </div>
                </div>
            </div>
        )
    }
}

const Loader = ({days}) => {

    let datesInterval = [];

    for (let i = 1; i <= days; i++) {
        datesInterval.push(moment().add(-i, 'days').format('YYYY-MM-DD'))
    }

    return Promise.all(datesInterval.map(date => fetch(`http://api.fixer.io/${date}?symbols=EUR&base=USD`)
        .then(response => response.json())
        .then(result => {if (result.date != date) result.date = date; return result;})
    )).then(exchangeRates => exchangeRates);

};

export default App;
export {App, Loader};