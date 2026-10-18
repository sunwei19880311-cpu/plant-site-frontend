'use client';

import { ConfigProvider, App as AntdApp, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

/**
 * 养花小集主题色 - 清新自然绿
 */
const plantTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#52c41a',
    colorSuccess: '#52c41a',
    colorLink: '#389e0d',
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
};

/**
 * Ant Design Provider
 * 包裹 ConfigProvider + App 组件，全站使用中文 locale 和自定义主题
 */
export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider locale={zhCN} theme={plantTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
