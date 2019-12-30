const OTHER_API = 'other_api';

const apisNameList = [
  'other_api',
];

const apisHosts = [
];

const apis = {
  [OTHER_API]: {
    name: OTHER_API,
    url: process.env.OTHER_API_URL,
    clientId: process.env.OTHER_API_SECRET_ID,
    password: process.env.OTHER_API_PASSWORD,
  },
};


export {
  apisNameList, apisHosts, apis, OTHER_API,
};
