import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'user',
  initialState: { userData: null, isAuth: false, perpos: null },
  reducers: {
    setUser: (state, { payload: { userData, isAuth, perpos } }) => {
      // state.userData = userData
      // state.isAuth = isAuth
      if (typeof userData !== 'undefined') {
        state.userData = userData
      }
      if (typeof isAuth !== 'undefined') {
        state.isAuth = isAuth
      }
      if (typeof perpos !== 'undefined') {
        state.perpos = perpos
      }
    },
  },
})

export const { setUser } = slice.actions

export default slice.reducer
