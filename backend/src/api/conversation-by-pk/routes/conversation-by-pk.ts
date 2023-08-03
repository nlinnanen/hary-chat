export default {
  routes: [
    {
     method: 'GET',
     path: '/conversation-by-pk/:publicKey',
     handler: 'conversation-by-pk.getConversationByPk',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
