import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  AppBar,
  Toolbar,
  Hidden,
  IconButton,
  Typography
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'

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
  }
}))

const Topbar = props => {
  const {
    className,
    onSidebarOpen,
    onLogoff,
    onInput,
    inputCount,
    storeName,
    ...rest
  } = props

  const classes = useStyles()

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/stores">
          <div className={classes.titleBox}>
            <img src='/images/logo.svg' alt='Logo' height='20px' style={{ margin: '10px 0px 10px 10px' }} />
            {storeName && (
              <Hidden mdDown>
                <Typography variant='h3' className={classes.and}>&</Typography>
                <Typography variant='h3' className={classes.title}>{storeName}</Typography>
              </Hidden>
            )}
          </div>
        </RouterLink>
        <div className={classes.flexGrow} />
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
  onInput: PropTypes.func,
  inputCount: PropTypes.number,
  storeName: PropTypes.string
}

export default Topbar
