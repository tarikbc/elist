import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Card, Typography, Avatar } from '@material-ui/core'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import PencilIcon from '@material-ui/icons/Create'

// import { Label } from 'components';
// import gradients from 'utils/gradients';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    height: 48,
    width: 48
  }
}))

const ValueCard = ({ className, value, title, icon, color, inversed, editable, onClick, ...rest }) => {
  const classes = useStyles()

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      style={inversed ? { backgroundColor: color, color: '#FFF', cursor: editable ? 'pointer' : 'auto' } : { cursor: editable ? 'pointer' : 'auto' }}
      onClick={() => editable && onClick()}
    >
      <div>
        <Typography
          component='h3'
          gutterBottom
          variant='overline'
          color={inversed ? 'inherit' : 'textSecondary'}
        >
          {title}{editable && <PencilIcon style={{ fontSize: 12, marginLeft:5 }}/>}
        </Typography>
        <div className={classes.details}>
          <Typography
            variant='h3'
            color={inversed ? 'inherit' : 'textPrimary'}
          >
            {value}
          </Typography>
        </div>
      </div>
      <Avatar className={classes.avatar} style={inversed ? { background: '#fff', color } : { background: color }}>
        {icon}
      </Avatar>
    </Card>
  )
}

ValueCard.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.node,
  color: PropTypes.string,
  inversed: PropTypes.bool,
  editable: PropTypes.bool
}

ValueCard.defaultProps = {
  value: 0,
  title: 'Nome',
  icon: <AttachMoneyIcon />,
  color: '#27ae60',
  inversed: false,
  editable: false
}

export default ValueCard
