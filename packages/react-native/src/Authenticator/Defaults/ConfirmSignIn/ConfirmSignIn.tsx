import React, { useMemo } from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';

import {
  DefaultContent,
  DefaultFooter,
  DefaultTextFormFields,
  DefaultHeader,
} from '../../common';
import { useFieldValues } from '../../hooks';

import { DefaultConfirmSignInComponent } from '../types';

const COMPONENT_NAME = 'ConfirmSignIn';

const {
  getBackToSignInText,
  getChallengeText,
  getConfirmText,
  getConfirmingText,
} = authenticatorTextUtil;

const ConfirmSignIn: DefaultConfirmSignInComponent = ({
  challengeName,
  fields,
  handleBlur,
  handleChange,
  handleSubmit,
  isPending,
  toSignIn,
  ...rest
}) => {
  const { fields: fieldsWithHandlers, handleFormSubmit } = useFieldValues({
    componentName: COMPONENT_NAME,
    fields,
    handleBlur,
    handleChange,
    handleSubmit,
  });

  const headerText = getChallengeText(challengeName);
  const primaryButtonText = isPending ? getConfirmingText() : getConfirmText();
  const secondaryButtonText = getBackToSignInText();

  const buttons = useMemo(
    () => ({
      primary: { children: primaryButtonText, onPress: handleFormSubmit },
      links: [{ children: secondaryButtonText, onPress: toSignIn }],
    }),
    [handleFormSubmit, primaryButtonText, secondaryButtonText, toSignIn]
  );

  return (
    <DefaultContent
      {...rest}
      buttons={buttons}
      headerText={headerText}
      fields={fieldsWithHandlers}
      isPending={isPending}
    />
  );
};

ConfirmSignIn.Footer = DefaultFooter;
ConfirmSignIn.FormFields = DefaultTextFormFields;
ConfirmSignIn.Header = DefaultHeader;

ConfirmSignIn.displayName = COMPONENT_NAME;
export default ConfirmSignIn;
