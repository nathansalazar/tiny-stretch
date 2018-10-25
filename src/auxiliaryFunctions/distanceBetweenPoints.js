let pythagorean = (a, b) => {
    return Math.sqrt(a * a + b * b) * 6371000;
}
let toRadians = (degrees) => {
    return degrees*Math.PI/180;
}

//this function takes in two 'points' as arguments, where each 
//'point' is an object with a 'lng' and 'lat' property
let distanceBetweenPoints = (point1, point2) => {
    let deltaX = toRadians(point1.lng) - toRadians(point2.lng);
    let deltaY = toRadians(point1.lat) - toRadians(point2.lat);
    return pythagorean( deltaX , deltaY );
}

export default distanceBetweenPoints;