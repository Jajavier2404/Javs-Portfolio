import { createContext, useContext } from "react";

const AdminViewContext = createContext(false);

export const AdminViewProvider = ({ children }: { children: React.ReactNode }) => (
  <AdminViewContext.Provider value={true}>{children}</AdminViewContext.Provider>
);

export const useAdminView = () => useContext(AdminViewContext);
