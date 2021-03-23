import React from 'react';
import { render } from 'react-dom';
import { App } from './Components/App/App.jsx';

import { configureFakeBackend } from './_helpers';
configureFakeBackend();

render(
    <App />,
    document.getElementById('app')
);
