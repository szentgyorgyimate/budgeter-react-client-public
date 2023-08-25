import React from 'react';
import Routes from '../Routes/Routes';

import styles from './Layout.module.css';

function Layout() {
    return (
        <div className={styles.container}>
            <Routes />
        </div>
    );
}

export default Layout;