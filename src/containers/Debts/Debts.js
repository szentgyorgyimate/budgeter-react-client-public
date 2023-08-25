import React, { useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import Repayment from '../../components/Debts/Repayment/Repayment';
import Loader from '../../components/Loader/Loader';

import debtsReducer from '../../store/reducers/debtsReducer';
import * as paths from '../../shared/paths';
import * as actionTypes from '../../store/actions/debtsActionTypes';
import { UI_STATE_LOADING, UI_STATE_REPAYING } from '../../shared/uiStates';
import { toForintString, toShortDateString } from '../../shared/utils';

import styles from './Debts.module.css';

const initialDebtsData = {
    debtList: [],
    financialResourceTypes: [],
    repaymentTypes: [],
    uiState: UI_STATE_LOADING,
    selectedBudgetRowId: null
};

function Debts() {
    const history = useHistory();

    const [debtsData, dispatch] = useReducer(debtsReducer, initialDebtsData);

    useEffect(() => {
        let unmounted = false;
        const url = `${paths.BASE_URL}${paths.DEBTS}`;

        async function fetchDebts() {
            const response = await fetch(url);

            if (!unmounted) {
                const jsonResponse = await response.json();
                const responseData = jsonResponse.data;

                const debtList = responseData.debts.map(d => {
                    return {
                        ...d,
                        selected: false
                    }
                });

                dispatch({ type: actionTypes.INIT, debtList, financialResourceTypes: responseData.financialResourceTypes, repaymentTypes: responseData.repaymentTypes });
            }
        }

        fetchDebts();

        return () => unmounted = true;
    }, []);

    function onSelectedChange(budgetRowId, selected) {
        const updatedDebtList = debtsData.debtList.map(d => {
            if (d.budgetRowId === budgetRowId) {
                return {
                    ...d,
                    selected: selected
                };
            } else {
                return d;
            }
        });

        dispatch({ type: actionTypes.DEBTLIST_CHANGE, debtList: updatedDebtList });
    };

    function clearSelection() {
        if (debtsData.debtList.some(d => d.selected)) {
            const updatedDebtList = debtsData.debtList.map(d => {
                return {
                    ...d,
                    selected: false
                };
            });

            dispatch({ type: actionTypes.DEBTLIST_CHANGE, debtList: updatedDebtList });
        }
    };

    function getSelectedDebtBySelectedId() {
        return debtsData.debtList.find(d => d.budgetRowId === debtsData.selectedBudgetRowId);
    };

    async function onRepaymentSaveClicked(amount, date, financialResourceTypeId, repaymentTypeId) {
        const selectedDebt = getSelectedDebtBySelectedId();

        const postData = {
            budgetRowId: selectedDebt.budgetRowId,
            comment: selectedDebt.comment,
            amount,
            date,
            financialResourceTypeId,
            repaymentTypeId
        };

        const postOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(postData)
        };

        await fetch(`${paths.BASE_URL}${paths.DEBTS}`, postOptions);

        handleRepayment(amount);
    };

    function handleRepayment(amount) {
        let updatedDebtList;
        const selectedDebt = getSelectedDebtBySelectedId();

        if (selectedDebt.remainingAmount - amount > 0) {
            updatedDebtList = debtsData.debtList.map(d => {
                if (d.budgetRowId === selectedDebt.budgetRowId) {
                    return {
                        ...d,
                        paidAmount: d.paidAmount + amount,
                        remainingAmount: d.remainingAmount - amount
                    };
                } else {
                    return d;
                }
            });
        } else {
            updatedDebtList = [...debtsData.debtList].filter(d => d.budgetRowId !== selectedDebt.budgetRowId);
        }

        dispatch({ type: actionTypes.REPAYMENT_SUCCESS, debtList: updatedDebtList });
    };

    let debts = <Loader />;
    let debtSum = null;
    let selectedDebtSum = null;
    let repayment = null;

    if (debtsData.uiState === UI_STATE_REPAYING) {
        const defaultFinancialResourceType = debtsData.financialResourceTypes.filter(fr => fr.name === 'Készpénz')[0];
        const defaultRepaymentType = debtsData.repaymentTypes.filter(r => r.name === 'Törlesztés')[0];

        repayment = (
            <Repayment
                saveClick={onRepaymentSaveClicked}
                cancelClick={() => dispatch({ type: actionTypes.REPAYMENT_CANCEL })}
                financialResourceTypes={debtsData.financialResourceTypes}
                defaultFinancialResourceType={defaultFinancialResourceType}
                repaymentTypes={debtsData.repaymentTypes}
                defaultRepaymentType={defaultRepaymentType}
                selectedDebt={getSelectedDebtBySelectedId()} />
        );
    }

    if (debtsData.uiState !== UI_STATE_LOADING) {
        let remainingAmountSum = 0;
        let selectedAmountSum = 0;

        debtsData.debtList.forEach(d => {
            remainingAmountSum += d.remainingAmount;

            if (d.selected) {
                selectedAmountSum += d.remainingAmount;
            }
        });

        debtSum = (
            <div className={styles['debt-sum']}>
                <label>Tartozások</label>
                <div>
                    <span>Összesen</span>
                    <span>{toForintString(remainingAmountSum)}</span>
                </div>
            </div>
        );

        selectedDebtSum = (
            <>
                <div className={styles['debt-sum']}>
                    <label>Kijelölt tartozások</label>
                    <div>
                        <span>Összesen</span>
                        <span>{toForintString(selectedAmountSum)}</span>
                    </div>
                </div>
                <div className={styles['clear-selection']}>
                    <input type="button" value="Kijelölések törlése" onClick={clearSelection} />
                </div>
            </>
        );

        debts = (
            <>
                {debtsData.debtList.map(d =>
                    <div className={styles.debtrow} key={d.budgetRowId}>
                        <div className={styles['click-wrapper']} onClick={() => { onSelectedChange(d.budgetRowId, !d.selected); }}>
                            <div className={styles.debtdata} >
                                <div>
                                    <input type="checkbox" className={styles.checkbox} checked={d.selected} onChange={(e) => { onSelectedChange(d.budgetRowId, e.target.checked); }} />
                                    <span className={styles.date}>{toShortDateString(d.date)}</span> <span>{d.comment}</span>
                                </div>
                                <div className={styles['amount-row']}>
                                    <span className={styles.amount}>{toForintString(d.amount)}</span>
                                    <span className={styles.separator}>|</span>
                                    <span className={styles['paid-amount']}>{toForintString(d.paidAmount)}</span>
                                    <span className={styles.separator}>|</span>
                                    <span className={styles['remaining-amount']}>{toForintString(d.remainingAmount)}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.repayment}>
                            <input type="button" value="Törlesztés" onClick={() => dispatch({ type: actionTypes.REPAYMENT_INIT, selectedBudgetRowId: d.budgetRowId })} />
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>Tartozások</span>
                    <button onClick={() => { history.push(paths.BUDGETSHEETS); }}>Költségvetési lapok</button>
                </div>
                <div className={styles.left}>
                    {debtSum}
                    {selectedDebtSum}
                </div>
                <div className={styles.main}>
                    {debts}
                </div>
                <div className={styles.right}>

                </div>
            </div>
            {repayment}
        </>
    );
};

export default Debts;