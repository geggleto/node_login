/**
 * Created by Glenn on 2016-03-01.
 */

var Promise = require("bluebird");

var breaker = {};

//OPEN, CLOSED, RETRY
breaker.state = [];
breaker.failureCounter = [];
breaker.failureThreshold = [];
breaker.retryThreshold = [];
breaker.trippedHandlers = [];

breaker.isAvailable = function (service) {
    return this.state[service] !== 'CLOSED';
};

breaker._setState = function (service, state) {
    this.state[service] = state;
};

/**
 * Registers a service
 * @param service string
 * @param threshold int
 * @param retry int
 */
breaker.registerService = function (service, threshold, retry) {
    this.state[service] = "OPEN";
    this.failureCounter[service] = 0;
    this.retryThreshold[service] = retry;
    this.failureThreshold[service] = threshold;
    this.trippedHandlers[service] = [];
};

/**
 *
 * @param service string
 * @param code function
 */
breaker.try = function (service, code) {
    if (!code()) {
        this.failureCounter[service]++;

        //check to see if its tripped
        if (this.failureCounter[service] == this.failureThreshold[service]) {
            this.trippedHandlers[service]();
            (function (obj) {
                setTimeout(function () {
                    obj._setState(service, "RETRY");
                }, obj.retryThreshold[service]);
            })(this);
        }
    }
};

breaker.isAvailable = function (service) {

};

module.exports = breaker;