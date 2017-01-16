"use strict";

var Located = React.createClass({
	displayName: "Located",

	HandleClick: function HandleClick() {
		this.props.HandleLoaction(this.props.city);
	},
	render: function render() {
		var location = this.props.isLocated ? React.createElement(
			"span",
			{ className: "city" },
			this.props.city
		) : React.createElement("i", { className: "fa fa-spinner fa-pulse" });
		return React.createElement(
			"div",
			{ className: "column", onClick: this.HandleClick },
			React.createElement("i", { className: "fa fa-map-marker" }),
			location
		);
	}
});

var All = React.createClass({
	displayName: "All",

	render: function render() {
		var that = this;
		var all = this.props.list.map(function (one, i) {
			var HandleClick = function HandleClick() {
				that.props.HandleClick(one);
			};
			return React.createElement(
				"div",
				{ className: "column-wrap" },
				React.createElement(
					"div",
					{ className: "column", onClick: HandleClick },
					React.createElement(
						"span",
						{ className: "text" },
						one
					),
					React.createElement("i", { className: "fa fa-angle-right" })
				)
			);
		});
		return React.createElement(
			"div",
			{ className: "framework" },
			all
		);
	}
});

var Address = React.createClass({
	displayName: "Address",

	getInitialState: function getInitialState() {
		return {
			city: "北京市",
			list: [],
			isLocated: false,
			HandleProvince: this.props.HandleProvince
		};
	},
	componentDidMount: function componentDidMount() {
		//获取全国的省份
		var list = this.state.list;
		var that = this;
		Service.getDistrict({ "keyword": "", "subdistrict": 1, "level": "" }, function (data) {
			var provinceList = data.districtList[0].districtList;
			for (var i = 0; i < provinceList.length; i++) {
				var province = provinceList[i];
				list.push(province.name);
			}
			that.setState({ list: list });
		});
		//console.log(list);

		//进行定位
		Service.getLocalCity(function (status, result) {
			console.log(3);
			console.log(status);
			if (status == 'complete') that.setState({ isLocated: true, city: result.city });
		});
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "contain" },
			React.createElement(
				"span",
				{ className: "located-title" },
				"定位到的位置"
			),
			React.createElement(Located, { isLocated: this.state.isLocated, city: this.state.city, HandleLoaction: this.props.HandleLoaction }),
			React.createElement(
				"span",
				{ className: "all-title" },
				"全部"
			),
			React.createElement(All, { list: this.state.list, HandleClick: this.state.HandleProvince })
		);
	}
});

var City = React.createClass({
	displayName: "City",

	getInitialState: function getInitialState() {
		return {
			HandleClick: this.props.HandleClick,
			list: []
		};
	},
	getCityList: function getCityList(province) {
		var list = [];
		var that = this;
		Service.getDistrict({ "keyword": province, "subdistrict": 1, "level": "province" }, function (data) {
			var cityList = data.districtList[0].districtList;
			for (var i = 0; i < cityList.length; i++) {
				var city = cityList[i];
				list.push(city.name);
			}
			that.setState({ list: list });
		});
	},
	componentDidMount: function componentDidMount() {
		//获取provin省份下属的市
		this.getCityList(this.props.province);
	},
	componentWillUpdate: function componentWillUpdate(nextProps, nextStates) {
		if (this.props.province != nextProps.province) this.getCityList(nextProps.province);
	},
	render: function render() {
		console.log(143);
		return React.createElement(
			"div",
			{ className: "contain" },
			React.createElement(
				"span",
				{ className: "all-title" },
				"请选择所在城市"
			),
			React.createElement(All, { list: this.state.list, HandleClick: this.state.HandleClick })
		);
	}
});