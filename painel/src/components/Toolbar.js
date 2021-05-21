import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'

import RefreshIcon from '@material-ui/icons/Refresh'

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  refresh: {
    marginRight: theme.spacing(1)
  }
}))

const Toolbar = ({ onAdd, onRefresh, actionText, className, children, ...rest }) => {
  const classes = useStyles()

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button color='primary' onClick={onRefresh} className={classes.refresh} data-cy="btn-refresh">
          <RefreshIcon />
        </Button>
        {children}
        {actionText && actionText.length > 0 && (
          <Button color='primary' variant='contained' onClick={onAdd} data-cy="btn-new-data">
            {actionText}
          </Button>
        )}
      </div>
    </div>
  )
}

Toolbar.propTypes = {
  className: PropTypes.string,
  onAdd: PropTypes.func,
  onRefresh: PropTypes.func,
  actionText: PropTypes.string
}

export default Toolbar
