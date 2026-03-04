'use client'
import { Provider } from 'react-redux'
import store from '../src/store'
import { AdminProvider } from '../src/contexts/AdminContext'
import DataProvider from '../src/providers/DataProvider'
import { ThemeProvider } from '../src/context/ThemeContext'
import { AuthProvider } from '../src/hooks/useAuth.jsx'
import { CTAModalProvider } from '../src/contexts/CTAModalContext'
import { Toaster } from 'react-hot-toast'
import { toastConfig } from '../src/config/toast'

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <DataProvider>
        <AdminProvider>
          <ThemeProvider>
            <AuthProvider>
              <CTAModalProvider>
                {children}
                <Toaster {...toastConfig} />
              </CTAModalProvider>
            </AuthProvider>
          </ThemeProvider>
        </AdminProvider>
      </DataProvider>
    </Provider>
  )
}
