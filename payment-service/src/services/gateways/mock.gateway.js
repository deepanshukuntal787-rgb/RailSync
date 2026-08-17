const crypto = require('crypto');
const BaseGateway = require('./base.gateway');

class MockGateway extends BaseGateway {
     constructor() {
          super('mock');
     }

     async createOrder(amount, currency, receipt, notes = {}) {
          const gatewayOrderId = `mock_order_${crypto.randomUUID()}`;

          return {
               gatewayOrderId,
               amount,
               currency,
               receipt,
               rawResponse: {
                    id: gatewayOrderId,
                    amount: Math.round(amount * 100),
                    currency,
                    receipt,
                    status: 'created',
                    notes,
               },
          };
     }

     verifyPaymentSignature(orderId, paymentId, signature) {
          return true;
     }

     verifyWebhookSignature(rawBody, signature) {
          return true;
     }

     async fetchPayment(paymentId) {
          return {
               status: 'captured',
               amount: 0,
               method: 'mock',
               rawResponse: {
                    id: paymentId,
               },
          };
     }

     async initiateRefund(paymentId, amount, notes = {}) {
          const gatewayRefundId = `mock_refund_${crypto.randomUUID()}`;

          return {
               gatewayRefundId,
               status: 'processed',
               amount,
               rawResponse: {
                    id: gatewayRefundId,
                    paymentId,
                    notes,
               },
          };
     }

     async fetchRefund(paymentId, refundId) {
          return {
               status: 'processed',
               amount: 0,
               rawResponse: {
                    paymentId,
                    refundId,
               },
          };
     }
}

module.exports = MockGateway;
