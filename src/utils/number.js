const calculatePercentage = (number, total) => {
    return Number.parseFloat(((number / total) * 100).toFixed(2));
}

export { calculatePercentage }
