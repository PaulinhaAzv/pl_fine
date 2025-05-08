import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, User } from '../types';
import { MESSAGES } from '../constants';
import { getLocalStorage, setLocalStorage } from '../utils';

// Estado inicial
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

// Contexto
export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Efeito para carregar estado inicial
  React.useEffect(() => {
    const userEmail = getLocalStorage<string>('userEmail');

    if (userEmail) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    }
  }, []);

  // Funções de utilidade
  const login = async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Aqui você implementaria a lógica de login
      const user: User = {
        id: '1',
        email,
        plano: 'vip',
        status: 'ativo',
      };

      setLocalStorage('userEmail', email);
      dispatch({ type: 'SET_USER', payload: user });
      return true;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: MESSAGES.ERRORS.AUTHENTICATION,
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    setLocalStorage('userEmail', null);
    dispatch({ type: 'LOGOUT' });
  };

  // Funções de autenticação administrativa
  const adminLogin = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulando autenticação administrativa
      if (email === 'admin@exemplo.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          email,
          plano: 'admin',
          status: 'ativo',
          is_admin: true,
        };

        setLocalStorage('userEmail', email);
        dispatch({ type: 'SET_USER', payload: adminUser });
        return true;
      }

      throw new Error('Credenciais inválidas');
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: MESSAGES.ERRORS.AUTHENTICATION,
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const adminLogout = () => {
    setLocalStorage('userEmail', null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}
