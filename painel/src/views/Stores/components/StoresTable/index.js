import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Material ui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Paper
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

// Utils
import { formatPrice } from '../../../../utils/format'

// Components
import StoresTableHead from './components/StoresTableHead'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const StoresTable = ({ stores, handleSelectStore }) => {
  const classes = useStyles();
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
      : (a, b) => -descendingComparator(a, b, orderBy);
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


  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <StoresTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={stores.length}
            />
            <TableBody>
              {stableSort(stores, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((store, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={() => handleSelectStore(store._id)}
                      // onClick={(event) => handleClick(event, row.name)}
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={store.name}
                      style={{ cursor: 'pointer' }}
                      data-cy="store-row"
                    // selected={isItemSelected}
                    >
                      <TableCell scope="row">
                        {store.name}
                      </TableCell>
                      <TableCell>{store.city}</TableCell>
                      <TableCell>{formatPrice(store.sold)}</TableCell>
                      <TableCell>{formatPrice(store.acDayGoal)}</TableCell>
                      <TableCell>
                        <Typography
                          style={{
                            color: ((value) => (value >= 100 ? '#27ae60' : value >= 80 ? '#f39c12' : '#e74c3c'))(store.sold / store.metric.acDayGoal * 100)
                          }}
                        >
                          {store.goalPercent}%
                        </Typography>
                      </TableCell>  
                      <TableCell>{formatPrice(store.projection)}</TableCell>
                      <TableCell>{formatPrice(store.mainGoal)}</TableCell>
                    </TableRow>
                  );
                })}
              {stores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={stores.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

StoresTable.propTypes = {
  stores: PropTypes.array,
  handleSelectStore: PropTypes.func
}

export default StoresTable