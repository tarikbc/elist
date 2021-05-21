import React, { useState, useEffect } from 'react';

// Libs
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '../../styles/DateRangePicker.css'

// Material UI
import { makeStyles } from '@material-ui/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CardContent from '@material-ui/core/CardContent'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import GroupIcon from '@material-ui/icons/Group';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';


// Components
import ValueCard from '../../components/ValueCard'
import UsersPerformanceTable from '../../components/UsersPerformanceTable'
import DaysTable from './components/DaysTable'
import HeatMap from '../../components/HeatMap'
import Toolbar from '../../components/Toolbar'

// Actions
import { dayReportRequest, dayListRequest, dayRequest } from '../../store/modules/day/actions'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  title: {
    padding: theme.spacing(1)
  },
  headerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  input: {
    background: '#e0e0e0',
    width: 350,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

function Services({ match }) {

  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()

  const { storeId } = match.params

  // ReduxState
  const day = useSelector(state => state.day)
  const store = useSelector(state => state.store.store)
  const token = localStorage.getItem('@Elist:token')


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // State
  const [tab, setTab] = useState('resumeTab')
  const [period, setPeriod] = useState({
    from: new Date(DateTime.local().startOf('month').toUTC()),
    to: new Date(DateTime.local().endOf('month').toUTC())
  })
  const [anchorEl, setAnchorEl] = useState(null);
  const [optionIndex, setOptionIndex] = useState(0)

  const handleChangePage = (page) => {
    if (page + 1 <= day.metadata.pagination.pageCount) {
      dispatch(dayListRequest(
        storeId,
        token,
        page + 1,
        day.metadata.pagination.limit
      ))
    }
  }

  const handleChangeRows = (rowsNumber) => {
    dispatch(dayListRequest(
      storeId,
      token,
      day.metadata.pagination.currentPage,
      Number(rowsNumber.props.value)
    ))
  }

  // Tabs
  const tabs = [
    { value: 'resumeTab', label: 'Resumo' },
    { value: 'daysTab', label: 'Dias' },
  ]

  const options = [
    {
      label: 'Esse mês',
      range: {
        from: DateTime.local().startOf('month').toUTC().toISO(),
        to: DateTime.local().endOf('month').toUTC().toISO()
      }
    },
    {
      label: 'Hoje',
      range: {
        from: DateTime.local().toUTC().toISO(),
        to: DateTime.local().toUTC().toISO()
      }
    },
    {
      label: 'Ontem',
      range: {
        from: DateTime.local().toUTC().minus({ day: 1 }).toISO(),
        to: DateTime.local().toUTC().minus({ day: 1 }).toISO()
      }
    },
    {
      label: 'Esta semana',
      range: {
        from: DateTime.local().startOf('week').toUTC().toISO(),
        to: DateTime.local().endOf('week').toUTC().toISO()
      }
    },
    {
      label: 'Personalizado',
      range: {
        from: DateTime.local().toUTC().toISO(),
        to: DateTime.local().toUTC().toISO()
      }
    },
  ];

  useEffect(() => {
    if (day.sellers.length == 0) dispatch(dayReportRequest(storeId, token, { from: new Date(period.from).toISOString(), to: new Date(period.to).toISOString() }))
    if (day.metadata.pagination.totalCount < 0) dispatch(dayListRequest(storeId, token))
  }, [])

  return (
    <div className className={classes.root}>
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
      {tab === 'resumeTab' && (
        <>
          <div className={classes.headerBox}>
          <div>
            <Button 
              aria-controls="simple-menu" 
              aria-haspopup="true" 
              onClick={handleClick}
              startIcon={<CalendarTodayIcon />}
            >
              {options[optionIndex].label}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}

            >
              {options.map((option, index) =>   
                <MenuItem 
                  
                  key={index}
                  onClick={() => {
                    setOptionIndex(index)
                    setAnchorEl(null)
                    if(index !== optionIndex) {
                      setPeriod({
                        from: new Date(option.range.from),
                        to: new Date(option.range.to)
                      })
                      dispatch(dayReportRequest(storeId, token, { from: new Date(option.range.from).toISOString(), to: new Date(option.range.to).toISOString() }))
                    }
                }}>
                {option.label}
                </MenuItem>
              )}
            </Menu>
          </div>
            {/* <DatePicker handleUpdatePeriod={setPeriod} period={period} /> */}
            {optionIndex == 4 && (
              <DateRangePicker
                onChange={(range) => {
                  if (range) {
                    dispatch(dayReportRequest(storeId, token, { from: new Date(range[0]).toISOString(), to: new Date(range[1]).toISOString() }))
                     setPeriod({
                      from: range[0],
                      to: range[1]
                      })
                    }
                  }}
                    value={[period.from, period.to]}
                    locale="pt-BR"
                    format="dd-MM-y"
                 />
            )}
            <Toolbar 
              onRefresh={() => dispatch(dayReportRequest(storeId, token, { from: period.from.toISOString(), to: period.to.toISOString() }))}
            />
          </div>
          <Grid container spacing={4}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <ValueCard
                title='Taxa de conversão'
                value={day.conversion ? `${day.conversion}%` : 0}
                icon={<CheckCircleIcon />}
                color='#9b59b6'
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <ValueCard
                title='Atendimentos por dia'
                value={day.dayServices ? day.dayServices.toFixed(2) : 0}
                icon={<GroupIcon />}
                color="#37474F"
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <ValueCard
                title='Vendas realizadas'
                value={day.totalSales ? day.totalSales : 0}
                color="#2ecc71"
                icon={<ThumbUpIcon />}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <ValueCard
                title="Atendimentos no período"
                value={day.totalServices ? day.totalServices : 0}
                icon={<GroupIcon />}
                color="#37474F"
              />
            </Grid>
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <Card className={classes.root}>
                <Grid
                  container
                  direction='row'
                  justify='space-between'
                  alignItems='center'
                >
                  <Grid item>
                    <Typography
                      variant="h5"
                      className={classes.heading}>
                      Vendas e Motivos de não compra - por vendedor
                </Typography>
                  </Grid>
                </Grid>
                <CardContent className={classes.content}>
                  <HeatMap 
                    totalSales={day.totalSales ? day.totalSales : 0} 
                    total={day.totalServices}
                    sellers={day.sellers}
                    store={store}
                    loading={day.loading}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <UsersPerformanceTable
                users={day.sellers.map(seller => ({
                  _id: seller.sellerId._id,
                  name: seller.sellerId.name.complete,
                  conversion: Number(((seller.success / seller.events.length > 0 ? seller.success / seller.events.length : 0) * 100).toFixed(2)),
                  success: seller.success,
                  total: seller.fail + seller.success,
                  lineTime: Number(seller.time.line),
                  workingTime: seller.time.working
                }))} />
            </Grid>
          </Grid>
        </>
      )}
      {tab === 'daysTab' && (
        <>
          <Toolbar 
            onRefresh={() => dispatch(dayListRequest(storeId, token))}
          />
        <DaysTable
          handleSelectDay={(dayId, date) => {
            dispatch(dayRequest(dayId, token))
            history.push(`/${storeId}/events/${dayId}`)
          }}
          storeId={storeId}
          days={day.days}
          metadata={day.metadata}
          onChangeRows={handleChangeRows}
          onChangePage={handleChangePage}
          />
        </>
      )}
    </div>
  )
}

export default Services;