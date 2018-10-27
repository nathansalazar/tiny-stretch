let pythagorean = (a, b) => {
    return Math.sqrt(a * a + b * b) * 6371000;
}
let toRadians = (degrees) => {
    return degrees * Math.PI / 180;
}

//this function takes in two 'points' as arguments, where each 
//'point' is an object with a 'lng' and 'lat' property

//This just uses the pythagorean theorem
// let distanceBetweenPoints = (point1, point2) => {
//     let deltaX = toRadians(point1.lng) - toRadians(point2.lng);
//     let deltaY = toRadians(point1.lat) - toRadians(point2.lat);
//     return pythagorean(deltaX, deltaY);
// }


//This is the Haversine formula
let distanceBetweenPoints = (point1, point2) => {
    let phi1 = toRadians(point1.lat);
    let phi2 = toRadians(point2.lat);
    let lambda1 = toRadians(point1.lng);
    let lambda2 = toRadians(point2.lng);
    let dPhi = phi1 - phi2;
    let dLambda = lambda1 - lambda2;
    let dSigma = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(dPhi / 2), 2) + Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin(dLambda / 2), 2)));
    return dSigma * 6371000;
}

export default distanceBetweenPoints;