const React = require('react');
const { Component } = require('react');
const largeNumber = require('large-number-chris');
require('./expense.scss');
const logo = require('./images/logo.jpg');
const { a } = require('./tree-shaking');

class Expense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Text: null,
        };
    }

    loadComponent = () => {
        import('./text.js')
            .then((res) => {
                this.setState({
                    Text: res.default,
                });
            });
    }

    handleOnKeyPress = (e) => {
        console.log(e);
    }

    render() {
        const funcA = a();
        const { Text } = this.state;
        const retNum = largeNumber('999', '1');
        return (
            <div onClick={this.loadComponent} className="expense">
                javaScript 语句 你好 ya
                {retNum}
                {funcA}
                {Text ? <Text /> : null}
                <img src={logo} alt="logo" />
            </div>
        );
    }
}

module.exports = <Expense />;
