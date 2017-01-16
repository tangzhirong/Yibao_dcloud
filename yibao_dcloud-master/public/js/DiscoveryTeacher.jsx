var baseUrl = localStorage.getItem('baseUrl');
var DiscoveryList = React.createClass({
	getInitialState : function(){
		return {discoverylist : this.props.discoverylist};
	},
	setFollow : function(e){
		
		e.stopPropagation();
		var newdiscoverylist = this.state.discoverylist;
		var that = this;
		mui.ajax({
			url :  baseUrl + "/setFollow",
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
			url :  baseUrl + "/cancelFollow",
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
		var me = plus.webview.create("page_home_page_teacher.html#/id/"+this.state.discoverylist._id, 'homepage');
		setTimeout(function() {
			me.show('pop-in', 150);
		}, 250);
	},
	
	render : function(){
		var follow = this.state.discoverylist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.discoverylist.isFollow ? 'undisplay' : 'display';
		return 	<div className="feed">
					<div className="teacherbar" onClick={this.goDetail}>
						<div className="profile">
						  <img src={this.state.discoverylist.photo}/>
						</div>
						<div className="info">
							<p className="teachername">{this.state.discoverylist.nickname}</p>
							<p className="teacherinfo">
								{/* {this.state.discoverylist.address}&nbsp;{this.state.discoverylist.city}&nbsp; */}
								{this.state.discoverylist.studio}
							</p>
							<p className="teacherstate">点评&nbsp;{this.state.discoverylist.commentNum}&nbsp;&nbsp;&nbsp;&nbsp;粉丝&nbsp;{this.state.discoverylist.fansNum}</p>
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
				</div>
	}
});
// 发现名师 列表 - 
var List = React.createClass({
	getInitialState : function() {
		return {list : []};
	},
	updateContent : function(e, cateid) {
		var cateid = e.detail.cateid || cateid;
		mui.ajax({
			type : "post",
			url : baseUrl + "/itemsByCategory",
			data : {
				cateid : cateid,
				type : 'user'
			},
			success : function(data){
				this.setState({list : data.userlist});
			}.bind(this)
		});
	},
	componentDidMount : function(){
		this.updateContent({detail : {}}, "564a91b09efd30d81bf13f56");
		window.addEventListener('CLICK_CATE', this.updateContent);
	},
	componentWillUnmount : function() {
		window.removeEventListener('CLICK_CATE', this.updateContent);
	},
	render : function(){
		var list = this.state.list.map(function(one, i){
			return <DiscoveryList key={one._id} discoverylist={one} />;
		});
		return <div>{list}</div>;
	}
});
// category
var Cate = React.createClass({
	render : function(){
		var className = this.props.selected ? "sidefocused" : "";
		return 	<li data-id={this.props.cate._id} className={className}>{this.props.cate.name}</li>
	}
});
// 发现名师类别 列表 - 
var CateList = React.createClass({
	getInitialState : function(){
		return {catelist : [], selectedId : ""};
	},
	componentDidMount : function(){
		var that = this;
		Service.getCatesByType(this.props.cateName, function(err,cates) {
			if(err) return;
			that.setState({catelist : cates, selectedId : cates[0]._id});
		});
		var node = ReactDOM.findDOMNode(this);
		mui(node).on('tap', 'li',function(e) {
			var cateid = this.getAttribute('data-id');
			that.setState({selectedId : cateid});
			var event = new CustomEvent('CLICK_CATE', {detail : {cateid : cateid }});
			window.dispatchEvent(event);
		});
	},
	render : function(){
		var list = this.state.catelist.map(function(one, i){
			return <Cate key={one._id} cate={one} selected={one._id == this.state.selectedId}/>;
		}.bind(this));
		return <div>{list}</div>;
	}
});
