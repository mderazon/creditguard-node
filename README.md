# creditguard-node

> A simple wrapper for [creditguard](http://creditguard.co.il) api

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Usage

### Installation

```
$ npm install creditguard
```

### Setting up

```js
var creditguard = require('creditguard');

var env = {
  user: 'username',
  password: 'password',
  server: 'https://cguat2.creditguard.co.il',
  terminal: '1234567',
  mid: '531', // required only for redirect
  // optional callback addresses when using cg redirect api
  // when left empty, cg will use the predefined terminal value
  success_url: 'localhost/payment/proceed?',
  error_url: 'localhost/payment/rejected?',
  cancel_url: 'localhost/payment/rejected?',
  // optional interface language of MPI hosted payment page
  language: 'heb' // default vaue is 'eng'
};

var options = {
  cleanup: true // remove empty fields from result, default to false
};

var cg = creditguard(env, options);
```

### Charging

`creditguard-node` follows cg xml-api (see their docs) parameters names. For example, if their api expects the following xml :

```xml
<ashrait>
   <request>
      <command>doDeal</command>
      <requestId/>
      <version>1001</version>
      <language>Eng</language>
      <mayBeDuplicate>0</mayBeDuplicate>
      <doDeal>
         <terminalNumber>0962XXX</terminalNumber>
         <cardNo>458045XXXXXX4580</cardNo>
         <cardExpiration>1212</cardExpiration>
         <creditType>RegularCredit</creditType>
         <currency>USD</currency>
         <transactionCode>Phone</transactionCode>
         <transactionType>Debit</transactionType>
         <total>10010</total>
         <validation>AutoComm</validation>
         <user>567890</user>
      </doDeal>
   </request>
</ashrait>
```

Then the proper use would be :

```js
// basically create an object with everything you want to put under 'doDeal' element
// (no need to inset terminal number or any other value from 'env')
let charge = {
  cardNo: '458045XXXXXX4580',
  cardExpiration: '1212'
  creditType: 'RegularCredit',
  currency: 'USD',
  transactionCode: 'Phone',
  transactionType: 'Debit',
  total: 10010,
  validation: 'AutoComm'
  user: '567890'
};

try {
  let res = await cg.call(charge)
  // ...
} catch (err) {
  // ...
}
```

### Customer data

If you are using the xml api to get a redirect page and you want to use `customerData` fields to pass some data into that page, you can do it simply by attaching it to `charge` object:

```js
charge.customerData = {
  userData1: 'userData1',
  userData3: 'userData3',
  ...
}
```

### Invoices

If your terminal supports invoices you can easily attach invoice to the call, again, by attaching it to the `charge` object:

```js
// check out cg invoice documentation for complete list of properties
charge.invoice = {
  invoiceCreationMethod: 'wait',
  invoiceSubject: 'Subject',
  invoiceItemQuantity: 1,
  invoiceItemPrice: 10010,
  companyInfo: 'Vandelay Industries',
  mailTo 'george@vandelay.com',
  ...
}
```

### Response

`creditguard-node` takes cg `xml` response and converts it to a `javascript` object so there's no need for you to parse any xml. It also verifies that the transaction result code is `000` (OK) and if not, throws an informative error that you can catch.

## TODO

* Add more tests.
* Add more apis for common operations like charge, capture and redirect.
