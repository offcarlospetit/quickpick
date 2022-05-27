function GetDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // km
    var dLat = ToRad(lat2 - lat1);
    var dLon = ToRad(lon2 - lon1);
    var lat1 = ToRad(lat1);
    var lat2 = ToRad(lat2);

    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function ToRad(Value: number) {
    return (Value * Math.PI) / 180;
}

export default { GetDistance, ToRad };