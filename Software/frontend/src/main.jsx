import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Chef from '@pages/Chef';
import Garzon from '@pages/Garzon';
import '@styles/styles.css';
import Inventario from '@pages/Inventario';
import Menu from '@pages/Menu';
import IRegister from './pages/iRegister';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/Menu',
        element: <Menu/>
      },
      {
        path: '/Chef',
        element: (
        <ProtectedRoute allowedRoles={['chef']}>
        <Chef />
      </ProtectedRoute>)
      }
      ,
      {
        path: '/Garzon',
        element: (
        <ProtectedRoute allowedRoles={['garzon']}>
        <Garzon />
      </ProtectedRoute>)
      }
      ,
      {
        path: '/users',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Users />
        </ProtectedRoute>
        )
        ,
        }
        ,
        {
          path: '/inventario',
          element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <Inventario />
            </ProtectedRoute>
            ),
        }
        ,
        {
          path: '/iRegister',
          element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <IRegister />
            </ProtectedRoute>
            ),
        }
        ,
    {
      path: '/register',
      element: <Register/>
    }
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)