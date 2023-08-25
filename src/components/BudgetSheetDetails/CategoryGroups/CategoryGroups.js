import React from "react";

import { toForintString, sortByName } from "../../../shared/utils";

import styles from './CategoryGroups.module.css';

const INCOME = 'income';
const OUTCOME = 'outcome';

function CategoryGroup({ type, groups }) {
    let amountStyle = '';
    let headerText = '';

    if (type === INCOME) {
        headerText = 'Bevételek';
        amountStyle = 'positive-amount';
    } else if (type === OUTCOME) {
        headerText = 'Kiadások';
        amountStyle = 'negative-amount';
    } else {
        throw new Error('Invalid category group type!')
    }

    return (
        <div className={styles['category-container']}>
            <div className={styles['category-header']}>
                {headerText}
            </div>
            {groups.sort(sortByName).map(cg => (
                <div className={styles['category-row']} key={cg.name}><span>{cg.name}</span><span className={styles[amountStyle]}>{toForintString(cg.amount)}</span></div>
            ))}
            <div className={styles['category-row-summary']}>
                <span>Összesen</span>
                <span className={styles[amountStyle]}>{toForintString(groups.reduce((previous, current) => previous + current.amount, 0))}</span>
            </div>
        </div>
    );
}

function CategoryGroups({ categoryOutcomeGroups, categoryIncomeGroups }) {
    return (
        <>
            <CategoryGroup type={INCOME} groups={categoryIncomeGroups} />
            <CategoryGroup type={OUTCOME} groups={categoryOutcomeGroups} />
        </>
    );
};

export default CategoryGroups;