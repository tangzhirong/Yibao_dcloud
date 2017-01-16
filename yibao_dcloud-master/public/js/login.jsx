var LoginForm = React.createclassName({
    getInitialState : function(){
        return { telephone : {},
                code : {},
                isSendCode : true,
                SendCodeText : "发送验证",
                isLogin : this.props.isLogin
            };
    },
    SendCode : function(){
            this.setState({isSendCode: false});
            this.setState({SendCodeText : "56"}); 
    },
    Login : function(){
        //请求登录
    },
    render : function(){
        var ready = this.state.isSendCode?'ready':'waitting';
        return <div>
        			<input type="number" id="ID" className="ID"  value={this.state.telephone} placeholder="请输入您的手机号"/>
                    <input type="number" className="verification-code" value={this.state.code} placeholder="请输入验证码"/>
                    <div className="send-code" className={ready} onClick="sendcode()">
                        <span>{this.state.SendCodeText}</span>
                    </div>
                    <div className="login" id="login" onClick="Login()">
                        <span>登录</span>
                    </div>
                </div>;
    }
});