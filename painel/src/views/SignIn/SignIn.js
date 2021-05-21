import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import jwt_decode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

import {
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { userRequest } from '../../store/modules/user/actions'

// import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import api from '../../repositories'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    background: `linear-gradient(to bottom right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}))

export default function SignIn({ history }) {
  // const { history, userRequest, user, loading } = props;

  const classes = useStyles()
  const confirm = useConfirm()
  const { register, handleSubmit, errors } = useForm()

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const [loading, setLoading] = useState(false)
  const [responseError, setResponseError] = useState()

  useEffect(() => {
    if (user.stores.length > 0) {
      setLoading(false)
      const userStores = user.stores.filter(s => ['owner', 'manager', 'cashier'].includes(s.type))
      if (userStores.length >= 0) {
        if (userStores.length > 1) {
          history.push('/stores')
        } else {
          history.push(`${user.stores[0].storeId._id}/events`)
        }
      } else {
        confirm({
          title: 'Ops!',
          description: 'Você não tem permissão para acessar o sistema.',
          confirmationText: 'Ok!',
          cancellationText: ''
        }).then(() => { }).catch(() => { })
      }
    }
  }, [user])

  const handleSignIn = data => {
    setLoading(true)
    api.login(data.email, data.password)
      .then(login => {
        const user = jwt_decode(login)
        if (user.stores.length > 0) {
          window.localStorage.setItem('@Elist:token', login)
          dispatch(userRequest(user.id, login))
          setResponseError()
        } else {
          setLoading(false)
          throw new Error('Você não está vinculado à uma loja.')
        }
      })
      .catch(err => {
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 401:
              setResponseError(err.response.data.error.friendlyMsg)
              break
            case 500:
              setResponseError(err.response.data.error.friendlyMsg)
              break
            default:
              confirm({
                title: 'Ops!',
                description: 'Deu algum problema...',
                confirmationText: 'Ok!',
                cancellationText: 'Fechar'
              }).then(() => { }).catch(() => { })
              break
          }
        } else {
          confirm({
            title: 'Ops!',
            description: !err.isAxiosError ? err.message : 'Ops, pelo jeito o servidor está desligado.',
            confirmationText: 'Ok!',
            cancellationText: 'Fechar'
          }).then(() => { }).catch(() => { })
        }

        setLoading(false)
      })
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={7}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <img src='/images/logo.svg' alt='Logo' height='80px' />
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={5} sm={12} xl={5} xs={12}>
          <div className={classes.content}>
            {/* <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div> */}
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={handleSubmit(handleSignIn)}>
                <Grid container spacing={1} direction='column'>
                  <Grid item lg={12} sm={12} xl={12} xs={12}>
                    <Typography className={classes.title} variant='h2'>
                      Entrar
                    </Typography>
                  </Grid>
                  <Grid item lg={12} sm={12} xl={12} xs={12}>
                    <TextField
                      className={classes.textField}
                      error={!!errors.email || !!responseError}
                      fullWidth
                      helperText={
                        (!!errors.email && 'Login é obrigatório')
                      }
                      label='Email/CPF'
                      name='email'
                      inputRef={register({ required: true })}
                      variant='outlined'
                      inputProps={{
                        'data-cy': 'email'
                      }}
                    />
                  </Grid>
                  <Grid item lg={12} sm={12} xl={12} xs={12}>
                    <TextField
                      className={classes.textField}
                      error={!!errors.password || !!responseError}
                      fullWidth
                      helperText={
                        !(!errors.password && 'Senha é obrigatória') || (!!responseError && responseError)
                      }
                      label='Senha'
                      name='password'
                      type='password'
                      inputRef={register({ required: true })}
                      variant='outlined'
                      inputProps={{
                        'data-cy': 'password'
                      }}
                    />
                  </Grid>
                  <Grid item lg={12} sm={12} xl={12} xs={12}>
                    <Button
                      className={classes.signInButton}
                      color='primary'
                      disabled={loading}
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'
                      name="btn-login"
                      data-cy="btn-login"
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      ) : (
                          'Entrar'
                        )}
                    </Button>
                  </Grid>
                  {/* <Grid item lg={12} sm={12} xl={12} xs={12}>
                    <Link component={RouterLink} to="/sign-up" variant="h6">
                      Esqueci minha senha
                    </Link>
                  </Grid> */}
                </Grid>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

SignIn.propTypes = {
  history: PropTypes.any
}
