import React, { useEffect } from 'react'
import './config/ReactotronConfig'
import 'react-toastify/dist/ReactToastify.css'
import { Router, useLocation } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Chart } from 'react-chartjs-2'
import { ThemeProvider } from '@material-ui/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import validate from 'validate.js'
import MomentUtils from '@date-io/moment';

import { ToastContainer, Slide } from 'react-toastify'
import theme from './theme'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './assets/scss/index.scss'
import validators from './common/validators'
import Routes from './Routes'

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const browserHistory = createBrowserHistory()


validate.validators = {
  ...validate.validators,
  ...validators
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
        <Router history={browserHistory}>
          <ScrollToTop />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Routes />
          </MuiPickersUtilsProvider>
        </Router>
        <ToastContainer
          autoClose={2000}
        />
      </ConfirmProvider>
    </ThemeProvider>
  )
}
