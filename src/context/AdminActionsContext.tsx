import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type SaveHandler = () => Promise<void>;

interface AdminActionsContextValue {
  handlers: Record<string, SaveHandler>;
  registerHandler: (key: string, handler: SaveHandler | null) => void;
  savingAll: boolean;
  setSavingAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const noop = () => undefined;

const AdminActionsContext = createContext<AdminActionsContextValue>({
  handlers: {},
  registerHandler: noop,
  savingAll: false,
  setSavingAll: noop,
});

export const AdminActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [handlers, setHandlers] = useState<Record<string, SaveHandler>>({});
  const [savingAll, setSavingAll] = useState(false);

  const registerHandler = useCallback((key: string, handler: SaveHandler | null) => {
    setHandlers((prev) => {
      const next = { ...prev };
      if (handler) next[key] = handler;
      else delete next[key];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ handlers, registerHandler, savingAll, setSavingAll }),
    [handlers, registerHandler, savingAll]
  );

  return <AdminActionsContext.Provider value={value}>{children}</AdminActionsContext.Provider>;
};

export const useAdminActions = () => useContext(AdminActionsContext);
