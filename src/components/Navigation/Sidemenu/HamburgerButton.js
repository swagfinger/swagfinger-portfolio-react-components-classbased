import React from 'react';
import classes from './HamburgerButton.module.scss';
import Utils from '../../../Utils';
import Icon from '../../UI/Icon/Icon';
const hamburgerButton = (props) => {
  let classList = Utils.getClassNameString([
    props.className,
    'HamburgerButton',
    classes.HamburgerButton
  ]);

  return (
    <div className={classList} onClick={props.onClick}>
      <Icon iconstyle='fas' code='bars' size='sm'></Icon>
    </div>
  );
};

export default hamburgerButton;
