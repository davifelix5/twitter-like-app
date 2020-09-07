import React, { createContext } from 'react';

import Router from './routes'

export const AuthContext = createContext()

function App({ username }) {
  return (
    <AuthContext.Provider value={{ username }}>
      <Router />
    </AuthContext.Provider>
  )
}

export default App;
