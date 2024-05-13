import { MultiTabContext } from '@/layouts/context';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Input, Space, notification } from 'antd';
import { useContext, useEffect } from 'react';

const Test: React.FC = () => {
  const { closeTab, closeOtherTab, refreshTab, onHidden, onShow } = useContext(MultiTabContext);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    onHidden(() => {
      api.open({
        message: 'onHidden event',
        description: 'onHidden.',
      });
    });
    onShow(() => {
      api.open({
        message: 'onShow event',
        description: 'onShow.',
      });
    });
  }, []);

  return (
    <PageContainer>
      {contextHolder}
      <Space>
        <Input />
        <Button
          onClick={() => {
            refreshTab();
          }}
        >
          刷新
        </Button>
        <Button
          onClick={() => {
            closeTab();
          }}
        >
          关闭
        </Button>
        <Button
          onClick={() => {
            closeOtherTab();
          }}
        >
          关闭其他
        </Button>
      </Space>
    </PageContainer>
  );
};

export default Test;
