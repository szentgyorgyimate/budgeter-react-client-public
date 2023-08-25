import React from 'react';
import { withRouter } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';

const App = () => (
    <Layout />
);

export default withRouter(App);