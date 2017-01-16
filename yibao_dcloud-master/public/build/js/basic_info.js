"use strict";

var Form = React.createClass({
	displayName: "Form",

	render: function render() {
		return;
	}
});

var BasicInfoContent = React.createClass({
	displayName: "BasicInfoContent",

	selectMaleGender: function selectMaleGender() {
		var newuser = this.props.user;
		newuser.gender = "male";
		this.props.setState({ user: newuser });
	},
	selectFemaleGender: function selectFemaleGender() {
		var newuser = this.props.user;
		newuser.gender = "female";
		this.props.setState({ user: newuser });
	},
	render: function render() {
		var maleSelect = this.props.user.gender == "male" ? 'maleselected' : 'boselected';
		var femaleSelect = this.props.user.gender == "female" ? 'femaleselected' : 'boselected';
		return React.createElement("div", null);
	}
});