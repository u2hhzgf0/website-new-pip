import { baseApi } from './baseApi';

export interface SavedAccount {
  id: string;
  user: string;
  accountType: 'crypto' | 'bank' | 'other';
  label: string;
  walletAddress?: string;
  network?: string;
  currency?: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateSavedAccountRequest {
  accountType: 'crypto' | 'bank' | 'other';
  label: string;
  walletAddress?: string;
  network?: string;
  currency?: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
  };
  isDefault?: boolean;
}

interface UpdateSavedAccountRequest {
  accountId: string;
  data: {
    label?: string;
    walletAddress?: string;
    network?: string;
    currency?: string;
    bankDetails?: {
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
      routingNumber?: string;
      swiftCode?: string;
      iban?: string;
    };
    isDefault?: boolean;
  };
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: {
    attributes: T;
  };
}

export const savedAccountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSavedAccounts: builder.query<
      ApiResponse<{ results: SavedAccount[]; totalPages?: number; page?: number; totalResults?: number }>,
      { accountType?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/saved-accounts',
        params: params || {},
      }),
      providesTags: ['SavedAccounts'],
    }),

    getSavedAccountById: builder.query<ApiResponse<SavedAccount>, string>({
      query: (accountId) => `/saved-accounts/${accountId}`,
      providesTags: (result, error, id) => [{ type: 'SavedAccounts', id }],
    }),

    createSavedAccount: builder.mutation<ApiResponse<SavedAccount>, CreateSavedAccountRequest>({
      query: (body) => ({
        url: '/saved-accounts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SavedAccounts'],
    }),

    updateSavedAccount: builder.mutation<ApiResponse<SavedAccount>, UpdateSavedAccountRequest>({
      query: ({ accountId, data }) => ({
        url: `/saved-accounts/${accountId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['SavedAccounts'],
    }),

    deleteSavedAccount: builder.mutation<ApiResponse<null>, string>({
      query: (accountId) => ({
        url: `/saved-accounts/${accountId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedAccounts'],
    }),

    setDefaultAccount: builder.mutation<ApiResponse<SavedAccount>, string>({
      query: (accountId) => ({
        url: `/saved-accounts/${accountId}/set-default`,
        method: 'POST',
      }),
      invalidatesTags: ['SavedAccounts'],
    }),
  }),
});

export const {
  useGetSavedAccountsQuery,
  useGetSavedAccountByIdQuery,
  useCreateSavedAccountMutation,
  useUpdateSavedAccountMutation,
  useDeleteSavedAccountMutation,
  useSetDefaultAccountMutation,
} = savedAccountApi;
