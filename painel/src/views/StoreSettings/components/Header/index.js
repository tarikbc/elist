import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'
// import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import TodayIcon from '@material-ui/icons/Today'
import Button from '@material-ui/core/Button'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  root: {},
  dates: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  startDateButton: {
    marginRight: theme.spacing(1)
  },
  endDateButton: {
    marginLeft: theme.spacing(1)
  },
  calendarTodayIcon: {
    marginRight: theme.spacing(1)
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '16px'
  }
}))

const Header = ({
  className,
  store,
  route,
  title,
  subtitle,
  value,
  handleDelete,
  ...rest
}) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.container}>
        <div>
          <Button
            className={classes.button}
            startIcon={<ChevronLeftIcon />}
            onClick={() => history.push(route)}
          >
            {title}
          </Button>
          <Typography component='h1' gutterBottom variant='h3'>
            {subtitle}
            {/* {name} de {data && moment(data.date).format('DD/MMMM')} */}
          </Typography>
          <div className={classes.itemContainer}>
            <div className={classes.item}>
              <TodayIcon
                style={{ color: '#63727A', marginRight: '6px' }}
                fontSize='small'
              />
              <Typography variant='subtitle2'>
                Última atualização: {store && moment(store.updatedAt).format('DD/MM/YYYY')}
              </Typography>
            </div>
            <div className={classes.item}>
              <TodayIcon
                style={{ color: '#63727A', marginRight: '6px' }}
                fontSize="small"
              />
              <Typography variant="subtitle2">
                Criado em: {store && moment(store.createdAt).format('DD/MM/YYYY')}
              </Typography>
            </div>
            {value && (
              <div className={classes.item}>
                <AttachMoneyIcon
                  style={{ color: '#63727A' }}
                  fontSize='small'
                />
                <Typography variant='subtitle2'>Meta: {value}</Typography>
              </div>
            )}
          </div>
        </div>
        <div>
          <Button
            onClick={() => handleDelete()}
            style={{ color: '#e74c3c' }}
            disabled
          >
            APAGAR LOJA
          </Button>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  route: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.any,
  value: PropTypes.string,
  handleDelete: PropTypes.func
}

Header.defaultProps = {
  route: '/',
  title: 'Título',
  subtitle: 'Subtítulo'
}

export default Header
