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
  tagTypes: ['Carrier'],
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
        // url: 'carrier',
        url: 'https://portal.prepaidiq.com/api/carriers',
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
    getPlans: builder.mutation({
      query: ({ ID, token }) => {
        return {
          // url: 'verzion',
          url: `https://portal.prepaidiq.com/api/plans/refill/${ID}`,
          method: 'POST',
          // body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
    }),
    //NMI Payment Method
    // getCardPayments: builder.mutation({
    //   query: payload => {
    //     let formDataObj = new FormData()
    //     formDataObj.append('security_key', payload.security_key)
    //     formDataObj.append('type', payload.type)
    //     formDataObj.append('first_name', payload.first_name)
    //     formDataObj.append('amount', payload.amount)
    //     formDataObj.append('ccnumber', payload.ccnumber)
    //     formDataObj.append('ccexp', payload.ccexp)
    //     formDataObj.append('cvv', payload.cvv)
    //     formDataObj.append('address1', payload.address1)
    //     formDataObj.append('city', payload.city)
    //     formDataObj.append('phone', payload.phone)
    //     formDataObj.append('plan_id', payload.plan_id)
    //     formDataObj.append('state', payload.state)
    //     formDataObj.append('zip', payload.zip)
    //     return {
    //       // url: 'https://apitest.authorize.net/xml/v1/request.api',
    //       url: 'https://secure.nmi.com/api/transact.php',
    //       method: 'POST',
    //       body: formDataObj,
    //       headers: {
    //         'content-type': 'multipart/form-data',
    //       },
    //       // responseHandler: 'text',
    //       responseHandler: response => response.text(),
    //     }
    //   },
    // }),
    getRecharge: builder.mutation({
      query: payload => {
        return {
          url: 'recharge',
          method: 'POST',
          body: payload,
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        }
      },
    }),
    getPrice: builder.mutation({
      query: ({ body, token }) => {
        return {
          url: 'get_pricing',
          method: 'POST',
          body: body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
    }),
    placeEsimOrder: builder.mutation({
      query: body => {
        return {
          url: 'place_order',
          method: 'POST',
          body: body,
          headers: {
            Authorization: `Bearer ${body.token}`,
          },
        }
      },
    }),
    getHistory: builder.mutation({
      query: ({ body, token }) => {
        return {
          url: 'order_history',
          method: 'POST',
          body: body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
    }),
    checkIMEINumber: builder.mutation({
      query: ({ body, token }) => {
        return {
          url: 'imei_check',
          method: 'POST',
          body: body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  useGetPlansMutation,
  // useGetCardPaymentsMutation,
  useGetRechargeMutation,
  useGetPriceMutation,
  useGetHistoryMutation,
  usePlaceEsimOrderMutation,
  useCheckIMEINumberMutation,
} = api
