import React, { createContext } from "react";
import { useSocket } from "../hooks/useSocket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { socket, online } = useSocket("http://localhost:6005");

  const store = {
    socket,
    online,
  };

  return (
    <SocketContext.Provider value={store}>{children}</SocketContext.Provider>
  );
};
