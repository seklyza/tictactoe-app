module.exports = {
  client: {
    includes: ['src/**/*.gql'],
    service: {
      localSchemaFile: __dirname + '/graphql.schema.json',
    },
  },
}
