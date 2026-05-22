import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: UserState | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('user');
const savedAccessToken = localStorage.getItem('accessToken');
const savedRefreshToken = localStorage.getItem('refreshToken');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: savedAccessToken || null,
  refreshToken: savedRefreshToken || null,
  isAuthenticated: !!savedAccessToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state, 
      action: PayloadAction<{ accessToken: string; refreshToken: string; userId: number; email: string; role: string }>
    ) => {
      const { accessToken, refreshToken, userId, email, role } = action.payload;
      
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.user = { id: userId, email, role };

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;