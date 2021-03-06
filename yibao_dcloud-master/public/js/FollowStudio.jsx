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
		var user;
		var newsView = plus.webview.create('../views/page_visit_studio.html','visit_studio');
		newsView.evalJS();
		newsView.show('slide-in-right',240);
	},
	render : function(){
		var follow = this.state.followlist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.followlist.isFollow ? 'undisplay' : 'display';
		return 	<div className="content">
				<div className="feed">
				  <div className="studiobar">
					<div className="profile" onClick={this.HandleClick}>
					  <img src={this.state.followlist.profile}/>
					</div>
					<div className="info">
					  <span className="studioname">{this.state.followlist.nickname}</span><br/>
					  <span className="studioinfo">{this.state.followlist.district}&nbsp;{this.state.followlist.city}</span><br/>
					  <span className="studiostate">报名&nbsp;{this.state.followlist.apply}&nbsp;&nbsp;粉丝&nbsp;{this.state.followlist.fansnum}</span>
					</div>
					<div className={unfollow}>
						<div className="addfollow" onClick={this.turnToFollow}>
							+关注
						</div>
					</div>
					<div className={follow}>
						<div className="followed" onClick={this.turnToUnFollow}>
							关注
						</div>
					</div>
				  </div>
				</div>
			</div>	
	}
});
// 发现画室列表 - 
var List = React.createClass({
	getInitialState : function(){
		return {list : [],
				follow : this.props.follow};
	},
	componentDidMount : function(){
		var url = "";
		if(this.state.follow)
			url = "http://pang.tunnel.yibaoedu.com:8080/followStudios";	
		else
			url = "http://pang.tunnel.yibaoedu.com:8080/hotStudio";	
		mui.ajax({
				url : url,
				dataType : "json",
				success : function(data){
					this.setState({list : data});
				}.bind(this)
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