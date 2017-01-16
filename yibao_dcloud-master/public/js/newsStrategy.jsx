var Strategy = React.createClass({
	getInitialState : function(){
		return {strategy : this.props.strategy};
	},
	addFavour : function(e){
		e.stopPropagation();
		var newstrategy = this.state.strategy;
		var that = this;
		if(!newstrategy.isFavour){
			mui.ajax({
				url : "http://pang.tunnel.yibaoedu.com:8080/setFavour",
				type : "post",
				data : {
					id : newstrategy._id,
					type : 'post'
				},
				success : function(result) {
					if(window.plus)
						plus.nativeUI.toast('收藏成功!');
					else
						console.log('Like success');
					newstrategy.isFavour = true;
					newstrategy.FavourNum ++;
					that.setState({strategy : newstrategy});
					
				}
			});
		}else{
			mui.ajax({
				url : "http://pang.tunnel.yibaoedu.com:8080/cancelFavour",
				type : "post",
				data : {
					_id : newstrategy._id,
					type : 'post'
				},
				success : function(result) {
					if(window.plus)
						plus.nativeUI.toast('取消收藏');
					else
						console.log('Cancel success');
					newstrategy.isFavour = false;
					newstrategy.FavourNum --;
					that.setState({strategy : newstrategy});					
				}
			});
		}
		
	},
	addDianzan : function(e){
		e.stopPropagation();
		var newstrategy = this.state.strategy;
		var that = this;
		if(!newstrategy.isDianzan){
			mui.ajax({
				url : "http://pang.tunnel.yibaoedu.com:8080/setDianzan",
				type : "post",
				data : {
					id : newstrategy._id,
					type : 'post'
				},
				success : function(result) {
					if(window.plus)
						plus.nativeUI.toast('点赞成功！');
					else
						console.log('Like success');
					newstrategy.isDianzan = true;
					newstrategy.likeNum ++;
					that.setState({strategy : newstrategy});				
				}
			});
		}else {
			mui.ajax({
				url : "http://pang.tunnel.yibaoedu.com:8080/cancelDianzan",
				type : "post",
				data : {
					id : newstrategy._id,
					type : 'post'
				},
				success : function(result) {
					if(window.plus)
						plus.nativeUI.toast('取消点赞');
					else
						console.log('Like success');
					newstrategy.isDianzan = false;
					newstrategy.likeNum --;
					that.setState({strategy : newstrategy});				
				}
			});
		}
		
	},
	render : function(){

		var isfavour = this.state.strategy.isFavour ? 'collection up' : 'collection down';
		var islove = this.state.strategy.isDianzan ? 'love up' : 'love down';
		return 	<div className="feed">
						<div className="card" id={this.state.strategy._id} title={this.state.strategy.title}>
							<div className="picture">
								<img src={this.state.strategy.picUrl}/>
								<div className="title">{this.state.strategy.title}</div>
							</div>
						</div>
						<div className="brief">	
							<div className="subtitle">
								{this.state.strategy.subtitle}
							</div>
							<hr/>
							<div className="comment">
							<div className="pageview">
								<i className="fa fa-eye"></i>
								<div className="text">
									{this.state.strategy.viewNum}
								</div>
							</div>
							<div className={islove} onClick={this.addDianzan}>
								<i className="fa fa-thumbs-o-up"></i>
								<div className="text">
									{this.state.strategy.likeNum}
								</div>
							</div>
							<div className={isfavour} onClick={this.addFavour}>
								<i className="fa fa-star"></i>
								<div className="text">
									{this.state.strategy.FavourNum}
								</div>
							</div>
						</div>
					</div> 
				</div>
				
	}
});
// 攻略列表 - 
var List = React.createClass({
	getInitialState : function(){
		return {list : []};
	},
	componentDidMount : function(){
		mui.ajax({
			type : "get",
			url : "http://pang.tunnel.yibaoedu.com:8080/postsByCategory/5643424a95804f136d5adec1",
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
			return <Strategy key={one._id} strategy={one}/>;
		});
		return <div>{list}</div>;
	}
});
