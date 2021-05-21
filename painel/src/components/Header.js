import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'

// Libs
import moment from 'moment'

// Material UI
// import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles'
import { useConfirm } from 'material-ui-confirm'
import Typography from '@material-ui/core/Typography'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import IconButton from '@material-ui/core/IconButton';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import TodayIcon from '@material-ui/icons/Today'
import SyncIcon from '@material-ui/icons/Sync';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button'

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
  },
}))

const Header = ({
  className,
  data,
  route,
  title,
  subtitle,
  value,
  goal,
  dayEvent,
  handleBack,
  handleDelete,
  actionText,
  secondaryText,
  handleSecondary,
  handleInputLock,
  ...rest
}) => {
  const classes = useStyles()
  const history = useHistory()
  const confirm = useConfirm()

  const handleUpdateInputLock = () => {
    confirm({
      title: 'Atenção',
      description:
        data?.locked ? 'Você tem certeza que deseja destravar o lançamento?'
          : 'Ao travar o lançamento, não será possível sobrescrever os valores ao sincronizar com o ERP. Deseja continuar?'
      ,
      confirmationText: 'Sim',
      cancellationText: 'Cancelar'
    })
      .then(() => handleInputLock({ locked: !data.locked }))
      .catch(() => { })
  }


  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.container}>
        <div>
          <Button
            className={classes.button}
            startIcon={<ChevronLeftIcon />}
            onClick={() => handleBack ? handleBack() : history.push(route)}
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
                Última atualização: {data && moment(data.updatedAt).format('DD/MM/YYYY')}
              </Typography>
              {!goal && !dayEvent && (data?.origin == 'user' ?
                <PersonIcon style={{ color: '#63727A', marginRight: '6px', marginLeft: '12px' }} fontSize='small' /> :
                <SyncIcon style={{ color: '#63727A', marginRight: '6px', marginLeft: '12px' }} fontSize='small' />
              )}
              {!goal && !dayEvent && (
                <Typography variant='subtitle2'>
                  Origem do lançamento: {{
                    user: 'Manual',
                    idbrasil: 'Sofstore',
                    setadigital: 'Seta Digital',
                    tagplus: 'TagPlus'
                  }[data?.origin] || data?.origin || 'Desconhecida'}
                </Typography>
              )}
            </div>
            {/* <div className={classes.item}>
              <TodayIcon
                style={{ color: '#63727A', marginRight: '6px' }}
                fontSize="small"
              />
              <Typography variant="subtitle2">
                Criado em: {data && moment(data.createdAt).format('DD/MM/YYYY')}
              </Typography>
            </div> */}
            {goal && value && (
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
          {secondaryText && (<Button onClick={handleSecondary}>{secondaryText}</Button>)}
          <Button
            onClick={() => handleDelete()}
            style={{ color: '#e74c3c' }}
            data-cy="btn-delete-input"
          >
            {actionText}
          </Button>
          {!value && !dayEvent && (
            <IconButton
              onClick={() => handleUpdateInputLock()}
            >
              {data?.locked ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
          )}
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
  goal: PropTypes.bool,
  handleDelete: PropTypes.func,
  secondaryText: PropTypes.string,
  dayEvent: PropTypes.bool,
  handleBack: PropTypes.func,
  handleSecondary: PropTypes.func,
  handleInputLock: PropTypes.func,
}

Header.defaultProps = {
  route: '/',
  title: 'Título',
  subtitle: 'Subtítulo',
  goal: false,

}

export default Header
