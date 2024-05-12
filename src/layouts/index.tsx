import { Tabs } from 'antd';
import { useMatchRoute } from './useMatchRoute';

const MultiTabLayout = () => {
  const matchRoute = useMatchRoute();

  return (
    <Tabs
      items={[
        {
          key: matchRoute?.pathname || '',
          label: matchRoute?.title,
          children: matchRoute?.children,
        },
      ]}
    />
  );
};

export default MultiTabLayout;
