"use strict";

var WorkTeacherContent = React.createClass({
	displayName: "WorkTeacherContent",

	getInitialState: function getInitialState() {
		return { works: [],
			user: this.props.user };
	},
	componentDidMount: function componentDidMount() {
		var that = this;
		mui.ajax({
			url: baseUrl + "/allWorks/" + this.props.user._id,
			type: "get",
			success: function success(data) {
				console.log(314);
				var worklist = data.worklist;
				if (worklist.length > 5) {
					worklist = worklist.slice(0, 4);
				}
				that.setState({ works: worklist });
			}, error: function error(err) {
				console.log("网络错误");
			}
		});
	},
	render: function render() {
		console.log(23);

		var works = this.state.works.map(function (one, i) {
			var imgUrl = one.picUrl.split('/');
			var imgname = imgUrl[imgUrl.length - 1];
			return React.createElement("img", { className: "work", id: one._id, src: "http://yibao.img-cn-beijing.aliyuncs.com/" + imgname + "@1e_1c_0o_0l_240h_240w_100q", key: i, width: "100%" });
		});
		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(TeacherTitle, { editable: this.props.editable }),
			React.createElement(
				"div",
				{ className: "work-content" },
				works
			)
		);
	}
});

var TeacherTitle = React.createClass({
	displayName: "TeacherTitle",

	render: function render() {
		var edit = this.props.editable ? React.createElement(
			"span",
			{ className: "edit right" },
			"编辑"
		) : null;

		return React.createElement(
			"div",
			{ className: "title" },
			React.createElement("div", { className: "photo icon" }),
			React.createElement(
				"span",
				{ className: "work-show left" },
				"作品展示"
			),
			edit
		);
	}
});

var TeacherDisplay = React.createClass({
	displayName: "TeacherDisplay",

	getInitialState: function getInitialState() {
		return { user: this.props.user };
	},
	save: function save() {
		user.graduate_school = this.refs.graduate_school.value;
		user.experience = this.refs.experience.value;
		user.teaching_object = this.refs.teaching_object.value;
		user.address_often = this.refs.address_often.value;

		Service.saveToLocal(user);
		console.log(JSON.stringify(user));
		plus.nativeUI.toast('保存成功');
		var event = new CustomEvent('MODIFY_USER');
		window.dispatchEvent(event);
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(
				"div",
				{ className: "title" },
				React.createElement("div", { className: "list icon" }),
				React.createElement(
					"span",
					{ className: "left" },
					"基本信息"
				),
				this.props.editable ? React.createElement(
					"span",
					{ className: "edit right", onClick: this.save },
					"保存"
				) : null
			),
			React.createElement(
				"div",
				{ className: "work-content info" },
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"毕业院校："
					),
					React.createElement("input", { type: "text", className: "column-content",
						onblur: "save()", placeholder: "您的院校", disabled: !this.props.editable,
						ref: "graduate_school",
						defaultValue: this.props.editable ? this.props.user.graduate_school : this.props.user.graduate_school || "暂未填写" })
				),
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"教学经验："
					),
					React.createElement("input", { type: "text", className: "column-content", disabled: !this.props.editable,
						onblur: "save()", placeholder: "教学经验",
						ref: "experience",
						defaultValue: this.props.editable ? this.props.user.experience : this.props.user.experience || "暂未填写" })
				),
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"教学对象："
					),
					React.createElement("input", { type: "text", className: "column-content", disabled: !this.props.editable,
						onblur: "save()", placeholder: "教学对象",
						ref: "teaching_object",
						defaultValue: this.props.editable ? this.props.user.teaching_object : this.props.user.teaching_object || "暂未填写" })
				),
				React.createElement(
					"div",
					{ className: "column" },
					React.createElement(
						"div",
						{ className: "column-title" },
						"常驻地址："
					),
					React.createElement("input", { type: "text", className: "column-content", disabled: !this.props.editable,
						onblur: "save()", placeholder: "您的住址",
						ref: "address_often",
						defaultValue: this.props.editable ? this.props.user.address_often : this.props.user.address_often || "暂未填写" })
				)
			)
		);
	}
});
var Alltag = React.createClass({
	displayName: "Alltag",

	getInitialState: function getInitialState() {
		return {
			alltag: this.props.alltag
		};
	},
	alltagSelect: function alltagSelect() {
		var alltag = this.state.alltag;
		alltag.isSelected = !alltag.isSelected;
		this.setState({ alltag: alltag });
		this.props.selected(this.state.alltag);
	},
	render: function render() {
		var selectClass = this.state.alltag.isSelected ? 'fa fa-circle fa-stack-2x selected' : 'fa fa-circle fa-stack-2x noselected';
		return React.createElement(
			"div",
			{ className: "tag-rect", onClick: this.alltagSelect },
			React.createElement(
				"div",
				{ className: "tag" },
				this.state.alltag.name
			),
			React.createElement(
				"span",
				{ className: "fa-stack fa-lg" },
				React.createElement("i", { className: selectClass }),
				React.createElement("i", { className: "fa fa-check fa-stack-1x fa-inverse" })
			)
		);
	}
});
var WorkSpeciality = React.createClass({
	displayName: "WorkSpeciality",

	getInitialState: function getInitialState() {

		return { alltags: this.props.alltags,
			tags: this.props.user.tags,
			isEdit: false };
	},
	specialityEdit: function specialityEdit() {
		this.setState({ isEdit: !this.state.isEdit });

		if (this.state.isEdit) {
			var newtags = [];
			var newtagsid = [];
			for (var i = 0; i < this.state.alltags.length; i++) {
				var alltag_i = this.state.alltags[i];
				if (alltag_i.isSelected == true) {
					newtags.push(alltag_i.name);
					newtagsid.push(alltag_i._id);
				}
			}
			this.setState({ tags: newtags });
			var user = Service.getLocalUser();
			user.tags = newtagsid;

			Service.saveToRemote(user);
		} else this.initialAlltags();
	},
	initialAlltags: function initialAlltags() {
		for (var i = 0; i < this.state.alltags.length; i++) {
			this.state.alltags[i].isSelected = false;
			for (var j = 0; j < this.state.tags.length; j++) {
				var tags_j = this.state.tags[j];
				if (this.state.alltags[i].name == tags_j) this.state.alltags[i].isSelected = true;
			}
		}
	},
	componentDidMount: function componentDidMount() {
		this.initialAlltags();
	},
	selected: function selected(alltag) {
		for (var i = 0; i < this.state.alltags.length; i++) {
			var alltags = this.state.alltags;
			var alltag_i = alltags[i];
			if (alltag.name == alltag_i.name) {
				var newtags = this.state.alltags;
				newtags[i] = alltag;
				this.setState({ alltags: newtags });
				break;
			}
		}
	},
	render: function render() {
		var that = this;
		var editable = this.props.editable;
		var edit = this.state.isEdit ? "完成" : "编辑";
		var tagMap = {
			'5643424a95804f136d5adeb2': "色彩",
			'5643424a95804f136d5adeb3': "素描",
			'56555a3c65436f3c714f8246': "速写"
		};

		var teacherTags = this.state.tags.map(function (one, i) {
			return React.createElement(
				"div",
				{ className: "tag-rect" },
				React.createElement(
					"div",
					{ className: "tag", key: i },
					one.length > 3 ? tagMap[one] : one
				)
			);
		});
		var allTags = this.state.alltags.map(function (one, i) {
			return React.createElement(Alltag, { alltag: one, key: i, selected: that.selected });
		});
		var tags = this.state.isEdit ? React.createElement(
			"div",
			{ className: "tags" },
			allTags
		) : React.createElement(
			"div",
			{ className: "tags" },
			teacherTags
		);

		return React.createElement(
			"div",
			{ className: "work-display" },
			React.createElement(
				"div",
				{ className: "title" },
				React.createElement("div", { className: "speciality icon" }),
				React.createElement(
					"span",
					{ className: "teacher-speciality left" },
					"教学特长"
				),
				this.props.editable ? React.createElement(
					"span",
					{ className: "edit right", onClick: this.specialityEdit },
					edit
				) : null
			),
			tags
		);
	}
});

var HomepageTeacher = React.createClass({
	displayName: "HomepageTeacher",

	getInitialState: function getInitialState() {
		return { editable: user._id == this.props.user._id };
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(HomeCard, { user: this.props.user, editable: this.state.editable }),
			React.createElement(WorkTeacherContent, { works: this.props.works, user: this.props.user, editable: this.state.editable, onClick: this.HandleClick }),
			React.createElement(TeacherDisplay, { user: this.props.user, editable: this.state.editable }),
			React.createElement(WorkSpeciality, { user: this.props.user, alltags: this.props.alltags, editable: this.state.editable })
		);
	}
});