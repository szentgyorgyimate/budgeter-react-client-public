import React from "react";

import styles from './BudgetSheetRow.module.css';

function BudgetSheetRow({ startDate, openUrl, onEditClick, onDeleteClick, balance, income, outcome, initialCapital, remainingAmount, investment, returnOnInvestment, debt, repayment }) {
    return (
        <div className={styles.budgetsheet}>
            <div className={styles['row-header']}>
                <span>{startDate}</span>
                <a href={openUrl}><i className="fas fa-folder-open"></i></a>
                <span className={styles['edit-button']} onClick={onEditClick}><i className="far fa-edit"></i></span>
                <span className={styles['delete-button']} onClick={onDeleteClick}><i className="far fa-trash-alt"></i></span>
            </div>
            <div className={styles.row}>
                <div className={styles.data}>
                    <span className={styles.label}><i className="fas fa-balance-scale"></i> Mérleg</span>
                    <span className={styles.amount}>{balance}</span>
                </div>
                <div className={styles.data}>
                    <span className={`${styles.label} ${styles.green}`}><i className="fas fa-plus-circle"></i> Bevétel</span>
                    <span className={styles.amount}>{income}</span>
                </div>
                <div className={styles.data}>
                    <span className={`${styles.label} ${styles.red}`}><i className="fas fa-minus-circle"></i> Kiadás</span>
                    <span className={styles.amount}>{outcome}</span>
                </div>
                <div className={styles.data}>
                    <span className={styles.label}><i className="fas fa-coins"></i> Kezdő</span>
                    <span className={styles.amount}>{initialCapital}</span>
                </div>
                <div className={styles.data}>
                    <span className={styles.label}><i className="fas fa-wallet"></i> Maradék</span>
                    <span className={styles.amount}>{remainingAmount}</span>
                </div>
                <div className={styles.data}>
                    <span className={styles.label}><i className="fas fa-chart-line"></i> Befektetés</span>
                    <span className={styles.amount}>{investment}</span>
                </div>
                <div className={styles.data}>
                    <span className={`${styles.label} ${styles.green}`}><i className="fas fa-chart-line"></i> Kivett</span>
                    <span className={styles.amount}>{returnOnInvestment}</span>
                </div>
                <div className={styles.data}>
                    <span className={`${styles.label} ${styles.green}`}><i className="fas fa-arrow-alt-circle-up"></i> Tartozás</span>
                    <span className={styles.amount}>{debt}</span>
                </div>
                <div className={styles.data}>
                    <span className={`${styles.label} ${styles.red}`}><i className="fas fa-arrow-alt-circle-down"></i> Visszafizetés</span>
                    <span className={styles.amount}>{repayment}</span>
                </div>
            </div>
        </div>
    );
}

export default BudgetSheetRow;