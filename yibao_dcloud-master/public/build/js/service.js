(function() {
    
    /* Service 整个项目的共同的代码库 */
    window.Service = {};
    var Service = window.Service;
    localStorage.setItem('baseUrl', 'http://pang.tunnel.yibaoedu.com:8080');
    window.baseUrl = localStorage.getItem('baseUrl');
    var baseUrl = window.baseUrl;
    var ajax = mui.ajax;


    /* 获取URL上的query, ONLY for debug */
    function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
    }
    var role = getQueryString('role');
    var debugid = getQueryString('debugid');
    var roleToUserMap = {
	'TEACHER' : '',
	'STUDENT' : ''
    };
    var userQuery = debugid || roleToUserMap[userQuery];
    userQuery = userQuery ? "debugid="+userQuery : "";


    // 获得存储在本机上的用户信息
    Service.getLocalUser = function(more,callback) {     
	var user; 
	try{
	    user = JSON.parse(localStorage.getItem('localUser'));
	}catch(e){
	    console.log('[Service.getLocalUser()] Parse localUser Error');
	    user = null;
	}
	return user;
    };

    /* 获取远程最新的用户，并且更新本地 */
    Service.getRemoteUser = function(callback) {
	var data = {};
	callback = callback || function() {};
	ajax(baseUrl + '/userInfo?'+userQuery, {
	    dataType : "json",
	    type : "get",
	    data : data,
	    success :function(result) {
		localStorage.setItem('localUser', JSON.stringify(result.user));
		callback(null,result.user);
	    },
	    error : function(err) {
		console.log('[server.js] Get remote user error : ' + err);
		callback(err);
	    }
	});
    };
    
    // 获得其他用户信息
    Service.getOtherUser = function(userid, callback) {
	var data = {};
	ajax(baseUrl + '/userInfo/'+ userid + "?" +userQuery, {
	    dataType : "json",
	    type : "get",
	    data : data,
	    success :function(result) {
		callback(null,result.user);
	    },
	    error : function(err) {
		console.log('[server.js] Get remote user error : ' + err);
		callback(err);
	    }
	});
    };

    
    // 保存User对象到local
    Service.saveToLocal = function(user) {
	if(typeof user !== 'object')
	    alert('用户信息不正确');
	var userstr = JSON.stringify(user);
	localStorage.setItem('localUser', userstr);
	return user;
    };

    // 保存User对象至远方
    Service.saveToRemote = function(u, callback){
	if(u){
	    Service.saveToLocal(u);
	}
	var user = Service.getLocalUser();
	callback = callback || function() {};
	ajax(baseUrl + "/editInfo?"+userQuery,{
	    data:{
		edit_user : user
	    },
	    timeout : 15000,
	    type:'post',
	    success:function(data){
		//成功
		if(callback){
		    console.log('NEW USER : '+ JSON.stringify(data.newuser));
		    Service.saveToLocal(data.newuser);
		    callback(null, data.newuser);
		}
	    },
	    error : function() {
		if(window.plus)
		    plus.nativeUI.toast('用户信息保存错误');
		console.log('save to Remote error');
	    }
	});

    };

    // 获得正在编辑的动态
    Service.getFeeding = function() {
	var postFeed;
	try{
	    postFeed = JSON.parse(localStorage.getItem('postFeed'));
	}catch(e){
	}
	if(!postFeed) postFeed = {};
	return postFeed;
    };
    
    Service.setFeeding = function(postFeed) {
	localStorage.setItem('postFeed', JSON.stringify(postFeed));
    };

    // 获得所有的技能、画作分类Tags
    Service.getAllTags = function(callback) {
	var tags; 
	try{
	    tags = JSON.parse(localStorage.getItem('workTags'));
	}catch(e){
	    // local User info is not parse-able
	    tags = [];
	}
	if(tags && tags.length > 0)
	    callback(null, tags);
	
	ajax(baseUrl + "/childrenTagsByName/画技分类",{
	    type : "GET",
	    dataType : "json",
	    success : function(result) {
		var tags = result.tags;
		callback(null, tags);
	    },
	    error : function() {
		callback(new Error('get children tags error'));
	    }
	});
    };

    Service.offline = function(user){
	localStorage.removeItem("localUser");
    };

    // 获得Photo
    Service.getPhoto = function(method, callback){
	var base64;
	var IMAGE_UNSPECIFIED = "image/*";
	var PHOTOZOOM = 2; // 获取完图片返回key
	var PHOTOLAT = 1; // 剪裁完毕后返回key
	var main = plus.android.runtimeMainActivity();
	var Intent = plus.android.importClass("android.content.Intent");
	var MediaStore = plus.android.importClass("android.provider.MediaStore");
	var File = plus.android.importClass("java.io.File");
	var Uri = plus.android.importClass("android.net.Uri");

	var intent;
	console.log('[service/getPhoto] BEFORE create intent, METHOD : ' + method);
	if(method == 'CAMERA'){ 
	    intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE, null);
	    var outPutPath = plus.io.convertLocalFileSystemURL("_doc/cachedImage/headImg.jpg");
	    var outFUri = Uri.fromFile(new File(outPutPath));
	    intent.putExtra(MediaStore.EXTRA_OUTPUT, outFUri);
	}else if(method == "GALLERY"){
	    intent = new Intent(Intent.ACTION_PICK, null);
	    intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, IMAGE_UNSPECIFIED);
	}
	main.startActivityForResult(intent, PHOTOZOOM);
	main.onActivityResult = function(requestCode, resultCode, data) {
	    console.log('[service/getPhoto] onActivityResult, requestCode : '+requestCode);
	    if (PHOTOZOOM == requestCode) {
		var uri;
		if(method == "CAMERA"){
		    uri = outFUri;
		}else{		
		    console.log(3);
		    outPutPath = plus.io.convertLocalFileSystemURL("_doc/cachedImage/headPhoto.jpg");
		    var file = new File(outPutPath);
		    // 输出目录uri
		    var outPutUri = Uri.fromFile(file);
		    plus.android.importClass(data);
		    uri = data.getData();
		    if(uri == undefined)
		    {
			console.log("您已取消");
			return false;
		    }
		}
		var cropIntent = new Intent("com.android.camera.action.CROP");
		cropIntent.setDataAndType(uri, IMAGE_UNSPECIFIED);
		// 截图完毕后 输出目录
		cropIntent.putExtra(MediaStore.EXTRA_OUTPUT, outPutUri);
		cropIntent.putExtra("crop", "true");
		// aspectX aspectY 是宽高的比例
		cropIntent.putExtra("aspectX", 1);
		cropIntent.putExtra("aspectY", 1);
		// outputX outputY 是裁剪图片宽高
		cropIntent.putExtra("outputX", 240);
		cropIntent.putExtra("outputY", 240);
		cropIntent.putExtra("return-data", false);
		main.startActivityForResult(cropIntent, PHOTOLAT);
	    } else if (requestCode == PHOTOLAT) {
		// 判断 剪裁完后的图片输出是否存在
		file = new File(outPutPath);
		console.log(outPutPath);
		var a = file.exists();
		if(a){
		    var path = outPutPath;
		    plus.io.resolveLocalFileSystemURL(path,function(entry){
			var localUrl = entry.toLocalURL();
			Service.convertToBase64(localUrl,function(url){
			    console.log(url);
			    callback(url);
			});
		    },function(e){
			console.log("失败："+e.message);
		    },{
			filename:"_doc/cacheImage/",
			index:1
		    });
		}else{
		    console.log('[PHOTO] File do not exist');
		}
	    }
	};
    };
    Service.convertToBase64 = function(path,callback){
	plus.io.resolveLocalFileSystemURL(path,function(entry){
	    entry.file(function(file){
		var reader = new plus.io.FileReader();
		reader.onloadend = function(e){
		    console.log('read base64 successfully');
		    Service.updateImg(e.target.result,function(url){
			console.log('remote url  : '+ url);
			callback(url);
		    });
		};
		reader.readAsDataURL(file);
	    });
	},function(err){
	    console.log('resolve file error : ' + JSON.stringigy(err));
	});
    };

    // 压缩图片
    Service.compress = function(path,callback){
	var filename = path.split('/');
	filename = filename[filename.length - 1];
	var compressPath = "_doc/cacheImage/";
	
	plus.zip.compressImage({
	    src : path,
	    dst : compressPath + filename,
	    overwrite : true
	},function(){
	    callback(compressPath + filename);
	},function(error){
	    console.log('compress error');
	    console.log(JSON.stringify(error));
	});
    };
    Service.getLocalCity = function(callback){
	AMap.service(["AMap.CitySearch"],function(){
	    var citysearch = new AMap.CitySearch();
	    citysearch.getLocalCity(function(status,result){
		callback(status,result);
	    });
	});
    };
    Service.getDistrict = function(option,callback){
	var keyword = option.keyword;
	var nextDistrictLevel = option.level;
	var subdistrict = option.subdistrict;
	AMap.service(["AMap.DistrictSearch"],function(){
	    var opts = {
		"level":nextDistrictLevel,
		"subdistrict":subdistrict
	    };
	    var district = new AMap.DistrictSearch(opts);
	    district.search(keyword,function(status,result){
		if(status === 'complete'){
		    
		    console.log(JSON.stringify(result));
		    callback(result);
		}
		else if(status == 'errot'){//服务器出错，或网络未连接
		    callback(null);
		}else if(status == 'no_data')
		{//未查找到数据
		    callback(0);
		}
		else
		    callback(result);
	    });
	});
    };
    Service.getGallery = function(callback){
	plus.gallery.pick(function(e){
	    callback(e.files);
	    console.log(e.files);
	}, function(e){
	    console.log("取消选择图片");
	    callback(null);
	}, {filter:"image",multiple:true,system:false});
    };
    Service.updateImg = function(base64,callback){
	baseUrl = baseUrl + "";
	console.log(base64);
	ajax(baseUrl + '/uploadImage',{
	    type : "post",
	    data :{
		b64 : base64
	    },
	    success : function(result){
		console.log(result);
		callback(result.picUrl);
	    }
	});
    };
    // 将时间转换成可读的相对时间
    Service.HQDate = function(preDate){
	var editDate = new Date(preDate);
	
	var nowDate = new Date();
	var nowTime = nowDate.getTime();
	var editTime = editDate.getTime();
	var time = nowTime - editTime;
	time = time / 1000;
	if(time < 60) return "刚刚";
	else if(time < 3600){
	    var min = parseInt(time / 60);
	    return min + "分钟前";
	}else if(time < 86400){
	    var hour = parseInt(time / 3600);
	    return hour + "小时前";
	}else if(time < 2592000){
	    var day = parseInt(time / (3600 * 24));
	    return day + "天前";
	}else if(time < 31536000){
	    var month = parseInt(time / (3600 * 24 * 30));
	    return month + "月前";
	}else{
	    var year = parseInt(time / 31536000);
	    return year + "年前";
	}
    };
    //将时间转化为YY-MM格式
    Service.YYMMDate = function(preDate){
	var YYMMDate="";
	for(var i =0; i < 7; i++)
	    YYMMDate += preDate[i];
	return YYMMDate;
    };
    //获取该用户的消息
    Service.getMessages = function(callback){
	var messages = JSON.parse(localStorage.getItem('messages'));
	ajax({
	    url : baseUrl + "/messages?"+userQuery,
	    success : function(data){
		console.log(JSON.stringify(data));
		if(data.msg=="ok"){
		    localStorage.setItem('messages',JSON.stringify(data.messages));
		    callback(data.messages);
		}else
		    console.log(data.msg);
	    }.bind(this)
	});
    };
    Service.getCatesByType = function(typeName, callback) {
	var cates = localStorage.getItem('catesMap');
	try{
	    cates = JSON.parse(cates) || {};
	}catch(e){
	    cates = {};
	}
	
	if(cates && cates[typeName]){
	    callback(null, cates[typeName]);
	}else 
	    ajax({
		type : "get",
		url : baseUrl + "/categoryByType/"+typeName + "?" + userQuery,
		dataType : "json",
		success : function(data){
		    cates[typeName] = data.categorys;
		    callback(null, cates[typeName]);
		}.bind(this)
	    });
    };
    
})();













