import React, { useState, useEffect } from 'react'
import 'react-day-picker/lib/style.css'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/styles'
import LoadingOverlay from 'react-loading-overlay'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useDispatch, useSelector } from 'react-redux'

import { useHistory } from 'react-router-dom'
import { useConfirm } from 'material-ui-confirm'

import jwt_decode from 'jwt-decode'
import {
  userRequest,
  logout
} from '../../store/modules/user/actions'

import { Sidebar, Topbar, Footer } from './components'

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

export default function Owner({ children }) {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user.user)
  const error = useSelector(state => state.error.error)

  const inputLoading = useSelector(state => state.input.loading)
  const userLoading = useSelector(state => state.user.loading)
  const goalLoading = useSelector(state => state.goal.loading)
  const reportLoading = useSelector(state => state.report.loading)

  const history = useHistory()

  const classes = useStyles()
  const theme = useTheme()
  const confirm = useConfirm()
  const token = window.localStorage.getItem('@Elist:token')

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })

  const [openSidebar, setOpenSidebar] = useState(false)

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

  const handleSidebarOpen = () => {
    setOpenSidebar(true)
  }

  const handleSidebarClose = () => {
    setOpenSidebar(false)
  }

  const logoff = (redirect = true) => {
    window.localStorage.removeItem('@Elist:token')
    dispatch(logout())
    if (redirect) history.push('/login')
  }

  const shouldOpenSidebar = isDesktop ? true : openSidebar

  // Verifica se user está logado
  useEffect(() => {
    if (!user._id) {
      logoff(false)
      if (user.stores.length === 0) history.push('/login')

    }
  }, [user, token])

  return (
    <LoadingOverlay active={userLoading || inputLoading || goalLoading || reportLoading} spinner>
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })}
      >
        <Topbar
          onSidebarOpen={handleSidebarOpen}
          onLogoff={logoff}
          storeName={user.name.first}
        />
        <Sidebar
          onClose={handleSidebarClose}
          open={shouldOpenSidebar}
          onOpen={handleSidebarOpen}
          variant={isDesktop ? 'persistent' : 'temporary'}
          user={user}
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

Owner.propTypes = {
  children: PropTypes.node
}
