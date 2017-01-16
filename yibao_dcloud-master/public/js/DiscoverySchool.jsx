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
			url : baseUrl + "/cancelFollow",
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

	goToSchool : function() {
		var newsView = plus.webview.create('page_news_view.html','newsView',{top : 0, height: "39px"});
		newsView.evalJS("updateContent('"+this.props.discoverylist._id+"', '"+this.props.discoverylist.title+"')");
	},
	
	render : function(){
		var follow = this.state.discoverylist.isFollow ? 'display' : 'undisplay';
		var unfollow = this.state.discoverylist.isFollow ? 'undisplay' : 'display';
		return 	<div className="content" onClick={this.goToSchool}>
				<div className="feed">
				  <div className="schoolbar">
					<div className="profile">
						<img src={this.state.discoverylist.thumbUrl}/>
					</div>
					<div className="info">
						<span className="schoolname">{this.state.discoverylist.title}</span><br/>
						{/* <span className="schoolinfo">{this.state.discoverylist.address}&nbsp;{this.state.discoverylist.city}</span> */}
					</div>
					{/* <div className={unfollow}>
					<div className="addfollow" onClick={this.setFollow}>
					+关注
					</div>
					</div>
					<div className={follow}>
					<div className="followed" onClick={this.cancelFollow}>
					已关注
					</div>
					</div> */}
				  </div>
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
		var that = this;
		Service.getCatesByType("校考", function(err,cates) {
			if(err) return;
			console.log('here');
			//ajax
			mui.ajax({
				type : "post",
				url : baseUrl + "/itemsByCategory",
				data : {
					cateid : cates[0]._id,
					type : 'school'
				},
				success : function(data){
					that.setState({list : data.schoollist});
				}
			});	
		});
	},
	
	render : function(){
		var self = this;
		
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
		return 	<li className={className} onClick={this.props.clickOnCate.bind(null, this)}>{this.props.cate.name}</li>
	}
});
// 发现名师类别 列表 - 
var CateList = React.createClass({
	getInitialState : function(){
		return {catelist : [], selectedId : ""};
	},
	componentDidMount : function(){
		var that = this;
		Service.getCatesByType("校考", function(err,cates) {
			if(err) return;
			that.setState({catelist : cates, selectedId : cates[0]._id});
		});
	},
	clickOnCate : function(cateThis) {
		this.selectedId = cateThis.props.cate._id;
		this.setState({selectedId : this.selectedId});
		this.props.cateClickHandler(this.selectedId);
	},
	render : function(){
		var self = this;
		
		var list = this.state.catelist.map(function(one, i){
			return <Cate key={one._id} cate={one} selected={one._id == self.state.selectedId} clickOnCate={self.clickOnCate}/>;
		});
		return <div>{list}</div>;
	}
});
