import React, { useEffect, useReducer } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import FinancialResourceGroups from '../../components/BudgetSheetDetails/FinancialResourceGroups/FinancialResourceGroups';
import CategoryGroups from '../../components/BudgetSheetDetails/CategoryGroups/CategoryGroups';
import CreateBudgetRow from '../../components/BudgetRows/CreateBudgetRow/CreateBudgetRow';
import EditBudgetRow from '../../components/BudgetRows/EditBudgetRow/EditBudgetRow';
import DeleteBudgetRowConfirmation from '../../components/BudgetRows/DeleteBudgetRowConfirmation/DeleteBudgetRowConfirmation';
import CreateDebt from '../../components/BudgetRows/CreateDebt/CreateDebt';
import MoveMoney from '../../components/BudgetRows/MoveMoney/MoveMoney';
import Loader from '../../components/Loader/Loader';

import * as paths from '../../shared/paths';
import * as actionTypes from '../../store/actions/budgetSheetDetailsActionTypes';
import { toForintString, toShortDateString, getDayName, sortByDateDesc, sortByName } from '../../shared/utils';
import { CATEGORY_NOT_PROVIDED_ID, DIRECTION_INCOME_ID, DIRECTION_OUTCOME_ID, RESPONSE_STATUS_SUCCESS } from '../../shared/common';
import budgetRowReducer from '../../store/reducers/budgetSheetDetailsReducer';
import { UI_STATE_LOADING, UI_STATE_ADDING, UI_STATE_EDITING, UI_STATE_DELETING, UI_STATE_DEBT_CREATING, UI_STATE_MONEY_MOVING, } from '../../shared/uiStates';

import styles from './BudgetSheetDetails.module.css';

const initialBudgetSheetDetailsData = {
    directions: [],
    financialResources: [],
    budgetCategories: [],
    budgetRows: [],
    uiState: UI_STATE_LOADING,
    selectedBudgetRowId: null
};

function fillFinancialResourceGroups(budgetRow, financialResourceGroups) {
    const amount = budgetRow.directionId === DIRECTION_OUTCOME_ID ? -budgetRow.amount : budgetRow.amount;

    const financialResourceGroup = financialResourceGroups.filter(frg => frg.name === budgetRow.financialResourceName)[0];
    financialResourceGroup.currentAmount += amount;
};

function fillDateGroups(budgetRow, dateGroups) {
    let dateGroup = dateGroups.filter(dg => dg.date === budgetRow.date)[0];

    if (!dateGroup) {
        dateGroup = {
            date: budgetRow.date,
            budgetRows: [budgetRow],
            dailyBalance: budgetRow.directionId === DIRECTION_INCOME_ID ? budgetRow.amount : -budgetRow.amount
        }

        dateGroups.push(dateGroup);
    } else {
        dateGroup.budgetRows = [...dateGroup.budgetRows, budgetRow];
        if (budgetRow.directionId === DIRECTION_INCOME_ID) {
            dateGroup.dailyBalance += budgetRow.amount;
        } else {
            dateGroup.dailyBalance -= budgetRow.amount;
        }
    }
};

function fillCategoryGroups(budgetRow, categoryIncomeGroups, categoryOutcomeGroups) {
    if (budgetRow.directionId === DIRECTION_INCOME_ID) {
        let categoryIncomeGroup = categoryIncomeGroups.filter(cg => cg.name === budgetRow.categoryName)[0];

        if (!categoryIncomeGroup) {
            categoryIncomeGroup = {
                amount: budgetRow.amount,
                name: budgetRow.categoryName
            };

            categoryIncomeGroups.push(categoryIncomeGroup);
        } else {
            categoryIncomeGroup.amount += budgetRow.amount;
        }
    }

    if (budgetRow.directionId === DIRECTION_OUTCOME_ID) {
        let categoryOutcomeGroup = categoryOutcomeGroups.filter(cg => cg.name === budgetRow.categoryName)[0];

        if (!categoryOutcomeGroup) {
            categoryOutcomeGroup = {
                amount: budgetRow.amount,
                name: budgetRow.categoryName
            };

            categoryOutcomeGroups.push(categoryOutcomeGroup);
        } else {
            categoryOutcomeGroup.amount += budgetRow.amount;
        }
    }
};

function BudgetSheetDetails() {
    const { urlslug } = useParams();

    const [budgetSheetDetailsData, dispatch] = useReducer(budgetRowReducer, initialBudgetSheetDetailsData);

    useEffect(() => {
        let unmounted = false;
        const url = `${paths.BASE_URL}${paths.BUDGETSHEETS}/${urlslug}`;

        async function fetchBudgetSheetDetails() {
            const response = await fetch(url);

            if (!unmounted) {
                const jsonResponse = await response.json();

                dispatch({ type: actionTypes.INIT, data: jsonResponse.data });
            }
        }

        fetchBudgetSheetDetails();

        return () => unmounted = true;
    }, [urlslug]);

    async function onAddSaveClicked(amount, comment, date, category, financialResourceId, directionId) {
        const postData = {
            amount,
            comment,
            date,
            categoryName: category.name,
            categoryId: category.id === 0 ? null : category.id,
            financialResourceId,
            directionId
        };

        const postOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(postData)
        };

        const response = await fetch(`${paths.BASE_URL}${paths.BUDGETROWS}`, postOptions);
        const jsonResponse = await response.json();

        handleBudgetRowAdded(jsonResponse.data, amount, comment, date, category.name, financialResourceId, directionId);
    };

    function handleBudgetRowAdded(responseData, amount, comment, date, categoryName, financialResourceId, directionId) {
        const categoryId = responseData.categoryId;
        const updatedCategories = [...budgetSheetDetailsData.budgetCategories];

        const updatedBudgetRows = [
            ...budgetSheetDetailsData.budgetRows,
            {
                id: responseData.id,
                financialResourceId: financialResourceId,
                budgetCategoryId: categoryId,
                directionId: directionId,
                amount,
                comment,
                date: date.replaceAll('-', '.')
            }
        ];

        updatedBudgetRows.sort(sortByDateDesc);

        if (responseData.isNewCategory) {
            updatedCategories.push({ id: categoryId, name: categoryName });
            updatedCategories.sort(sortByName);
        }

        dispatch({ type: actionTypes.ADD_SUCCESS, budgetRows: updatedBudgetRows, budgetCategories: updatedCategories });
    };

    async function onEditSaveClicked(amount, comment, date, category, financialResourceId, directionId) {
        const putData = {
            id: budgetSheetDetailsData.selectedBudgetRowId,
            amount,
            comment,
            date,
            categoryName: category.name,
            categoryId: category.id === 0 ? null : category.id,
            financialResourceId,
            directionId
        };

        const putOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(putData)
        };

        const url = `${paths.BASE_URL}${paths.BUDGETROWS}`;
        let result;

        try {
            const response = await fetch(url, putOptions);
            result = await response.json();
        } catch (err) {
            console.log(`[ERROR]: fetching url ${url}`);
        }

        if (result) {
            handleBudgetRowEdited(result, amount, comment, date, category.name, financialResourceId, directionId);
        }
    };

    function handleBudgetRowEdited(result, amount, comment, date, categoryName, financialResourceId, directionId) {
        const categoryId = result.data.categoryId;
        const updatedCategories = [...budgetSheetDetailsData.budgetCategories];

        const updatedBudgetRows = [...budgetSheetDetailsData.budgetRows].map(d => {
            if (d.id === budgetSheetDetailsData.selectedBudgetRowId) {
                return {
                    ...d,
                    amount,
                    comment,
                    date: date.replaceAll('-', '.'),
                    budgetCategoryId: categoryId,
                    financialResourceId,
                    directionId
                };
            } else {
                return d;
            }
        });

        updatedBudgetRows.sort(sortByDateDesc);

        if (result.data.isNewCategory) {
            updatedCategories.push({ id: categoryId, name: categoryName });
            updatedCategories.sort(sortByName);
        }

        dispatch({ type: actionTypes.EDIT_SUCCESS, budgetRows: updatedBudgetRows, budgetCategories: updatedCategories });
    };

    async function onDeleteConfirmationYesClicked(id) {
        const deleteOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE'
        };

        const url = `${paths.BASE_URL}${paths.BUDGETROWS}/${id}`;
        let result;

        try {
            const response = await fetch(url, deleteOptions);
            result = await response.json();
        } catch (err) {
            console.log(`[ERROR]: fetching url ${url}`);
        }

        if (result && result.status === RESPONSE_STATUS_SUCCESS) {
            handleBudgetRowDeleted(id);
        } else {
            console.log('[handleBudgetRowDeleted] Delete failed.');
        }
    };

    function handleBudgetRowDeleted(id) {
        const updatedBudgetRows = [...budgetSheetDetailsData.budgetRows].filter(br => br.id !== id);

        dispatch({ type: actionTypes.DELETE_SUCCESS, budgetRows: updatedBudgetRows });
    };

    async function onCreateDebtSaveClicked(amount, comment, date, financialResourceId) {
        const postData = {
            amount,
            comment,
            date,
            financialResourceId
        };

        const postOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(postData)
        };

        const response = await fetch(`${paths.BASE_URL}${paths.BUDGETROWS}${paths.DEBT}`, postOptions);
        const jsonResponse = await response.json();

        handleDebtCreated(jsonResponse.data, amount, comment, date, financialResourceId);
    };

    function handleDebtCreated(responseData, amount, comment, date, financialResourceId) {
        const updatedBudgetRows = [
            ...budgetSheetDetailsData.budgetRows,
            {
                id: responseData.id,
                financialResourceId,
                budgetCategoryId: responseData.categoryId,
                directionId: DIRECTION_OUTCOME_ID,
                amount,
                comment,
                date: date.replaceAll('-', '.')
            }
        ];

        updatedBudgetRows.sort(sortByDateDesc);

        dispatch({ type: actionTypes.CREATE_DEBT_SUCCESS, budgetRows: updatedBudgetRows });
    };

    async function onMoveMoneyOkClicked(amount, comment, date, sourceFinancialResourceId, destinationFinancialResourceId) {
        const postData = {
            amount,
            comment,
            date,
            sourceFinancialResourceId,
            destinationFinancialResourceId
        };

        const postOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(postData)
        };

        const response = await fetch(`${paths.BASE_URL}${paths.BUDGETROWS}${paths.MOVE_MONEY}`, postOptions);
        const jsonResponse = await response.json();

        handleMoneyMoved(jsonResponse.data, amount, comment, date, sourceFinancialResourceId, destinationFinancialResourceId);
    };

    function handleMoneyMoved(responseData, amount, comment, date, sourceFinancialResourceId, destinationFinancialResourceId) {
        const categoryId = responseData.categoryId;
        const updatedBudgetRows = [
            ...budgetSheetDetailsData.budgetRows,
            {
                id: responseData.outcomeBudgetRowId,
                financialResourceId: sourceFinancialResourceId,
                budgetCategoryId: categoryId,
                directionId: DIRECTION_OUTCOME_ID,
                amount,
                comment,
                date: date.replaceAll('-', '.')
            },
            {
                id: responseData.incomeBudgetRowId,
                financialResourceId: destinationFinancialResourceId,
                budgetCategoryId: categoryId,
                directionId: DIRECTION_INCOME_ID,
                amount,
                comment,
                date: date.replaceAll('-', '.')
            }
        ];

        updatedBudgetRows.sort(sortByDateDesc);

        dispatch({ type: actionTypes.MOVE_MONEY_SUCCESS, budgetRows: updatedBudgetRows });
    };

    function getSelectedBudgetRowBySelectedId() {
        return budgetSheetDetailsData.budgetRows.find(b => b.id === budgetSheetDetailsData.selectedBudgetRowId);
    };

    let createBudgetRow = null;
    let editBudgetRow = null;
    let deleteBudgetRow = null;
    let createDebt = null;
    let moveMoney = null;

    if (budgetSheetDetailsData.uiState === UI_STATE_ADDING) {
        const defaultCategory = budgetSheetDetailsData.budgetCategories.find(c => c.id === CATEGORY_NOT_PROVIDED_ID);
        const defaultDirection = budgetSheetDetailsData.directions.find(d => d.id === DIRECTION_OUTCOME_ID);
        const defaultFinancialResource = budgetSheetDetailsData.financialResources.find(fr => fr.name === 'OTP Folyószámla');

        createBudgetRow = (
            <CreateBudgetRow
                saveClick={onAddSaveClicked}
                cancelClick={() => dispatch({ type: actionTypes.ADD_CANCEL })}
                categories={budgetSheetDetailsData.budgetCategories}
                defaultCategory={defaultCategory}
                financailResources={budgetSheetDetailsData.financialResources}
                defaultFinancialResource={defaultFinancialResource}
                directions={budgetSheetDetailsData.directions}
                defaultDirection={defaultDirection} />
        );
    } else if (budgetSheetDetailsData.uiState === UI_STATE_EDITING) {
        editBudgetRow = (
            <EditBudgetRow
                saveClick={onEditSaveClicked}
                cancelClick={() => dispatch({ type: actionTypes.EDIT_CANCEL })}
                budgetRow={getSelectedBudgetRowBySelectedId()}
                categories={budgetSheetDetailsData.budgetCategories}
                financailResources={budgetSheetDetailsData.financialResources}
                directions={budgetSheetDetailsData.directions} />
        );
    } else if (budgetSheetDetailsData.uiState === UI_STATE_DELETING) {
        deleteBudgetRow = (
            <DeleteBudgetRowConfirmation
                budgetRow={getSelectedBudgetRowBySelectedId()}
                yesClick={onDeleteConfirmationYesClicked}
                noClick={() => dispatch({ type: actionTypes.DELETE_CANCEL })} />
        );
    } else if (budgetSheetDetailsData.uiState === UI_STATE_DEBT_CREATING) {
        const defaultFinancialResource = budgetSheetDetailsData.financialResources.find(fr => fr.name === 'OTP Folyószámla');

        createDebt = (
            <CreateDebt
                saveClick={onCreateDebtSaveClicked}
                cancelClick={() => dispatch({ type: actionTypes.CREATE_DEBT_CANCEL })}
                financailResources={budgetSheetDetailsData.financialResources}
                defaultFinancialResource={defaultFinancialResource} />
        );
    } else if (budgetSheetDetailsData.uiState === UI_STATE_MONEY_MOVING) {
        const defaultFinancialResource = budgetSheetDetailsData.financialResources.find(fr => fr.name === 'Készpénz');

        moveMoney = (
            <MoveMoney
                saveClick={onMoveMoneyOkClicked}
                cancelClick={() => dispatch({ type: actionTypes.MOVE_MONEY_CANCEL })}
                financailResources={budgetSheetDetailsData.financialResources}
                defaultFinancialResource={defaultFinancialResource} />
        );
    }

    let content = <Loader />;

    if (budgetSheetDetailsData.uiState !== UI_STATE_LOADING) {
        const financialResourceGroups = [];
        const categoryIncomeGroups = [];
        const categoryOutcomeGroups = [];
        const dateGroups = [];

        budgetSheetDetailsData.financialResources.forEach(fr => {
            financialResourceGroups.push({
                name: fr.name,
                initialAmount: fr.initialAmount,
                currentAmount: fr.initialAmount
            });
        });

        budgetSheetDetailsData.budgetRows.forEach(br => {
            br.date = toShortDateString(br.date);
            br.financialResourceName = budgetSheetDetailsData.financialResources.filter(fr => fr.id === br.financialResourceId)[0].name;
            br.categoryName = budgetSheetDetailsData.budgetCategories.filter(bc => bc.id === br.budgetCategoryId)[0].name;
            br.directionName = budgetSheetDetailsData.directions.filter(d => d.id === br.directionId)[0].name;

            fillFinancialResourceGroups(br, financialResourceGroups);
            fillCategoryGroups(br, categoryIncomeGroups, categoryOutcomeGroups);
            fillDateGroups(br, dateGroups);
        });

        financialResourceGroups.forEach(frg => frg.balance = frg.currentAmount - frg.initialAmount);

        content = (
            <>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <NavLink to={paths.BUDGETSHEETS}>Költségvetési lapok</NavLink>
                        <button onClick={() => dispatch({ type: actionTypes.ADD_INIT })}>Új sor</button>
                        <button onClick={() => dispatch({ type: actionTypes.CREATE_DEBT_INIT })}>Új tartozás sor</button>
                        <button onClick={() => dispatch({ type: actionTypes.MOVE_MONEY_INIT })}>Áthelyezés</button>
                    </div>
                    <div className={styles.left}>
                        <FinancialResourceGroups financialResourceGroups={financialResourceGroups} />
                    </div>
                    <div className={styles.main}>
                        {dateGroups.map(dg => (
                            <div key={dg.date} className={styles.dategroup}>
                                <div className={styles['dategroup-header']}>
                                    <span>{dg.date}.</span><span className={styles.dayname}>{getDayName(dg.date)}</span>
                                </div>
                                {dg.budgetRows.map(br => (
                                    <div key={br.id} className={styles.budgetrow}>
                                        <div className={styles['budgetrow-header']}>
                                            <span className={br.directionId === DIRECTION_INCOME_ID ? styles['positive-amount'] : styles['negative-amount']}>{toForintString(br.amount)}</span>
                                            <span className={styles['category-tag']}>{br.categoryName}</span>
                                            <span className={styles['financial-resource-tag']}>{br.financialResourceName}</span>
                                            <span className={styles['edit-button']} onClick={() => dispatch({ type: actionTypes.EDIT_INIT, selectedBudgetRowId: br.id })}><i className="far fa-edit"></i></span>
                                            <span className={styles['delete-button']} onClick={() => dispatch({ type: actionTypes.DELETE_INIT, selectedBudgetRowId: br.id })}><i className="far fa-trash-alt"></i></span>
                                        </div>
                                        <div className={styles.comment}>{br.comment}</div>
                                    </div>
                                ))}
                                <div className={styles['dategroup-footer']}>
                                    <span className={styles['daily-balance']}>Napi mérleg</span> <span className={dg.dailyBalance >= 0 ? styles['positive-amount'] : styles['negative-amount']}>
                                        {toForintString(dg.dailyBalance)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.right}>
                        <CategoryGroups categoryIncomeGroups={categoryIncomeGroups} categoryOutcomeGroups={categoryOutcomeGroups} />
                    </div>
                </div>
                {createBudgetRow}
                {editBudgetRow}
                {deleteBudgetRow}
                {createDebt}
                {moveMoney}
            </>
        );
    }

    return content;
};

export default BudgetSheetDetails;