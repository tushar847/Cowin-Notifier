const request = require('request');
const constants = require('./constants.js');
const logger = require('./logger');
const accountSid = constants.env.acccountSid;
const authToken = constants.env.token;
const client = require('twilio')(accountSid, authToken);
let contErrCount = 0;
let adminActionReq = false;

let t = true;
let Hm = new Map();

const getDateInRequiredFormat = () => {
    currentTime = new Date();
    currentOffset = currentTime.getTimezoneOffset();
    ISTOffset = 330;
    ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    const date = ISTTime;
    let array = [];
    array.push(date.getDate().toString());
    array.push((date.getMonth() + 1).toString());
    array.push(date.getFullYear().toString());
    return (array.join("-"));
}

const requestBuilder = () => {
    const date = getDateInRequiredFormat();
    let endpoint = constants.env.apiEndpoint + date;
    return endpoint
}

const callApi = () => {
    if (contErrCount > constants.env.errorThreshold) {
        logger.interfaceLogger.error(`Max error threshold , Reaching out admin`);
        adminActionReq = true;
        adminMessageProcessor();
    } else {
        const url = requestBuilder();
        logger.interfaceLogger.info(`GET - ${url}`);
        var centers;
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) {
                contErrCount += 1;
                return logger.interfaceLogger.error(`${err}`);
            }
            logger.interfaceLogger.info(`RECIEVED - ${JSON.stringify(body.centers)}`);
            try {
                centers = body.centers;
                centers.forEach(element => {
                    element.sessions.forEach(elm => {
                        if(elm.min_age_limit == 18){
                            if (elm.available_capacity_dose1 > 10) {
                                availabilityHandler(element.name, element.center_id, elm);
                            } else {
                                nonAvailabilityhandler(element.center_id,elm);
                            }
                        } 
                    });
                });
                logger.hmLogger.info(`${JSON.stringify(mapToObj(Hm))}`);
                messageProcessor();
                contErrCount = 0;
            } catch (err) {
                contErrCount += 1;
                logger.interfaceLogger.error(`${err}`);
            }

        });
    }
};

const availabilityHandler = (name, cid, sessionDetails) => {
    if (Hm.has(cid)) {
        if(!Hm.get(cid).date.has(sessionDetails.date)){
            Hm.get(cid).date.set(sessionDetails.date, sessionDetails.date);
            if (Hm.get(cid).sentSms == true) {
                Hm.get(cid).sentSms = false;
            }
        }
    } else {
        dateHm = new Map();
        dateHm.set(sessionDetails.date, sessionDetails.date);
        Hm.set(cid, {
            centerId: cid,
            centerName: name,
            slots:sessionDetails.available_capacity_dose1,
            date: dateHm,
            sentSms: false
        });
    }
}

const nonAvailabilityhandler = (cid,sessionDetails) => {
    if (Hm.has(cid)){
        Hm.get(cid).date.delete(sessionDetails.date);
        if (Hm.get(cid).date.size == 0){
            Hm.delete(cid);
        }
    }
}

const clearHm = () => {
    Hm = {};
}

const messageProcessor = () => {
    console.log(Hm);
    sendMsg = false;
    Hm.forEach(ele => {
        if (ele.sentSms == false) {
            ele.sentSms = true;
            if (sendMsg == false) {
                sendMsg = true;
            }
        }
    });
    if (sendMsg) {
        sendMessages();
    }
}

const adminMessageProcessor = () => {
    client.messages
        .create({
            body: 'App crashed',
            from: constants.env.fromPhno,
            to: constants.env.adminPhno
        })
        .then(message => logger.smsLogger.warn(`Admin SOS message sent id - ${message.sid}`));
    client.messages
        .create({
            body: 'App crashed, contact admin',
            from: constants.env.fromPhno,
            to: constants.env.toPhno
        })
        .then(message => logger.smsLogger.warn(`User SOS message sent id - ${message.sid}`));
}

const sendMessages = () => {
    client.messages
        .create({
            body: 'Slots Available, Login to check',
            from: constants.env.fromPhno,
            to: constants.env.toPhno
        })
        .then(message => logger.smsLogger.info(`${message.sid}`));
    console.log('Message Sent');
}

const setMode = () => {
    if (constants.env.mode == 'pincode') {
        constants.env.apiEndpoint = constants.env.pinEndpoint;
    } else {
        constants.env.apiEndpoint = constants.env.disEndPoint;
    }
    logger.interfaceLogger.info(`Selected mode - ${constants.env.mode}`);
}

const updatePincode = (pin) => {
    if (pin.toString.len() == 6) {
        const prevPin = constants.env.pinCode
        constants.env.pinCode = pin.toString();
        const newEndpoint = constants.env.pinEndpoint.replace(prevPin, constants.env.pinCode);
        constants.env.pinEndpoint = newEndpoint;
    }
}

const updateDistrictId = (disCode) => {
    const prevDisId = constants.env.districtId
    constants.env.districtId = disCode.toString();
    const newEndpoint = constants.env.disEndPoint.replace(prevDisId, constants.env.districtId);
    constants.env.disEndPoint = newEndpoint;
}

function mapToObj(map) {
    const obj = {}
    for (let [k, v] of map)
        obj[k] = v
    return obj
}

module.exports = {
    callApi,
    clearHm,
    setMode,
    updatePincode,
    updateDistrictId,
    adminActionReq
}