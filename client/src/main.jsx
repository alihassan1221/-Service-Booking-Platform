import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ThemeProvider } from './context/ThemeContext'
import App from './App.jsx'
import './index.css'
import { setupAxiosInterceptors } from './services/api';
import history from './utils/history';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';

setupAxiosInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <HistoryRouter history={history}> {/* Use HistoryRouter with custom history */}
          <App />
        </HistoryRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)