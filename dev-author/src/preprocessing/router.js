import React from "react";

import Homepage from './../pages/Homepage'
import EssayList from '../pages/Essay/List'
import EssayAdd from "../pages/Essay/Add";
import EssayEdit from "../pages/Essay/Edit";
import EssayCategoryList from "../pages/EssayCategory/List";
import EssayCategoryAdd from "../pages/EssayCategory/Add";
import EssayCategoryEdit from "../pages/EssayCategory/Edit";

export default {
  "/": {component: Homepage, label: 'statistic'},
  "/essay": {component: EssayList, label: ['article', 'list']},
  "/essay/add": {component: EssayAdd, label: ['add', 'article']},
  "/essay/edit": {component: EssayEdit, label: ['edit', 'article']},
  "/essay/category": {component: EssayCategoryList, label: ['article', 'category']},
  "/essay/category/add": {component: EssayCategoryAdd, label: ['add', 'article', 'category']},
  "/essay/category/edit": {component: EssayCategoryEdit, label: ['edit', 'article', 'category']},
}
