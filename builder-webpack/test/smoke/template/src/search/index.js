import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import largeNumber from 'large-number-chris';
import './expense.scss';
import logo from './images/logo.jpg';
import { a } from './tree-shaking';

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

ReactDOM.render(<Expense />, document.getElementById('root'));
