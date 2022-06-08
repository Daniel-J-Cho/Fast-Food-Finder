import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// const franchiseNames = [
//   { name: 'McDonald\'s' },
//   { name: 'Taco Bell' },
//   { name: 'In-N-Out' },
//   { name: 'Chipotle' },
//   { name: 'Burger King' },
//   { name: 'Del Taco' },
//   { name: 'Carl\'s Jr' },
//   { name: 'Wienerschnitzel' },
//   { name: 'Subway' },
//   { name: 'Jersey Mike\'s' }
// ];

const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);

root.render(<App />);
