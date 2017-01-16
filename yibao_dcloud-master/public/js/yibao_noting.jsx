var YibaoNote = React.createClass({
	getInitialState : function(){
		return {noting : this.props.noting};
	},
	HandleClick : function(){
		var url = this.noting.url;
		var newsView = plus.webview.create('../views/page_news_view.html','news_view');
		newsView.evalJS("updateContent(id,'"+url+"','"+title+"')");
	},
	render : function(){
		var note = this.state.noting.isRead ? <div class="noting-dot"></div>
		: <div></div>;
		return	<div className="thumbnail" onClick={this.HandleClick}>
					<div className="head-portrait">
						<img src={this.state.noting.proUrl} height="45px" width="45px"/>
						{note}
					</div>
					<div className="noting-info">
						<span className="noting-title">
							{this.state.noting.title}
						</span>
						<br/>
						<span className="noting-brief">
							{this.state.noting.brief}...
						</span>
					</div>
					<div className="time">{this.state.noting.editTime}</div>
				</div>;
	}
});

var YibaoNoteList = React.createClass({
	getInitialState : function(){
		return {notelist : []};
	},
	componentDidMount: function(){
		var that = this;
		mui.ajax({
			url : "http://pang.tunnel.yibaoedu.com:8080/yibao",
			success : function(data){
				that.setState({notelist : data.list});
				console.log(JSON.stringify(data));
			}.bind(this)
		});
	},
	render : function(){
		var list = this.state.notelist.map(function(one,i){
			return <YibaoNote noting={one}/>
		});
		var nothing = <div className="nothing">
						您还未收到任何艺伴通知
					</div>;
		var lists = this.state.notelist.length != 0? list : nothing;
		return <div>{lists}</div>;
	}
});
