import { Dropdown, Tabs } from 'antd';
import { useCallback, useMemo } from 'react';
import { history } from '@umijs/max';
import { MultiTab, useMultiTabs } from './useMultiTabs';
import { MenuInfo } from 'rc-menu/lib/interface';
import { MultiTabContext } from './context';

enum OperationType {
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHER = 'close-other',
}

type MenuItem = {
  label: string;
  key: OperationType;
};

type MenuItemType = MenuItem | null;

const MultiTabLayout = () => {
  const { activeTabs, activeTabRoutePath, onShow, onHidden, closeTab, refreshTab, closeOtherTab } =
    useMultiTabs();

  const menuItems: MenuItemType[] = useMemo(
    () =>
      [
        {
          label: '刷新',
          key: OperationType.REFRESH,
        },
        activeTabs.length <= 1
          ? null
          : {
              label: '关闭',
              key: OperationType.CLOSE,
            },
        activeTabs.length <= 1
          ? null
          : {
              label: '关闭其他',
              key: OperationType.CLOSEOTHER,
            },
      ].filter((o) => o),
    [activeTabs],
  );

  const menuClick = useCallback(
    ({ key, domEvent }: MenuInfo, tab: MultiTab) => {
      domEvent.stopPropagation();
      if (key === OperationType.REFRESH) {
        refreshTab(tab.routePath);
      } else if (key === OperationType.CLOSE) {
        closeTab(tab.routePath);
      } else if (key === OperationType.CLOSEOTHER) {
        closeOtherTab(tab.routePath);
      }
    },
    [closeOtherTab, closeTab, refreshTab],
  );

  const onTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove') {
      closeTab(targetKey as string);
    }
  };

  const renderTabTitle = useCallback(
    (tab: MultiTab) => {
      return (
        <Dropdown
          menu={{ items: menuItems, onClick: (e) => menuClick(e, tab) }}
          trigger={['contextMenu']}
        >
          <div style={{ margin: '-12px 0', padding: '12px 0' }}>
            {tab.icon}
            {tab.title}
          </div>
        </Dropdown>
      );
    },
    [menuItems],
  );

  const tabItems = useMemo(() => {
    return activeTabs.map((tab) => {
      return {
        key: tab.routePath,
        label: renderTabTitle(tab),
        children: (
          <div key={tab.key} style={{ height: 'calc(100vh - 112px)', overflow: 'auto' }}>
            {tab.children}
          </div>
        ),
        closable: activeTabs.length > 1,
      };
    });
  }, [activeTabs]);

  const onTabsChange = useCallback((tabRoutePath: string) => {
    history.push(tabRoutePath);
  }, []);

  const multiTabContextValue = useMemo(
    () => ({
      closeTab,
      closeOtherTab,
      refreshTab,
      onShow,
      onHidden,
    }),
    [closeTab, closeOtherTab, refreshTab],
  );

  return (
    <MultiTabContext.Provider value={multiTabContextValue}>
      <Tabs
        type="editable-card"
        items={tabItems}
        activeKey={activeTabRoutePath}
        onChange={onTabsChange}
        className="keep-alive-tabs"
        hideAdd
        onEdit={onTabEdit}
      />
    </MultiTabContext.Provider>
  );
};

export default MultiTabLayout;
