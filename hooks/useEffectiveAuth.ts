import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation } from "@/contexts/ImpersonationContext";

export function useEffectiveAuth() {
    const auth = useAuth();
    const { impersonatedUser, isImpersonating } = useImpersonation();

    if (isImpersonating && impersonatedUser) {
        return {
            ...auth,
            role: impersonatedUser.role as typeof auth.role,
            userId: impersonatedUser.id,
        };
    }

    return {
        ...auth,
        userId: auth.session?.user?.id ?? null,
    };
}
