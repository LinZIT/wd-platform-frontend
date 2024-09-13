import { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { Theme, ThemeProvider } from '@emotion/react';
import { useUserStore } from './store/user/UserStore';
import { themeDark, themeLight } from './common/theme';
import { Profile } from './pages/profile/Profile';
import { Tickets } from './pages/tickets/Tickets';
import { TicketView } from './pages/tickets/TicketView';
const useGetTheme = () => {
  const user = useUserStore((state) => state.user);
  const [theme, setTheme] = useState<Theme>(themeLight)
  useEffect(() => {
    if (user?.theme === 'dark') {
      setTheme(themeDark);
    } else {
      setTheme(themeLight);
    }
  }, [user?.theme])
  return theme
}
function App() {
  const theme = useGetTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/tickets' element={<Tickets />} />
          <Route path='/ticket/:id' element={<TicketView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App;