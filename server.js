const express = require('express');
const routes = require('./routes');
const logger = require('./logger');
const app = express();
app.use(express.json());
app.use('/cnotifier', routes);
app.listen(3000 , () => { 
    logger.serviceLogger.info('Server Started');
    logger.interfaceLogger.info('Server Started');
    logger.smsLogger.info('Server Started');
    logger.hmLogger.info('Server Started');
});
// console.log("Server Started");
// setInterval(() => {
//     apiCall.callApi();
// },5000)
