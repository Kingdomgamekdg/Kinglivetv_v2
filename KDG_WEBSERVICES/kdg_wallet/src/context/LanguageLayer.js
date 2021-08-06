import React, { createContext, useContext, useReducer } from 'react';

const LanguageContext = createContext();

export const LanguageLayer = ({ initialState, reducer, children }) => (
  <LanguageContext.Provider value={useReducer(reducer, initialState)}>{children}</LanguageContext.Provider>
);

export const useLang = () => useContext(LanguageContext);
