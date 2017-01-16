var CommentColumn = React.createClass({
	
	render : function(){
		var data = this.props.commentData;
		var imgname = this.props.commentData.feedPhoto||"";
		imgname = imgname == "undefined" ? "" : imgname.split('/');
		imgname = imgname.length > 0 ? imgname[imgname.length-1] : "";
		imgname = imgname ? "http://yibao.img-cn-beijing.aliyuncs.com/"+imgname+"@1e_1c_0o_0l_120h_120w_100q" : "";
		return 	<div className="column" data-feedid={this.props.commentData.feedid  || ""}>
			<div className="column-text">
				<div className="head-portrait">
					<img className="head-img" src={data.sender.photo} height="47px"/>
					<div className="notice"></div>
				</div>
				<div className="info">
					<span className="info-name">
						{data.sender.nickname}
					</span>
					<br/>
					<span className="info-time">
						{Service.HQDate(data.editTime)}
					</span>
				</div>
				<div className="comment">
					<span className="text">评论了你的作品</span>
					<br/>
				</div>

				<img Style="max-height:47px" src={imgname} />

			</div>
			<br />
			<div className="comment-text">
				<i className="triangle-left"></i>
				<span className="content-text">
					{data.content}
				</span>
			</div>
		</div>;
	}
});

var CommentColumnList = React.createClass({
	getInitialState : function(){
		return {CommentColumnList : []};
	},
	componentDidMount : function(){
		var list = ReactDOM.findDOMNode(this);
		mui(list).on('click', 'div.column', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var feedid = this.getAttribute('data-feedid');
			if(feedid){
				var feedDetail = mui.openWindow({
					id: "feedDetail",
					url: "page_feeds_detail.html",
					styles: {},
					show: {
						aniShow: "pop-in",
						duration : 400
					},
					waiting: {
						autoShow: true
					}
				});
				feedDetail.evalJS("update('"+ feedid  +"')");	
			}
		});
	},
	componentWillUnmount : function() {
		mui(list).off('click','div.column');
	},
	render : function(){
		var list = this.state.CommentColumnList.map(function(one,i){
			return <CommentColumn commentData={one} />;
		});
		var nothing = <div className="nothing">
			您还未收到任何评论
		</div>;
		var lists = this.state.CommentColumnList.length != 0? list : nothing;
		return <div>{lists}</div>;
	}
});
