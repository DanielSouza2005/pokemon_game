function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getNumbersFromString(str) {
    return str.replace(/\D/g, '');
}

function calculatePercentageDamage(part, total) {
    if (part === total){
        return 0;
    }

    if (total === 0) {
       return 0; 
    }

    if (part === 0){
        return 100
    }

    return ((part / total) * 100).toFixed(2);
}