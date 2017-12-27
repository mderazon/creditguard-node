const xml2js = require('xml2js');
const jsonxml = require('jsontoxml');
const request = require('request-promise');
const pd = require('pretty-data').pd;
const debug = require('debug')('creditguard');

const parserOpts = {
  emptyTag: undefined,
  ignoreAttrs: true,
  explicitArray: false,
  explicitRoot: false
};

// an array of decimal values of unicode characters that create problems
const badChars = [8235, 8206, 8236, 1523];

const xmljson = new xml2js.Parser(parserOpts).parseString;

const defaults = {
  currency: 'ILS',
  creditType: 'RegularCredit',
  validation: 'AutoComm' // this means charge immediately
};

module.exports = function creditguard(env, options) {
  env = env || {};
  if (!env.user) throw new Error('env.user is required');
  if (!env.password) throw new Error('env.password is required');
  if (!env.server) throw new Error('env.server is required');
  if (!env.terminal) throw new Error('env.terminal is required');
  // Make the field mid optional for using as XML API without redirection
  if (env.mid) {
    env.success_url = env.success_url || '';
    env.error_url = env.error_url || '';
    env.cancel_url = env.cancel_url || '';
  }

  options = options || {};
  const cleanup = options.cleanup;

  const api = {};

  api.call = async function(options) {
    const doDeal = setDefaults(options, defaults);

    doDeal.terminalNumber = env.terminal;
    if (env.mid) {
      doDeal.mid = env.mid;
      doDeal.successUrl = env.success_url;
      doDeal.errorUrl = env.error_url;
      doDeal.cancelUrl = env.cancel_url;
    }

    const requestObj = {
      ashrait: {
        request: {
          version: '1001',
          language: env.language || 'eng',
          command: 'doDeal',
          doDeal: doDeal
        }
      }
    };

    return sendRequest(requestObj);
  };

  async function sendRequest(requestObj) {
    const header = "<?xml version='1.0' encoding='ISO-8859-8'?>";
    let requestXml = jsonxml(requestObj, {
      prettyPrint: true,
      indent: '    '
    });
    requestXml = stripCharacters(requestXml);
    requestXml = header.concat(requestXml);
    const req = {
      resolveWithFullResponse: true,
      url: env.server + '/xpo/Relay',
      method: 'post',
      form: {
        user: env.user,
        password: env.password,
        int_in: requestXml
      }
    };

    debug('------ sending xml request to crediguard ------>');
    debug(requestXml);
    debug('<-----------------------------------------------');

    const xmlResponse = await request(req);

    if (xmlResponse.statusCode !== 200) {
      throw new Error(`Unexpected response from gateway server`);
    }
    const { body: xmlBody } = xmlResponse;

    debug('------ response from creditguard ------>');
    debug(pd.xml(xmlBody));
    debug('<------------------------------------->');

    const json = await xmlToJSON(xmlBody);

    const { response: { result, doDeal, userMessage, tranId } } = json;

    if (result !== '000') {
      throw new Error(userMessage);
    }

    if (cleanup) {
      clean(result);
    }

    return Object.assign(doDeal, { tranId });
  }

  return api;
};

async function xmlToJSON(xml) {
  return new Promise((resolve, reject) => {
    xmljson(xml, function(err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

// recursively remove all empty properties from object
function clean(obj) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === 'object') {
        clean(obj[property]);
      } else {
        if (!obj[property]) {
          delete obj[property];
        }
      }
    }
  }
}

function stripCharacters(str) {
  let exp = '';
  badChars.forEach(function(c) {
    exp += String.fromCharCode(c) + '|';
  });
  const regex = new RegExp(exp, 'g');
  return str.replace(regex, '');
}

function setDefaults(obj) {
  const length = arguments.length;
  if (length < 2 || obj == null) {
    return obj;
  }
  for (let index = 1; index < length; index++) {
    const source = arguments[index],
      keys = Object.keys(source),
      l = keys.length;
    for (let i = 0; i < l; i++) {
      const key = keys[i];
      if (obj[key] === void 0) {
        obj[key] = source[key];
      }
    }
  }
  return obj;
}
