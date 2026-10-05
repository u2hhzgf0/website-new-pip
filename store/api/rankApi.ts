import { baseApi } from './baseApi';

export interface RankDefinition {
  level: number;
  name: string;
  badgeImage: string;
  frameImage: string;
  target: number;
  monthlySalary: number;
  directReferrals: number;
  personalInvestment: number;
  bonus: string | null;
  commissionRange: { min: number; max: number } | null;
}

export interface RankProgress {
  businessVolume: { current: number; required: number; percentage: number };
  directReferrals: { current: number; required: number; percentage: number };
  personalInvestment: { current: number; required: number; percentage: number };
  leadershipChain?: {
    current: number;
    required: number;
    requiredRankLevel: number;
    requiredRankName: string;
    percentage: number;
  };
}

export interface UserRankInfo {
  userId: string;
  currentRank: number;
  currentRankInfo: RankDefinition;
  nextRankInfo: RankDefinition | null;
  progress: RankProgress | null;
  metrics: {
    businessVolume: number;
    personalInvestment: number;
    directReferrals: number;
  };
  totalSalaryEarned: number;
  rankHistory: Array<{
    fromRank: number;
    toRank: number;
    upgradeDate: string;
    businessVolumeAtUpgrade: number;
  }>;
  salaryHistory: Array<{
    rank: number;
    amount: number;
    month: string;
    paidAt: string;
  }>;
  bonusHistory: Array<{
    rank: number;
    bonusName: string;
    claimedAt: string;
    status: 'pending' | 'processing' | 'delivered';
  }>;
  lastCheckedAt: string | null;
}

export interface ReferralRankBalance {
  level: number;
  name: string;
  badgeImage: string;
  referralCount: number;
  totalBalance: number;
}

export interface ReferralBalancesByRank {
  ranks: ReferralRankBalance[];
  totalReferrals: number;
  totalBalance: number;
}

export const rankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyRank: builder.query<{ data: { attributes: UserRankInfo } }, void>({
      query: () => '/ranks/my',
      providesTags: ['Ranks'],
    }),

    // Total wallet balance of my direct referrals, grouped by their rank (first 3 ranks)
    getMyReferralBalancesByRank: builder.query<{ data: { attributes: ReferralBalancesByRank } }, void>({
      query: () => '/ranks/my/referral-balances',
      providesTags: ['Ranks', 'Referrals'],
    }),

    checkAndUpgradeRank: builder.mutation<{ data: { attributes: { upgraded: boolean; oldRank: number; newRank: number } } }, void>({
      query: () => ({
        url: '/ranks/check-upgrade',
        method: 'POST',
      }),
      invalidatesTags: ['Ranks'],
    }),

    getRankDefinitions: builder.query<{ data: { attributes: RankDefinition[] } }, void>({
      query: () => '/ranks/definitions',
    }),

    checkEligibility: builder.query<{
      data: { attributes: { qualifies: boolean; reasons: string[]; metrics: object } }
    }, number>({
      query: (rankLevel) => `/ranks/eligibility/${rankLevel}`,
    }),
  }),
});

export const {
  useGetMyRankQuery,
  useGetMyReferralBalancesByRankQuery,
  useCheckAndUpgradeRankMutation,
  useGetRankDefinitionsQuery,
  useCheckEligibilityQuery,
} = rankApi;
