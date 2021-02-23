var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
 
// Construct a schema using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);
 
// Construct a root providing a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

// Initialize server using express
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  // Enable Graphiql
  graphiql: true,
}))

// Run server
app.listen(4000, callback=() => console.log('Running a GraphQL API server at http://localhost:4000/graphql'));