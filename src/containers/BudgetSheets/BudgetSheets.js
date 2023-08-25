import React, { useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import Summary from '../../components/BudgetSheets/Summary/Summary';
import BudgetSheetRow from '../../components/BudgetSheets/BudgetSheetRow/BudgetSheetRow';
import CreateBudgetSheet from '../../components/BudgetSheets/CreateBudgetSheet/CreateBudgetSheet';
import EditBudgetSheet from '../../components/BudgetSheets/EditBudgetSheet/EditBudgetSheet';
import DeleteBudgetSheetConfirmation from '../../components/BudgetSheets/DeleteBudgetSheetConfirmation/DeleteBudgetSheetConfirmation';
import Loader from '../../components/Loader/Loader';

import budgetSheetsReducer from '../../store/reducers/budgetSheetsReducer';
import * as paths from '../../shared/paths';
import * as actionTypes from '../../store/actions/budgetSheetsActionTypes';
import { toForintString, toShortDateString, sortAsc, sortByStartDateDesc } from '../../shared/utils';
import { RESPONSE_STATUS_SUCCESS } from '../../shared/common';
import { UI_STATE_LOADING, UI_STATE_ADDING, UI_STATE_EDITING, UI_STATE_DELETING } from '../../shared/uiStates';

import styles from './BudgetSheets.module.css';

const initialBudgetSheetsData = {
    yearList: [],
    selectedYear: 0,
    budgetSheetList: [],
    financialResourceTypeList: [],
    uiState: UI_STATE_LOADING,
    selectedBudgetSheetId: null
};

function getNewBudgetSheet(resultData, amountSum, date) {
    return {
        id: resultData.id,
        urlSlug: resultData.urlSlug,
        balance: 0,
        debt: 0,
        income: 0,
        initialCapital: amountSum,
        outcome: 0,
        investment: 0,
        remainingAmount: amountSum,
        repayment: 0,
        returnOnInvestment: 0,
        startDate: date,
        financialResources: resultData.financialResources
    }
};

function BudgetSheets() {
    const [budgetSheetsData, dispatch] = useReducer(budgetSheetsReducer, initialBudgetSheetsData);

    useEffect(() => {
        let unmounted = false;
        const url = `${paths.BASE_URL}${paths.BUDGETSHEETS}`;

        async function fetchBudgetSheets() {
            let response = await fetch(url);

            if (!unmounted) {
                var jsonResponse = await response.json();

                dispatch({ type: actionTypes.INIT, data: jsonResponse.data });
            }
        }

        fetchBudgetSheets();

        return () => unmounted = true;
    }, []);

    const history = useHistory();

    async function getBudgetSheetsByYear(year) {
        const alreadyLoaded = budgetSheetsData.budgetSheetList.some(bs => bs.startDate.startsWith(year.toString()));

        if (alreadyLoaded) {
            dispatch({ type: actionTypes.SET_YEAR, year: year });
        } else {
            dispatch({ type: actionTypes.GET_BUDGETSHEETS_BY_YEAR_START, year: year });

            const url = `${paths.BASE_URL}${paths.BUDGETSHEETS_BY_YEAR}/${year}`;
            const response = await fetch(url);
            const jsonResponse = await response.json();
            const updatedBudgetSheetList = [
                ...budgetSheetsData.budgetSheetList,
                ...jsonResponse.data
            ];

            dispatch({ type: actionTypes.SET_LOADED_BUDGETSHEETS, budgetSheets: updatedBudgetSheetList });
        }
    };

    function getSelectedBudgetSheetBySelectedId() {
        return budgetSheetsData.budgetSheetList.find(b => b.id === budgetSheetsData.selectedBudgetSheetId);
    };

    async function onAddSaveClicked(date, financialResourceData) {
        const postData = {
            startDate: date,
            financialResources: financialResourceData
        };

        const postOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(postData)
        };

        const response = await fetch(`${paths.BASE_URL}${paths.BUDGETSHEETS}`, postOptions);
        const jsonResponse = await response.json();

        handleBudgetSheetAdded(jsonResponse.data, date);
    };

    function handleBudgetSheetAdded(responseData, date) {
        const year = parseInt(date.substring(0, 4));
        let amountSum = 0;

        responseData.financialResources.forEach(fr => {
            amountSum += fr.initialAmount;
        });

        const updatedBudgetSheetList = [
            ...budgetSheetsData.budgetSheetList,
            getNewBudgetSheet(responseData, amountSum, date)
        ];

        updatedBudgetSheetList.sort(sortByStartDateDesc);

        let updatedYearList = [...budgetSheetsData.yearList];

        if (!budgetSheetsData.yearList.includes(year)) {
            updatedYearList = [
                ...budgetSheetsData.yearList,
                year
            ];

            updatedYearList.sort(sortAsc);
        }

        dispatch({ type: actionTypes.ADD_SUCCESS, yearList: updatedYearList, budgetSheetList: updatedBudgetSheetList });
    };

    async function onEditSaveClicked(financialResources) {
        const selectedBudgetSheet = getSelectedBudgetSheetBySelectedId();

        const modifiedFinancialResources =
            financialResources.filter(fr => selectedBudgetSheet.financialResources.filter(ofr => ofr.id === fr.id)[0].initialAmount !== fr.initialAmount);

        if (modifiedFinancialResources.length > 0) {
            const patchData = {
                id: selectedBudgetSheet.id,
                financialResources: modifiedFinancialResources.map(mfr => {
                    return {
                        financialResourceId: mfr.id,
                        amount: mfr.initialAmount
                    }
                })
            };

            const patchOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'PATCH',
                body: JSON.stringify(patchData)
            };

            const url = `${paths.BASE_URL}${paths.BUDGETSHEETS}`;
            let result;

            try {
                const response = await fetch(url, patchOptions);
                result = await response.json();
            } catch (err) {
                console.error(`[ERROR]: fetching url ${url}`);
            }

            if (result && result.status === RESPONSE_STATUS_SUCCESS) {
                handleBudgetSheetEdited(financialResources);
            } else {
                console.error('[ERROR]: Edit budgetsheet failed');
            }
        } else {
            dispatch({ type: actionTypes.EDIT_CANCEL });
        }
    };

    function handleBudgetSheetEdited(financialResources) {
        let initialCapital = 0;

        financialResources.forEach(fr => {
            initialCapital += fr.initialAmount;
        });

        const updatedBudgetSheetList = budgetSheetsData.budgetSheetList.map(bs => {
            if (bs.id === budgetSheetsData.selectedBudgetSheetId) {
                return {
                    ...bs,
                    initialCapital,
                    remainingAmount: initialCapital + bs.balance,
                    financialResources
                };
            } else {
                return bs;
            }
        });

        dispatch({ type: actionTypes.EDIT_SUCCESS, budgetSheetList: updatedBudgetSheetList });
    };

    async function onDeleteConfirmationYesClicked(id) {
        const deleteOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE'
        };

        const url = `${paths.BASE_URL}${paths.BUDGETSHEETS}/${id}`;
        let result;

        try {
            const response = await fetch(url, deleteOptions);
            result = await response.json();
        } catch (err) {
            console.error(`[ERROR]: fetching url ${url}`);
        }

        if (result && result.status === RESPONSE_STATUS_SUCCESS) {
            handleBudgetSheetDeleted(id);
        } else {
            console.error('[ERROR]: Delete budgetsheet failed');
        }
    };

    function onDeleteConfirmationNoClicked() {
        dispatch({ type: actionTypes.DELETE_CANCEL });
    };

    function handleBudgetSheetDeleted(id) {
        const updatedBudgetSheetList = [...budgetSheetsData.budgetSheetList].filter(bs => bs.id !== id);

        dispatch({ type: actionTypes.DELETE_SUCCESS, budgetSheetList: updatedBudgetSheetList });
    };

    let budgetSheetRows = (
        <Loader />
    );

    let yearSelector = null;
    let summary = null;
    let createBudgetSheet = null;
    let editBudgetSheet = null;
    let deleteBudgetSheet = null;

    if (budgetSheetsData.uiState === UI_STATE_ADDING) {
        createBudgetSheet = (
            <CreateBudgetSheet
                saveClick={onAddSaveClicked}
                cancelClick={() => { dispatch({ type: actionTypes.ADD_CANCEL }) }}
                financialResourceTypes={budgetSheetsData.financialResourceTypeList}
            />
        );
    } else if (budgetSheetsData.uiState === UI_STATE_EDITING) {
        const selectedBudgetSheet = getSelectedBudgetSheetBySelectedId();

        const financialResourcesToUpdate = selectedBudgetSheet.financialResources.map(fr => {
            return {
                id: fr.id,
                name: fr.name,
                initialAmount: fr.initialAmount
            };
        });

        editBudgetSheet = (
            <EditBudgetSheet
                saveClick={onEditSaveClicked}
                cancelClick={() => { dispatch({ type: actionTypes.EDIT_CANCEL }) }}
                financialResources={financialResourcesToUpdate}
            />
        );
    } else if (budgetSheetsData.uiState === UI_STATE_DELETING) {
        const selectedBudgetSheet = getSelectedBudgetSheetBySelectedId();

        deleteBudgetSheet = (
            <DeleteBudgetSheetConfirmation
                budgetSheet={selectedBudgetSheet}
                yesClick={onDeleteConfirmationYesClicked}
                noClick={onDeleteConfirmationNoClicked} />
        );
    }

    if (budgetSheetsData.yearList.length > 0) {
        yearSelector = (
            <select className={styles.yearselector} value={budgetSheetsData.selectedYear} onChange={(e) => { getBudgetSheetsByYear(e.target.value); }}>
                {budgetSheetsData.yearList.map(y =>
                    <option key={y} value={y}>{y}</option>
                )}
            </select>
        );
    }

    if (budgetSheetsData.uiState !== UI_STATE_LOADING) {
        const filteredBudgetSheetList = budgetSheetsData.budgetSheetList.filter(bs => bs.startDate.startsWith(budgetSheetsData.selectedYear.toString()));

        let balanceSum = 0;
        let incomeSum = 0;
        let outcomeSum = 0;
        let investmentSum = 0;
        let returnOnInvestmentSum = 0;
        let debtSum = 0;
        let repaymentSum = 0;

        filteredBudgetSheetList.forEach(bs => {
            balanceSum += bs.balance;
            incomeSum += bs.income;
            outcomeSum += bs.outcome;
            investmentSum += bs.investment;
            returnOnInvestmentSum += bs.returnOnInvestment;
            debtSum += bs.debt;
            repaymentSum += bs.repayment;
        });

        summary = (
            <Summary
                outcomeSum={toForintString(outcomeSum)}
                incomeSum={toForintString(incomeSum)}
                investmentSum={toForintString(investmentSum)}
                returnOnInvestmentSum={toForintString(returnOnInvestmentSum)}
                debtSum={toForintString(debtSum)}
                repaymentSum={toForintString(repaymentSum)}
                balanceSum={toForintString(balanceSum)}
                negativeBalance={balanceSum < 0}
            />
        );

        budgetSheetRows = (
            <>
                {filteredBudgetSheetList.map(bs => {
                    return (
                        <BudgetSheetRow
                            key={bs.id}
                            startDate={toShortDateString(bs.startDate)}
                            openUrl={`${paths.BUDGETSHEETS}/${bs.urlSlug}`}
                            onEditClick={() => dispatch({ type: actionTypes.EDIT_INIT, selectedBudgetSheetId: bs.id })}
                            onDeleteClick={() => dispatch({ type: actionTypes.DELETE_INIT, selectedBudgetSheetId: bs.id })}
                            balance={toForintString(bs.balance)}
                            income={toForintString(bs.income)}
                            outcome={toForintString(bs.outcome)}
                            initialCapital={toForintString(bs.initialCapital)}
                            remainingAmount={toForintString(bs.remainingAmount)}
                            investment={toForintString(bs.investment)}
                            returnOnInvestment={toForintString(bs.returnOnInvestment)}
                            debt={toForintString(bs.debt)}
                            repayment={toForintString(bs.repayment)}
                        />
                    )
                })}
            </>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>Költségvetés választó</span>
                    <button onClick={() => { dispatch({ type: actionTypes.ADD_INIT }); }}>Új költségvetési lap</button>
                    {yearSelector}
                    <button onClick={() => { history.push(paths.DEBTS); }}>Tartozások</button>
                </div>
                <div className={styles.left}>
                    {summary}
                </div>
                <div className={styles.main}>
                    {budgetSheetRows}
                </div>
                <div className={styles.right}>

                </div>
            </div>
            {createBudgetSheet}
            {editBudgetSheet}
            {deleteBudgetSheet}
        </>
    );
};

export default BudgetSheets;