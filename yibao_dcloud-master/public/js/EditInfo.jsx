var EditHead = React.createClass({
	HandleClick : function(){
		this.props.HandleClick("头像");
	},
	render : function(){
		return  <div className="head_portrait" onClick={this.HandleClick}>
			<div className="info_title">头像</div>
			<img src={this.props.user.photo || "../img/logo.png"}/> 
		</div>;
	}
});

var EditColumn = React.createClass({
	getInitialState : function(){
		return {name : this.props.name,
			properity : this.props.properity};
	},
	HandleClick : function(){
		console.log(this.state.properity);
		console.log(this.state.name);
		this.props.HandleClick(this.state.name,this.state.properity);
	},
	render : function(){
		console.log(this.props.pro);
		var name = this.props.name;
		var clickable = name == "姓名" || name == "性别"
			|| name == "画室" || name == "地址" || name == "QQ" || name == "个性签名";

		var arrow = clickable ? <i className="fa fa-angle-right"></i> : null;
		console.log(this.props.pro);
		return  <div className="name" onClick={this.HandleClick}>
			<div className="line"></div>
			<div className="info_title">
				{this.state.name}
			</div>
			<div className="info_content">
				{this.props.pro}
			</div>
			{arrow}
		</div>
	}
});

var EditColumnList = React.createClass({
	getInitialState : function(){
		return {user : this.props.user};
	},
	saveUser : function(user){
		var that = this;
		console.log('current : ' + user.photo);
		Service.saveToLocal(user);
		that.setState({user : user});
	},
	HandleClick : function(name,properity){
		var that = this;
		var user = this.state.user;
		if(name == "姓名" || name == "QQ" || name == "画室" || name == "个性签名"){
			plus.nativeUI.prompt("请您输入"+name, function(e){
				if(e.index==0){
					user[properity] = e.value;
					that.setState({user : user});
					that.saveUser(user);
				}					
			},"艺伴",name, ["确定","取消"]);
		}else if(name == "性别"){
			plus.nativeUI.actionSheet({title:"选择性别",cancel:"取消",buttons:[{title:"男"},{title:"女"}]},function(e){
				var gender = "";
				if(e.index == 1)
					gender = "male";
				else if(e.index == 2)
					gender = "female";
				else
					return null;
				var Tuser = that.state.user;
				user.gender = gender;
				that.saveUser(user);
				that.setState({user : user});
			});
		}else if(name == "身份"){//进入身份界面
			console.log(4);
		}else if(name == "地址"){
			var pageAddress = plus.webview.create('page_address.html','address_contain');
			setTimeout(function() {
				pageAddress.show('pop-in', 200);
			},100);
		}else if(name == "头像"){
			plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照"},{title:"相册"}]},function(e){
				if(e.index == 1){
					Service.getPhoto('CAMERA', function(url){
						user.photo = url;
						that.saveUser(user);
					});
				}else if(e.index == 2){
					Service.getPhoto('GALLERY', function(url){
						user.photo = url;
						that.saveUser(user);
					});
				}
			});
		}
	},
	componentWillReceiveProps : function(nextProps){
		console.log(JSON.stringify(nextProps));
		this.setState({user : nextProps.user});
	},
	render : function(){
		console.log(this.state.user.city);
		var distance = <div className="distance"></div>;
		var signature = <EditColumn pro={this.state.user.signature} properity="signature" name="个性签名" HandleClick={this.HandleClick}/>;
		var isVarified = <EditColumn pro={this.state.user.isVarified?"已认证":"未认证"} name="认证" HandleClick={this.HandleClick}/>;
		var sign = this.state.user.role=="TEACHER"?isVarified : signature;
		return 	<div className="content">
			<EditHead user={this.state.user} HandleClick={this.HandleClick}/>
			<EditColumn pro={this.state.user.nickname} properity="nickname" name="姓名" HandleClick={this.HandleClick}/>
			{sign}
			<EditColumn pro={this.state.user.gender=="male"? "男" : "女"} name="性别" HandleClick={this.HandleClick}/>
			<EditColumn pro={this.state.user.role=="TEACHER"?"老师" : "学生"} name="身份" HandleClick={this.HandleClick}/>
			{distance}
			<EditColumn pro={this.state.user.telephone} properity="telephone" name="手机" HandleClick={this.HandleClick}/>
			{/* 			<EditColumn pro={this.state.user.qq} properity="qq" name="QQ" HandleClick={this.HandleClick}/> */}
			{distance}
			<EditColumn pro={this.state.user.studio} properity="studio" name="画室" HandleClick={this.HandleClick}/>
			<EditColumn pro={this.state.user.city} properity="city" name="地址" HandleClick={this.HandleClick}/>
		</div>;
	}
});

var EditStudio = React.createClass({
	getInitialState : function(){
		return {
			user : this.props.user
		};
	},
	HandleClick : function(name){
		if(name == "头像")
		{}
		else if(name == "机构名称" || name == "联系方式" || name == "官方邮箱" || name == "官方网站")
			plus.webview.create('../views/page_editColumn.html',name,{top:"39px",bottom:"0px",width:"100%",background:"rgb(236,236,236)"}).show('slide-in-right',240);
		
	},
	render : function(){
		var distance = <div className="distance"></div>;
		return <div className="content">
			<EditHead user={this.state.user} HandleClick={this.HandleClick}/>
			<EditColumn pro={this.state.user.nickname}  properity="nickname"name="机构名称" HandleClick={this.HandleClick}/>
			<EditColumn pro={this.state.user.city} properity="city" name="地址" HandleClick={this.HandleClick}/>
			{distance}
			<EditColumn pro={this.state.user.principal} properity="principal" name="负责人" HandleClick={this.HandleClick}/>
			{/* 			<EditColumn pro={this.state.user.isVarified?"已认证":"未认证"} name="认证" HandleClick={this.HandleClick}/> */}
			<EditColumn pro={this.state.user.telephone} properity="telephone" name="联系方式" HandleClick={this.HandleClick}/>
			{distance}
			<EditColumn pro={this.state.user.email} properity="email" name="官方邮箱" HandleClick={this.HandleClick}/>
			<EditColumn pro={this.state.user.website} properity="website" name="官方网站" HandleClick={this.HandleClick}/>
		</div>;
	}
});

function headImg(){
	plus.nativeUI.actionSheet({title:"头像",cancel:"取消",buttons:[{title:"查看大头像"},{title:"更换头像"}]},function(e){
		if(e.index == 2)
		{
			Service.getPhoto(function(base64){
				Service.updateImg(base64,function(url){
					user.photo = url;
					$('#img').attr("src",url);
				});
			});
		}
		else if(e.index ==1)
		{
			var xurl = "../img/head.jpg";
			plus.webview.getWebviewById('imgLarge').evalJS("view('"+xurl+"')");
		}
	});
}
