var DiscoveryList = React.createClass({
	getInitialState : function(){
		return {discoverylist : this.props.discoverylist};
	},
	render : function(){
		return 	<div className="content">
				<div className="feed">
				  <div className="studiobar">
					<div className="profile">
					  <img src={this.state.discoverylist.photo}/>
					</div>
					<div className="info">
					  <span className="studioname">{this.state.discoverylist.nickname}</span><br/>
					  <span className="studioinfo">{this.state.discoverylist.address}&nbsp;{this.state.discoverylist.city}</span><br/>
					  <span className="studiostate">报名&nbsp;{this.state.discoverylist.apply}&nbsp;&nbsp;粉丝&nbsp;{this.state.discoverylist.fansNum}</span>
					</div>
					<div className="ranking">
					  {this.state.discoverylist.ranking}
					</div>
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
		mui.ajax({
			type : "post",
			url : "http://pang.tunnel.yibaoedu.com:8080/itemsByCategory",
			data : {
				cateid : "564a92833159d8a032da16ab",
				type : 'user'
			},
			success : function(data){
				this.setState({list : data.userlist});
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
// category
var Cate = React.createClass({
	getInitialState : function(){
		return {cate : this.props.cate};
	},
	changeStyle : function(e){
		var list = document.querySelectorAll("#page-tab2sidebar-content li");
		for(var i = 0; i<list.length; i++){
			list[i].className="";
		}
		e.target.className += ' sidefocused';
		this.props.cateClickHandler.call(this);
	},
	render : function(){
		return 	<li onClick={this.changeStyle}>{this.state.cate.name}</li>
	}
});
// 发现类别 列表 - 
var CateList = React.createClass({
	getInitialState : function(){
		return {catelist : []};
	},
	componentDidMount : function(){
		mui.ajax({
			type : "get",
			url : "http://pang.tunnel.yibaoedu.com:8080/categoryByType/画室",
			dataType : "json",
			success : function(data){
				this.setState({catelist : data.categorys});
			}.bind(this)
		});
		var self = this;
	},
	
	render : function(){
		var self = this;
		
		var list = this.state.catelist.map(function(one, i){
			return <Cate key={one._id} cate={one} cateClickHandler={self.props.cateClickHandler}/>;
		});
		return <div>{list}</div>;
	}
});