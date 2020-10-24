import React from "react";

import {
  PieChartFilled,
  SettingOutlined,
  TranslationOutlined,
  SnippetsOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  TeamOutlined,
  GoogleOutlined,
  UserOutlined,
  UserAddOutlined,
  KeyOutlined,
  NodeIndexOutlined,
  MessageOutlined,
} from "@ant-design/icons";

export default [
  {icon: <PieChartFilled/>, to: '/'},
  {
    icon: <TeamOutlined/>, to: ['user', [
      {
        icon: <GoogleOutlined/>, to: [['administrator', 'user'], [
          {icon: <UnorderedListOutlined/>, to: '/user/admin'},
          {icon: <UserAddOutlined/>, to: '/user/admin/add'},
        ]]
      },
      {
        icon: <UserOutlined/>, to: [['normal', 'user'], [
          {icon: <UnorderedListOutlined/>, to: '/user/normal'},
          {icon: <UserAddOutlined/>, to: '/user/normal/add'},
        ]]
      },
      {icon: <KeyOutlined/>, to: '/permission'},
    ]]
  },
  {
    icon: <FileTextOutlined/>, to: ['article', [
      {icon: <UnorderedListOutlined/>, to: '/essay'},
      {icon: <AppstoreOutlined/>, to: '/essay/category'},
    ]]
  },
  {icon: <MessageOutlined/>, to: '/feedback'},
  {
    icon: <SettingOutlined/>, to: ['setting', [
      {icon: <TranslationOutlined/>, to: '/setting/i18n'},
      {icon: <NodeIndexOutlined/>, to: '/setting/sdk'},
      {icon: <SnippetsOutlined/>, to: '/setting/log/file'},
      {icon: <DatabaseOutlined/>, to: '/setting/log/db'},
    ]]
  },
]
