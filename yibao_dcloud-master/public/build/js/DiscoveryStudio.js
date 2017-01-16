"use strict";

var DiscoveryList = React.createClass({
	displayName: "DiscoveryList",

	getInitialState: function getInitialState() {
		return { discoverylist: this.props.discoverylist };
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "content" },
			React.createElement(
				"div",
				{ className: "feed" },
				React.createElement(
					"div",
					{ className: "studiobar" },
					React.createElement(
						"div",
						{ className: "profile" },
						React.createElement("img", { src: this.state.discoverylist.photo })
					),
					React.createElement(
						"div",
						{ className: "info" },
						React.createElement(
							"span",
							{ className: "studioname" },
							this.state.discoverylist.nickname
						),
						React.createElement("br", null),
						React.createElement(
							"span",
							{ className: "studioinfo" },
							this.state.discoverylist.address,
							" ",
							this.state.discoverylist.city
						),
						React.createElement("br", null),
						React.createElement(
							"span",
							{ className: "studiostate" },
							"报名 ",
							this.state.discoverylist.apply,
							"  粉丝 ",
							this.state.discoverylist.fansNum
						)
					),
					React.createElement(
						"div",
						{ className: "ranking" },
						this.state.discoverylist.ranking
					)
				)
			)
		);
	}
});
// 发现名师 列表 -
var List = React.createClass({
	displayName: "List",

	getInitialState: function getInitialState() {
		return { list: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			type: "post",
			url: "http://pang.tunnel.yibaoedu.com:8080/itemsByCategory",
			data: {
				cateid: "564a92833159d8a032da16ab",
				type: 'user'
			},
			success: (function (data) {
				this.setState({ list: data.userlist });
			}).bind(this)
		});
		var self = this;
	},

	render: function render() {
		var self = this;

		var list = this.state.list.map(function (one, i) {
			return React.createElement(DiscoveryList, { key: one._id, discoverylist: one });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});
// category
var Cate = React.createClass({
	displayName: "Cate",

	getInitialState: function getInitialState() {
		return { cate: this.props.cate };
	},
	changeStyle: function changeStyle(e) {
		var list = document.querySelectorAll("#page-tab2sidebar-content li");
		for (var i = 0; i < list.length; i++) {
			list[i].className = "";
		}
		e.target.className += ' sidefocused';
		this.props.cateClickHandler.call(this);
	},
	render: function render() {
		return React.createElement(
			"li",
			{ onClick: this.changeStyle },
			this.state.cate.name
		);
	}
});
// 发现类别 列表 -
var CateList = React.createClass({
	displayName: "CateList",

	getInitialState: function getInitialState() {
		return { catelist: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			type: "get",
			url: "http://pang.tunnel.yibaoedu.com:8080/categoryByType/画室",
			dataType: "json",
			success: (function (data) {
				this.setState({ catelist: data.categorys });
			}).bind(this)
		});
		var self = this;
	},

	render: function render() {
		var self = this;

		var list = this.state.catelist.map(function (one, i) {
			return React.createElement(Cate, { key: one._id, cate: one, cateClickHandler: self.props.cateClickHandler });
		});
		return React.createElement(
			"div",
			null,
			list
		);
	}
});