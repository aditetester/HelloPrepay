import { Config } from '@/Config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({ baseUrl: Config.API_URL })

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  // console.log('RESULTS RESULTS', result.data)
  if (result.error && result.error.status === 401) {
    // here you can deal with 401 error
  }
  return result
}

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: builder => ({
    getVerifyUser: builder.mutation({
      query: payload => ({
        url: 'verify',
        method: 'POST',
        body: payload,
      }),
    }),
    getLoginUser: builder.mutation({
      query: payload => ({
        url: 'login',
        method: 'POST',
        body: payload,
      }),
    }),
    getRegisterUser: builder.mutation({
      query: payload => ({
        url: 'register',
        method: 'POST',
        body: payload,
      }),
    }),
    getCarrierList: builder.query({
      query: payload => ({
        url: 'carrier',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${payload}`,
        },
      }),
    }),
    getProfileUpdate: builder.mutation({
      query: ({ body, token }) => {
        return {
          url: 'profile_update',
          method: 'POST',
          body: body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
    }),
    sendEmailCode: builder.mutation({
      query: phoneNumber => {
        return {
          url: 'sendMail',
          method: 'POST',
          body: phoneNumber,
        }
      },
    }),
  }),
})

export const {
  useGetVerifyUserMutation,
  useGetLoginUserMutation,
  useGetRegisterUserMutation,
  useGetCarrierListQuery,
  useGetProfileUpdateMutation,
  useSendEmailCodeMutation,
} = api
