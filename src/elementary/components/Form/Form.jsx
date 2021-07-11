import React, { useEffect, useState } from 'react';
import { FormProvider, useFormValues } from './FormContext';
import { cls, formatValidate } from '../utils';

import styles from './Form.scss';

export const Form = ({ children, ...attrs }) => {
  const { form } = styles;
  const className = cls(form, attrs.className);
  
  return (
    <FormProvider>
      <FormChild { ...attrs } className={ className }>
        { children }
      </FormChild>
    </FormProvider>
  );
};

const FormChild = ({ children, validations, onSubmit, ...attrs }) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const { setValidations } = useFormValues();
  const { loading } = styles;
  const className = cls(attrs.className, isLoading && loading);
  const formatedValidations = formatValidations(validations);
  const handleSubmit = e => {
    const data = getDataObj(e.target);
    const { elements } = e.target;
    const allValid = formatedValidations.every(({ name, valid }) => {
      const element = elements[name];
      const isValid = valid(element);
      element.focus();
      isValid && element.blur();
      return isValid;
    });
    
    if (allValid && !isLoading) {
      setIsLoading(true);
      const submitPromise = onSubmit(data);
      if (submitPromise && submitPromise.then) {
        submitPromise.then(() => setIsLoading(false));
      }
    }
    e.preventDefault();
  };

  useEffect(() => {
    setValidations(formatedValidations);
  }, []);

  return (
    <form { ...attrs } className={ className } onSubmit={ handleSubmit } >
      { children }
    </form>
  );
};

const getDataObj = form => Object.fromEntries(new FormData(form));

const formatValidations = validations => {
  const keys = Object.keys(validations || {});
  return keys.map(key => {
    return {
      name: key,
      valid: formatValidate(validations[key])
    }
  });
}