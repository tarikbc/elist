import React from 'react'

// Libs
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Material UI
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Button
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4)
  },
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 850
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}))

export default function InputsTable({
  min,
  className,
  handleSelectDay,
  storeId,
  days,
  onChangePage,
  onChangeRows,
  metadata,
  ...rest
}) {
  const classes = useStyles()

  const history = useHistory()

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Atendimentos</TableCell>
                  <TableCell>Taxa de conversão</TableCell>
                  {/* <TableCell>Vendas</TableCell>
                  <TableCell>Não compra</TableCell>
                  <TableCell>Taxa de conversão</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {days && metadata && metadata.pagination?.totalCount > 0 ? (
                  days
                    .slice(0, min ? 5 : metadata.pagination.limit)
                    .map(day => (
                      <TableRow
                        onClick={() => handleSelectDay(day._id, day.date)}
                        className={classes.tableRow}
                        hover
                        key={day._id}
                        selected={false}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Typography>
                            {moment(day.date).format('DD/MMMM - dddd')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {day.events.length}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {((day.success / (day.success + day.fail) > 0 ? day.success / (day.success + day.fail) : 0) * 100).toFixed(2)}%
                          </Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography>
                            10
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            10
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            10
                          </Typography>
                        </TableCell> */}
                      </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan='5' style={{ textAlign: 'center' }}>
                        {days
                          ? 'Ops, nenhum dia encontrado.'
                          : 'Carregando...'}
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        {min ? (
          <Button
            color='primary'
            size='small'
            variant='text'
          >
            Ver todos <ArrowRightIcon />
          </Button>
        ) : (
            <TablePagination
              component='div'
              count={metadata ? metadata.pagination.totalCount : 0}
              onChangePage={(event, page) => onChangePage(page)}
              onChangeRowsPerPage={(event, rows) => onChangeRows(rows)}
              page={metadata ? metadata.pagination.currentPage - 1 : 0}
              rowsPerPage={metadata ? metadata.pagination.limit : 0}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
      </CardActions>
    </Card>
  )
}

InputsTable.propTypes = {
  className: PropTypes.string,
  days: PropTypes.array,
  min: PropTypes.bool,
  onChangePage: PropTypes.func,
  onChangeRows: PropTypes.func,
  handleSelectDay: PropTypes.func,
  metadata: PropTypes.object
}
