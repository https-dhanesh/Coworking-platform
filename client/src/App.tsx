import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import { Toaster } from "react-hot-toast"
import { createBrowserRouter , RouterProvider , Outlet } from "react-router-dom"
import SpaceDetailPage from "./pages/SpaceDetailPage"
import CreateSpacePage from "./pages/CreateSpacePage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import MySpacesPage from "./pages/MySpacesPage"
import EditSpacePage from "./pages/EditSpacePage"
import NotFoundPage from './pages/NotFoundPage';

const AppLayout=()=>{
  return(
   <div className="flex flex-col min-h-screen">
    <Toaster position="top-center" />
    <Header/>
    <main className="flex-grow">
      <Outlet/>
    </main>
    <Footer/>
   </div>
  );
};  

const router = createBrowserRouter([
  {
    path:'/',
    element:<AppLayout/>,
    children:[
      {path:'/',element:<HomePage/>},
      {path:'/login',element:<LoginPage/>},
      {path:'/register',element:<RegisterPage/>},
      {path: '/spaces/:id', element: <SpaceDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
      {
        element:<ProtectedRoute/>,
        children: [
          {path:'/create-space',element:<CreateSpacePage/>},
          {path:'/my-spaces',element:<MySpacesPage/>},
          { path: '/spaces/:id/edit', element: <EditSpacePage /> },
        ]
      }
    ],
  },
]);

function App(){
  return <RouterProvider router={router}/>;
}

export default App