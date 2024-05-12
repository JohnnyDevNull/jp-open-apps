import { CssBaseline } from '@mui/material';
import AppContent from './components/AppContent/AppContent';
import AppFooter from './components/AppFooter/AppFooter';
import AppHeader from './components/AppHeader/AppHeader';

export function App() {
  return (
    <>
      <CssBaseline />
      <main className="jpoa-app">
        <AppHeader appName="TimeTracking" />
        <AppContent />
        <AppFooter />
      </main>
    </>
  );
}

export default App;
