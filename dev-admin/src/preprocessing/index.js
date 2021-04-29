import {Api, LocalStorage, Preprocessing, Navigator} from "h-react-antd";
import I18nJson from "./i18n.json";
import Helper from "./helper.js";
import router from "./router.js";
import catalog from "./catalog.js";
import mapping from "./mapping.js";

// const i18nSupport = ['zh_cn', 'zh_tw', 'zh_hk', 'en_us', 'ja_jp', 'ko_kr'];
const i18nSupport = ['zh_cn', 'zh_tw', 'zh_hk', 'en_us', 'ja_jp', 'ko_kr'];

/**
 * 这里是h-react.HistoryInitial需要预处理的数据项
 * 会以数组的形势返回，以数组的顺序加载
 * 当HistoryInitial有传入预处理数据时，会在数据完全处理完后，在进行页面渲染
 * 数据格式：[
 *  [key,setting],[key,setting],[key,setting]...
 * ]
 * key会保存到 History.state内，
 * setting可以设 function _promise() { return new Promise... } 或值
 */
export default {

  i18n: {
    lang: LocalStorage.get('h-react-i18n-lang') || Navigator.language(),
    support: i18nSupport,
    data: I18nJson.length > 0
      ? Helper.i18nDataFormat(I18nJson, i18nSupport)
      : new Preprocessing(() => {
        return new Promise((resolve, reject) => {
          Api.query().post({I18N_ALL: {}}, (response) => {
            Api.handle(response,
              () => resolve(Helper.i18nDataFormat(response.data, i18nSupport)),
              () => reject(response.msg),
              () => reject(response.msg)
            );
          });
        })
      }),
  },
  router: router,
  catalog: catalog,
  mapping: mapping,
}