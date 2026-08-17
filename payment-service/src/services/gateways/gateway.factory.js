const { config } = require('../../config');
const RazorpayGateway = require('./razorpay.gateway');
const MockGateway = require('./mock.gateway');

let gatewayInstance = null;

/**
 * Returns the configured payment gateway.
 *
 * Supported providers:
 * - razorpay
 * - mock
 */
function getGateway() {
     if (gatewayInstance) {
          return gatewayInstance;
     }

     switch (config.PAYMENT_GATEWAY) {
          case 'razorpay':
               gatewayInstance = new RazorpayGateway(
                    config.RAZORPAY_KEY_ID,
                    config.RAZORPAY_KEY_SECRET,
                    config.RAZORPAY_WEBHOOK_SECRET
               );
               break;

          case 'mock':
               gatewayInstance = new MockGateway();
               break;

          default:
               throw new Error(
                    `Unknown payment gateway provider: ${config.PAYMENT_GATEWAY}`
               );
     }

     return gatewayInstance;
}

module.exports = { getGateway };
