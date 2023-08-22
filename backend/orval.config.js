module.exports = {
  api: {
    output: {
      mode: 'tags-split',
      target: '../frontend/src/api/',
      client: 'react-query',
      mock: false,
    },
    input: {
      target: './src/extensions/documentation/documentation/1.0.0/full_documentation.json',
      filters : {
        tags: ['Message', 'Hary', 'Conversation', "Users-Permissions - Auth", "Conversation-page", "Users-Permissions - Users & Roles", "Question"],
      },
    }
  },
};
