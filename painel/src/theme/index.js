import { createMuiTheme } from '@material-ui/core'
import {
  ptBR
} from '@material-ui/core/locale'

import palette from './palette'
import typography from './typography'
import overrides from './overrides'

const theme = createMuiTheme({
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
}, ptBR)

export default theme
