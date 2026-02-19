import { baseApi } from './baseApi';

interface Referral {
  id: string;
  referrer: {
    id: string;
    fullName: string;
    email: string;
    referralCode?: string;
  };
  referred: {
    id: string;
    fullName: string;
    email: string;
  };
  referralCode: string;
  level: number;
  commissionRate: number;
  totalEarnings: number;
  status: 'pending' | 'active' | 'inactive';
  firstDepositAmount: number;
  firstDepositDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LevelBreakdown {
  commissionRate: number;
  count: number;
  active: number;
  earnings: number;
}

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  monthlyCommission: number;
  weeklyCommission: number;
  referrals: Array<{
    id: string;
    user: string;
    level: number;
    date: string;
    status: 'active' | 'inactive' | 'pending';
    earnings: number;
  }>;
  levelBreakdown: {
    level1: LevelBreakdown;
    level2: LevelBreakdown;
    level3: LevelBreakdown;
    level4: LevelBreakdown;
    level5: LevelBreakdown;
    level6: LevelBreakdown;
    level7: LevelBreakdown;
  };
}

interface ValidateReferralCodeResponse {
  valid: boolean;
  referrerName: string;
}

interface TeamMember {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  level: number;
  image?: string;
  totalInvested: number;
  totalEarned: number;
  earnings: number;
  commissionEarned: number;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  children?: TeamMember[];
}

interface CommissionLevelBreakdown {
  level: number;
  commissionRate: number;
  totalMembers: number;
  activeMembers: number;
  totalEarnings: number;
}

interface CommissionRate {
  level: number;
  commissionRate: number;
  description: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: {
    attributes: T;
  };
}

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get My Referrals
    getMyReferrals: builder.query<ApiResponse<Referral[]>, void>({
      query: () => '/referrals/my',
      providesTags: ['Referrals'],
    }),

    // Get Referral Stats
    getReferralStats: builder.query<ApiResponse<ReferralStats>, void>({
      query: () => '/referrals/stats',
      providesTags: ['Referrals'],
    }),

    // Validate Referral Code
    validateReferralCode: builder.query<ApiResponse<ValidateReferralCodeResponse>, string>({
      query: (code) => `/referrals/validate/${code}`,
    }),

    // Get Team Network
    getTeamNetwork: builder.query<ApiResponse<TeamMember[]>, void>({
      query: () => '/referrals/team-network',
      providesTags: ['Referrals'],
    }),

    // Get Commission Breakdown
    getCommissionBreakdown: builder.query<ApiResponse<CommissionLevelBreakdown[]>, void>({
      query: () => '/referrals/commission-breakdown',
      providesTags: ['Referrals'],
    }),

    // Get Commission Rates
    getCommissionRates: builder.query<ApiResponse<CommissionRate[]>, void>({
      query: () => '/referrals/commission-rates',
      providesTags: ['Referrals'],
    }),
  }),
});

export const {
  useGetMyReferralsQuery,
  useGetReferralStatsQuery,
  useValidateReferralCodeQuery,
  useLazyValidateReferralCodeQuery,
  useGetTeamNetworkQuery,
  useGetCommissionBreakdownQuery,
  useGetCommissionRatesQuery,
} = referralApi;
