"use strict";

var GetInvitation = React.createClass({
	displayName: "GetInvitation",

	getInitialState: function getInitialState() {
		return {
			invitation: this.props.invitation,
			user: {},
			work: {}
		};
	},
	HandleClick: function HandleClick() {
		//前往精准点评界面
	},
	componentDidMount: function componentDidMount() {
		console.log(JSON.stringify(this.state.invitation));
		var that = this;
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/workInfo/" + that.state.invitation.content._id,
			success: (function (data) {
				if (data.msg == 'ok') that.setState({ work: data.work });
			}).bind(this)
		});
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/userInfoById",
			data: {
				_id: that.state.invitation.publish_user
			},
			success: (function (data) {
				if (data.msg == 'ok') that.setState({ user: data.user });
			}).bind(this)
		});
		var self = this;
	},
	render: function render() {
		var time = HQDate(this.state.invitation.publish_time);
		return React.createElement(
			"div",
			{ className: "column", onClick: this.HandleClick },
			React.createElement(
				"div",
				{ className: "head-portrait" },
				React.createElement("div", { className: "head-img" }),
				React.createElement(
					"div",
					{ className: "class" },
					"LV",
					this.state.user.degree
				),
				React.createElement("div", { className: "notice" })
			),
			React.createElement(
				"div",
				{ className: "info" },
				React.createElement(
					"div",
					{ className: "info-name" },
					this.state.user.nickname
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ className: "info-time" },
					time
				)
			),
			React.createElement(
				"div",
				{ className: "invitation" },
				React.createElement(
					"div",
					{ className: "text" },
					"邀请您点评画作"
				)
			),
			React.createElement("img", { src: this.state.work.picUrl, height: "47px" })
		);
	}
});
var GetInvitationList = React.createClass({
	displayName: "GetInvitationList",

	getInitialState: function getInitialState() {
		return { InvitationList: [] };
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		mui.ajax({
			url: "http://pang.tunnel.yibaoedu.com:8080/messageInvite",
			success: (function (data) {
				if (data.msg == 'ok') that.setState({ InvitationList: data.messagelist });
			}).bind(this)
		});
		var self = this;
	},
	render: function render() {
		var self = this;
		var list = this.state.InvitationList.map(function (one, i) {
			return React.createElement(GetInvitation, { invitation: one, key: i });
		});
		var nothing = React.createElement(
			"div",
			{ className: "nothing" },
			"您还未收到任何邀请"
		);
		var lists = this.state.InvitationList.length != 0 ? list : nothing;
		return React.createElement(
			"div",
			null,
			list
		);
	}
});