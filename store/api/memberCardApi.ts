import { baseApi } from './baseApi';

export const memberCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get the current user's member card (or hasCard: false if none)
    getMyCard: builder.query<any, void>({
      query: () => '/member-card/me',
      providesTags: ['MemberCard'],
    }),

    // Issue a new member card for the current user
    issueMyCard: builder.mutation<any, void>({
      query: () => ({
        url: '/member-card/issue',
        method: 'POST',
      }),
      invalidatesTags: ['MemberCard'],
    }),
  }),
});

export const {
  useGetMyCardQuery,
  useIssueMyCardMutation,
} = memberCardApi;
