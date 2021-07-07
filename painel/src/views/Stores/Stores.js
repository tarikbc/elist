import React, { useEffect, useState } from 'react'

// Libs
import { useSelector, useDispatch } from 'react-redux'
import jwt from 'jwt-decode'
import clsx from 'clsx'

// Utils
import { formatPrice } from '../../utils/format'

// Material UI
import { makeStyles } from '@material-ui/styles'
import {
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core'
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import TimelineIcon from '@material-ui/icons/Timeline'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

// Components
import ValueCard from '../../components/ValueCard'
import { StoresTable } from './components'

// Actions
import { clearRedux } from '../../store/modules/main/actions'
import { logout } from '../../store/modules/user/actions'


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

  },
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(2),
    minWidth: 300
  },

  card: {
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.08)'
    },
    cursor: 'pointer'
  },
  pos: {
    marginBottom: 12
  },
  avatar: {
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    marginBottom: theme.spacing(1)
  },
  sellsContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
}))

const Stores = ({ history }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  // Redux
  const user = useSelector(state => state.user.user)

  const token = window.localStorage.getItem('@Elist:token')

  useEffect(() => {
    if (token) {
      dispatch(clearRedux())
    } else {
      window.localStorage.removeItem('@Elist:token')
      dispatch(logout())
      history.push(`/login`)
    }
  }, [token])


  const handleSelectStore = (storeId) => {
    history.push(`/${storeId}/dashboard`)
  }


  return (
    <div className={classes.root}>
      <Typography variant="h4" style={{ marginBottom: 8 }}>Todas as lojas</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <StoresTable
            handleSelectStore={handleSelectStore}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default Stores
