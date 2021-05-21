import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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

const UsersTable = ({ className, handleOpenModal, users, ...rest }) => {
  const classes = useStyles()

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)

  const handlePageChange = (event, page) => {
    setPage(page)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value)
  }

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
                  <TableCell>Telefone</TableCell>
                  <TableCell>Aniversário</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Código</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.length > 0 ? (
                  users.slice(0, rowsPerPage).map(user => (
                    <TableRow
                      style={{ cursor: 'pointer' }}
                      className={classes.tableRow}
                      hover key={user._id}
                      onClick={() => handleOpenModal(user)}
                    >
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar
                            className={classes.avatar}
                            src={user.photo.url}
                          />
                          <Typography variant='body1'>
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
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.birthDate.substring(0, 10)}</TableCell>
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
                          : 'Não cadastrado'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan='5' style={{ textAlign: 'center' }}>
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
          count={users ? users.length : 0}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  )
}

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array
}

export default UsersTable
