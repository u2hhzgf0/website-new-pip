import { baseApi } from './baseApi';

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveAnnouncement: builder.query<any, void>({
      query: () => '/announcements/active',
      providesTags: ['Announcements'],
    }),
  }),
});

export const { useGetActiveAnnouncementQuery } = announcementApi;
