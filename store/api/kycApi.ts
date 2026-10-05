import { baseApi } from './baseApi';

export type KycStatus = 'pending' | 'submitted' | 'verified' | 'rejected';
export type KycDocumentType = 'nid' | 'passport' | 'driving_license';

export interface MyKyc {
  status: KycStatus;
  documentType: KycDocumentType | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  documents: { idFront: boolean; idBack: boolean; selfie: boolean };
}

export const kycApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get the current user's KYC status
    getMyKyc: builder.query<any, void>({
      query: () => '/kyc/me',
      providesTags: ['Kyc'],
    }),

    // Submit KYC documents: documentType + idFront, idBack and selfie images
    submitKyc: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/kyc/submit',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Kyc', 'User'],
    }),
  }),
});

export const { useGetMyKycQuery, useSubmitKycMutation } = kycApi;
