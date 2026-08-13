import React, { createContext, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/errorHandlers';
import { storage } from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => storage.getUser());
  const [isLoading, setIsLoading] = useState(true);

  const setUser = (user) => {
    setUserState(user);
    if (user) {
      storage.setUser(user);
    } else {
      storage.removeUser();
    }
  };

  const handleAuthSuccess = (response) => {
    storage.setAccessToken(response.accessToken);
    storage.setRefreshToken(response.refreshToken);
    setUser(response.user);
  };

  const refreshProfile = useCallback(async () => {
    const token = storage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const profile = await userService.getCurrentUserProfile();
      setUser(profile);
    } catch {
      storage.clearAll();
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      handleAuthSuccess(response);
      toast.success(`Welcome back, ${response.user.firstName}!`);
    } catch (error) {
      const msg = getErrorMessage(error, 'Login failed');
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      handleAuthSuccess(response);
      toast.success('Registration successful! Welcome to TicketDesk.');
    } catch (error) {
      const msg = getErrorMessage(error, 'Registration failed');
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = storage.getRefreshToken();
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Silent fail on logout request
      }
    }
    storage.clearAll();
    setUserState(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!storage.getAccessToken(),
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
