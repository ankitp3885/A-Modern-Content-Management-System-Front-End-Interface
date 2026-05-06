import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthProvider from './context/AuthContext';
import ContentProvider from './context/ContentContext';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import AddContent from './components/AddContent';
import EditContent from './components/EditContent';
import ViewContent from './components/ViewContent';
import PrivateRoute from './components/PrivateRoute';
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#f8f9fa', height: '100vh' }}>
          <h2>Something went wrong!</h2>
          <p>Please refresh the page or contact support.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ContentProvider>
          <div className='app-container'>
            <Sidebar />
            <main className='main-content'>
              <Routes>
                <Route path='/login' element={<Login />}/>
                <Route path='/signup' element={<Signup />}/>
                <Route path='/forgot-password' element={<ForgotPassword />}/>
                <Route path='/add' element={
                  <PrivateRoute>
                    <AddContent />
                  </PrivateRoute>
                }/>
                <Route path='/edit/:id' element={
                  <PrivateRoute>
                    <EditContent />
                  </PrivateRoute>
                }/>
                <Route path='/view' element={
                  <PrivateRoute>
                    <ViewContent />
                  </PrivateRoute>
                }/>
                <Route path='/' element={<Navigate to="/login" replace/>}/>
              </Routes>
            </main>
          </div>
        </ContentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
