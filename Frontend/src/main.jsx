import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// react router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routerInfo from '@router/index';
const router = createBrowserRouter(routerInfo);

// react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const queryClient = new QueryClient();

// redux
import { Provider } from 'react-redux';
import store from '@store'; // Redux store 불러오기

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);