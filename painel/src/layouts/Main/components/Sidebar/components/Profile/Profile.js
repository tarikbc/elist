import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { Avatar, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  },
  location: {
    marginTop: theme.spacing(1),
    color: '#000000AA'
  }
}))

export default function Profile({ className, storeProfileImage, storeLocation, storeId, ...rest }) {
  const user = useSelector(state => state.user.user)

  const classes = useStyles()

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt={user.name.first}
        className={classes.avatar}
        component={RouterLink}
        src={storeProfileImage}
      />
      <Typography
        className={classes.name}
        variant='h4'
      >
        {user.name.complete}
      </Typography>
      <Typography
        className={classes.location}
        variant='h5'
      >
        {storeLocation}
      </Typography>
    </div>
  )
};
