import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'

// Libs
import moment from 'moment'

// Material UI
import { makeStyles, useTheme } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'
import StorefrontIcon from '@material-ui/icons/Storefront'

// Components
import { AddInput } from '../../../../components'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  title: {
    color: 'white'
  },
  and: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 8,
    paddingRight: 8
  },
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  dev: {
    paddingLeft: 8,
    color: '#FF8E53',
    fontWeight: 900
  },
  syncText: {
    color: '#fff',
    marginRight: theme.spacing(1)
  }
}))

const Topbar = ({
  className,
  onSidebarOpen,
  onLogoff,
  storeName,
  user,
  goToStore,
  storeIntegrationData,
  currentStoreId,
  ...rest
}) => {
  const classes = useStyles()
  const theme = useTheme()

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color={process.env.NODE_ENV === 'development' ? 'secondary' : 'primary'}>
      <Toolbar>
        <RouterLink to={`/${currentStoreId}/events`}>
          <div className={classes.titleBox}>
            <img
              src='/images/logo.svg'
              alt='Logo'
              height='20px'
              style={{ margin: '10px 0px 10px 10px' }}
            />
            {storeName && (
              <Hidden smDown>
                <Typography variant='h3' className={classes.and}>
                  &
                </Typography>
                <Typography variant='h3' className={classes.title}>
                  {storeName}
                </Typography>
              </Hidden>
            )}
          </div>
        </RouterLink>
        {process.env.NODE_ENV === 'development' && (
          <>
            <Typography variant='h3' className={classes.dev}>
              {isDesktop && 'Desenvolvimento'}
            </Typography>
            <Typography variant='h3' className={classes.dev}>
              {currentStoreId && isDesktop && `StoreId: ${currentStoreId}`}
            </Typography>
          </>
        )}
        <div className={classes.flexGrow} />
        {user &&
          user.stores.length > 1 &&
          currentStoreId &&
          ['owner', 'manager', 'cashier'].includes(user.stores.find(s => s.storeId._id === currentStoreId).type) && (
            <>
              <Hidden lgUp>
                <IconButton
                  onClick={goToStore}
                  color='primary'
                  aria-label='upload picture'
                  component='span'
                >
                  <StorefrontIcon style={{ color: '#fff' }} />
                </IconButton>
              </Hidden>
              <Hidden mdDown>
                <Button
                  variant='contained'
                  onClick={goToStore}
                  style={{ marginRight: '8px' }}
                >
                  Trocar Loja
              </Button>
              </Hidden>
            </>
          )}
        <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color='inherit'
            onClick={onLogoff}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color='inherit' onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  storeName: PropTypes.string,
  currentStoreId: PropTypes.string,
}

export default Topbar
