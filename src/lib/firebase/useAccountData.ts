import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { observeAuthState } from "./auth";
import { isProfileReady, readAccountData, type AccountData } from "./profile";

type UseAccountDataOptions = {
  includeActivity?: boolean;
  includeCounts?: boolean;
  requireCompleteProfile?: boolean;
};

type AccountDataState = {
  loading: boolean;
  data: AccountData | null;
  error: string | null;
};

export function useAccountData(options: UseAccountDataOptions = {}) {
  const navigate = useNavigate();
  const [state, setState] = useState<AccountDataState>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    return observeAuthState(async (user) => {
      if (!user) {
        if (active) {
          setState({ loading: false, data: null, error: null });
        }
        navigate({ to: "/login" });
        return;
      }

      try {
        const data = await readAccountData(user, {
          includeActivity: options.includeActivity,
          includeCounts: options.includeCounts,
        });

        if (options.requireCompleteProfile && !isProfileReady(data.profile)) {
          if (active) {
            setState({ loading: false, data, error: null });
          }
          navigate({ to: "/complete-profile" });
          return;
        }

        if (active) {
          setState({ loading: false, data, error: null });
        }
      } catch {
        if (active) {
          setState({
            loading: false,
            data: null,
            error: "Не удалось загрузить данные профиля.",
          });
        }
      }
    });
  }, [
    navigate,
    options.includeActivity,
    options.includeCounts,
    options.requireCompleteProfile,
  ]);

  return state;
}
