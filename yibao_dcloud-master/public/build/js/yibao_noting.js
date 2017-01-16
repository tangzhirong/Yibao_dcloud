'use strict';

var YibaoNote = React.createClass({
	displayName: 'YibaoNote',

	getInitialState: function getInitialState() {
		return { noting: this.props.noting };
	},
	HandleClick: function HandleClick() {
		var url = this.noting.url;
		var newsView = plus.webview.create('../views/page_news_view.html', 'news_view');
		newsView.evalJS("updateContent(id,'" + url + "','" + title + "')");
	},
	render: function render() {
		var note = this.state.noting.isRead ? React.createElement('div', { 'class': 'noting-dot' }) : React.createElement('div', null);
		return React.createElement(
			'div',
			{ className: 'thumbnail', onClick: this.HandleClick },
			React.createElement(
				'div',
				{ className: 'head-portrait' },
				React.createElement('img', { src: this.state.noting.proUrl, height: '45px', width: '45px' }),
				note
			),
			React.createElement(
				'div',
				{ className: 'noting-info' },
				React.createElement(
					'span',
					{ className: 'noting-title' },
					this.state.noting.title
				),
				React.createElement('br', null),
				React.createElement(
					'span',
					{ className: 'noting-brief' },
					this.state.noting.brief,
					'...'
				)
			),
			React.createElement(
				'div',
				{ className: 'time' },
				this.state.noting.editTime
			)
		);
	}
});

var YibaoNoteList = React.createClass({
	displayName: 'YibaoNoteList',

	getInitialState: function getInitialState() {
		return { notelist: [] };
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/yibao",
			success: (function (data) {
				that.setState({ notelist: data.list });
				console.log(JSON.stringify(data));
			}).bind(this)
		});
	},
	render: function render() {
		var list = this.state.notelist.map(function (one, i) {
			return React.createElement(YibaoNote, { noting: one });
		});
		var nothing = React.createElement(
			'div',
			{ className: 'nothing' },
			'您还未收到任何艺伴通知'
		);
		var lists = this.state.notelist.length != 0 ? list : nothing;
		return React.createElement(
			'div',
			null,
			lists
		);
	}
});