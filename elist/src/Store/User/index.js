import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Login from './Login'
import Logout from './Logout'
import ClearError from '~/Store/ClearError'

const sliceInitialState = {
  loggedUser: null,
  modal: false
}

export default buildSlice('user', [Modal, Login, Logout, EditUser, Load, Fetch, UploadPhotos, Connect, View, ClearError('user')], sliceInitialState).reducer
