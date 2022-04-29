
const date = (date) => new Date(date).toLocaleDateString("az-AZ", { timeZone: "Asia/Baku" });

const dateTime = (dateTime) => new Date(dateTime).toLocaleString("az-AZ", { timeZone: "Asia/Baku" });

const percent = (percentage) => `%${percentage * 100}`;

const bool = (data) => (data ? "Yes" : "No");

const weight = (data, symbol='KG') => (`${data?.toFixed(2)} ${symbol}`)

const price = (data) => (`${data?.toFixed(2)}₼`)

export {
    date,
    percent,
    bool,
    weight,
    dateTime,
    price
}