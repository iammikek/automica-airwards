import React, {Component} from 'react';
import PropTypes from 'prop-types';

// ES6
import ReactMapboxGl, {Layer, Feature, ZoomControl, Popup, Marker, ScaleControl} from "react-mapbox-gl";

import '../assets/Airwards.css';

import moment from 'moment';

const Map = ReactMapboxGl({
    minZoom: 5,
    maxZoom: 15,
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});


const FetchOptions = {
    method: 'GET',
    headers: {}
};

class Airwards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            time: Date.now(),
            center:
                {lat: 51.4545, lng: -2.5789},
            zoom: [9],
            style: "mapbox://styles/brightstormltd/cjmgkzgti3rm62rqsll4heil2",

            api: "https://opensky-network.org/api/",
            markers: [],
            newMarkers: [],
            bounds: {}
        };
    }

    getFlights = () => {

        console.log('getFlights');

        let defaultTargetUrl = this.state.api + 'states/all?lamin=51.3109372590192&lomin=-3.4845854248900423&lamax=51.60102478472518&lomax=-1.7858244385610078';

        const bounds = this.state.bounds;

        let targetUrl = bounds._ne !== undefined ? this.state.api + 'states/all?lamin=' + bounds._sw.lat + '&lomin=' + bounds._sw.lng + '&lamax=' + bounds._ne.lat + '&lomax=' + bounds._ne.lng : defaultTargetUrl;

        console.log(targetUrl);

        fetch(targetUrl, FetchOptions)
            .then(response => {

                if (response.status === 401) {
                    this.setState({error: 'Cannot connect to API'});
                    return this.state.markers;
                }

                return response.json();
            }, function (error) {
                console.log(error.message); //=> String
            })
            .then(newMarkers => {

                if (newMarkers === undefined) {
                    this.setState({error: 'API returns no data'});
                    return {};
                }

                this.setState({newMarkers: newMarkers.states});
                console.log(newMarkers);
            })
    };

    renderLayers = () => {

        return this.state.markers.map((marker, index) => {

            let coordinates = [marker[5], marker[6]];

            return (
                <Marker
                    key={index}
                    className='marker'
                    coordinates={coordinates}
                    anchor="bottom"
                    offset={[0, 10]}
                ><div>{marker[1]}</div>
                </Marker>
            )
        })
    }

    componentDidMount() {
        //   this.getFlights();

        this.updateMarkers();

        this.interval = setInterval(() => {
            this.setState({time: Date.now()})

            this.updateMarkers();

        }, 10000);

    }

    componentDidUpdate() {
        console.log(this.state.bounds);

    }

    updateMarkers() {

        let markers = this.state.markers;

        this.getFlights();

        let newMarkers = this.state.newMarkers;

        const combinedMarkers = [...newMarkers, ...markers];

        console.log(combinedMarkers);

        this.setState({markers: newMarkers});
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        const date = moment().format('LTS');

        return (
            <div>
                {this.state.error && (
                    <div className='message'>{this.state.error}</div>
                )}

                <div className='lastUpdated'> {date}</div>

                <Map
                    onDragEnd={(map) => {
                        const bounds = map.getBounds();

                        this.setState({bounds: bounds});

                        this.updateMarkers();


                    }}
                    style={this.state.style}
                    center={this.state.center}
                    zoom={this.state.zoom}
                    containerStyle={{
                        height: "85vh",
                        width: "100%"
                    }}>
                    {this.renderLayers()}
                    <ZoomControl/>
                    <ScaleControl/>
                </Map>
            </div>
        );
    }
}

Airwards.propTypes = {};

export default Airwards;
