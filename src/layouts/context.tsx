import { createContext } from 'react';

interface MultiTabContextProps {
  refreshTab: (path?: string) => void;
  closeTab: (path?: string) => void;
  closeOtherTab: (path?: string) => void;
}

const defaultValue = {
  refreshTab: () => {},
  closeTab: () => {},
  closeOtherTab: () => {},
};

export const MultiTabContext = createContext<MultiTabContextProps>(defaultValue);
