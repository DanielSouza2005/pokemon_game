function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getNumbersFromString(str) {
    return str.replace(/\D/g, '');
}
