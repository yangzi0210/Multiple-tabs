import { Tabs } from 'antd';
import { useCallback, useMemo } from 'react';
import { history } from '@umijs/max';
import { useMultiTabs } from './useMultiTabs';

const KeepAliveLayout = () => {
  const { activeTabs, activeTabRoutePath } = useMultiTabs();

  const tabItems = useMemo(() => {
    return activeTabs.map((tab) => {
      return {
        key: tab.routePath,
        label: (
          <span>
            {tab.icon}
            {tab.title}
          </span>
        ),
        children: (
          <div key={tab.key} style={{ height: 'calc(100vh - 112px)', overflow: 'auto' }}>
            {tab.children}
          </div>
        ),
        closable: false,
      };
    });
  }, [activeTabs]);

  const onTabsChange = useCallback((tabRoutePath: string) => {
    history.push(tabRoutePath);
  }, []);

  return (
    <Tabs
      type="editable-card"
      items={tabItems}
      activeKey={activeTabRoutePath}
      onChange={onTabsChange}
      className="keep-alive-tabs"
      hideAdd
    />
  );
};

export default KeepAliveLayout;
