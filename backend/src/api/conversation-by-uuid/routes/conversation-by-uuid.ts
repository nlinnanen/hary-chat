export default {
  routes: [
    {
      method: 'POST',
      path: '/conversation/uuid/many',
      handler: 'conversation-by-uuid.getConversationsByUuids',
      config: {
        policies: [],
        middlewares: [],
      },
     },
    {
     method: 'GET',
     path: '/conversation/uuid/:uuid',
     handler: 'conversation-by-uuid.getConversationByUuid',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'DELETE',
     path: '/conversation/uuid/:uuid',
     handler: 'conversation-by-uuid.deleteConversationByUuid',
     config: {
       policies: [],
       middlewares: [],
     },
    }
  ],
};
