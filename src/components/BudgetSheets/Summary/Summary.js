import React from "react";

import styles from './Summary.module.css';

function Summary({ outcomeSum, incomeSum, investmentSum, returnOnInvestmentSum, debtSum, repaymentSum, balanceSum, negativeBalance }) {
    return (
        <>
            <div className={styles['summary-name']}>Éves összesítő</div>
            <div className={styles['summary-row']}>
                <span>Kiadás</span><span>{outcomeSum}</span>
            </div>
            <div className={styles['summary-row']}>
                <span>Bevétel</span><span>{incomeSum}</span>
            </div>
            <div className={styles['summary-row']}>
                <span>Befektetés</span><span>{investmentSum}</span>
            </div>
            <div className={styles['summary-row']}>
                <span>Befektetésből kivett</span><span>{returnOnInvestmentSum}</span>
            </div>
            <div className={styles['summary-row']}>
                <span>Tartozás</span><span>{debtSum}</span>
            </div>
            <div className={styles['summary-row']}>
                <span>Visszafizetés</span><span>{repaymentSum}</span>
            </div>
            <div className={styles['summary-balance-row']}>
                <span>Mérleg</span><span className={negativeBalance ? styles['negative-amount'] : styles['positive-amount']}>{balanceSum}</span>
            </div>
        </>
    )
};

export default Summary;