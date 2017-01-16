var FollowList = React.createClass({
	getInitialState : function(){
		return {followlist : this.props.followlist};
	},
	turnToFollow : function(){
		var that = this;
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/setFollow",
			data :{
				followed_id : this.props.user._id,
				type : "user"
			},
			type: 'post',
			success : function(data){
				console.log(JSON.stringify(data));
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
			url : "http://pang.tunnel.yibaoedu.com:8080/setFollow",
			data :{
				followed_id : this.props.user._id,
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
		var user = followlist;
		var webview = plus.webview.create('../views/page_visit_student.html');
		webview.evalJS("setUser('"+user+"')");
		webview.show('slide-in-right',240);
	},
	render : function(){
		var follow = this.state.followlist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.followlist.isFollow ? 'undisplay' : 'display';
		return 	<div className="master-comments">
					<div className="feed">
						<div className="master-info">
							<div className="profile" onClick={this.HandleClick}>
								<img src={this.state.followlist.profile}/>
							</div>
							<div className="info">
								<span className="name">{this.state.followlist.nickname}</span>
								<span className="small">({this.state.followlist.grade})</span><br/>
								<span className="info-infor">{this.state.followlist.province}&nbsp;{this.state.followlist.city}&nbsp;<small>{this.state.followlist.follownum}人关注</small></span>
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
				</div>	
	}
});
// 发现名师 列表 - 
var List = React.createClass({
	getInitialState : function(){
		return {list : [],
				follow : this.props.follow};
	},
	componentDidMount : function(){
		var url = "";
		var that = this;
		if(undefined == plus.webview.getWebviewById('main-menu.html'))
			url = baseUrl + "/hotMaster";
		else
			url = baseUrl + "/followMasters";
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
			return <FollowList key={one._id} followlist={one} />;
		});
		return <div>{list}</div>;
	}
});