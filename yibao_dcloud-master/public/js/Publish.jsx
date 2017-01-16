var baseUrl = localStorage.getItem('baseUrl');
var Publish = React.createClass({
	getInitialState : function(){
		return {user_id : this.props.user_id,
				publishList : []};
	},
	componentDidMount : function(){
		var that = this;
		console.log(this.state.user_id);
		mui.ajax({
			url : baseUrl + "/allWorks/"+ this.state.user_id,
			type : "get",
			success : function(data){
				console.log(JSON.stringify(data));
				var list = data.worklist;
				console.log(list.length);
				var workcate = [];
				var temp = false;
				for(var i = 0; i < list.length; i++)
				{
					var work = list[i];
					if(!work.picUrl || work.picUrl == "undefined")
						continue;
					var date = new Date(work.editTime);
					var month = date.getMonth()+1;
					var year = date.getFullYear();
					var time = year + "-" + month;
					for(var j = 0; j < workcate.length; j++)
					{
						if(workcate[j].time == time)
						{
							temp = true;
							workcate[j].content.push(work);
							break;
						}
					}
					if(temp == false){
							workcate[workcate.length] = {};
							workcate[workcate.length-1].time = time;
							workcate[workcate.length-1].content = [];
							workcate[workcate.length-1].content.push(work);
					}
				}
				that.setState({publishList : workcate}); 
			}.bind(this),
			error : function(err){
				console.log(JSON.stringify(err));
			}
		});
		var self = this;
	},
	render : function(){
		var list = <div><Display  workcates={this.state.publishList}/></div>;
		var nothing = <div className="nothing">
						您还未发布任何作品
					</div>;
		var lists = this.state.publishList.length != 0? list : nothing;
		return <div>{lists}</div>;
	}
});
