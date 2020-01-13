import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.scss';
import axios from '../../axios-contacts';

import * as actions from '../../store/actions/index';
import Button from '../../components/UI/Button/Button';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import InputContext from '../../context/InputContext';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
class Auth extends Component {
  state = {
    form: {
      email: {
        elementtype: 'input',
        name: 'email',
        label: 'Email',
        elementconfig: {
          type: 'text',
          placeholder: 'Mail Address'
        },
        validation: {
          required: true,
          isEmail: true
        },
        value: { data: '', valid: false, touched: false, pristine: true }
      },
      password: {
        elementtype: 'input',
        name: 'password',
        label: 'Password',
        elementconfig: {
          type: 'password',
          placeholder: 'Password'
        },
        validation: {
          required: true,
          minLength: 6
        },
        value: { data: '', valid: false, touched: false, pristine: true }
      }
    },
    formIsValid: false,
    isSignUp: false
  };
  //------------------------------------------------------
  //------------------------------------------------------
  validationCheck(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }
  //------------------------------------------------------
  //------------------------------------------------------
  //checks the .valid property of each input in array or individual input
  //returns true/false if form object is valid/invalid
  checkInputValidProperty = (form) => {
    // console.log('IS FORM VALID CHECK');
    let formIsValid = true;

    //each prop in contact
    for (let inputIdentifier in form) {
      //if the prop of contact has an element type of...
      if (form[inputIdentifier].elementtype === 'multiinput') {
        for (let each of form[inputIdentifier].value) {
          formIsValid = each.valid && formIsValid;
        }
      } else {
        formIsValid = form[inputIdentifier].value.valid && formIsValid;
      }
    }

    return formIsValid;
  };

  //------------------------------------------------------
  //------------------------------------------------------
  inputChangedHandler = (newval, inputIdentifier, index = null) => {
    // console.log('inputChangedHandler: ', inputIdentifier);
    //single contact
    const updatedForm = {
      ...this.state.form
    };

    //single prop of form
    const updatedFormElement = {
      ...updatedForm[inputIdentifier]
    };

    //if array
    if (index !== null) {
      updatedFormElement.value[index].data = newval;
      updatedFormElement.value[index].touched = true;
      updatedFormElement.value[index].pristine = false;
      updatedFormElement.value[index].valid = this.validationCheck(
        updatedFormElement.value[index].data,
        updatedFormElement.validation
      );
    } else {
      //if single value
      updatedFormElement.value.data = newval;
      updatedFormElement.value.touched = true;
      updatedFormElement.value.pristine = false;
      updatedFormElement.value.valid = this.validationCheck(
        updatedFormElement.value.data,
        updatedFormElement.validation
      );
    }

    updatedForm[inputIdentifier] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const formValidCheck = this.checkInputValidProperty(updatedForm);
    // console.log('FORM VALIDITY: ', formValidCheck);
    this.setState({ form: updatedForm, formIsValid: formValidCheck });
  };

  onSubmitHandler = (event) => {
    event.preventDefault(); //prevents reloading of page
    this.props.onAuth(
      this.state.form.email.value.data,
      this.state.form.password.value.data,
      this.state.isSignUp
    );
  };

  switchAuthModeHandler = () => {
    console.log('switchAuthModeHandler!');
    this.setState((prevState) => {
      return { isSignUp: !prevState.isSignUp };
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.form) {
      formElementsArray.push({
        id: key,
        data: this.state.form[key]
      });
    }

    let form = formElementsArray.map((item) => (
      <ComponentFactory key={item.id} id={item.id} data={item.data} />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to='/' />;
    }

    return (
      <React.Fragment>
        {authRedirect}
        <div className={classes.Auth}>
          <div className='container'>
            <div className={[classes.Wrapper, 'container'].join(' ')}>
              {authRedirect}
              {errorMessage}
              <form onSubmit={this.onSubmitHandler} autoComplete='off'>
                <InputContext.Provider
                  value={{
                    changed: this.inputChangedHandler
                  }}>
                  {form}
                </InputContext.Provider>
                <Button btnType='Success'>Submit</Button>
                <Button btnType='Danger' onClick={this.switchAuthModeHandler}>
                  Switch to {this.state.isSignUp ? 'SIGN-IN' : 'SIGN-UP'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Auth, axios));
