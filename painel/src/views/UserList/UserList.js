import React, { useState, useEffect } from 'react'

// Libs
import { makeStyles } from '@material-ui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { useHistory } from 'react-router-dom'
import JwtDecode from 'jwt-decode'

// Components
import UsersTable from './components/UsersTable'
import AddUserModal from './components/AddUserModal'
import { Toolbar } from '../../components'
import EditUserModal from './components/EditUserModal'

// Actions
import {
  userListRequest,
  userAddRequest,
  userEditRequest,
  unLinkUser,
  userUpdateLink,
  userExistsRequest,
  userLinkRequest,
  userAddModal,
  userExistsSuccess,
  clearNewUser
} from '../../store/modules/user/actions'
import { requestFailed } from '../../store/modules/error/action'


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}))

export default function UserList({ match }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const history = useHistory()

  // userList: state.repositories.userList,
  // loading: state.repositories.loading

  // User
  const userList = useSelector(state => state.user.userList)
  const metadata = useSelector(state => state.user.metadata)
  const loading = useSelector(state => state.user.loading)
  const searchLoading = useSelector(state => state.user.searchLoading)
  const userExists = useSelector(state => state.user.userExists)
  const addUserModal = useSelector(state => state.user.addUserModal)
  const error = useSelector(state => state.user.error)
  const newUser = useSelector(state => state.user.newUser)


  const { storeId } = match.params
  const token = window.localStorage.getItem('@Elist:token')
  const decoded = JwtDecode(token)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [user, setUser] = useState()

  const onRefresh = () => {
    dispatch(
      userListRequest(
        storeId,
        token
      )
    )
  }

  const handleChangePage = (page) => {
    if (page + 1 <= metadata.pagination.pageCount) {
      dispatch(userListRequest(
        storeId,
        token,
        page + 1,
        metadata.pagination.limit
      ))
    }
  }

  const handleChangeRows = (rowsNumber) => {
    dispatch(userListRequest(
      storeId,
      token,
      metadata.pagination.currentPage,
      Number(rowsNumber.props.value)
    ))
  }

  const handleSubmit = (data) => {
    dispatch(userEditRequest(data, token, user._id))
  }

  const handleOpenModal = (data) => {
    setUser(data)
    setEditModal(true)
  }

  const handleUpdateUserLink = (data) => {
    dispatch(userUpdateLink(data, user._id, localStorage.getItem('@Elist:token'), storeId))
  }

  const handleLinkUser = (data) => {
    dispatch(userLinkRequest({ ...data, storeId: storeId }, userExists._id, token))
  }

  const handleCheckCpf = (data) => {
    dispatch(userExistsRequest(data, token))
  }

  useEffect(() => {
    if (metadata.pagination.totalCount < 0) {
      onRefresh()
    }
  }, [])

  useEffect(() => {
    if (userList) {
      setAddModal(false)
      setEditModal(false)
    }
  }, [userList])

  useEffect(() => {
    if (!addUserModal) {
      dispatch(requestFailed(null))
      dispatch(userExistsSuccess({
        found: false
      }))
    }
  }, [addUserModal])

  return (
    <div className={classes.root}>
      <Toolbar
        onAdd={() => dispatch(userAddModal(true))}
        onRefresh={onRefresh}
        actionText='Adicionar Usuário'
      />
      <UsersTable
        users={userList}
        handleOpenModal={handleOpenModal}
        onChangeRows={handleChangeRows}
        onChangePage={handleChangePage}
        metadata={metadata}
      />
      <EditUserModal
        active={editModal}
        onClose={() => setEditModal(false)}
        loading={loading}
        user={user}
        storeId={storeId}
        isDifferentUser={user && decoded.id !== user._id}
        handleUpdateUserLink={handleUpdateUserLink}
        handleSubmitData={handleSubmit}
        handleUnLinkUser={() => dispatch(unLinkUser(storeId, user._id, token))}
      />
      <AddUserModal
        handleCheckCpf={handleCheckCpf}
        userExists={userExists}
        error={error}
        loading={loading}
        active={addUserModal}
        searchLoading={searchLoading}
        onClose={() => dispatch(userAddModal(false))}
        linkUser={(data) => handleLinkUser(data)}
        addUser={user => dispatch(
          userAddRequest(
            { ...user, storeId: storeId },
            token
          )
        )}
      />
    </div>
  )
}
