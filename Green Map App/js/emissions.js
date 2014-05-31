/**
 * Created by gavin on 5/31/14.
 */

// source:
// http://www.buses.org/files/ComparativeEnergy.pdf

// returns kg of co2
function calculateEmissionsForCar(miles) {
    return miles * .371;
}

function calculateEmissionsForCommuterTrain(miles) {
    return miles * .177;
}

function calculateEmissionsForCommuterBus(miles) {
    return miles * .299;
}