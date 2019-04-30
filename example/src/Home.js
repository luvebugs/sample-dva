import React from 'react';
import {connect} from 'react-redux'

const Home = () => {
    return (
        <div>
            home
        </div>
    );
}

const mapStateToProps = state => {
    return {
        example: state.example
    };
}

export default connect(mapStateToProps)(Home)