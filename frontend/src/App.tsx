// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/ui/AuthContext';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import FirstPage from '@/components/ui/FirstPage';  // 确保路径正确
import LoginPage from '@/components/ui/LoginPage';
import InforPage from '@/components/ui/InforPage';
import GamePage from '@/components/ui/GamePage';
import ProdPage from '@/components/ui/ProdPage';
import StatsPage from '@/components/ui/StatsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<FirstPage/>}/>
          <Route path='/LoginPage' element={<ProtectedRoute element={<LoginPage/>} condition={ctx => ctx!.visitedFirstPage}/>}/>
          <Route path='/InforPage' element={<ProtectedRoute element={<InforPage/>} condition={ctx => ctx!.visitedFirstPage}/>}/>
          <Route path='/StatsPage' element={<ProtectedRoute element={<StatsPage/>} condition={ctx => ctx!.visitedLoginPage}/>}/>
          <Route path='/GamePage' element={<ProtectedRoute element={<GamePage/>} condition={ctx => ctx!.visitedInforPage}/>}/>
          <Route path='/ProdPage' element={<ProtectedRoute element={<ProdPage/>} condition={ctx => ctx!.visitedGamePage}/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
