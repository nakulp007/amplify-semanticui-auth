/*
This is a really simple component that takes an isLoading flag and 
the text that the button displays in the two states 
(the default state and the loading state). 
The disabled prop is a result of what we have currently in our 
Login button. And we ensure that the button is disabled when 
isLoading is true. This makes it so that the user can’t click it 
while we are in the process of logging them in.
*/

import React from "react";
import { Button, Icon } from 'semantic-ui-react';

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Icon name="spinner" loading />}
    {!isLoading ? text : loadingText}
  </Button>;