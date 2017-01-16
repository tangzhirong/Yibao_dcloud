var baseUrl = localStorage.getItem('baseUrl') || "http://pang.tunnel.yibaoedu.com:8080";
var FollowList = React.createClass({
	getInitialState : function(){
		return {followlist : this.props.followlist};
	},
	turnToFollow : function(){
		var that = this;
		mui.ajax({
			url : baseUrl + "/setFollow",
			data :{
				followed_id : this.state.followlist._id,
				type : "user"
			},
			type: 'post',
			success : function(data){
				if(data.msg == "ok")
					{
						var newfollowlist = that.state.followlist;
						newfollowlist.isFollow = true;
						that.setState({followlist :newfollowlist});
					}
			}.bind(this)
		});
	},
	turnToUnFollow : function(){
		var that = this;
		mui.ajax({
			url : baseUrl + "/cancelFollow",
			data :{
				followed_id : this.props.followlist._id,
				type : "user"
			},
			type: 'post',
			success : function(data){
				console.log(JSON.stringify(data));
				if(data.msg == "ok")
					{
						var newfollowlist = that.state.followlist;
						newfollowlist.isFollow = false;
						that.setState({followlist :newfollowlist});
					}
			}.bind(this)
		});
	},
	HandleClick : function(){
		var me = plus.webview.create("page_home_page_teacher.html#/id/"+this.state.followlist.followed._id, 'homepage');
		setTimeout(function() {
			me.show('pop-in', 150);
		}, 250);
		
	},
	componentDidMount : function(){
		var newfollowlist = this.state.followlist;
		newfollowlist.isFollow = this.props.follow;
		this.setState({followlist : newfollowlist});
	},
	render : function(){
		return 	<div className="feed">
			<div className="teacherbar"  onClick={this.HandleClick}>
						<div className="profile">
							<img src={this.state.followlist.followed.photo}/>
						</div>
						<div className="info">
							<span className="teachername">{this.state.followlist.followed.nickname}</span><br/>
							<span className="teacherinfo">{this.state.followlist.followed.address}&nbsp;{this.state.followlist.followed.city}&nbsp;{this.state.followlist.followed.studio}</span><br/>
							<span className="teacherstate">点评&nbsp;{this.state.followlist.followed.comment}&nbsp;&nbsp;粉丝&nbsp;{this.state.followlist.followed.fansnum}</span>
						</div>
						<div>
							<div className="followed" onClick={this.turnToUnFollow}>
								取消关注
							</div>
						</div>
					</div>
				</div>
	}
});
// 发现名师 列表 - 
var List = React.createClass({
	getInitialState : function(){
		return {list : [],follow : this.props.follow};
	},
	componentDidMount : function(){
		var url;
		var that = this;
		url = baseUrl + "/followTeachers?debugid=565a816dae1ce988100a811c";
		mui.ajax({
			url : url,
			success : function(data){
				that.setState({list : data.ftlist});
				plus.nativeUI.closeWaiting();
			}.bind(this),
			error : function(err){
				plus.nativeUI.closeWaiting();
				plus.nativeUI.toast("网络错误");
			}
		});
		var self = this;
	},
	
	render : function(){
		var self = this;		
		var list = this.state.list.map(function(one, i){
			return <FollowList key={one._id} follow={self.state.follow} followlist={one} />;
		});
		return <div>{list}</div>;
	}
});
