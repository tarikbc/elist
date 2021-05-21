import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// Libs
import moment from 'moment'

// Material UI
import { makeStyles } from '@material-ui/styles'
import { useConfirm } from 'material-ui-confirm'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Utils
import { phoneMask, cpfMask } from '../../../utils/inputMasks'

// Styles
const useStyles = makeStyles(theme => ({
  root: {},
  textField: {
    marginTop: theme.spacing(2.5)

  },
  removeButton: { marginLeft: theme.spacing(1) },
  buttonSuccess: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white'
    }
  }
}))

export default function EditUserModal({
  active,
  onClose,
  user,
  storeId,
  loading,
  isDifferentUser,
  handleSubmitData,
  handleUnLinkUser,
  handleUpdateUserLink,
  ...rest
}) {
  const classes = useStyles()
  const confirm = useConfirm()

  const defaultValues = {
    firstName: '...',
    lastName: '...',
    birthDate: '',
    email: '...',
    gender: '...',
    phone: '...',
    cpf: '...',
    gender: '...',
    code: '...',
    type: '...'
  }

  const [initialData, setInitialData] = useState()
  const [data, setData] = useState(defaultValues)

  const handleChangeData = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const onSubmit = () => {

    const newUserData = {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      email: data.email,
      gender: data.gender,
      phone: data.phone,
      cpf: data.cpf,
      gender: data.gender,
    }

    const newUserLink = {
      code: data.code,
      type: data.type
    }


    if (JSON.stringify(newUserData) !== initialData.userData) {
      handleSubmitData({
        name: {
          first: data.firstName,
          last: data.lastName
        },
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
        gender: data.gender,
        phone: data.phone.replace(/[^a-zA-Z0-9]/g, "",),
        cpf: data.cpf ? data.cpf.replace(/[^a-zA-Z0-9]/g, "",) : undefined,
        email: data.email,
      })
    }

    if (JSON.stringify(newUserLink) !== initialData.userLink) {
      handleUpdateUserLink({
        type: data.type,
        code: data.code,
        storeId: storeId
      })
    }
  }


  useEffect(() => {
    if (user) {
      const currStore = user.stores.find(store => typeof store.storeId === 'object' ? store.storeId._id === storeId : store.storeId === storeId)
      setData({
        firstName: user.name.first,
        lastName: user.name.last,
        birthDate: user.birthDate ? moment(user.birthDate).format('YYYY-MM-DD') : undefined,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        cpf: user.cpf,
        gender: user.gender,
        code: currStore?.code,
        type: currStore?.type
      })
      setInitialData({
        userData: JSON.stringify({
          firstName: user.name.first,
          lastName: user.name.last,
          birthDate: moment(user.birthDate).format('YYYY-MM-DD'),
          email: user.email,
          gender: user.gender,
          phone: user.phone,
          cpf: user.cpf,
          gender: user.gender,
        }),
        userLink: JSON.stringify({
          code: currStore?.code,
          type: currStore?.type
        })
      })
    }
  }, [user])


  return (
    <div {...rest} className={classes.root}>
      <Dialog
        open={active}
        onClose={onClose}
      >
        <form
          className={classes.root}
          autoComplete='off'
        >
          <DialogTitle id='form-dialog-title'>Editar Usuário</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Preencha os dados abaixo para editar o usuário.
            </DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs>
                <TextField
                  label="Nome"
                  fullWidth
                  variant='outlined'
                  margin="normal"
                  id="firstName"
                  name="firstName"
                  onChange={handleChangeData}
                  value={data.firstName}
                  className={classes.textField}
                  onFocus={event => event.target.select()}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  label="Sobrenome"
                  fullWidth
                  variant='outlined'
                  margin="normal"
                  id="lastName"
                  name="lastName"
                  onChange={handleChangeData}
                  value={data.lastName}
                  className={classes.textField}
                  onFocus={event => event.target.select()}
                />
              </Grid>
            </Grid>
            <FormControl
              fullWidth
              variant='outlined'
              className={classes.textField}
              margin="normal"
            >
              <InputLabel htmlFor="gender">
                Gênero
              </InputLabel>
              <Select
                id="gender"
                name="gender"
                value={data.gender}
                onChange={handleChangeData}
                labelWidth={30}
              >
                <MenuItem value='female'>Feminino</MenuItem>
                <MenuItem value='male'>Masculino</MenuItem>
                <MenuItem value='other'>Outro</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Data de nascimento"
              type="date"
              fullWidth
              variant='outlined'
              margin="normal"
              id="birthDate"
              name="birthDate"
              onChange={handleChangeData}
              value={data.birthDate}
              className={classes.textField}
              onFocus={event => event.target.select()}
            />
            <TextField
              label="Email"
              fullWidth
              variant='outlined'
              margin="normal"
              id="email"
              name="email"
              onChange={handleChangeData}
              value={data.email}
              className={classes.textField}
              onFocus={event => event.target.select()}
            />
            <TextField
              label="CPF"
              fullWidth
              variant='outlined'
              margin="normal"
              id="cpf"
              name="cpf"
              onChange={handleChangeData}
              value={data.cpf}
              className={classes.textField}
              onFocus={event => event.target.select()}
              InputProps={{
                inputComponent: cpfMask,
              }}
            />
            <TextField
              label="Telefone"
              fullWidth
              variant='outlined'
              margin="normal"
              id="phone"
              name="phone"
              onChange={handleChangeData}
              value={data.phone}
              className={classes.textField}
              onFocus={event => event.target.select()}
              InputProps={{
                inputComponent: phoneMask,
              }}
            />
            <FormControl
              fullWidth
              variant='outlined'
              margin="normal"
              className={classes.textField}
            >
              <InputLabel htmlFor="type">
                Cargo
              </InputLabel>
              <Select
                id="type"
                name="type"
                value={data.type}
                onChange={handleChangeData}
                labelWidth={30}
              >
                <MenuItem value='seller'>Vendedor</MenuItem>
                <MenuItem value='cashier'>Caixa</MenuItem>
                <MenuItem value='manager'>Gerente</MenuItem>
                <MenuItem value='owner'>Dono</MenuItem>
              </Select>
            </FormControl>
            {data.type === 'seller' && (
              <TextField
                label="Código de segurança"
                fullWidth
                variant='outlined'
                id="code"
                name="code"
                onChange={handleChangeData}
                value={data.code}
                className={classes.textField}
                inputProps={{ maxLength: 4 }}
                onFocus={event => event.target.select()}
              />
            )}
          </DialogContent>
          <DialogActions>
            {isDifferentUser && (<>
              <Button
                className={classes.removeButton}
                onClick={() => {
                  confirm({
                    title: 'Remover usuário',
                    description: `Você tem certeza que deseja remover o usuário ${user.name.complete}?`,
                    confirmationText: 'Sim',
                    cancellationText: 'Não'
                  })
                    .then(() => {
                      handleUnLinkUser(user._id)
                      onClose()
                    })
                    .catch(() => { })
                }}
              >Desvincular da loja</Button>
              <div style={{ flex: 1 }}></div>
            </>)}
            <Button onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={() => onSubmit()} color='primary'>
              {loading ? (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              ) : (
                  'Salvar'
                )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

EditUserModal.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
  loading: PropTypes.bool,
  isDifferentUser: PropTypes.bool,
  handleSubmitData: PropTypes.func,
  handleUnLinkUser: PropTypes.func,
  handleUpdateUserLink: PropTypes.func,
}