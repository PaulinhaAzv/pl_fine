import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

export const useApp = () => {
  const { dispatch } = useContext(AppContext);

  const adminLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return { adminLogout };
};
