//配置API接口地址
var root = "https://cnodejs.org/api/v1";
//引入superagent
var request = require('superagent');
//自定义判断元素类型
function tpType(obj){
	return ({}).toString.call(obj).match(/\s([a-zA-z])/)[1].toLowerCase()

}

//参数过滤
function filter_null(o){
	for(var key in o){
		if(o[key]==null){
			delete o[key]
		}
		if(toType(o[key])=="string"){
			o[key] = o[key].trin();
			if(o[key].length == 0){
				delete o[key]
			}
		}
	}
	return o;
}
function _api_base(method,url,params,success,failure){
	var r = request(method,url).type("text/plain");
	if(params){
		params = filter_null(params);
		if(method == "POST" || method == "PUT"){
			if(toType(params)=="string"){
				params = JSON.stringify(params);
			}
			r = r.send(params);
		}else if(method=="GET" || method=="DELETE"){
			r = r.query(params);
		}
	}
	r.end(function(err,res){
		if(err){
			console.err("api error,HTTP CODE:"+res.status);
			return;
		}
		if(res.body.success == true){
			if(success){
				success(res.body);
			}
		}else{
			if(failure){
				failure(res.body)
			}else{
				console.error("error:"+JSON.stringify(res.body));
			}
		}
	})
}

// 返回在vue模板中的调用接口
export default {
  get: function(url, params, success, failure) {
    return _api_base('GET', root + '/' + url, params, success, failure)
  },
  post: function(url, params, success, failure) {
    return _api_base('POST', root + '/' + url, params, success, failure)
  },
  put: function(url, params, success, failure) {
    return _api_base('PUT', root + '/' + url, params, success, failure)
  },
  delete: function(url, params, success, failure) {
    return _api_base('DELETE', root + '/' + url, params, success, failure)
  },
}