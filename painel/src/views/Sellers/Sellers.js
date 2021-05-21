import React, { useState, useEffect } from 'react'

// Libs
import { makeStyles } from '@material-ui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// Components
import UsersTable from './components/UsersTable'
import { Toolbar } from '../../components'

// Actions
import { userListRequest } from '../../store/modules/user/actions'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}))

export default function Sellers() {
  const classes = useStyles()
  const dispatch = useDispatch()

  // userList: state.repositories.userList,
  // loading: state.repositories.loading

  const userList = useSelector(state => state.user.userList)

  const [user, setUser] = useState()

  const { storeId } = useParams()

  function onRefresh() {
    dispatch(
      userListRequest(
        storeId,
        window.localStorage.getItem('@Elist:token')
      )
    )
  }

  useEffect(() => {
    if (!userList) {
      onRefresh()
    }
  }, [])

  const handleOpenModal = (data) => {
    setUser({
      _id: data._id,
      name: data.name,
      birthDate: data.birthDate,
      phone: data.phone,
      email: data.email,
      isOnThisMonthGoal: data.isOnThisMonthGoal
    })
  }

  return (
    <div className={classes.root}>
      <Toolbar
        onRefresh={onRefresh}
      />
      <div className={classes.content}>
        <UsersTable users={userList} handleOpenModal={handleOpenModal} />
      </div>
    </div>
  )
}
