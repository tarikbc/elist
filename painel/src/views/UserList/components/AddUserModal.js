import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

// Material UI
import { useConfirm } from 'material-ui-confirm'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
// import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import InputAdornment from '@material-ui/core/InputAdornment';

// Components
import TabPanel from '../../../components/TabPanel'


// Utils
import { phoneMask, cpfMask } from '../../../utils/inputMasks'

const useStyles = makeStyles(theme => ({
  root: {},
  textField: {},
  selectMargin: { marginTop: theme.spacing(2), marginBottom: theme.spacing(1) }
}))

const AddUserModal = ({
  active,
  onClose,
  addUser,
  loading,
  searchLoading,
  handleCheckCpf,
  userExists,
  linkUser,
  error,
  currentGoal,
  ...rest
}) => {
  const classes = useStyles()
  const confirm = useConfirm()
  const history = useHistory()

  const defaultData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    storeType: 'seller',
    cpf: ''
  }

  const [tab, setTab] = useState(0)
  const [data, setData] = useState(defaultData)

  useEffect(() => {
    const filteredCPF = data.cpf.replace(/[^a-zA-Z0-9]/g, "",)
    if (filteredCPF.length === 11) {
      handleCheckCpf(filteredCPF)
    }
  }, [data.cpf])

  useEffect(() => {
    setData(defaultData)
    setTab(0)
  }, [active])

  useEffect(() => {
    if (tab === 1 && userExists.found) {
      setTab(0)
    } else if (tab === 0 && !userExists.found) {
      setTab(1)
    }
  }, [userExists])

  const handleLinkUser = () => {
    const submitData = {
      type: data.storeType
    }
    if (data.storeType.length > 0) {
      if (data.storeType === 'seller' && data.code.length === 0) {
        confirm({
          title: 'Ops!',
          description: `O Código de segurança é obrigatório!`,
          confirmationText: 'Ok!',
          cancellationText: 'Fechar'
        }).then(() => { }).catch(() => { })
        return
      } else {
        submitData.code = data.code
      }
    } else {
      confirm({
        title: 'Ops!',
        description: `Preencha todos os campos antes de avançar!`,
        confirmationText: 'Ok!',
        cancellationText: 'Fechar'
      }).then(() => { }).catch(() => { })
      return
    }
    linkUser(submitData)
  }
  const handleChangeTab = (iOld, iNew) => {
    if (iOld === 0 && iNew === 1) {
      if (!error) {
        setTab(1)
      } else {
        confirm({
          title: 'Ops!',
          description: `Preencha todos os campos corretamente!`,
          confirmationText: 'Ok!',
          cancellationText: 'Fechar'
        }).then(() => { }).catch(() => { })
      }
    } else {
      if (data.firstName.length > 0 &&
        data.lastName.length > 0 &&
        data.storeType.length > 0 &&
        data.password.length > 0 &&
        (data.storeType !== 'seller' ? data.email.length > 0 : true)
      ) {
        const submitData = {
          name: {
            first: data.firstName,
            last: data.lastName
          },
          storeType: data.storeType,
          password: data.password,
        }

        if (data.cpf) submitData.cpf = data.cpf.replace(/[^a-zA-Z0-9]/g, "",)
        if (data.email) submitData.email = data.email

        addUser(submitData)
      } else {
        confirm({
          title: 'Ops!',
          description: `Preencha todos os campos!`,
          confirmationText: 'Ok!',
          cancellationText: 'Fechar'
        }).then(() => { }).catch(() => { })
      }
    }
  }


  return (
    <div {...rest} className={classes.root}>
      <Dialog
        open={active}
        onClose={onClose}
        maxWidth='xs'
        fullWidth
      >
        <form
          className={classes.root}
          autoComplete='off'
        >
          <DialogTitle id='form-dialog-title'>Adicionar Usuário</DialogTitle>
          <DialogContent>
            <Stepper activeStep={tab} className={classes.root}>
              <Step key={0}>
                <StepLabel>Buscar usuário</StepLabel>
              </Step>
              <Step key={1}>
                <StepLabel>Dados</StepLabel>
              </Step>
            </Stepper>
            <TabPanel value={tab} index={0}>
              {userExists.found && data.cpf.length === 14 && !error ? (
                <DialogContentText>
                  Já existe um usuário com este CPF.
                  Preencha os dados abaixos para vincular o usuário a sua loja.
                </DialogContentText>
              ) : (
                  <DialogContentText>
                    Digite um CPF para buscar por um usuário já existente ou vá para o próximo passo.
                  </DialogContentText>
                )}
              <TextField
                variant='outlined'
                margin="normal"
                fullWidth
                id="cpf"
                name="cpf"
                label="CPF"
                disabled={searchLoading}
                value={data.cpf}
                onChange={event =>
                  setData({
                    ...data,
                    cpf: event.target.value
                  })
                }
                onFocus={event => event.target.select()}
                className={classes.textField}
                InputProps={{
                  'data-cy': 'cpf',
                  inputComponent: cpfMask,
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchLoading && <CircularProgress size={24} />}
                    </InputAdornment>
                  )
                }}
                error={!!error}
                helperText={error && error.error.friendlyMsg}
              />
              {userExists.found && data.cpf.length === 14 && !error && (
                <FormControl
                  fullWidth
                  variant='outlined'
                  className={classes.selectMargin}
                >
                  <InputLabel htmlFor='storeType'>Tipo</InputLabel>
                  <Select
                    id='storeType'
                    name='storeType'
                    value={data.storeType}
                    onChange={event =>
                      setData({
                        ...data,
                        storeType: event.target.value
                      })
                    }
                    labelWidth={35}
                    data-cy="store-type-user-exists"
                  >
                    <MenuItem value='seller'>Vendedor</MenuItem>
                    <MenuItem value='cashier'>Caixa</MenuItem>
                    <MenuItem value='manager'>Gerente</MenuItem>
                  </Select>
                </FormControl>
              )}
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <TextField
                    variant='outlined'
                    margin="normal"
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="Nome"
                    value={data.firstName}
                    onChange={event =>
                      setData({
                        ...data,
                        firstName: event.target.value
                      })
                    }
                    onFocus={event => event.target.select()}
                    className={classes.textField}
                    inputProps={{
                      'data-cy': 'last-name'
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    variant='outlined'
                    margin="normal"
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Sobrenome"
                    value={data.lastName}
                    onChange={event =>
                      setData({
                        ...data,
                        lastName: event.target.value
                      })
                    }
                    onFocus={event => event.target.select()}
                    className={classes.textField}
                    inputProps={{
                      'data-cy': 'first-name'
                    }}
                  />
                </Grid>
              </Grid>
              <FormControl
                fullWidth
                variant='outlined'
                className={classes.selectMargin}
              >
                <InputLabel htmlFor='storeType'>Tipo</InputLabel>
                <Select
                  id='storeType'
                  name='storeType'
                  value={data.storeType}
                  onChange={event =>
                    setData({
                      ...data,
                      storeType: event.target.value
                    })
                  }
                  labelWidth={35}
                  inputProps={{
                    'data-cy': 'store-type'
                  }}
                >
                  <MenuItem value='seller'>Vendedor</MenuItem>
                  <MenuItem value='cashier'>Caixa</MenuItem>
                  <MenuItem value='manager'>Gerente</MenuItem>
                </Select>
              </FormControl>
              {data.storeType !== 'seller' ? (
                <TextField
                  variant='outlined'
                  margin="normal"
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={data.email}
                  onChange={event =>
                    setData({
                      ...data,
                      email: event.target.value
                    })
                  }
                  onFocus={event => event.target.select()}
                  className={classes.textField}
                  inputProps={{
                    'data-cy': 'email'
                  }}
                />
              ) : (
                  <TextField
                    variant='outlined'
                    margin="normal"
                    fullWidth
                    id="cpf"
                    name="cpf"
                    label="CPF"
                    value={data.cpf}
                    onChange={event =>
                      setData({
                        ...data,
                        cpf: event.target.value
                      })
                    }
                    onFocus={event => event.target.select()}
                    className={classes.textField}
                  />
                )}
              <TextField
                variant='outlined'
                margin="normal"
                fullWidth
                id="password"
                name="password"
                label="Senha"
                value={data.password}
                onChange={event =>
                  setData({
                    ...data,
                    password: event.target.value
                  })
                }
                onFocus={event => event.target.select()}
                className={classes.textField}
                type="password"
                autoComplete="new-password"
                inputProps={{
                  'data-cy': 'password'
                }}
              />
            </TabPanel>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => tab === 0 ? onClose() : setTab(0)} color='primary' disabled={loading || searchLoading}>
              {tab === 0 ? 'Cancelar' : 'Voltar'}
            </Button>
            <Button
              disabled={loading || searchLoading}
              color='primary' onClick={() => userExists.found && !error ?
                handleLinkUser() : handleChangeTab(tab, tab + 1)}
              data-cy="btn-create-user"
            >
              {loading ? <CircularProgress size={24} /> : (<>{userExists.found ? 'Vincular usuário' : tab !== 1 ? 'Próximo' : 'Adicionar'}</>)}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

AddUserModal.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
  addUser: PropTypes.func,
  loading: PropTypes.bool,
  searchLoading: PropTypes.bool,
  handleCheckCpf: PropTypes.func,
  userExists: PropTypes.object,
  linkUser: PropTypes.func,
  error: PropTypes.object,
  currentGoal: PropTypes.object,
}

export default AddUserModal