import React from 'react'
import PropTypes from 'prop-types';

import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core'

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Nome' },
  { id: 'conversion', numeric: true, disablePadding: false, label: 'Taxa de conversão' },
  { id: 'total', numeric: true, disablePadding: false, label: 'Quantidade de atendimentos' },
  { id: 'success', numeric: true, disablePadding: false, label: 'Vendas' },
  { id: 'lineTime', numeric: true, disablePadding: false, label: 'Tempo na fila' },
  { id: 'workingTime', numeric: true, disablePadding: false, label: 'Tempo em atendimento' },
];

const UsersTableHead = ({ classes, order, orderBy, onRequestSort }) => {

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/* {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null} */}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

UsersTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default UsersTableHead