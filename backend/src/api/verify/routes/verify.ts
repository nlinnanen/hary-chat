export default {
  routes: [
    {
     method: 'GET',
     path: '/verify',
     handler: 'verify.generateChallenge',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/verify',
     handler: 'verify.validateChallenge',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
