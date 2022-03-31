import { Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import { theme } from './Theme';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes';
import { AppProvider } from './context/context';

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        {/* TODO to add a backdrop */}
        <Suspense fallback={<></>}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Suspense>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
