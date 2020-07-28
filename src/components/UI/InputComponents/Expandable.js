import React, { Component } from 'react';
import classes from './Expandable.module.scss';
import Button from '../Button/Button';
import Icon from './Icon';

// single element of an accordion
class Expandable extends Component {
  constructor(props) {
    super(props);
    this.expandableRef = React.createRef();
    this.headerRef = React.createRef();
  }

  state = {
    isOpen: this.props.isActive ? true : false,
  };

  componentDidMount() {
    this.setMaxHeight();
  }

  componentDidUpdate() {
    this.setMaxHeight();
  }

  setMaxHeight = () => {
    const container = this.expandableRef.current;
    const header = this.headerRef.current;

    console.log('container: ', container);
    if (this.state.isOpen) {
      container.style.maxHeight = container.scrollHeight + 'px';
    } else {
      container.style.maxHeight = header.offsetHeight + 'px';
    }
  };
  onClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('onClickHandler');
    this.setState((prevState) => {
      return { isOpen: !prevState.isOpen };
    });
  };

  render() {
    //is Active?
    let additionalClasses = [];
    if (this.state.isOpen === true) {
      additionalClasses.push(classes.Active);
    }

    return (
      <div className={classes.Expandable} ref={this.expandableRef}>
        <div
          className={[classes.Header, ...additionalClasses].join(' ')}
          ref={this.headerRef}
          onClick={(event) => this.onClickHandler(event)}>
          <div className={classes.Title}>
            {this.props.title ? this.props.title : null}
          </div>
          <Button type='NoStyle' className={classes.ExpandButton}>
            <Icon
              iconstyle='fas'
              code={this.state.isOpen ? 'chevron-up' : 'chevron-down'}
              size='sm'
            />
          </Button>
        </div>
        <div className={[classes.Body, ...additionalClasses].join(' ')}>
          {this.props.children ? this.props.children : null}
        </div>
      </div>
    );
  }
}

export default Expandable;

{
  /* <div className={classes.Accordion}>
  <div className={classes.DisplayTitle}>{val.url.data}</div>
  <div className={classes.DisplayBody} style={{ backgroundColor: 'orange' }}>
    
  </div>
</div>; */
}