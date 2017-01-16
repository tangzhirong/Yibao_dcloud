"use strict";

var LoginForm = React.createclassName({
    getInitialState: function getInitialState() {
        return { telephone: {},
            code: {},
            isSendCode: true,
            SendCodeText: "发送验证",
            isLogin: this.props.isLogin
        };
    },
    SendCode: function SendCode() {
        this.setState({ isSendCode: false });
        this.setState({ SendCodeText: "56" });
    },
    Login: function Login() {
        //请求登录
    },
    render: function render() {
        var ready = this.state.isSendCode ? 'ready' : 'waitting';
        return React.createElement(
            "div",
            null,
            React.createElement("input", { type: "number", id: "ID", className: "ID", value: this.state.telephone, placeholder: "请输入您的手机号" }),
            React.createElement("input", { type: "number", className: "verification-code", value: this.state.code, placeholder: "请输入验证码" }),
            React.createElement(
                "div",
                { className: "send-code", className: ready, onClick: "sendcode()" },
                React.createElement(
                    "span",
                    null,
                    this.state.SendCodeText
                )
            ),
            React.createElement(
                "div",
                { className: "login", id: "login", onClick: "Login()" },
                React.createElement(
                    "span",
                    null,
                    "登录"
                )
            )
        );
    }
});