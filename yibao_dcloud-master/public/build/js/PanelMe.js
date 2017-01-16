
/* 头像信息 */
"use strict";

var Head = React.createClass({
	displayName: "Head",

	render: function render() {
		var rank = this.props.user.role == "STUDENT" ? React.createElement(
			"div",
			{ className: "rank" },
			this.props.user.degree
		) : React.createElement("div", null);
		var v = this.props.user.is_qualified ? React.createElement("div", { className: "v" }) : React.createElement("div", null);
		return React.createElement(
			"div",
			{ className: "head" },
			React.createElement(
				"div",
				{ className: "headPortrait" },
				React.createElement("img", { src: this.props.user.photo || '../img/logo.png', width: "100%" })
			)
		);
	}
});

/* 用户信息栏 : 姓名，地区等信息 */
var Infor = React.createClass({
	displayName: "Infor",

	render: function render() {
		var isStudent = this.props.user.role == "STUDENT" ? true : false;
		var school = isStudent ? React.createElement("span", null) : React.createElement(
			"span",
			{ className: "school" },
			this.props.user.studio
		);
		React.createElement("div", null);
		return React.createElement(
			"div",
			{ className: "info" },
			React.createElement(
				"div",
				{ className: "name" },
				this.props.user.nickname
			),
			React.createElement(
				"div",
				{ className: "address" },
				React.createElement(
					"span",
					{ className: "district" },
					this.props.user.address
				),
				React.createElement(
					"span",
					{ className: "city" },
					this.props.user.city,
					" "
				),
				school
			)
		);
	}
});

/* 统计信息栏 */
var MeTab = React.createClass({
	displayName: "MeTab",

	render: function render() {
		var tab = this.props.user.role == "STUDENT" ? React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "min-tab works" },
				React.createElement(
					"div",
					{ className: "num" },
					this.props.user.workNum == undefined ? 0 : this.props.user.workNum
				),
				React.createElement(
					"div",
					{ className: "text" },
					"画作"
				)
			),
			React.createElement(
				"div",
				{ className: "min-tab focus" },
				React.createElement(
					"div",
					{ className: "num" },
					this.props.user.followNum == undefined ? 0 : this.props.user.followNum
				),
				React.createElement(
					"div",
					{ className: "text" },
					"关注"
				)
			),
			React.createElement(
				"div",
				{ className: "min-tab fan" },
				React.createElement(
					"div",
					{ className: "num" },
					this.props.user.fansNum == undefined ? 0 : this.props.user.fansNum
				),
				React.createElement(
					"div",
					{ className: "text" },
					"粉丝"
				)
			)
		) : React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "comment" },
				React.createElement(
					"div",
					{ className: "num" },
					this.props.user.commentNum == undefined ? 0 : this.props.user.commentNum
				),
				React.createElement(
					"div",
					{ className: "text" },
					"已点评"
				)
			),
			React.createElement(
				"div",
				{ className: "fans" },
				React.createElement(
					"div",
					{ className: "num" },
					this.props.user.fansNum == undefined ? 0 : this.props.user.fansNum
				),
				React.createElement(
					"div",
					{ className: "text" },
					"粉丝"
				)
			),
			React.createElement(
				"div",
				{ className: "flowers" },
				React.createElement(
					"div",
					{ className: "num" },
					this.props.user.flowerNum == undefined ? 0 : this.props.user.flowerNum
				),
				React.createElement(
					"div",
					{ className: "text" },
					"鲜花"
				)
			),
			React.createElement(
				"div",
				{ className: "favour" },
				React.createElement(
					"div",
					{ className: "num" },
					this.props.user.favourNum == undefined ? 0 : this.props.user.favourNum
				),
				React.createElement(
					"div",
					{ className: "text" },
					"赞"
				)
			)
		);
		return React.createElement(
			"div",
			{ className: "tab" },
			tab
		);
	}
});

/* 个人信息展示栏 */
var MeCard = React.createClass({
	displayName: "MeCard",

	go: function go() {
		plus.webview.create('../views/page_editInfo.html', 'editInfo_contain').show('pop-in');
	},
	render: function render() {
		if (!this.props.user) return null;
		var photo = this.props.user.photo.split('/');
		photo = photo[photo.length - 1];
		var src = "http://yibao.img-cn-beijing.aliyuncs.com/" + photo + "@50-50bl";
		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "card-template" },
				React.createElement("img", { src: src, id: "head", width: "100%" }),
				React.createElement("div", { className: "gray" }),
				React.createElement(
					"div",
					{ className: "card" },
					React.createElement(
						"div",
						{ className: "editTitle", onClick: this.go },
						React.createElement("i", { className: "fa fa-edit" })
					),
					React.createElement(Head, { user: this.state.user }),
					React.createElement(Infor, { user: this.state.user }),
					React.createElement(MeTab, { user: this.state.user })
				)
			)
		);
	}
});

var HomeCard = React.createClass({
	displayName: "HomeCard",

	getInitialState: function getInitialState() {
		return { isFollow: false };
	},
	go: function go() {
		plus.webview.currentWebview().close();
	},
	HandleClick: function HandleClick() {
		var that = this;
		var leafUrl;
		if (that.state.isFollow) leafUrl = "/cancelFollow";else leafUrl = "/setFollow";
		mui.ajax({
			url: baseUrl + leafUrl,
			data: {
				followed_id: this.props.user._id,
				type: "user"
			},
			type: 'post',
			success: (function (data) {
				console.log(JSON.stringify(data));
				if (data.msg == "ok") {
					if (leafUrl == "/cancelFollow") {
						that.setState({ isFollow: false });
						plus.nativeUI.toast("取消关注");
					} else {
						that.setState({ isFollow: true });
						plus.nativeUI.toast("关注成功");
					}
				}
			}).bind(this)
		});
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		mui.ajax({
			url: baseUrl + '/isFollow/' + this.props.user._id,
			success: function success(data) {
				console.log(data.isFollow);
				if (data.isFollow) that.setState({ isFollow: true });
			},
			error: function error(err) {
				console.log(JSON.stringify(err));
			}
		});
	},
	render: function render() {

		if (!this.props.user) return null;

		var photo = this.props.user.photo.split('/');
		photo = photo[photo.length - 1];
		var src = "http://yibao.img-cn-beijing.aliyuncs.com/" + photo + "@50-50bl";
		var follow = this.state.isFollow ? React.createElement("i", { className: "fa fa-user-times celFollowBtn", onClick: this.HandleClick }) : React.createElement("i", { className: "fa fa-user-plus setFollowBtn", onClick: this.HandleClick });
		var followBtn = this.props.editable ? React.createElement("div", { className: "setFollowBtn" }) : React.createElement(
			"div",
			null,
			follow
		);
		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "card-template" },
				React.createElement("img", { src: src, id: "head", width: "100%" }),
				React.createElement("div", { className: "gray-card", width: "100%/" }),
				React.createElement(
					"div",
					{ className: "card" },
					React.createElement(
						"div",
						{ className: "editTitle", onClick: this.go },
						React.createElement("i", { className: "fa fa-angle-left" })
					),
					followBtn,
					React.createElement(
						"div",
						{ className: "head-info" },
						React.createElement(Head, { user: this.props.user }),
						React.createElement(Infor, { user: this.props.user })
					),
					React.createElement(MeTab, { user: this.props.user }),
					React.createElement(
						"div",
						{ className: "setFollow" },
						"个性签名：",
						this.props.user.signature ? this.props.user.signature : "主人挺懒的，还没有个性签名哦！"
					)
				)
			)
		);
	}
});