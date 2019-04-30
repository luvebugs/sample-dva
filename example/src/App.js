import React from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux'
import {Link} from 'react-router';

function App({example, dispatch, children}) {
    const {count} = example;
    function handleClick(num) {
        if (num === 1) {
            dispatch({
                type: 'example/fetch',
                payload: {
                    count: count+1
                }
            });
        } else {
            dispatch({
                type: 'example/fetch',
                payload: {
                    count: count+2
                }
            }).then((data) => {console.log(">>>>>>>>>", data)});
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
            </p>
            <div>{count}</div>
            <button onClick={() => handleClick(1)}>+ 1</button>
            <button onClick={() => handleClick(2)}>+ 2</button>
            <ul>
                <li>
                    <Link to="/">Index</Link>
                </li>
                <li>
                    <Link to="/home">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
            <div>
                {children}
            </div>
        </div>
    );
}


const mapStateToProps = state => {
    return {
        example: state.example
    };
}

export default connect(mapStateToProps)(App)
