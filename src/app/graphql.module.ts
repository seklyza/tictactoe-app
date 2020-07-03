import { NgModule } from '@angular/core'
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const uri = 'http://localhost:8080/graphql'
export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({
    uri,
  })

  const ws = new WebSocketLink({
    uri: uri.replace('http', 'ws'),
    options: {
      reconnect: true,
    },
  })

  const link = split(
    ({ query, operationName }) => {
      const { kind } = getMainDefinition(query)

      return kind === 'OperationDefinition' && operationName === 'subscription'
    },
    ws,
    http,
  )

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers = { ...headers, Authorization: `Bearer ${token}` }
      }

      return { headers }
    })

    return forward(operation)
  })

  return {
    link: ApolloLink.from([authLink, link]),
    cache: new InMemoryCache(),
  }
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
