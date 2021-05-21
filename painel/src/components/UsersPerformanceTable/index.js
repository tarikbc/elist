import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from 'moment'

import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import 'react-day-picker/lib/style.css'

// Components
import UsersTableHead from './UsersTableHead'

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  heading: {
    padding: theme.spacing(2)
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

const UsersPerformanceTable = ({
  className,
  users,
  ...rest
}) => {
  const classes = useStyles()
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
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
            Desempenho de atendimentos - por vendedor
          </Typography>
        </Grid>
      </Grid>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <UsersTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={users.length}
              />
              <TableBody>
                {stableSort(users, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={user._id}
                      >
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.conversion}%</TableCell>
                        <TableCell>{user.total}</TableCell>
                        <TableCell>{user.success}</TableCell>
                        <TableCell>{moment().startOf('day').seconds(user.lineTime).format('HH:mm:ss')}</TableCell>
                        {/* <TableCell>{user.lineTime.toFixed()}</TableCell> */}
                        <TableCell>{moment().startOf('day').seconds(user.workingTime).format('HH:mm:ss')}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </PerfectScrollbar>
        {/* <TablePagination
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
      </CardContent>
    </Card>
  )
}

UsersPerformanceTable.propTypes = {
  className: PropTypes.string,
  reports: PropTypes.object,
  requestReports: PropTypes.func
}

export default UsersPerformanceTable
