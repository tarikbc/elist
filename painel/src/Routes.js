import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

import { RouteWithLayout } from './components'
import { Main as MainLayout, Minimal as MinimalLayout, Owner as OwnerLayout } from './layouts'

import {
  UserList as UserListView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Stores as StoresView,
  Sellers as SellersView,
  Services as ServicesView,
  ServiceDay as ServiceDayView
} from './views'

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from='/' to='/login' />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path='/:storeId/users'
      />
      <RouteWithLayout
        component={StoresView}
        exact
        layout={OwnerLayout}
        path='/stores'
      />
      <RouteWithLayout
        component={SellersView}
        exact
        layout={OwnerLayout}
        path='/:storeId/sellers'
      />
      <RouteWithLayout
        component={ServicesView}
        exact
        layout={MainLayout}
        path='/:storeId/events'
      />
      <RouteWithLayout
        component={ServiceDayView}
        exact
        layout={MainLayout}
        path='/:storeId/events/:dayId'
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path='/login'
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path='/not-found'
      />
      <Redirect to='/not-found' />
    </Switch>
  )
}

export default Routes
