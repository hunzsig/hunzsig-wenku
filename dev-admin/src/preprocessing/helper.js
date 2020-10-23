export default {

  i18nDataFormat: (langJson, support) => {
    const data = {};
    langJson.forEach((ljv) => {
      support.forEach((sv) => {
        if (data[sv] === undefined) {
          data[sv] = {};
        }
        const uk = ljv.i18n_unique_key;
        data[sv][uk] = ljv[`i18n_${sv}`] || '';
      });
    });
    return data;
  }

};
