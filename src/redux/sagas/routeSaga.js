
/*this file is currently not being used, since the function
has changes local state, and it will take me a bit to figure out
how I want to store that information differently */



import {put, takeLatest} from 'redux-saga/effects';

const plotRouteAndParks = (route) => {
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
        origin: route.origin,
        destination: route.destination,
        waypoints: [],
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
                directions: result
            });
            let polyline = new google.maps.Polyline({
                path: [],
            });
            console.log(result);
            let legs = result.routes[0].legs;
            for (let i = 0; i < legs.length; i++) {
                let steps = legs[i].steps;
                for (let j = 0; j < steps.length; j++) {
                    let nextSegment = steps[j].path;
                    for (let k = 0; k < nextSegment.length; k++) {
                        polyline.getPath().push(nextSegment[k]);
                    }
                }
            }
            console.log('Polyline:', polyline);
            console.log(Object.keys(polyline.latLngs));

            // we initialize our checkpoints with the first latLng from polyline
            let lastSearch = { lat: polyline.latLngs.j[0].j[0].lat(), lng: polyline.latLngs.j[0].j[0].lng() };
            let distanceTraveledMeters = 0;
            let searchAt = []; //an array of coordinates at which to search
            let stepBeginning; //we keep track of each beginning/end of each step of the trip
            let stepEnd = lastSearch;
            for (let step of polyline.latLngs.j[0].j) {
                stepBeginning = stepEnd;
                stepEnd = { lat: step.lat(), lng: step.lng() };
                let segmentDistance = distanceBetweenPoints(stepEnd, stepBeginning);
                distanceTraveledMeters = distanceTraveledMeters + segmentDistance;
                if (distanceBetweenPoints(stepEnd, lastSearch) > route.radius * 2) {
                    lastSearch = stepEnd;
                    searchAt.push(lastSearch);
                    this.props.dispatch({ type: PLAYGROUND_ACTIONS.SEARCH_PLAYGROUNDS, payload: lastSearch, radius: route.radius });
                }
            }
            console.log('We search at:', searchAt);
            console.log('polyline.latLngs.b[0].b', polyline.latLngs.j[0].j);
            this.props.dispatch({ type: 'SET_CHECKPOINTS', payload: searchAt });
        } else {
            console.error(`error fetching directions ${result}`);
        }
    });
}



function* routeSaga () {
    yield takeEvery('PLOT_ROUTE_AND_PARKS', plotRouteAndParks);
}

export default routeSaga;