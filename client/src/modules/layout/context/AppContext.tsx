import React from 'react';

type AppContextType = {
  isLightMode: boolean;
  handleSwitchLightMode: (isLightMode: boolean) => void;
  isWalletModalVisible: boolean;
  setIsWalletModalVisible: (isVisible: boolean) => void;
  authToken: string;
  setAuthToken: (token: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
};

const AppContext = React.createContext<AppContextType>({
  isLightMode: false,
  handleSwitchLightMode: () => {},
  isWalletModalVisible: false,
  setIsWalletModalVisible: () => {},
  authToken: '',
  setAuthToken: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

export default AppContext;
