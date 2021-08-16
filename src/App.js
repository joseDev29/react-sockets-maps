import { SocketProvider } from "./context/SocketContext";
import { MapPage } from "./pages/MapPage";

export const App = () => {
  return (
    <SocketProvider>
      <MapPage />
    </SocketProvider>
  );
};
