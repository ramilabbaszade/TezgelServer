import fetch from 'node-fetch';


const APIKEY = '446a1ade321f0c7';
const APIURL = 'https://azweb.paym.es/api/authorize'
const HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' }


export default async function createPaymesPayment(body) {
    body = {
        secret: APIKEY,
        ...body
    }
    let formBody = [];
    for (let property in body) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return new Promise((res, rej) => {
        fetch(APIURL, {
            method: 'POST',
            body: formBody,
            headers: HEADERS
        }).then(response => {
            return response.json();
        })
            .then(responseText => res(responseText))
            .catch(error => rej(error.message));
    })
}

