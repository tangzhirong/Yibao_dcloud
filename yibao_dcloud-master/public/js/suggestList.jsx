var SuggestTab = React.createClass({
	getInitialState : function(){
		return {select : 0}
	},
	render : function(){
		return <div className="tab">
					<div id="tab-all" className={this.state.select==0? 'focused' : ' unfocused'} onClick={getStudentList(0)}>
						推荐画霸
					</div>
					<div id="tab-comment" className={this.state.select==1? 'focused' : ' unfocused'} onClick={getStudentList(1)}>
						人气名师
					</div>
					<div id="tab-state" className={this.state.select==2? 'focused' : ' unfocused'} onClick={getStudentList(2)}>
						热门画室
					</div>
				</div>
				
	}
});

var SuggestColumn = React.createClass({
	getInitialState : function(){
		return {
			follow :false
		};
	},
	HandleClick : function(){
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
						that.setState({follow : true});
			}.bind(this)
		});
	},
	render : function(){
		var unit = this.props.user.role == "TEACHER"? <span className="unit">（画室老师）</span>:
		<span>xinsh</span>;
		var fol = this.state.follow ? "已关注":"+关注";
		return 	<div className="master-comments">
					<div className="feed">
						<div className="master-info">
							<div className="profile">
								<img src="../img/head.jpg" height="100%" width="100%"/>
								<div className="v"></div>
							</div>
							<div className="info">
								<span className="name">{this.props.user.nickname}</span>
								{unit}
								<br/>
								<span className="info-infor">{this.props.user.address}&nbsp;{this.props.user.city}&nbsp;{this.props.user.studio}&nbsp;</span>
								<br/>
								<span className="info-infornext"><small>点评 2000</small>&nbsp;&nbsp;&nbsp;<small>粉丝 2000</small></span>
							</div>
							<div className="addfollow" onClick={this.HandleClick}>
								{fol}
							</div>
						</div>
						<div className="picture">
							<img src={this.props.user.picUrl}/>
							<img src={this.props.user.picUrl}/>
							<img src={this.props.user.picUrl}/>
							<img src={this.props.user.picUrl}/>
							<img src={this.props.user.picUrl}/>
						</div>
					</div>
				</div>	
	}
});

var SuggestColumnList = React.createClass({
	render : function(){  
		var userlist = this.props.userlist.map(function(one,i){
			return <SuggestColumn user={one}/>;
		});
			return <div>{userlist}</div>;
	}
});

var SuggestContent = React.createClass({
	getInitialState : function(){ 
		return {userlist : [],
				user : this.props.user
		};
	},
	componentDidMount : function(){
		var that = this;
		console.log(that);
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/hotTeacher",
			type: 'get',
			success : function(data){
				that.setState({userlist : data.teacher_works});
				console.log(JSON.stringify(data.teacher_works));
			}.bind(this)
		});
		var self = this;
	},
	render : function(){
		return <SuggestColumnList userlist={this.state.userlist}/>;
	}
});
