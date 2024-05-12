import { useEffect, useState } from 'react';
import { useMatchRoute } from './useMatchRoute';

export interface MultiTab {
  title: string;
  routePath: string;
  key: string;
  pathname: string;
  children: any;
  icon?: any;
}

const generateKey = () => {
  return new Date().getTime().toString();
};

export const useMultiTabs = () => {
  const [activeTabs, setActiveTabs] = useState<MultiTab[]>([]);
  const [activeTabRoutePath, setActiveTabRoutePath] = useState<string>('');

  const matchRoute = useMatchRoute();

  useEffect(() => {
    if (!matchRoute) return;
    const existActiveTabs = activeTabs.find((item) => item.routePath === matchRoute.routePath);

    if (!existActiveTabs) {
      setActiveTabs((prev) => [
        ...prev,
        {
          title: matchRoute.title,
          key: generateKey(),
          routePath: matchRoute.routePath,
          pathname: matchRoute.pathname,
          children: matchRoute.children,
          icon: matchRoute.icon,
        },
      ]);
    }
    setActiveTabRoutePath(matchRoute.routePath);
  }, [matchRoute]);
  return { activeTabs, activeTabRoutePath };
};

export default useMultiTabs;
