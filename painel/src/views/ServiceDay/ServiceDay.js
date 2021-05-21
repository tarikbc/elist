import React, { useEffect, useState } from 'react'

// Libs
import moment from 'moment'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'

// Redux
import { useSelector, useDispatch } from 'react-redux'

// Material UI
import { makeStyles } from '@material-ui/styles'
import { useConfirm } from 'material-ui-confirm'
import { Divider, colors, Grid } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import GroupIcon from '@material-ui/icons/Group';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

// Components
import Header from '../../components/Header'
// import Users from './components/Users'
import ValueCard from '../../components/ValueCard'
import UsersPerformanceTable from '../../components/UsersPerformanceTable'


// Actions
import { dayRequest } from '../../store/modules/day/actions'

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  tabs: {
    marginBottom: theme.spacing(2)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  alert: {
    marginTop: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(3)
  },
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  cardRoot: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

const ServiceDay = ({ match }) => {
  const { dayId, storeId } = match.params

  const classes = useStyles()
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const history = useHistory()

  // Redux
  const sellers = useSelector(state => state.day.sellers)
  const day = useSelector(state => state.day.day)

  const token = localStorage.getItem('@Elist:token')


  // Component State
  // Tabs
  const tabs = [
    { value: 'performance', label: 'Desempenho' },
    { value: 'timeLine', label: 'Linha do tempo' },
  ]
  const [tab, setTab] = useState('performance')

  const status = {
    start: 'Iniciou o dia',
    end_operational: 'Tarefas operacionais',
    end_food: 'Saiu para almoçar',
    end_coffee: 'Saiu para lanchar',
    end_bathroom: 'Foi ao banheiro',
    end_external: 'Tarefas externas',
    end: 'Finalizou o dia',
  }

  useEffect(() => {
    if (!day) dispatch(dayRequest(dayId, token))
  }, [])


  return (
    <div className={classes.root}>
      <Header
        dayEvent
        data={{
          updatedAt: day ? day.sellers[0].activities[0].date : ''
        }}
        handleBack={() => {
          history.push(`/${storeId}/events`)
        }}
        title='Atendimentos'
        subtitle={`Dia de ${day ? moment(day.sellers[0].activities[0].date).format('DD/MMMM - dddd') : '...'
          }`}
      />
      <Grid className={classes.container} container spacing={3}>
        <Grid item lg={3} sm={6} xs={12}>
          <ValueCard
            title='Taxa de conversão'
            value={day ? `${day.conversion}%` : '0'}
            icon={<CheckCircleIcon />}
            color='#9b59b6'
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <ValueCard
            title='Vendas realizadas'
            value={day ? day.success : '0'}
            color="#2ecc71"
            icon={<ThumbUpIcon />}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <ValueCard
            title='VENDAS NÃO REALIZADAS'
            value={day ? day.fail : '0'}
            icon={<ThumbDownAltIcon />}
            color="#e74c3c"
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <ValueCard
            title='Qtd. de atendimentos'
            value={day ? day.fail + day.success : '0'}
            color="#37474F"
            icon={<GroupIcon />}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <div className={classes.content}>
        <Tabs
          className={classes.tabs}
          onChange={(e, value) => setTab(value)}
          scrollButtons='auto'
          value={tab}
          variant='scrollable'
        >
          {tabs.map(tab => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        <Grid item lg={12} sm={12} xl={12} xs={12}>
          {tab == 'performance' && (
            <UsersPerformanceTable users={day ? day.sellers.map(seller => ({
              _id: seller.sellerId._id,
              name: seller.sellerId.name.complete,
              conversion: ((seller.success / seller.events.length > 0 ? seller.success / seller.events.length : 0) * 100).toFixed(2),
              success: seller.success,
              total: seller.fail + seller.success,
              lineTime:  seller.time.line,
              workingTime: seller.time.working
            })) : []} />
          )}
          {tab == 'timeLine' && (
            <Grid container>
              {day ? day.sellers.map((seller) => (
                <Grid key={seller.sellerId._id} item lg={3} sm={6} xl={3} xs={12}>
                  <Card className={classes.cardRoot}>
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {seller.sellerId.name.complete}
                      </Typography>
                      <Timeline align="left">
                        {seller.activities.map((aC, index) => (
                          <TimelineItem>
                            <TimelineOppositeContent>
                              <Typography color="textSecondary">{DateTime.fromISO(aC.date).toLocaleString({ ...DateTime.TIME_24_SIMPLE })}</Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot />
                              {aC.type !== 'end' && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography>{status[aC.type]}</Typography>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </CardContent>
                  </Card>
                </Grid>
              )) : <></>}
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  )
}

ServiceDay.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default ServiceDay
