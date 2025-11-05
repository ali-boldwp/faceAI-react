import React from 'react';
import './assets/scss/style.scss';
import Routing from './Routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
      <>
    <Routing />
  <Toaster position="top-right" reverseOrder={false} />
      </>
  );
}

export default App;
