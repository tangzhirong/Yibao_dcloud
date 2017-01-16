
// 一个collection内容
var Collection = React.createClass({
	render : function(){
		var type = this.props.item.type;
		var item = this.props.item;
		var typeMap = {
			'feed' : function() {
				return 	<div className="feed" data-id={item.feedid}>
					<div className="content">
						<div className="head-portrait">
							<img src={"../img/logo.png"} />
						</div>
						<div className="title">{item.feedOwnerNickname}</div>
						<img src={item.feedPhoto} className="work"/>
					</div>
				</div>;	
			},
			'post' : function() {
				return <div className="post" data-id={item.postid}>
					<div className="content">
						<div className="title">{item.postTitle}</div>
						<img src={item.postPic} className="work"/>
					</div>
				</div>
			}
		};

		return typeMap[type]();
	}
});
// Collection 列表 - 
var CollectionList = React.createClass({
	getInitialState : function(){
		return {collectionList : []};
	},
	componentDidMount : function(){
		mui.ajax({
			//url : baseUrl + "/favours/all?debugid=565a816dae1ce988100a811c",
			url : baseUrl + "/favours/all",
			dataType : "json",
			success : function(data){
				this.setState({collectionList : data.favours});
			}.bind(this)
		});

		var list = ReactDOM.findDOMNode(this);
		mui(list).on('tap', '.feed', function(e) {
			var feedid = this.getAttribute('data-id');
			if(feedid){
				var feedDetail = mui.openWindow({
					id: "feedDetail",
					url: "page_feeds_detail.html",
					styles: {},
					show: {
						aniShow: "pop-in",
						duration : 200
					},
					waiting: { 
						autoShow: true
					}
				});
				setTimeout(function() {
					feedDetail.evalJS("update('"+ feedid  +"')");	
				},50);

			}
		});
		mui(list).on('tap', '.post', function(e) {
			var postid = this.getAttribute('data-id');
			var pagePost = plus.webview.create('page_news_view.html','newsView',{top : 0, height: "39px"});
			pagePost.evalJS("updateContent('"+postid+"', '"+"test title"+"')");
		});
		
	},
	render : function(){
		var cl = this.state.collectionList.map(function(one, i){
			return <Collection key={one._id} item={one}/>;
		});
		return <div>{cl}</div>;
	}
});
