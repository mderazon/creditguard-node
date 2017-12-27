const assert = require('chai').assert;
const creditguard = require('../lib/creditguard');

const payment_env = {
  language: 'heb',
  user: 'israeli',
  password: 'PASSWORD',
  server: 'https://cguat2.creditguard.co.il',
  terminal: 'TERM'
};

const payment_env_with_mid = {
  language: 'heb',
  user: 'israeli',
  password: 'PASSWORD',
  server: 'https://cguat2.creditguard.co.il',
  terminal: 'TERM',
  mid: 'MID',
  success_url: 'http://localhost:3000/success',
  error_url: 'http://localhost:3000/error',
  cancel_url: 'http://localhost:3000/cancel'
};

const charge = {
  cardNo: '4012888888881881',
  cardExpiration: '0916',
  id: '310608195',
  cvv: '123',
  total: 100,
  transactionType: 'Debit',
  creditType: 'RegularCredit',
  currency: 'ILS',
  transactionCode: 'Phone',
  validation: 'AutoComm',
  uniqueid: '1234',
  email: 'test@yourown.com',
  invoice: {
    invoiceCreationMethod: 'wait',
    invoiceSubject: 'חשבונית קאפס',
    invoiceItemCode: '1234',
    invoiceItemDescription: 'test',
    invoiceItemPrice: 100,
    invoiceItemQuantity: 1,
    isItemPriceWithTax: 1,
    companyInfo: 'דפנה דה-גרוט',
    mailTo: 'test@yourown.com',
    ccDate: new Date().toISOString().slice(0, 10)
  }
};

suite('charge', function() {
  test('successful charge', function(done) {
    const cg = creditguard(payment_env);
    cg.call(charge, function(err, res) {
      assert.isNull(err);
      assert.isNotNull(res);
      done();
    });
  });

  test('successful charge with mid and urls', function(done) {
    const cg = creditguard(payment_env_with_mid);
    cg.call(charge, function(err, res) {
      assert.isNull(err);
      assert.isNotNull(res);
      done();
    });
  });
});
