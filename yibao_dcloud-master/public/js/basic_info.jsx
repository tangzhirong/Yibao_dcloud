var Form = React.createClass({
	render : function(){
		return 
	}
});

var BasicInfoContent = React.createClass({
	selectMaleGender : function(){
		var newuser = this.props.user;
		newuser.gender = "male" ;
		this.props.setState({user :newuser});
	},
	selectFemaleGender : function(){
		var newuser = this.props.user;
		newuser.gender = "female" ;
		this.props.setState({user :newuser});
	},
	render : function(){
		var maleSelect = this.props.user.gender=="male"? 'maleselected':'boselected';
		var femaleSelect = this.props.user.gender=="female"? 'femaleselected':'boselected';
		return <div>
		</div>
	}
});
