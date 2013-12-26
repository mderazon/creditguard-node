#Creditguard node.js
[![Build Status](https://drone.io/github.com/mderazon/creditguard-node/status.png)](https://drone.io/github.com/mderazon/creditguard-node/latest)

A simple wrapper to [creditguard](http://creditguard.co.il) api

## Usage
### Installation
```
npm install creditguard
```
### Setting up

```js
var creditguard = require('creditguard');

var env = {
  user: 'username',
  password: 'password',
  server: 'https://cguat2.creditguard.co.il',
  terminal: '1234567',
  mid: '531',
  // optional callback addresses when using cg redirect api
  // when left empty, cg will use the predefined terminal value
  success_url: 'localhost/payment/proceed?',
  error_url: 'localhost/payment/rejected?',
  cancel_url: 'localhost/payment/rejected?'
};

var options = {
  verbose: true, // prints more logs, default to false
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
var charge = {
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

cg.call(charge, function(err, res) {
  if (err) {
    console.error(err);
    console.error(res);
  } else {
    console.log(res);
  }
});
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
If your terminal supports invoices you can easily attach invoice to the call again, by attaching it to the `charge` object: 

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
`creditguard-node` takes cg `xml` response and converts it to a `javascript` object so there's no need for you to parse any xml. It also verify that the transaction result code is `000` (OK) and if not, throws an informative error that you can catch.

## Changelog
- v0.0.2 - added xml header for ISO-8859-8 encoding

## TODO
- Add mock test server that emulates cg server to remove dependency in cg real servers.
- Add more tests.
- Add more apis for common operations like charge, capture and redirect.


## The MIT License

Copyright (C) 2013 Michael Derazon

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
