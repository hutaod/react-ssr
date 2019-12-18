import Index from './pages/Index'
import About from './pages/About'
import User from './pages/User'
import NotFound from './pages/NotFound'

export default [
  {
    path: '/',
    component: Index,
    exact: true,
    key: 'index',
  },
  {
    path: '/about',
    component: About,
    exact: true,
    key: '/about',
  },
  {
    path: '/user',
    component: User,
    exact: true,
    key: '/user',
  },
  {
    component: NotFound,
    key: 'NotFound',
  },
]
