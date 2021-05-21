import React from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'

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
import { formatPrice } from '../utils/format'

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
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
  storeId,
  inputs,
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
                  <TableCell>Faturamento</TableCell>
                  <TableCell>N˚ de vendas</TableCell>
                  <TableCell>N˚ de peças</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inputs && metadata && metadata.pagination?.totalCount > 0 ? (
                  inputs
                    .slice(0, min ? 5 : metadata.pagination.limit)
                    .map(input => (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={input._id}
                        selected={false}
                        onClick={() => history.push(`/${storeId}/inputs/${input._id}`)}
                        style={{ cursor: 'pointer' }}
                        data-cy="input-table-row"
                      >
                        <TableCell>
                          <div className={classes.nameContainer}>
                            <Typography variant='body1'>
                              {moment(input.date).format('DD/MMMM - dddd')}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(input.total.sold)}</TableCell>
                        <TableCell>{input.total.sales.toFixed(0)}</TableCell>
                        <TableCell>{input.total.items.toFixed(0)}</TableCell>
                      </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan='5' style={{ textAlign: 'center' }}>
                        {inputs
                          ? 'Sem lançamentos cadastrados.'
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
            onClick={() => history.push(`/${storeId}/inputs`)}
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
              rowsPerPageOptions={[35]}
            />
          )}
      </CardActions>
    </Card>
  )
}

InputsTable.propTypes = {
  className: PropTypes.string,
  inputs: PropTypes.array,
  min: PropTypes.bool,
  onChangePage: PropTypes.func,
  onChangeRows: PropTypes.func,
  metadata: PropTypes.object
}
