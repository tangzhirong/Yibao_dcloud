var DiscoveryList = React.createClass({
	getInitialState : function(){
		return {discoverylist : this.props.discoverylist};
	},
	setFollow : function(e){
		
		e.stopPropagation();
		var newdiscoverylist = this.state.discoverylist;
		var that = this;
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/setFollow",
			type : "post",
			data : {
				followed_id : newdiscoverylist._id,
				type : 'user'
			},
			success : function(result) {
				if(window.plus)
					plus.nativeUI.toast('关注成功!');
				else
					console.log('Like success');
				newdiscoverylist.isFollow = true;
				newdiscoverylist.fansNum ++;
				that.setState({discoverylist : newdiscoverylist});
				
			}
		});
	},
	cancelFollow : function(e){
		
		e.stopPropagation();
		var newdiscoverylist = this.state.discoverylist;
		var that = this;
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/cancelFollow",
			type : "post",
			data : {
				followed_id : newdiscoverylist._id,
				type : 'user'
			},
			success : function(result) {
				if(window.plus)
					plus.nativeUI.toast('取消关注');
				else
					console.log('Cancel success');
				newdiscoverylist.isFollow = false;
				newdiscoverylist.fansNum --;
				that.setState({discoverylist : newdiscoverylist});
				
			}
		});
	},

	
	goDetail : function() {
		var me = plus.webview.create("page_home_student.html#/id/"+this.state.discoverylist._id, 'homepage');
		setTimeout(function() {
			me.show('pop-in', 150);
		}, 250);
	},
	
	render : function(){
		var follow = this.state.discoverylist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.discoverylist.isFollow ? 'undisplay' : 'display';
		return 	<div className="master-comments">
					<div className="feed">
						<div className="master-info" onClick={this.goDetail}>
							<div className="profile">
								<img src={this.state.discoverylist.photo}/>
							</div>
							<div className="info">
								<span className="name">{this.state.discoverylist.nickname}</span>
								<span className="small">({this.state.discoverylist.degree})</span><br/>
								<span className="info-infor">{this.state.discoverylist.address}&nbsp;{this.state.discoverylist.city}&nbsp;<small>{this.state.discoverylist.followNum}人关注</small></span>
							</div>
							<div className={unfollow}>
								<div className="addfollow" onClick={this.setFollow}>
									+关注
								</div>
							</div>
							<div className={follow}>
								<div className="followed" onClick={this.cancelFollow}>
									已关注
								</div>
							</div>
						</div>
						<PicList picList={this.props.discoverylist.work}/>
					</div>
				</div>	
	}
});
// 发现名师 列表 - 
var List = React.createClass({
	getInitialState : function(){
		return {list : []};
	},
	componentDidMount : function(){
		mui.ajax({
			type : "get",
			url : "http://pang.tunnel.yibaoedu.com:8080/HotMaster",
			dataType : "json",
			success : function(data){
				this.setState({list : data.master_works});
			}.bind(this)
		});
		var self = this;
	},
	
	render : function(){
		var self = this;
		
		var list = this.state.list.map(function(one, i){
			return <DiscoveryList key={one._id} discoverylist={one} />;
		});
		return <div>{list}</div>;
	}
});

var Pic = React.createClass({
	getInitialState : function() {
		return {pic : this.props.pic};
	},
	render : function() {
		return <img src={this.state.pic.picUrl}/>;
	}
});

var PicList = React.createClass({
	getInitialState : function() {
		return {picList : this.props.picList};
	},
	render : function() {
		if(!this.state.picList)
			return null;
		var list = this.state.picList.map(function(pic,i) {
			if(!pic.picUrl)
				return null;
			return <Pic key={i} pic={pic}></Pic>;
		});
		return  <div className="picture">
			{list}
		</div>;
	}
});
