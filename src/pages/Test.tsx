import { MultiTabContext } from '@/layouts/context';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Input, Space } from 'antd';
import React, { useContext } from 'react';

const Test: React.FC = () => {
  const { closeTab, closeOtherTab, refreshTab } = useContext(MultiTabContext);

  return (
    <PageContainer>
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
