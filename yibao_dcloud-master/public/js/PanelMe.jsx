
/* 头像信息 */
var Head = React.createClass({
	render : function(){
		var rank = this.props.user.role == "STUDENT"? <div className="rank">{this.props.user.degree}</div>
			: <div></div>;
		var v = this.props.user.is_qualified? <div className="v"></div>
			: <div></div>;
		return <div className="head">
       			<div className="headPortrait"><img src={this.props.user.photo || '../img/logo.png'} width="100%"/></div>
      		</div>;
	}
});

/* 用户信息栏 : 姓名，地区等信息 */
var Infor = React.createClass({
	render : function(){
		var isStudent = this.props.user.role == "STUDENT" ? true : false;
		var school = isStudent? <span></span> 
			: <span className="school">{this.props.user.studio}</span>;
		<div></div>;
		return <div className="info">
			<div className="name">{this.props.user.nickname}</div>
			<div className="address">
				<span className="district">{this.props.user.address}</span>
				<span className="city">{this.props.user.city}&nbsp;</span>
				{school}
			</div>
		</div>;
	}
});

/* 统计信息栏 */
var MeTab = React.createClass({
	render : function(){
		var tab = this.props.user.role == "STUDENT" ?
			<div><div className="min-tab works">
				<div className="num">{this.props.user.workNum==undefined? 0 : this.props.user.workNum}
				</div>
				<div className="text">画作</div>
			</div>
			<div className="min-tab focus">
				<div className="num">{this.props.user.followNum==undefined? 0 : this.props.user.followNum}
				</div>
				<div className="text">关注
				</div>
			</div>
			<div className="min-tab fan">
				<div className="num">{this.props.user.fansNum==undefined? 0 : this.props.user.fansNum}
				</div>
				<div className="text">粉丝
				</div>
			</div>
			</div>
			: 
			<div>
				<div className="comment">
					<div className="num">{this.props.user.commentNum==undefined? 0 : this.props.user.commentNum}
					</div>
					<div className="text">已点评
					</div>
				</div>
				<div className="fans">
					<div className="num">{this.props.user.fansNum==undefined? 0 : this.props.user.fansNum}
					</div>
					<div className="text">粉丝
					</div>
				</div>
				<div className="flowers">
					<div className="num">{this.props.user.flowerNum==undefined? 0 : this.props.user.flowerNum}
					</div>
					<div className="text">鲜花
					</div>
				</div>
				<div className="favour">
					<div className="num">{this.props.user.favourNum==undefined? 0 : this.props.user.favourNum}
					</div>
					<div className="text">赞
					</div>
				</div>
			</div>;
		return <div className="tab">{tab}</div>;
	}
});

/* 个人信息展示栏 */
var MeCard = React.createClass({
	go : function(){
		plus.webview.create('../views/page_editInfo.html','editInfo_contain').show('pop-in');
	},
	render : function(){
		if(!this.props.user)
			return null;
		var photo = this.props.user.photo.split('/');
		photo = photo[photo.length-1];
		var src = "http://yibao.img-cn-beijing.aliyuncs.com/"+photo+"@50-50bl";
		return <div>
				<div className="card-template">
				<img src={src} id="head" width="100%"/>
				<div className="gray"></div>
	  				<div className="card">
	  					<div className="editTitle" onClick={this.go}>
							<i className="fa fa-edit" >  
							</i>
						</div>
						<Head user={this.state.user}/>
						<Infor user={this.state.user}/>
						<MeTab user={this.state.user}/>
					</div>
				</div>
		</div>;
	}
});

var HomeCard = React.createClass({
	getInitialState : function(){
		return {isFollow : false}
	},
	go : function(){
		plus.webview.currentWebview().close();
	},
	HandleClick : function(){
		var that = this;
		var leafUrl;
		if(that.state.isFollow)
			leafUrl = "/cancelFollow";
		else
			leafUrl = "/setFollow";
		mui.ajax({
			url : baseUrl + leafUrl,
			data :{
				followed_id : this.props.user._id,
				type : "user"
			},
			type: 'post',
			success : function(data){
				console.log(JSON.stringify(data));
				if(data.msg == "ok")
					{
						if(leafUrl == "/cancelFollow"){
							that.setState({isFollow : false});
							plus.nativeUI.toast("取消关注");
						}else{
							that.setState({isFollow : true});
							plus.nativeUI.toast("关注成功");
						}
					}
			}.bind(this)
		});
	},
	componentDidMount : function(){
		var that = this;
		mui.ajax({
			url : baseUrl + '/isFollow/'+this.props.user._id,
			success : function(data){
				console.log(data.isFollow);
				if(data.isFollow)
						that.setState({isFollow : true});
			},
			error : function(err){
				console.log(JSON.stringify(err));
			}
		});
	},
	render : function(){

		if(!this.props.user)
			return null;
		
		var photo = this.props.user.photo.split('/');
		photo = photo[photo.length-1];
		var src = "http://yibao.img-cn-beijing.aliyuncs.com/"+photo+"@50-50bl";
		var follow = this.state.isFollow? <i className="fa fa-user-times celFollowBtn" onClick={this.HandleClick}></i>
					: <i className="fa fa-user-plus setFollowBtn" onClick={this.HandleClick}></i>;
		var followBtn = this.props.editable? <div className="setFollowBtn"></div>
						:<div>{follow}</div>;
		return <div>
			<div className="card-template">
				<img src={src} id="head" width="100%"/>
				<div className="gray-card" width="100%/"></div>
	  			<div className="card">
	  				<div className="editTitle" onClick={this.go}>
						<i className="fa fa-angle-left" >
						</i>
					</div>
					{followBtn}
					<div className="head-info">
						<Head user={this.props.user}/>
						<Infor user={this.props.user}/>
					</div>
						<MeTab user={this.props.user}/>
					<div className="setFollow">个性签名：{this.props.user.signature?this.props.user.signature : "主人挺懒的，还没有个性签名哦！"}
					</div>
				</div>
			</div>
		</div>;
	}
});
