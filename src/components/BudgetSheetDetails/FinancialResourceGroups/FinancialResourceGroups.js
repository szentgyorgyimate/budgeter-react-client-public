import React from "react";

import { toForintString, sortByName } from "../../../shared/utils";

import styles from './FinancialResourceGroups.module.css';

function FinancialResourceGroup({ financialResourceGroup }) {
    return (
        <div className={styles['financial-resource']}>
            <div className={styles['financial-resource-name']}>{financialResourceGroup.name}</div>
            <div className={styles['financial-resource-row']}>
                <span>Tőke</span><span>{toForintString(financialResourceGroup.initialAmount)}</span>
            </div>
            <div className={styles['financial-resource-row']}>
                <span>Egyenleg</span><span>{toForintString(financialResourceGroup.currentAmount)}</span>
            </div>
            <div className={styles['financial-resource-row']}>
                <span>Mérleg</span><span className={financialResourceGroup.balance >= 0 ? styles['positive-amount'] : styles['negative-amount']}>{toForintString(financialResourceGroup.balance)}</span>
            </div>
        </div>
    );
};

function FinancialResourceSummary({ financialResourceGroups }) {
    const initialAmountSum = financialResourceGroups.reduce((previous, current) => previous + current.initialAmount, 0);
    const currentAmountSum = financialResourceGroups.reduce((previous, current) => previous + current.currentAmount, 0);
    const balanceSum = financialResourceGroups.reduce((previous, current) => previous + current.balance, 0);

    return (
        <div className={styles['financial-resource-summary']} >
            <div className={styles['financial-resource-name']}>Összesen</div>
            <div className={styles['financial-resource-row']}>
                <span>Tőke</span><span>{toForintString(initialAmountSum)}</span>
            </div>
            <div className={styles['financial-resource-row']}>
                <span>Egyenleg</span><span>{toForintString(currentAmountSum)}</span>
            </div>
            <div className={styles['financial-resource-row']}>
                <span>Mérleg</span><span className={balanceSum >= 0 ? styles['positive-amount'] : styles['negative-amount']}>
                    {toForintString(balanceSum)}
                </span>
            </div>
        </div>
    );
}

function FinancialResourceGroups({ financialResourceGroups }) {
    return (
        <>
            {financialResourceGroups.sort(sortByName).map(frg => (
                <FinancialResourceGroup key={frg.name} financialResourceGroup={frg} />
            ))}
            <FinancialResourceSummary financialResourceGroups={financialResourceGroups} />
        </>
    );
};

export default FinancialResourceGroups;