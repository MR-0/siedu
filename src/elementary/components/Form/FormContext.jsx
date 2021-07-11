import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [ validations, setValidations ] = useState(null);
  const validate = element => {
    const validation = validations && validations
      .find(({ name }) => name === element.name);
    return validation ? validation.valid(element) : true;
  };
  return (
    <FormContext.Provider value={{ validate, validations, setValidations }}>
      { children }
    </FormContext.Provider>
  );
};

export const useFormValues = () => useContext(FormContext);