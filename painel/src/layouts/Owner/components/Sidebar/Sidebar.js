import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  Divider,
  SwipeableDrawer,
  colors,
  Button,
  Hidden
} from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
// import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InputIcon from '@material-ui/icons/Input'

import { Profile, SidebarNav } from './components'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2),
    height: '100%',
    flexGrow: 1
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  }
}))

const Sidebar = props => {
  const {
    open,
    variant,
    onClose,
    onOpen,
    className,
    user,
    onLogoff,
    ...rest
  } = props

  const classes = useStyles()

  const pages = [
    {
      title: 'Início',
      href: '/stores',
      icon: <DashboardIcon />
    },
  ]

  return (
    <SwipeableDrawer
      anchor='left'
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      onOpen={onOpen}
      variant={variant}
    >
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile user={user} />
        <Divider className={classes.divider} />
        <SidebarNav className={classes.nav} pages={pages} />
        <Hidden lgUp>
          <Divider className={classes.divider} />
          <Button className={classes.button} onClick={onLogoff}>
            <div className={classes.icon}>
              <InputIcon />
            </div>
            Sair
          </Button>
        </Hidden>
      </div>
    </SwipeableDrawer>
  )
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
}

export default Sidebar
