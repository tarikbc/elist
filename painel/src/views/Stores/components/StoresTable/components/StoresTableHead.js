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
  { id: 'city', numeric: false, disablePadding: false, label: 'Cidade' },
  { id: 'sold', numeric: true, disablePadding: false, label: 'Faturamento' },
  { id: 'acDayGoal', numeric: true, disablePadding: false, label: 'Meta Acumulada' },
  { id: 'goalPercent', numeric: true, disablePadding: false, label: 'Percentual da meta' },
  { id: 'projection', numeric: true, disablePadding: false, label: 'Projeção de venda' },
  { id: 'mainGoal', numeric: true, disablePadding: false, label: 'Meta do mês' },
];

const StoresTableHead = ({ classes, order, orderBy, onRequestSort }) => {

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
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

StoresTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default StoresTableHead