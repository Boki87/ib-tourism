import { useState, useContext, createContext, ReactNode } from "react";
import { Owner } from "../types/Owner";

const initialUserState: {
  user: Owner | null;
  setUser: (val: Owner | null) => void;
} = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext(initialUserState);

export const useUserContext = () => useContext(UserContext);

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<Owner | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
