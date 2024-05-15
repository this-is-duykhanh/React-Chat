import './App.css';
import "./style.scss";
import Login from './components/Login';
import ChatRoom from './components/ChatRom';
import {Route, Routes, BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider';
import AppProvider from './context/AppProvider';
import AddRoom from './components/Modals/AddRoom';
import InviteMember from './components/Modals/InviteMember';



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route Component={Login} path='/login'/>
            <Route Component={ChatRoom} path='/'/>
          </Routes>
            <AddRoom />
            <InviteMember />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
