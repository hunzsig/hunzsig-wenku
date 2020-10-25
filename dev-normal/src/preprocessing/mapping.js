import {Api, Preprocessing} from "h-react-antd";

export default {
  yonna: new Preprocessing(() => {
    return new Promise((resolve, reject) => {
      Api.query().post({
        MAPPING: {
          method: "antd",
          target: "label",
          keys: [
            "Yonna_QuickStart_Mapping_Common_Boolean",
            "Yonna_QuickStart_Mapping_Essay_EssayStatus",
            "Yonna_QuickStart_Mapping_Essay_EssayCategoryStatus",
            "Yonna_QuickStart_Mapping_User_AccountType",
            "Yonna_QuickStart_Mapping_User_IdentityAuthStatus",
            "Yonna_QuickStart_Mapping_User_MetaCategoryStatus",
            "Yonna_QuickStart_Mapping_User_MetaValueFormat",
            "Yonna_QuickStart_Mapping_User_MetaComponent",
            "Yonna_QuickStart_Mapping_User_Sex",
            "Yonna_QuickStart_Mapping_User_UserStatus",
            "Yonna_QuickStart_Mapping_Data_DataStatus",
          ]
        },
      }, (response) => {
        if (response.error === 0) {
          const antd = {};
          const value2label = {};
          const label2value = {};
          for (let i in response.data) {
            const key = i.replace('Yonna_QuickStart_Mapping_', '');
            antd[key] = response.data[i];
            value2label[key] = {};
            label2value[key] = {};
            response.data[i].forEach((val) => {
              value2label[key][val.value] = val.label;
              label2value[key][val.label] = val.value;
            });
          }
          resolve({
            antd: antd,
            value2label: value2label,
            label2value: label2value,
          });
        } else {
          reject(response.msg);
        }
      });
    })
  }),
}