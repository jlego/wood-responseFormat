// 工具类
// by YuRonghui 2018-1-4

let Util = {
  // 返回错误
  error(err) {
    let result = JSON.parse(JSON.stringify(WOOD.error_code.error));
    if (typeof err !== 'object') {
      if(typeof err == 'string') result.msg = err;
      result.error = err;
    }else if(typeof err == 'object'){
      if(err.message){
        result.msg = err.message;
        result.error = err;
      }else if(err.msg && err.code){
        result = err;
      }
    }
    return result;
  },

  // 捕获异常
  catchErr(promise){
    return promise
      .then(data => ({ data }))
      .catch(err => ({ err }));
  },
  // 深拷贝
  deepCopy(obj){
    let str, newobj = Array.isArray(obj) ? [] : {};
    if(typeof obj !== 'object'){
      return;
    // } else if(window.JSON){
    //   newobj = JSON.parse(JSON.stringify(obj));
    } else {
      for(let i in obj){
        newobj[i] = typeof obj[i] === 'object' && !(obj[i] instanceof Date) ? Util.deepCopy(obj[i]) : obj[i];
      }
    }
    return newobj;
  },
  // 是否空对象
  isEmpty(value){
    if(JSON.stringify(value) == '{}' || JSON.stringify(value) == '[]') return true;
    return false;
  },

  respData(data, reqData){
    let status = 0,
      msg = '';
    if (!data && data !== false) data = WOOD.error_code.error_nodata;
    if (data.path && data.message && data.kind) { //返回错误
      status = WOOD.error_code.error_wrongdata.code;
      msg = WOOD.error_code.error_wrongdata.msg;
    } else if (data.name == 'ValidationError') {
      status = WOOD.error_code.error_validation.code;
      msg = WOOD.error_code.error_validation.msg;
    } else {
      status = !data.code ? WOOD.error_code.success.code : data.code;
      msg = !data.msg ? WOOD.error_code.success.msg : data.msg;
    }
    return {
      // seqno: reqData.seqno,
      cmd: reqData.cmd,
      status,
      msg,
      data: !data.code ? data : {}
    };
  },
  // 过滤html
  filterHtml(str){
    return str ? str.replace(/<[^>]+>/g,"") : '';
  }
};

module.exports = Util;
