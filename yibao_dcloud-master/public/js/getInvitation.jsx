var GetInvitation = React.createClass({
	getInitialState : function(){
		return {
			invitation : this.props.invitation,
			user : {},
			work : {}
		};
	},
	HandleClick : function(){
		//前往精准点评界面
	},
	componentDidMount : function(){
		console.log(JSON.stringify(this.state.invitation));
		var that = this;
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/workInfo/"+that.state.invitation.content._id,
			success : function(data){
				if(data.msg == 'ok')
					that.setState({work : data.work});
			}.bind(this)
		});
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/userInfoById",
			data : {
				_id : that.state.invitation.publish_user
			},
			success : function(data){
				if(data.msg == 'ok')
					that.setState({user : data.user});
			}.bind(this)
		});
		var self = this;
	},
	render : function(){
		var time = HQDate(this.state.invitation.publish_time);
		return  <div className="column" onClick={this.HandleClick}>
					<div className="head-portrait">
						<div className="head-img"></div>
						<div className="class">LV{this.state.user.degree}</div>
						<div className="notice"></div>
					</div>
					<div className="info">
						<div className="info-name">
							{this.state.user.nickname}
						</div>
						<br />
						<div className="info-time">{time}</div>
					</div>
					<div className="invitation">
						<div className="text">邀请您点评画作</div>
					</div>
					<img src={this.state.work.picUrl} height="47px"/>
				</div>;
	}
});
var GetInvitationList = React.createClass({
	getInitialState : function(){
		return {InvitationList : []};
	},
	componentDidMount : function(){
		var that = this;
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/messageInvite",
			success : function(data){
				if(data.msg == 'ok')
					that.setState({InvitationList : data.messagelist});
			}.bind(this)
		});
		var self = this;
	},
	render : function(){
		var self = this;
		var list = this.state.InvitationList.map(function(one, i){
			return <GetInvitation invitation={one} key={i}/>;
		});
		var nothing = <div className="nothing">
						您还未收到任何邀请
					</div>;
		var lists = this.state.InvitationList.length != 0? list : nothing;
		return <div>{list}</div>;
	}
});