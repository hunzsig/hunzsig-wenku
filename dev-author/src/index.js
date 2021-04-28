import './antd.less';
import './index.less';
import 'braft-editor/dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {HistoryInitial} from 'h-react-antd';
import Login from './pages/Login';

import preprocessing from "./preprocessing";

ReactDOM.render(
  <HistoryInitial
    Login={<Login/>}
    preprocessing={preprocessing}
    api={{
      key: 'def',
      host: '/api',
      crypto: null /*{ mode: 'des-cbc', secret: 'iod13kxx' }*/,
      append: {}
    }}
    defaultSetting={{
      enableDarkMenu: true,
      enableHelpTips: true,
      enableFullscreen: true,
    }}
  />, document.getElementById('h-container'));