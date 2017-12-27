const expect = require('chai').expect;
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
    invoiceSubject: 'your invoice',
    invoiceItemCode: '1234',
    invoiceItemDescription: 'test',
    invoiceItemPrice: 100,
    invoiceItemQuantity: 1,
    isItemPriceWithTax: 1,
    companyInfo: 'yourown info',
    mailTo: 'test@yourown.com',
    ccDate: new Date().toISOString().slice(0, 10)
  }
};

describe('charge', async () => {
  it('should successfully charge', async done => {
    const cg = creditguard(payment_env);
    try {
      const res = await cg.call(charge);
      expect(res).to.exist;
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should successfully charge with mid and urls', async done => {
    const cg = creditguard(payment_env_with_mid);
    try {
      const res = await cg.call(charge);
      expect(res).to.exist;
      done();
    } catch (err) {
      done(err);
    }
  });
});
