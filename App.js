import AuthProvider from './server/context/authContext';
import AppNav from './src/navigation/AppNav';

export default App = () => {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}