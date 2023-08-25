import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Navigation.module.css';

import * as paths from '../../shared/paths';

const Navigation = () => (
    <nav>
        <ul>
            <li>
                <NavLink to="/">Kezdőlap</NavLink>
            </li>
            <li>
                <NavLink to={paths.PRIVATE_BUDGETSHEETS}>Magán költségvetési lapok</NavLink>
            </li>
            <li>
                <NavLink to={paths.COMPANY_BUDGETSHEETS}>Céges költségvetési lapok</NavLink>
            </li>
            <li>
                <NavLink to={paths.UNPAID_DEBTS}>Tartozások</NavLink>
            </li>
            <li>
                <NavLink to={paths.BUDGET_CATEGORIES}>Kategóriák</NavLink>
            </li>
            <li>
                <NavLink to={paths.FINANCIAL_RESOURCE_TYPES}>Pénzforrás típusok</NavLink>
            </li>
        </ul>
    </nav>
);

export default Navigation;