var assert = require('chai').assert;
var creditguard = require('../lib/creditguard');

var payment_env = {
  user: 'USER',
  password: 'PASS',
  server: 'https://cguat2.creditguard.co.il',
  terminal: 'TERM',
  mid: 'MID',
};

var charge = {
  cardNo: '1234567890123456',
  cardExpiration: '0916',
  id: '012345678',
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
    ccDate: '2015-12-15',
  }
};


suite('charge', function() {
  test('successful charge', function(done) {
    var cg = creditguard(payment_env);
    cg.call(charge, function(err, res) {
      assert.isNull(err);
      assert.isNotNull(res);
      done();
    });
  });

});