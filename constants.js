const env = {
    apiEndpoint: '',
    pinEndpoint: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=786125&date=',
    disEndPoint: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=395&date=',
    pinCode: '786125',
    districtId: '395',
    mode: 'district',
    acccountSid: 'ACb7f417d87c4d9c8d162045ecc62665b5',
    token: '1ddce57bcba4b68683f9a8c8c01a9277',
    fromPhno: '+12012126838',
    adminPhno: '+916901274814',
    toPhno: '+916901274814',
    errorThreshold: 20,
    intervalTime: 10000
};

module.exports = {
    env
};