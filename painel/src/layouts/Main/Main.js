import React, { useState, useEffect } from 'react'
import 'react-day-picker/lib/style.css'
import 'moment/locale/pt-br'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import clsx from 'clsx'

// Libs
import { useHistory, useParams } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay'
import jwt_decode from 'jwt-decode'

// Material UI
import { makeStyles, useTheme } from '@material-ui/styles'
import { useConfirm } from 'material-ui-confirm'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// Components
import { Sidebar, Topbar, Footer } from './components'

import { storeRequest } from '../../store/modules/store/actions'
import { userRequest, logout } from '../../store/modules/user/actions'
import { clearRedux } from '../../store/modules/main/actions'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200
  },
  inner: {
    minWidth: 350,
    minHeight: 250,
    marginLeft: 45
  },
  inputForm: {
    width: 100,
    minWidth: 150,
    marginBottom: 15,
    marginRight: 5
  }
}))

export default function Main({ children, match }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const confirm = useConfirm()

  const [openSidebar, setOpenSidebar] = useState(false)
  const [inputTimeoutID, setInputTimeoutID] = useState()
  const [reportTimeoutID, setReportTimeoutID] = useState()



  // Error
  const error = useSelector(state => state.error.error)

  // User
  const user = useSelector(state => state.user.user)
  const userLoading = useSelector(state => state.user.loading)

  // Store
  const store = useSelector(state => state.store.store)
  const storeLoading = useSelector(state => state.store.loading)

  // Day
  const dayLoading = useSelector(state => state.day.loading)

  // Storage
  const token = window.localStorage.getItem('@Elist:token')
  const { storeId } = useParams()

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })


  useEffect(() => {
    if (error) {
      confirm({
        title: 'Ops!',
        description:
          error.error && error.error.friendlyMsg
            ? error.error.friendlyMsg
            : JSON.stringify(error),
        confirmationText: 'Ok!',
        cancellationText: 'Fechar'
      })
        .then(() => { })
        .catch(() => { })
    }
  }, [error])

  
  const logoff = (redirect = true) => {
    window.localStorage.removeItem('@Elist:token')
    dispatch(logout())
    if(redirect) history.push('/login')
  }

  //Como o Main é o ambiente logado da loja, aqui valida se o storeId da URL tá certo
  useEffect(() => {
    if (storeId.length !== 24 || isNaN(Number('0x' + storeId))) {
      logoff(false)
      if (user.stores.length === 0) history.push('/login')
    }
  }, [storeId, user.stores])

  // Verifica se user está logado
  useEffect(() => {
    if (!user._id) {
      if (token) {
        const user = jwt_decode(token)
        dispatch(userRequest(user.id, token))
      } else {
        history.push('/login')
      }
    } else {
      //Está logado. Popula os estados do redux:
      if (!store || store._id !== storeId) dispatch(storeRequest(storeId, token))
    }
  }, [user, token])

  return (
    <LoadingOverlay
      active={userLoading || storeLoading || dayLoading}
      spinner
    >
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })}
      >
        <Topbar
          onSidebarOpen={() => setOpenSidebar(true)}
          storeIntegrationData={store?.integration}
          onLogoff={logoff}
          storeName={store && store.name}
          user={user}
          currentStoreId={store && store._id}
          goToStore={() => {
            dispatch(clearRedux())
            history.push('/stores')
          }}
        />
        <Sidebar
          storeId={storeId}
          onClose={() => setOpenSidebar(false)}
          open={isDesktop ? true : openSidebar}
          onOpen={() => setOpenSidebar(true)}
          variant={isDesktop ? 'persistent' : 'temporary'}
          user={user}
          storeLocation={store && store.city}
          onLogoff={logoff}
        />
        <main className={classes.content}>
          {children}
          <Footer />
        </main>
      </div>
    </LoadingOverlay>
  )
}

Main.propTypes = {
  children: PropTypes.node
}
