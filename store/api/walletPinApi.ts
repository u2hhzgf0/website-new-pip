import { baseApi } from './baseApi';

export const walletPinApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get whether the current user has a wallet PIN set
    getWalletPinStatus: builder.query<any, void>({
      query: () => '/wallet/pin/status',
      providesTags: ['WalletPin'],
    }),

    // Create the wallet PIN for the first time
    setupWalletPin: builder.mutation<any, { pin: string; confirmPin: string }>({
      query: (body) => ({
        url: '/wallet/pin/setup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WalletPin'],
    }),

    // Verify the wallet PIN to unlock Wallet Overview / Withdraw
    verifyWalletPin: builder.mutation<any, { pin: string }>({
      query: (body) => ({
        url: '/wallet/pin/verify',
        method: 'POST',
        body,
      }),
    }),

    // Request a reset code by email
    forgotWalletPin: builder.mutation<any, void>({
      query: () => ({
        url: '/wallet/pin/forgot',
        method: 'POST',
      }),
    }),

    // Reset the wallet PIN using the emailed code
    resetWalletPin: builder.mutation<any, { code: string; newPin: string; confirmNewPin: string }>({
      query: (body) => ({
        url: '/wallet/pin/reset',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WalletPin'],
    }),
  }),
});

export const {
  useGetWalletPinStatusQuery,
  useSetupWalletPinMutation,
  useVerifyWalletPinMutation,
  useForgotWalletPinMutation,
  useResetWalletPinMutation,
} = walletPinApi;
