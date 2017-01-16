if(!window.baseUrl)
	window.baseUrl = localStorage.getItem('baseUrl');

var Zixun = React.createClass({
	getInitialState : function(){
		return {zixun : this.props.zixun};
	},
	addFavour : function(e){
		e.stopPropagation();
		var newzixun = this.state.zixun;
		var that = this;
		mui.ajax({
			url : baseUrl + "/setFavour",
			type : "post",
			data : {
				id : newzixun._id,
				type : 'post'
			},
			success : function(result) {
				if(window.plus)
					plus.nativeUI.toast('收藏成功!');
				else
					console.log('Like success');
				newzixun.isFavour = true;
				newzixun.FavourNum ++;
				that.setState({zixun : newzixun});
				
			}
		});
	},
	cancelFavour : function(e){
		e.stopPropagation();
		var newzixun = this.state.zixun;
		var that = this;
		mui.ajax({
			url : baseUrl + "/cancelFavour",
			type : "post",
			data : {
				_id : newzixun._id,
				type : 'post'
			},
			success : function(result) {
				if(window.plus)
					plus.nativeUI.toast('取消收藏');
				else
					console.log('Cancel success');
				newzixun.isFavour = false;
				newzixun.FavourNum --;
				that.setState({zixun : newzixun});
				
			}
		});
	},
	render : function(){
		var follow = this.state.zixun.isFavour ? 'display' : 'undisplay';
		var unfollow = this.state.zixun.isFavour ? 'undisplay' : 'display';
		var viewItemClickHandler = this.props.viewArticleClickHandler || function(){};
		return 	<div className="feed" onClick={viewItemClickHandler.bind(this)}>
					<div className="consult-bar">
					  	<div className="profile">
							<img src={this.state.zixun.thumbUrl}/>
					  	</div>
					  	<div className="consult-info">
							<div className="title">{this.state.zixun.title}</div>
							<div className="time">{this.state.zixun.createTime}</div>
					  	</div>
					  	<div className={unfollow}>
							<div className="addfollow" onClick={this.addFavour}>
								收藏
							</div>
						</div>
						<div className={follow}>
							<div className="followed" onClick={this.cancelFavour}>
								已收藏
							</div>
						</div>
					</div>
				</div>
	}
});

// 资讯列表 - 
var List = React.createClass({
	getInitialState : function(){
		return {list : []};
	},
	componentDidMount : function(){
		mui.ajax({
			type:"get",
			url : baseUrl + "/postsByCategory/564a89b3e7aa481418b09864",
			dataType : "json",
			success : function(data){
				this.setState({list : data.postlist});
			}.bind(this)
		});
		var self = this;
	},
	
	render : function(){
		var self = this;
		
		var list = this.state.list.map(function(one, i){
			return <Zixun key={one._id} zixun={one} viewArticleClickHandler={self.props.viewArticleClickHandler}/>;
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
		var list = document.querySelectorAll("#page-sidebar-content li");
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
// 类别列表 - 
var CateList = React.createClass({
	getInitialState : function(){
		return {catelist : []};
	},
	componentDidMount : function(){
		var that = this;
		Service.getCatesByType('艺考咨讯',function(err,catelist) {
			that.setState({catelist : catelist});
		})
	},
	
	render : function(){
		var self = this;
		
		var list = this.state.catelist.map(function(one, i){
			return <Cate key={one._id} cate={one} cateClickHandler={self.props.cateClickHandler}/>;
		});
		return <div>{list}</div>;
	}
});
