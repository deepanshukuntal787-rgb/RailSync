const axios = require('axios');
const { config } = require('../config');
const {
     ServiceUnavailableError,
     GatewayTimeoutError,
} = require('../utils/error');
const logger = require('../config/logger');

class CircuitBreaker {
     constructor(
          serviceName,
          threshold = config.CIRCUIT_BREAKER_THRESHOLD,
          timeout = config.CIRCUIT_BREAKER_TIMEOUT
     ) {
          this.serviceName = serviceName;
          this.failureCount = 0;
          this.threshold = threshold;
          this.timeout = timeout;
          this.state = 'CLOSED';
          this.nextAttempt = Date.now();
     }

     async execute(request) {
          if (this.state === 'OPEN') {
               if (Date.now() < this.nextAttempt) {
                    throw new ServiceUnavailableError(
                         `Service ${this.serviceName} is temporarily unavailable. Circuit breaker is OPEN.`
                    );
               }

               this.state = 'HALF_OPEN';
               logger.info(
                    `Circuit breaker HALF_OPEN for ${this.serviceName}`
               );
          }

          try {
               const response = await request();
               this.onSuccess();
               return response;
          } catch (err) {
               this.onFailure();
               throw err;
          }
     }

     onSuccess() {
          this.failureCount = 0;

          if (this.state === 'HALF_OPEN') {
               this.state = 'CLOSED';
               logger.info(
                    `Circuit breaker CLOSED for ${this.serviceName}`
               );
          }
     }

     onFailure() {
          this.failureCount++;

          if (this.failureCount >= this.threshold) {
               this.state = 'OPEN';
               this.nextAttempt = Date.now() + this.timeout;

               logger.error(
                    `Circuit breaker OPEN for ${this.serviceName}. Next attempt at ${new Date(
                         this.nextAttempt
                    ).toISOString()}`
               );
          }
     }

     getState() {
          return {
               service: this.serviceName,
               state: this.state,
               failureCount: this.failureCount,
               nextAttempt:
                    this.state === 'OPEN'
                         ? new Date(this.nextAttempt).toISOString()
                         : null,
          };
     }
}

const circuitBreakers = {
     userService: new CircuitBreaker('user-service'),
     searchService: new CircuitBreaker('search-service'),
     adminService: new CircuitBreaker('admin-service'),
     notificationService: new CircuitBreaker('notification-service'),
     bookingService: new CircuitBreaker('booking-service'),
     paymentService: new CircuitBreaker('payment-service'),
     inventoryService: new CircuitBreaker('inventory-service'),
};

async function forwardRequest(
     serviceUrl,
     path,
     method,
     data,
     headers,
     circuitBreaker
) {
     const url = `${serviceUrl}${path}`;

     logger.info(`FORWARDING ${method} ${url}`);

     const requestConfig = {
          method,
          url,
          timeout: config.SERVICE_TIMEOUT_MS,
          headers: {
               ...headers,
               host: undefined,
               'content-length': undefined,
          },
          validateStatus: () => true,
          maxRedirects: 5,
     };

     if (method !== 'GET' && method !== 'DELETE' && data) {
          requestConfig.data = data;
     }

     if ((method === 'GET' || method === 'DELETE') && data) {
          requestConfig.params = data;
     }

     try {
          const response = await circuitBreaker.execute(() =>
               axios(requestConfig)
          );

          logger.info(
               `DOWNSTREAM RESPONSE ${method} ${url} -> ${response.status}`
          );

          return {
               status: response.status,
               data: response.data,
               headers: response.headers,
          };
     } catch (err) {
          logger.error(`Error forwarding to ${serviceUrl}`, {
               message: err.message,
               code: err.code,
               url,
               method,
          });

          if (
               err.code === 'ECONNABORTED' ||
               err.code === 'ETIMEDOUT'
          ) {
               throw new GatewayTimeoutError(
                    `Request to ${serviceUrl} timed out after ${config.SERVICE_TIMEOUT_MS}ms`
               );
          }

          if (err.code === 'ECONNREFUSED') {
               throw new ServiceUnavailableError(
                    `Cannot connect to ${serviceUrl}. Service may be down.`
               );
          }

          if (err.response) {
               return {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers,
               };
          }

          throw new ServiceUnavailableError(
               `Service temporarily unavailable: ${err.message}`
          );
     }
}

function createProxy(serviceName, serviceUrl, fixedPath = null) {
     const circuitBreaker = circuitBreakers[serviceName];

     if (!circuitBreaker) {
          throw new Error(
               `No circuit breaker found for service: ${serviceName}`
          );
     }

     return async (req, res, next) => {
          try {
               let servicePath;

               if (fixedPath) {
                    servicePath = fixedPath;
               } else {
                    const pathParts = req.path
                         .split('/')
                         .filter(Boolean);

                    servicePath =
                         '/' + pathParts.slice(1).join('/');
               }

               let queryString = '';

               if (req.originalUrl.includes('?')) {
                    queryString =
                         req.originalUrl.substring(
                              req.originalUrl.indexOf('?')
                         );
               }

               logger.info(
                    `PROXY ${req.method} ${req.originalUrl} -> ${serviceUrl}${servicePath}${queryString}`
               );

               const result = await forwardRequest(
                    serviceUrl,
                    servicePath + queryString,
                    req.method,
                    req.body,
                    req.headers,
                    circuitBreaker
               );

               const excludedHeaders = [
                    'connection',
                    'keep-alive',
                    'transfer-encoding',
                    'host',
               ];

               Object.keys(result.headers).forEach((key) => {
                    if (
                         !excludedHeaders.includes(key.toLowerCase())
                    ) {
                         res.setHeader(
                              key,
                              result.headers[key]
                         );
                    }
               });

               res.status(result.status).json(result.data);
          } catch (err) {
               next(err);
          }
     };
}

function getCircuitBreakerStatus() {
     return Object.values(circuitBreakers).map((cb) =>
          cb.getState()
     );
}

module.exports = {
     createProxy,
     CircuitBreaker,
     circuitBreakers,
     getCircuitBreakerStatus,
};
