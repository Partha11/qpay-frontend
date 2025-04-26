const formatCurrency = (amount, currency) => {
    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        BDT: '৳',
        INR: '₹',
        JPY: '¥',
        CNY: '¥',
        AUD: 'A$',
        CAD: 'C$',
    }
    const symbol = currencySymbols[currency] || currency
    return `${symbol} ${amount}`
}

const formatDate = (date) => {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }
    return new Date(date).toLocaleDateString('en-US', options)
}

const formatDateToDay = (date) => {
    const options = {
        month: 'short',
        day: 'numeric'
    }
    return new Date(date).toLocaleDateString('en-US', options)
}

const formatByte = (primevue, bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
}

export { formatCurrency, formatDate, formatByte, formatDateToDay }
