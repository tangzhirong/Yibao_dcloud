var HomepageStudent = React.createClass({
	getInitialState : function(){
		return {user : this.props.user,
				editable : user._id == this.props.user._id};
	},
	render : function(){
		return <div>
					<HomeCard user={this.state.user} editable={this.state.editable}/>
					<div><Publish user_id={this.state.user._id} feedClickHandler={this.props.feedClickHandler}/></div>
				</div>;
	}
});
