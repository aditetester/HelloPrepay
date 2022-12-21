import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    isAuth: false,
    perpos: null,
    startupScreen: 'Tutorial',
  },
  reducers: {
    setUser: (
      state,
      { payload: { userData, isAuth, perpos, startupScreen } },
    ) => {
      // state.userData = userData
      // state.isAuth = isAuth
      if (typeof userData !== 'undefined') {
        state.userData = null
        state.userData = userData
      }
      if (typeof isAuth !== 'undefined') {
        state.isAuth = isAuth
      }
      if (typeof perpos !== 'undefined') {
        state.perpos = perpos
      }
      if (typeof startupScreen !== 'undefined') {
        state.startupScreen = startupScreen
      }
      console.log('Redux', state.userData)
    },
  },
})

export const { setUser } = slice.actions

export default slice.reducer
