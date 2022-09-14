import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

//class is used for redirecting to Logout page and logging out
class Logout extends Component {
  componentDidMount() {
    this.props.authLogout();
  }
  render() {
    return <Redirect to='/' />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authLogout: () => dispatch(actions.authLogout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
