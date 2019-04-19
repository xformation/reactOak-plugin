import ApolloClient from "apollo-boost";
import { ApolloLink } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { HttpLink, InMemoryCache } from "apollo-client-preset";

const gqlPath = process.env.GQL_URL;

const uploadLink = createUploadLink({ uri: gqlPath });
const httpLink = new HttpLink({ uri: gqlPath });
const cache = new InMemoryCache();

// apollo client setup
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([uploadLink, httpLink])
});

class Utils {
  static getApolloClient() {
    return client;
  }
}

export default Utils;
