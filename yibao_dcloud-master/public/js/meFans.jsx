var baseUrl = localStorage.getItem("baseUrl") || "http://pang.tunnel.yibaoedu.com:8080";
var Fans = React.createClass({
	getInitialState : function(){
		return {fanslist : this.props.fans};
	},
	componentWillReceiveProps : function(nextProps){
		this.setState({fanslist : nextProps.fans})
	},
	turnToFollow : function(e){
		console.log("addFollow");
		e.stopPropagation();
		var that = this;
		mui.ajax({
			url : baseUrl + "/setFollow",
			data :{
				"followed_id" : that.state.fanslist.follower._id,
				"type" : "user"
			},
			type: 'post',
			success : function(data){
				console.log(JSON.stringify(data));
				if(data.msg == "ok")
				{
					var newfollowlist = that.state.fanslist;
					newfollowlist.isFollow = true;
					that.setState({fanslist :newfollowlist});
				}
			}.bind(this),
			error : function(data){
				console.log(JSON.stringify(data));
			}
		});
	},
	turnToUnFollow : function(e){
		console.log("addFollow");
		e.stopPropagation();
		var that = this;
		mui.ajax({
			url : baseUrl + "/cancelFollow",
			data :{
				"followed_id" : that.state.fanslist.follower._id,
				"type" : "user"
			},
			type: 'post',
			success : function(data){
				console.log(JSON.stringify(data));
				if(data.msg == "ok")
				{
					var newfollowlist = that.state.fanslist;
					newfollowlist.isFollow = false;
					that.setState({fanslist :newfollowlist});
				}
			}.bind(this),
			error : function(data){
				console.log(JSON.stringify(data));
			}
		});
	},
	HandleClick : function(){
		var role = this.state.fanslist.follower.role;
		var userid = this.state.fanslist.follower._id;
		console.log(role);
		console.log(userid);
		var webview_style = {
			popGesture: "close"
		};
		var id, url;
		if(role == "STUDENT"){
			console.log(101);
			id =  "page_home_student.html";
			url = "page_home_student.html#/id/"+userid;
			console.log(url);
		}else if(role == "TEACHER"){
			console.log(100);
			id =  "page_home_page_teacher.html";
			url =  "page_home_page_teacher.html#/id/"+userid;
			console.log(100);
		}else{
			plus.nativeUI.toast("您的身份信息有误！");
			return;
		}
		mui.openWindow({
			id: id,
			url: url,
			styles: webview_style,
			show: {
				aniShow: "pop-in",
				duration : 400
			},
			waiting: {
				autoShow: true
			}
		});
		console.log(100);
	},
	render : function(){
		var studentSelect = this.state.fanslist.follower.role == "STUDENT" ? 'display' : 'undisplay';
		var teacherSelect = this.state.fanslist.follower.role == "STUDENT" ? 'undisplay' : 'display';
		var follow = this.state.fanslist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.fanslist.isFollow ? 'undisplay' : 'display';
		var roleString = this.state.fanslist.follower.role == "STUDNET" ? "老师":"学生";
		console.log(roleString);
		console.log(this.state.fanslist.follower._id);
		if(this.state.fanslist.follower.role == "STUDENT"){
			console.log(this.state.fanslist.follower.role);
			var role = this.state.fanslist.follower.role;
			return <div className={studentSelect}>
					<div className="feed" onClick={this.HandleClick}>
						<div className="master-info">
							<div className="profile">
								<img src={this.state.fanslist.followerPhoto}/>
							</div>
							<div className="info">
								<span className="name">{this.state.fanslist.followerName}</span>&nbsp;
								<br/>
								<span className="info-infor">{this.state.fanslist.follower.address}&nbsp;{this.state.fanslist.follower.city}&nbsp;<small>{!this.state.fanslist.follower.follownum?"0":this.state.fanslist.follower.follownum}人关注</small></span>
						</div>
						<div className={unfollow}>
							<div className="addfollow" onClick={this.turnToFollow}>
								+关注
							</div>
						</div>
						<div className={follow}>
							<div className="followed" onClick={this.turnToUnFollow}>
								取消
							</div>
						</div>
					</div>			
				</div>
			</div>;
		}else{	
			return <div className={teacherSelect}>
					<div className="feed" onClick={this.HandleClick}>
						<div className="teacherbar">
							<div className="profile" onClick={this.HandleClick}>
							  <img src={this.state.fanslist.follower.photo}/>
							</div>
							<div className="info">
							  <span className="teachername">{this.state.fanslist.follower.nickname}</span>&nbsp;&nbsp;
							  <span className="small">老师</span>
								<br/>
							  <span className="teacherinfo">{this.state.fanslist.follower.address}&nbsp;{this.state.fanslist.follower.city}&nbsp;{this.state.fanslist.follower.graduate_school}</span><br/>
							  <span className="small">点评&nbsp;{this.state.fanslist.follower.commentNum}&nbsp;&nbsp;粉丝&nbsp;{this.state.fanslist.follower.fansNum}</span>
							</div>
							<div className={unfollow}>
								<div className="addfollow" onClick={this.turnToFollow}>
									+关注
								</div>
							</div>
						</div>
						<div className={follow}>
							<div className="followed" onClick={this.turnToUnFollow}>
								取消
							</div>
						</div>
					</div>
			</div>;
		}
	}
});
// 粉丝列表 - 
var FansList = React.createClass({
	getInitialState : function(){
		return {list : []};
	},
	componentDidMount : function(){
		var that = this;
		mui.ajax({
			url : baseUrl + "/fans?debugid=565a816dae1ce988100a811c",
			success : function(data){
				console.log(JSON.stringify(data));
				that.setState({list : data.fanslist});
			}.bind(this),
			error : function(err){
				console.log(JSON.stringify(err));
			}
		});
		var self = this;
	},
	render : function(){
		var self = this;
		var list = this.state.list.map(function(one, i){
			return <Fans key={one._id} fans={one} />;
		});
		return <div>{list}</div>;
	}
});
