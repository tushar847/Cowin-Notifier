const {
    Router
} = require('express');
const logger = require('./logger');
const readLastLines = require('read-last-lines');
const apiCall = require('./baseLogic.js');
const constants = require('./constants.js');
const express = require('express');
const routes = express.Router();

var processInterval;

routes.get('/endpointCheck', async (req, res) => {
    logger.serviceLogger.info("Entered Endpoint Check");
    try {
        res.status(200).json({
            code: 0,
            message: "App deployed and server working"
        });
        logger.serviceLogger.info("Succesfully Executed EnpointCheck");
    } catch (err) {
        res.status(400).json({
            code: 1,
            message: err.message
        });
        logger.serviceLogger.error(`${err.message}`);
    }
});

routes.get('/start', async (req, res) => {
    logger.serviceLogger.info("Entered Start");
    try {
        apiCall.setMode();
        processInterval = setInterval(() => {
            if (apiCall.adminActionReq == false) {
                apiCall.callApi();
            } else {
                stopApiCalls();
                logger.serviceLogger.warn("Stop action triggered from start api");
            }
        }, constants.env.intervalTime);
        res.status(200).json({
            code: 0,
            message: "Started intervals"
        });
        logger.serviceLogger.info("Succesfully Executed Start");
    } catch (err) {
        res.status(400).json({
            code: 1,
            message: err.message
        });
        logger.serviceLogger.error(`${err.message}`);
    }
});

routes.get('/stop', async (req, res) => {
    logger.serviceLogger.info("Entered Stop");
    try {
        if (processInterval != undefined) {
            clearInterval(processInterval);
            apiCall.clearHm();
            res.status(200).json({
                code: 0,
                message: "Stopped intervals"
            });
        } else {
            res.status(200).json({
                code: 0,
                message: "No interval to stop , create one"
            });
        }
        logger.serviceLogger.info("Succesfully Executed Stop");
    } catch (err) {
        res.status(400).json({
            code: 1,
            message: err.message
        });
        logger.serviceLogger.error(`${err.message}`);
    }
})

routes.get('/intervalCheck', async (req, res) => {
    logger.serviceLogger.info("Entered IntervalCheck");
    try {
        if (processInterval != undefined && processInterval._destroyed === false) {
            res.status(200).json({
                code: 0,
                message: "Interval active"
            });
        } else {
            res.status(200).json({
                code: 0,
                message: "Interval In-active"
            });
        }
        logger.serviceLogger.info("Succesfully Executed IntervalCheck");
    } catch (err) {
        res.status(400).json({
            code: 1,
            message: err.message
        });
        logger.serviceLogger.error(`${err.message}`);
    }
})

routes.get('/readLogs', async (req, res) => {
    logger.serviceLogger.info("Entered readLogs");
    try {
        await readLastLines.read('./logs/interface.log', 15).then((lines) => {
            latestLogs = lines
        });
        latestLogs = latestLogs.split('\t').join('');
        latestLogs = latestLogs.split('\r').join(' ');
        latestLogs = latestLogs.trim().split('\n');
        res.status(200).json({
            code: 0,
            message: "Read Last 10 lines",
            result: latestLogs
        });
        logger.serviceLogger.info("Succesfully Executed readLogs");
    } catch (err) {
        res.status(400).json({
            code: 1,
            message: err.message
        });
        logger.serviceLogger.error(`${err.message}`);
    }
})

const stopApiCalls = () => {
    if (processInterval != undefined) {
        clearInterval(processInterval);
        apiCall.clearHm();
    }
}

module.exports = routes;