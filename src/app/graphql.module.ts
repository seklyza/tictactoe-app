import { HttpHeaders } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const uri = 'http://localhost:8080/graphql'
export function createApollo(httpLink: HttpLink) {
  const token = localStorage.getItem('token')

  return {
    link: httpLink.create({
      uri,
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    }),
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
