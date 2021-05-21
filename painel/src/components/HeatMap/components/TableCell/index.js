import React from 'react';

// Libs
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip';


// Styles
import { Container } from './styles';

function TableCell({ value, hasPercent, percent, reason, backgroundColor, defaultCell, ...rest }) {
  return (
    <Tooltip title={reason ? `${reason}: ${value}` : ''} arrow>
      <Container defaultCell={defaultCell} backgroundColor={backgroundColor} {...rest} percent={percent}>
        <h1>{value}</h1>
          {hasPercent && (
            <p>{percent}%</p>
          )}
    </Container>
  </Tooltip>
  )
}

TableCell.propTypes = {
  value: PropTypes.number,
  hasPercent: PropTypes.bool,
  percent: PropTypes.number,
  reason: PropTypes.string,
  backgroundColor: PropTypes.string,
  defaultCell: PropTypes.bool,
}

TableCell.defaultProps = {
  value: 1000,
}

export default TableCell;