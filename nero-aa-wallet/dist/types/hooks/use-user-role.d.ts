export type UserRole = "farmer" | "consumer" | "manufacturer" | undefined;
export declare function useUserRole(): {
    userRole: UserRole;
    isLoading: boolean;
};
