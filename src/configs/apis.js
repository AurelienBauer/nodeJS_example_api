const OTHER_API = 'other_api';

const apisNameList = [
  'other_api',
];

const apisHosts = [
];

const apis = {
  [OTHER_API]: {
    host: process.env.OTHER_API_HOST,
    clientId: process.env.OTHER_API_HOST,
    password: process.env.OTHER_API_PASSWORD,
  },
};


export {
  apisNameList, apisHosts, apis, OTHER_API,
};
