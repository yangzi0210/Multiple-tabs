import { createContext } from 'react';

interface MultiTabContextProps {
  refreshTab: (path?: string) => void;
  closeTab: (path?: string) => void;
  closeOtherTab: (path?: string) => void;
  onShow: (cb: () => void) => void;
  onHidden: (cb: () => void) => void;
}

const defaultValue = {
  refreshTab: () => {},
  closeTab: () => {},
  closeOtherTab: () => {},
  onShow: () => {},
  onHidden: () => {},
};

export const MultiTabContext = createContext<MultiTabContextProps>(defaultValue);
