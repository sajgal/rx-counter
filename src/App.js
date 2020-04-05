import React from 'react';
import { createGlobalStyle } from 'styled-components'

import Counter from './Counter';

const GlobalStyle = createGlobalStyle`
  :root {
    --color-black: rgba(7, 30, 34, 1);
    --color-green: rgba(29, 120, 116, 1);
    --color-red: rgba(192, 50, 33, 1);
    --color-peach: rgba(244, 192, 149, 1);
    --color-white: rgba(232, 232, 232, 1);
  }

  body {
    margin: 0;
    background: var(--color-white);
    color: var(--color-black);
  }
`

function App() {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Counter />
    </React.Fragment>
  );
}

export default App;