import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Material UI
import { makeStyles } from '@material-ui/styles'
import { InputAdornment, TextField, Button, Grid, InputLabel, Input } from '@material-ui/core'

// libs
import { useForm } from 'react-hook-form'
import MaskedInput from 'react-text-mask'
import { formatCNPJ, formatCEP } from '@brazilian-utils/brazilian-utils'
import { toast } from 'react-toastify'

// Components
import Header from './components/Header'

// Redux
import { storeRequest, storeUpdateRequest } from '../../store/modules/store/actions'

// Mask's
function PhoneMask ({ inputRef, ...other }) {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide
    />
  )
}

function CnpjMask ({ inputRef, ...other }) {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
      guide
    />
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  }
}))

const StoreSettings = ({ match, history }) => {
  const { id } = match.params
  const { register, handleSubmit, reset } = useForm()
  const [currentData, setCurrentData] = useState()

  const classes = useStyles()
  const dispatch = useDispatch()
  const store = useSelector(state => state.store.store)

  const onSubmit = (data) => {
    dispatch(storeUpdateRequest(id, {
      name: data.name,
      phone: data.phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', ''),
      email: data.email,
      cep: data.cep.replace('-', ''),
      city: data.city,
      address: data.address,
      cnpj: data.cnpj.replace('.', '').replace('.', '').replace('/', '').replace('-', '')
    }, window.localStorage.getItem('@Elist:token')))
  }

  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        phone: store.phone,
        email: store.email,
        cep: formatCEP(store.cep),
        city: store.city,
        address: store.address,
        cnpj: formatCNPJ(store.cnpj, { pad: true })
      })
      setCurrentData({
        name: store.name,
        phone: store.phone,
        email: store.email,
        cep: formatCEP(store.cep),
        city: store.city,
        address: store.address,
        cnpj: formatCNPJ(store.cnpj, { pad: true })
      })
    }
  }, [store])

  useEffect(() => {
    if (!store) {
      dispatch(storeRequest(id, window.localStorage.getItem('@Elist:token')))
    }
  }, [])

  return (
    <div className={classes.root}>
      <Header
        store={store}
        title='VOLTAR'
        subtitle={store?.name}
        route="/dashboard"
      />
      <form
        autoComplete='off'
        onSubmit={handleSubmit(formData => onSubmit(formData))}
        style={{ marginTop: '32px' }}
      >

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <InputLabel style={{ marginBottom: '8px' }} htmlFor='name'>Nome</InputLabel>

            <TextField
              className={classes.margin}
              // label='Nome'
              variant='outlined'
              fullWidth
              inputRef={register}
              // value={currentData?.name}
              // defaultValue={currentData?.name}
              name='name'
              onFocus={event => event.target.select()}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel style={{ marginBottom: '8px' }} htmlFor='phone'>Telefone</InputLabel>
            <TextField
              className={classes.margin}
              // label='Telefone'
              variant='outlined'
              fullWidth
              inputRef={register}
              // defaultValue={store?.phone}
              inputComponent={PhoneMask}
              name='phone'
              onFocus={event => event.target.select()}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel style={{ marginBottom: '8px' }} htmlFor='email'>Email</InputLabel>
            <TextField
              className={classes.margin}
              // label='Email'
              variant='outlined'
              fullWidth
              inputRef={register}
              // defaultValue={store?.email}
              name='email'
              onFocus={event => event.target.select()}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <InputLabel style={{ marginBottom: '8px' }} htmlFor='cep'>Cep</InputLabel>
            <TextField
              className={classes.margin}
              // label='Cep'
              variant='outlined'
              fullWidth
              inputRef={register}
              // defaultValue={store?.email}
              name='cep'
              onFocus={event => event.target.select()}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel style={{ marginBottom: '8px' }} htmlFor='city'>Cidade</InputLabel>

            <TextField
              className={classes.margin}
              // label='Cidade'
              variant='outlined'
              fullWidth
              inputRef={register}
              // defaultValue={store?.email}
              name='city'
              onFocus={event => event.target.select()}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel style={{ marginBottom: '8px' }} htmlFor='address'>Endereço</InputLabel>
            <TextField
              className={classes.margin}
              //= 'Endereço'
              variant='outlined'
              fullWidth
              inputRef={register}
              // defaultValue={store?.email}
              name='address'
              onFocus={event => event.target.select()}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel style={{ marginBottom: '8px' }} htmlFor='cnpj'>CNPJ</InputLabel>
            <TextField
              className={classes.margin}
              //= 'Endereço'
              variant='outlined'
              fullWidth
              inputRef={register}
              // defaultValue={store?.email}
              inputComponent={CnpjMask}
              name='cnpj'
              onFocus={event => event.target.select()}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '8px' }}>
          SALVAR
        </Button>
      </form>
    </div>
  )
}

export default StoreSettings
