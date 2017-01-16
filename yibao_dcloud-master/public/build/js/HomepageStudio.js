'use strict';

var StudioCatalogue = React.createClass({
	displayName: 'StudioCatalogue',

	HandleClickBrief: function HandleClickBrief() {
		var webview = plus.webview.create('../views/page_brief', 'brief');
		webview.evalJS("setUser('" + this.props.user + "')");
	},
	HandleClickEnvir: function HandleClickEnvir() {
		var webview = plus.webview.create('../views/page_environment');
		webview.evalJS("setUser('" + this.props.user + "')");
	},
	HandleClickProgress: function HandleClickProgress() {
		var webview = plus.webview.create('../views/page_progress');
		webview.evalJS("setUser('" + this.props.user + "')");
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'catalogue' },
			React.createElement(
				'div',
				{ className: 'left horizontal', onClick: this.HandleClickBrief },
				React.createElement('div', { className: 'image studio-brief' }),
				React.createElement('br', null),
				React.createElement(
					'span',
					null,
					'画室简介'
				)
			),
			React.createElement(
				'div',
				{ className: 'center horizontal', onClick: this.HandleClickEnvir },
				React.createElement('div', { className: 'image environment' }),
				React.createElement('br', null),
				React.createElement(
					'span',
					null,
					'教学环境'
				)
			),
			React.createElement(
				'div',
				{ className: 'right horizontal', onClick: this.HandleClickProgress },
				React.createElement('div', { className: 'image progress' }),
				React.createElement('br', null),
				React.createElement(
					'span',
					null,
					'教学成果'
				)
			)
		);
	}
});
var WorkStudioContent = React.createClass({
	displayName: 'WorkStudioContent',

	getInitialState: function getInitialState() {
		return { imgUrls: this.props.works };
	},
	render: function render() {
		var works = this.state.imgUrls.map(function (one, i) {
			return React.createElement('img', { src: one.url });
		});
		return React.createElement(
			'div',
			{ className: 'work-display' },
			React.createElement(StudioTitle, null),
			React.createElement(
				'div',
				null,
				works
			)
		);
	}
});

var StudioTitle = React.createClass({
	displayName: 'StudioTitle',

	getInitialState: function getInitialState() {
		return {};
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'title' },
			React.createElement('div', { className: 'photo icon' }),
			React.createElement(
				'span',
				{ className: 'work-show left' },
				'作品展示'
			),
			React.createElement(
				'span',
				{ className: 'edit right' },
				'编辑'
			)
		);
	}
});

var DisplayTeachers = React.createClass({
	displayName: 'DisplayTeachers',

	getInitialState: function getInitialState() {
		return { teachers: this.props.teachers };
	},
	render: function render() {
		var teachersinfo = this.state.teachers.map(function (one, i) {
			return React.createElement(
				'div',
				{ className: 'teacher-info' },
				React.createElement('img', { src: one.url, width: '100%' }),
				React.createElement('br', null),
				React.createElement(
					'div',
					{ className: 'name' },
					one.nickname
				)
			);
		});
		return React.createElement(
			'div',
			{ className: 'work-display' },
			React.createElement(
				'div',
				{ className: 'title' },
				React.createElement('div', { className: 'photo icon' }),
				React.createElement(
					'span',
					{ className: 'work-show left' },
					'师资队伍'
				),
				React.createElement(
					'span',
					{ className: 'edit right' },
					'编辑'
				)
			),
			React.createElement(
				'div',
				{ className: 'work-content-teacher' },
				teachersinfo
			)
		);
	}
});

var HomepageStudio = React.createClass({
	displayName: 'HomepageStudio',

	getInitialState: function getInitialState() {
		return { user: this.props.user,
			teachers: [],
			works: [] };
	},
	componentDidMount: function componentDidMount() {
		mui.ajax({
			url: "http://yibao.coding.io/HotTeacher/" + '56320e949dd245b85ebe26e6',
			type: 'get',
			dataType: 'json',
			success: (function (data) {
				this.setState({ userlist: data.teacher_works });
			}).bind(this)
		});
		var self = this;
	},
	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(HomeCard, { user: this.props.user }),
			React.createElement(
				'div',
				{ className: 'studio' },
				React.createElement(
					'div',
					{ className: 'display' },
					React.createElement(StudioCatalogue, { user: this.props.user }),
					React.createElement(
						'div',
						{ className: 'work-display' },
						React.createElement(StudioTitle, null),
						React.createElement(WorkStudioContent, { works: this.state.works })
					)
				)
			)
		);
	}
});