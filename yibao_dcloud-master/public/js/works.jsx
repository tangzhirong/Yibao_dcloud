var Work_card = React.createClass({
	render : function(){
		var that = this;
		var work = this.props.workcate.content.map(function(one, i){
			if(!one.picUrl)
				return null;
			
			var imgUrl = one.picUrl.split('/');
			var imgname = imgUrl[imgUrl.length-1];
			if(/yibao/.test(one.picUrl))
				return <img className="work" id={one._id}
					       src={"http://yibao.img-cn-beijing.aliyuncs.com/"+imgname+"@1e_1c_0o_0l_360h_360w_100q"} width="100%" />;
			else
				return <img className="work" id={one._id}
					       src={one.picUrl} width="100%" />;

		});
		return <div className="card-content">
					<div className="works_info">
						<span className="works_time">
							{this.props.workcate.time}
						</span>
						<span className="works_num">
							{this.props.workcate.content.length}幅
						</span>
					</div>
					<div className="works">{work}</div>
				</div>;
	}
});
var Display = React.createClass({
	render : function(){
		var that = this;
		var work_cards = this.props.workcates.map(function(one,i){
			return <div className="works_card_contain">
						
						<div className="works_card">
							<Work_card workcate={one}/>
						</div>
					</div>;
		});
		return <div>
				<div className="card-image-background"></div>
				<div className="contain">{work_cards}</div>
					<div className="works_card_contain">
						
					</div>
				</div>;
	}
});
