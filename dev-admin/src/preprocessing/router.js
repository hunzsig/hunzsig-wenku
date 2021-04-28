import React from "react";

import Homepage from './../pages/Homepage'
import SettingI18n from "../pages/Setting/I18n";
import SettingSdk from "../pages/Setting/Sdk/List";
import SettingSdkEdit from "../pages/Setting/Sdk/Edit";
import SettingLogFile from "../pages/Setting/LogFile";
import SettingLogDB from "../pages/Setting/LogDB";
import EssayList from '../pages/Essay/List'
import EssayAdd from "../pages/Essay/Add";
import EssayEdit from "../pages/Essay/Edit";
import EssayCategoryList from "../pages/EssayCategory/List";
import EssayCategoryAdd from "../pages/EssayCategory/Add";
import EssayCategoryEdit from "../pages/EssayCategory/Edit";
import License from "../pages/License/List";
import LicenseAdd from "../pages/License/Add";
import LicenseEdit from "../pages/License/Edit";
import UserPassword from '../pages/User/Password'
import UserAccount from '../pages/User/Account'
import UserAdminList from '../pages/User/Admin/List';
import UserAdminAdd from '../pages/User/Admin/Add';
import UserAdminEdit from '../pages/User/Admin/Edit';
import UserNormalList from '../pages/User/Normal/List';
import UserNormalAdd from '../pages/User/Normal/Add';
import UserNormalEdit from '../pages/User/Normal/Edit';
import UserAuthorList from '../pages/User/Author/List';
import UserAuthorAdd from '../pages/User/Author/Add';
import UserAuthorEdit from '../pages/User/Author/Edit';
import UserMetaList from "../pages/UserMeta/List";
import UserMetaAdd from "../pages/UserMeta/Add";
import UserMetaEdit from "../pages/UserMeta/Edit";
import Feedback from "../pages/Feedback/List";

export default {
  "/": {component: Homepage, label: 'statistic'},
  "/essay": {component: EssayList, label: ['article', 'list']},
  "/essay/add": {component: EssayAdd, label: ['add', 'article']},
  "/essay/edit": {component: EssayEdit, label: ['edit', 'article']},
  "/essay/category": {component: EssayCategoryList, label: ['article', 'category']},
  "/essay/category/add": {component: EssayCategoryAdd, label: ['add', 'article', 'category']},
  "/essay/category/edit": {component: EssayCategoryEdit, label: ['edit', 'article', 'category']},

  "/setting/i18n": {component: SettingI18n, label: 'translate'},
  "/setting/sdk": {component: SettingSdk, label: 'sdk'},
  "/setting/sdk/edit": {component: SettingSdkEdit, label: ['edit', 'sdk']},
  "/setting/log/file": {component: SettingLogFile, label: ['file', 'log']},
  "/setting/log/db": {component: SettingLogDB, label: ['database', 'log']},

  "/user/password": {component: UserPassword, label: ['modify', 'my', 'password']},
  "/user/account": {component: UserAccount, label: ['modify', 'account']},
  "/user/admin": {component: UserAdminList, label: ['administrator', 'user', 'list']},
  "/user/admin/add": {component: UserAdminAdd, label: ['add', 'administrator', 'user']},
  "/user/admin/edit": {component: UserAdminEdit, label: ['edit', 'administrator', 'user']},
  "/user/normal": {component: UserNormalList, label: ['normal', 'user', 'list']},
  "/user/normal/add": {component: UserNormalAdd, label: ['add', 'normal', 'user']},
  "/user/normal/edit": {component: UserNormalEdit, label: ['edit', 'normal', 'user']},
  "/user/author": {component: UserAuthorList, label: ['author', 'user', 'list']},
  "/user/author/add": {component: UserAuthorAdd, label: ['add', 'author', 'user']},
  "/user/author/edit": {component: UserAuthorEdit, label: ['edit', 'author', 'user']},

  "/permission": {component: License, label: ['license']},
  "/permission/add": {component: LicenseAdd, label: ['add', 'license']},
  "/permission/edit": {component: LicenseEdit, label: ['edit', 'license']},

  "/feedback": {component: Feedback, label: ['feedback']},

  "/data/user/meta": {component: UserMetaList, label: ['user', 'common', 'data', 'item']},
  "/data/user/meta/add": {component: UserMetaAdd, label: ['add', 'user', 'common', 'data', 'item']},
  "/data/user/meta/edit": {component: UserMetaEdit, label: ['edit', 'user', 'common', 'data', 'item']},

}
