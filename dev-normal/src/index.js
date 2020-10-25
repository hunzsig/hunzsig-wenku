import './antd.less';
import './index.less';
import 'braft-editor/dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {HistoryInitial} from 'h-react-antd';

import preprocessing from "./preprocessing";

ReactDOM.render(
  <HistoryInitial
    preprocessing={preprocessing}
    forceLogin={false}
    catalog={false}
    guidance={false}
    api={{
      key: 'def',
      host: '/api',
      crypto: null /*{ mode: 'des-cbc', secret: 'iod13kxx' }*/,
      append: {}
    }}
  />, document.getElementById('h-container'));