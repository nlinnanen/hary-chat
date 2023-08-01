module.exports = {
  api: {
    output: {
      mode: 'split',
      target: '../frontend/src/api.ts',
      schemas: '../frontend/src/model',
      client: 'react-query',
      mock: false,
    },
    input: {
      target: './src/extensions/documentation/documentation/1.0.0/full_documentation.json',
      filters : {
        tags: ['Message', 'Hary', 'Conversation', "Users-Permissions - Auth", "Conversation-page"],
      },
    }
  },
};
