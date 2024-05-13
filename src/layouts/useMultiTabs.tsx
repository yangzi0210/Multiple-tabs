import { useCallback, useEffect, useRef, useState } from 'react';
import { useMatchRoute } from './useMatchRoute';
import { history } from '@umijs/max';

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
  // 在业务组件中监听onShow和onHidden事件
  const activeTabShowEvents = useRef<Record<string, Array<() => void>>>({});
  const activeTabeHiddenEvents = useRef<Record<string, Array<() => void>>>({});

  const matchRoute = useMatchRoute();

  const onShow = useCallback(
    (cb: () => void) => {
      if (!activeTabShowEvents.current[activeTabRoutePath]) {
        activeTabShowEvents.current[activeTabRoutePath] = [];
      }
      activeTabShowEvents.current[activeTabRoutePath].push(cb);
    },
    [activeTabRoutePath],
  );

  const onHidden = useCallback(
    (cb: () => void) => {
      if (!activeTabeHiddenEvents.current[activeTabRoutePath]) {
        activeTabeHiddenEvents.current[activeTabRoutePath] = [];
      }
      activeTabeHiddenEvents.current[activeTabRoutePath].push(cb);
    },
    [activeTabRoutePath],
  );

  // 删除当前
  const closeTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      const index = activeTabs.findIndex((item) => item.routePath === routePath);
      if (activeTabs[index].routePath === activeTabRoutePath) {
        if (index > 0) {
          history.push(activeTabs[index - 1].routePath);
        } else {
          history.push(activeTabs[index + 1].routePath);
        }
      }

      delete activeTabShowEvents.current[routePath];
      delete activeTabeHiddenEvents.current[routePath];

      activeTabs.splice(index, 1);
      setActiveTabs([...activeTabs]);
    },
    [activeTabRoutePath],
  );
  // 删除其他
  const closeOtherTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      setActiveTabs((prev) => prev.filter((o) => o.routePath === routePath));
      const toCloseTabs = activeTabs.filter((o) => o.routePath !== routePath);
      toCloseTabs.forEach((o) => {
        delete activeTabShowEvents.current[o.routePath];
        delete activeTabeHiddenEvents.current[o.routePath];
      });
    },
    [activeTabRoutePath],
  );
  // 刷新
  const refreshTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      setActiveTabs((prev) => {
        const index = prev.findIndex((tab) => tab.routePath === routePath);
        if (index >= 0) {
          // 根据react的特性，key变了，组件会卸载重新渲染
          prev[index].key = generateKey();
        }
        delete activeTabShowEvents.current[prev[index].routePath];
        delete activeTabeHiddenEvents.current[prev[index].routePath];
        return [...prev];
      });
    },
    [activeTabRoutePath],
  );

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
    } else {
      (activeTabShowEvents.current[existActiveTabs.routePath] || []).forEach((cb) => cb());
    }

    (activeTabeHiddenEvents.current[activeTabRoutePath] || []).forEach((cb) => cb());

    setActiveTabRoutePath(matchRoute.routePath);
  }, [matchRoute]);
  return { closeTab, refreshTab, closeOtherTab, onHidden, onShow, activeTabs, activeTabRoutePath };
};

export default useMultiTabs;
