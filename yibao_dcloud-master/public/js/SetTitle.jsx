var Title = React.createClass({
	getInitialState : function(){
		return{
			title : this.props.title,
			right : this.props.right,
			backPage : this.props.backPage,
			nextPage : this.props.nextPage
		};
	},
	render : function(){
		return <div className="title">
			<div className="title_back" onClick={backPage}>
				<i className="fa fa-angle-left"></i>
			</div>
			<div className="title_name">
				{this.state.title}
			</div>
			<div className="next" onClick={nextPage}>
				{this.state.right}
			</div>
		</div>;
	}
});
