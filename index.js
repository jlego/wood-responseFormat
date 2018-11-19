/**
 * Wood Plugin Module.
 * 格式化输出结果中间件
 * by jlego on 2018-11-17
 */
 const zlib = require('zlib');
 const Util = require('./src/util');

module.exports = (app = {}, config = {}) => {
  app.responseFormat = function(req, res, next) {
    res.print = function(data){
      let body = {};
      if(req.method == 'GET'){
        body = req.query;
      }else{
        body = req.body;
      }
      let result = Util.respData(data.err ? Util.error(data.err) : (data.hasOwnProperty('data') ? data.data : data), body);
      let resultStr = JSON.stringify(result);
      // 压缩结果
      res.statusCode = 200;
      if (resultStr.length > 1000) {
        resultStr = zlib.gzipSync(resultStr);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Connection', 'close');
        res.setHeader('Content-Encoding', 'gzip');
        res.end(resultStr);
      } else {
        res.json(result);
      }
    };
    next();
  };
  app.application.use(app.responseFormat);
  return app;
}
