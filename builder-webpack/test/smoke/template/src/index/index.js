import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './expense.scss';
import logo from './images/logo.jpg';

class Expense extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="expense">
                javaScript 语句 你好 ya
                <img src={logo} alt="logo" />
            </div>
        );
    }
}

ReactDOM.render(<Expense />, document.getElementById('root'));
