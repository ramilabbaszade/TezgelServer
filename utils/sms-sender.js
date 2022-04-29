import fetch from 'node-fetch';
import uniqid from 'uniqid'

export default class SmsSender {
    URL = 'https://sms.atltech.az:7443/bulksms/api';
    USERNAME = 'tezgelsms';
    PASSWORD = 'bhzi87!7';
    METHOD = 'POST'
    HEADERS = { 'Content-Type': 'text/xml' }

    constructor(phoneNumber, message) {
        this.phoneNumber = phoneNumber.replace('+', '');
        this.message = message;
    }

    prepare() {
        this.BODY = `<?xml version="1.0" encoding="UTF-8"?>
    <request>
   <head>
 <operation>submit</operation>                        
 <login>${this.USERNAME}</login>                                    
 <password>${this.PASSWORD}</password>                             
 <title>TezGel</title>                               
 <scheduled>NOW</scheduled>                          
 <isbulk>false</isbulk>
 <controlid>${uniqid()}</controlid>                              
 </head>
    <body>
            <msisdn>${this.phoneNumber}</msisdn>
         <message>${this.message}</message> 
   </body>
</request>`;
    }

    async sendSms() {
        this.prepare()
        console.log(this.BODY)
        return new Promise((res, rej) => {
            fetch(this.URL, {
                method: this.METHOD,
                body: this.BODY,
                headers: this.HEADERS
            }).then(response => {
                return response.text();
            })
                .then(responseText => res(responseText))
                .catch(error => rej(error.message));
        })
    }
}
