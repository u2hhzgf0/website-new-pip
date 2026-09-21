import { baseApi } from './baseApi';

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get the current user's vendor request (or null if none exists)
    getMyVendorRequest: builder.query<any, void>({
      query: () => '/vendor/request/me',
      providesTags: ['Vendor'],
    }),

    // Whether vendor registration is currently open platform-wide
    getVendorRegistrationStatus: builder.query<any, void>({
      query: () => '/vendor/registration-status',
      providesTags: ['Vendor'],
    }),

    // Submit or resubmit a vendor request
    submitVendorRequest: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/vendor/request',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: ['Vendor'],
    }),
  }),
});

export const {
  useGetMyVendorRequestQuery,
  useSubmitVendorRequestMutation,
  useGetVendorRegistrationStatusQuery,
} = vendorApi;
