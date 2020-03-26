import React, { Fragment } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { Container, Row, Col } from 'reactstrap';
import {
    ComposableMap,
    Geographies,
    Geography,
    Sphere,
    Graticule
} from "react-simple-maps";
import { Slider, Intent, Label } from '@blueprintjs/core';

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

export default class MapChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dates: [],
            max: 1,
            dateIndex: 0,
            date: '3/24/20'
        }
    }

    componentDidMount() {
        csv(this.props.datalink).then(data => {
            data = this.mergeRegions(data);
            let firstrow = Object.keys(data[0])
            //console.log("firstrow", data[1]);
            for (let n = 1; n <= 4; n++) firstrow.shift()
            firstrow.pop();
            this.setState({ data, dateIndex: 0, date: firstrow[0], dates: [...firstrow] });
        });
    }

    componentWillUpdate(nextProps, nextState) {
        this.colorScale = scaleLinear().domain([this.props.min, nextState.max]).range(["#eee", "#f00"]);
    }

    mergeRegions(data) {

        let newPreData = {}
        let manageKeys

        data.map(row => {
            row.Name = this.nameFix(row['Country/Region']);
            if (manageKeys === undefined) {
                manageKeys = Object.keys(row).filter(find => (find !== 'Province/State' && find !== 'Name' && find !== 'Lat' && find !== 'Long'))
            }
            if (newPreData[row.Name] === undefined) {
                newPreData[row.Name] = row;
            }
            else {
                manageKeys.map(key => {
                    newPreData[row.Name][key] = parseInt(newPreData[row.Name][key])
                    newPreData[row.Name][key] += parseInt(row[key])
                })
            }
        })

        return Object.values(newPreData)
    }

    nameFix(input) {
        let conv = {
            'US': 'United States',
            'Greenland': 'Denmark',
            'Congo (Brazzaville)': 'Dem. Rep. Congo',
            'Congo (Kinshasa)': 'Dem. Rep. Congo',
            'Korea, South': 'South Korea',
        };
        return conv[input] !== undefined ? conv[input] : input
    }

    changeDate(val) {
        this.setState({ dateIndex: val, date: this.state.dates[val] })
    }

    perCapita(geo, count) {
        return 100000 / geo.properties.POP_EST * count;
    }

    datalessCountryColor(geo) {
        return "#ddd";
    }

    render() {
        const data = this.state.data;

        if (this.state.dates.length === 0) return <Fragment />

        return (

            <Fragment>
                <Container>
                    <h1>{this.props.title}</h1>
                    <Row className="pl-3 pr-3">
                        <Col md={8}>
                            <Label>
                                Date
                                <Slider
                                    min={0}
                                    max={this.state.dates.length - 1}
                                    stepSize={1}
                                    labelStepSize={10}
                                    intent={this.props.intent}
                                    onChange={val => this.changeDate(val)}
                                    labelRenderer={val => this.state.dates[val]}
                                    showTrackFill={true}
                                    value={this.state.dateIndex}
                                    vertical={false}
                                />
                            </Label>
                        </Col>
                        <Col md={1} />
                        <Col md={3}>
                            <Label>
                                Dedramatizer
                                <Slider
                                    min={1}
                                    max={400}
                                    stepSize={50}
                                    labelStepSize={50}
                                    intent={Intent.SUCCESS}
                                    onChange={max => this.setState({ max })}
                                    labelRenderer={val => parseInt((val / 400) * 11)}
                                    showTrackFill={false}
                                    value={this.state.max}
                                    vertical={false}
                                />
                            </Label>
                        </Col>
                    </Row>
                </Container>
                <Container fluid style={{ marginTop: 'calc((-100% / 12)', marginBottom: 'calc((-100% / 12)' }}>
                    <ComposableMap
                        projectionConfig={{
                            rotate: [-10, 0, 0],
                            scale: 147
                        }}
                    >
                        <Sphere stroke="#E4E5E6" strokeWidth={1.4} />
                        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                        {data.length > 0 && (
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map(geo => {
                                        const d = data.find(s => (this.nameFix(s.Name) === geo.properties.NAME || this.nameFix(s.Name) === geo.properties.NAME_LONG));
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={d ? this.colorScale(this.perCapita(geo, d[this.state.date])) : this.datalessCountryColor(geo)}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        )}
                    </ComposableMap>
                </Container>
            </Fragment>
        )
    }
}