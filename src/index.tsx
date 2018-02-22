import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from './pages/App';
import './index.css';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  request: async (operation) => {
    /*const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
      }
    });*/
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);
