import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { formatCPF } from '@brazilian-utils/brazilian-utils';
import moment from 'moment'
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/CheckCircle'

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
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

const UsersTable = ({ className, handleOpenModal, users, usersWorking, onChangeRows, onChangePage, metadata, ...rest }) => {
  const classes = useStyles()

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Está na meta</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Aniversário</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Código de Segurança</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map(user => (
                    <TableRow
                      style={{ cursor: 'pointer' }}
                      className={classes.tableRow}
                      hover
                      key={user._id}
                      onClick={() => handleOpenModal(user)}
                      data-cy="user-table-row"
                    >
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar
                            className={classes.avatar}
                          />
                          <Typography variant='body1' data-cy="user-table-name">
                            {user.name.complete}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isOnThisMonthGoal && (
                          <CheckIcon
                            style={{ color: '#2ecc71' }}
                            size='small'
                          />
                        )}
                      </TableCell>
                      <TableCell>{user.email || 'Não definido'}</TableCell>
                      <TableCell>{user.cpf ? formatCPF(user.cpf, { pad: true }) : '-'}</TableCell>
                      <TableCell>{user.birthDate ? moment(user.birthDate).format('DD/MM/YYYY') : 'Não definido'}</TableCell>
                      <TableCell>
                        {user.stores.length > 0
                          ? {
                            seller: 'Vendedor',
                            manager: 'Gerente',
                            cashier: 'Caixa',
                            owner: 'Dono'
                          }[user.stores[0].type] : '-'}
                      </TableCell>
                      <TableCell>
                        {user.stores[0].code
                          ? user.stores[0].code
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                      <TableCell colSpan='7' style={{ textAlign: 'center' }}>
                        {users ? 'Sem usuários cadastrados.' : 'Carregando...'}
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component='div'
          count={metadata ? metadata.pagination.totalCount : 0}
          onChangePage={(event, page) => onChangePage(page)}
          onChangeRowsPerPage={(event, rows) => onChangeRows(rows)}
          page={metadata ? metadata.pagination.currentPage - 1 : 0}
          rowsPerPage={metadata.pagination.limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  )
}

UsersTable.propTypes = {
  className: PropTypes.string,
  handleOpenModal: PropTypes.func,
  users: PropTypes.array,
  onChangeRows: PropTypes.func,
  onChangePage: PropTypes.func,
  metadata: PropTypes.object
}

export default UsersTable
