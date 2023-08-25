import { UI_STATE_ADDING, UI_STATE_DEBT_CREATING, UI_STATE_DELETING, UI_STATE_EDITING, UI_STATE_INIT, UI_STATE_MONEY_MOVING } from '../../shared/uiStates';
import * as actionTypes from '../actions/budgetSheetDetailsActionTypes';

function init(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        directions: action.data.directions,
        financialResources: action.data.financialResources,
        budgetCategories: action.data.budgetCategories,
        budgetRows: action.data.budgetRows,
        uiState: UI_STATE_INIT
    };
};

function addInit(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        uiState: UI_STATE_ADDING
    };
};

function addSuccess(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        budgetRows: action.budgetRows,
        budgetCategories: action.budgetCategories,
        uiState: UI_STATE_INIT
    };
};

function addCancel(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        uiState: UI_STATE_INIT
    };
};

function editInit(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        selectedBudgetRowId: action.selectedBudgetRowId,
        uiState: UI_STATE_EDITING
    };
};

function editSuccess(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        budgetRows: action.budgetRows,
        budgetCategories: action.budgetCategories,
        uiState: UI_STATE_INIT
    };
};

function editCancel(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        selectedBudgetRowId: null,
        uiState: UI_STATE_INIT
    };
};

function deleteInit(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        selectedBudgetRowId: action.selectedBudgetRowId,
        uiState: UI_STATE_DELETING
    };
};

function deleteSuccess(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        budgetRows: action.budgetRows,
        selectedBudgetRowId: null,
        uiState: UI_STATE_INIT
    };
};

function deleteCancel(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        selectedBudgetRowId: null,
        uiState: UI_STATE_INIT
    };
};

function createDebtInit(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        uiState: UI_STATE_DEBT_CREATING
    };
};

function createDebtSuccess(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        budgetRows: action.budgetRows,
        uiState: UI_STATE_INIT
    };
};

function createDebtCancel(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        uiState: UI_STATE_INIT
    };
};

function moveMoneyInit(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        uiState: UI_STATE_MONEY_MOVING
    };
};

function moveMoneySuccess(budgetSheetDetailsData, action) {
    return {
        ...budgetSheetDetailsData,
        budgetRows: action.budgetRows,
        uiState: UI_STATE_INIT
    };
};

function moveMoneyCancel(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        uiState: UI_STATE_INIT
    };
};

function budgetSheetDetailsReducer(budgetSheetDetailsData, action) {
    switch (action.type) {
        case actionTypes.INIT: return init(budgetSheetDetailsData, action);
        case actionTypes.ADD_INIT: return addInit(budgetSheetDetailsData);
        case actionTypes.ADD_SUCCESS: return addSuccess(budgetSheetDetailsData, action);
        case actionTypes.ADD_CANCEL: return addCancel(budgetSheetDetailsData);
        case actionTypes.EDIT_INIT: return editInit(budgetSheetDetailsData, action);
        case actionTypes.EDIT_SUCCESS: return editSuccess(budgetSheetDetailsData, action);
        case actionTypes.EDIT_CANCEL: return editCancel(budgetSheetDetailsData, action);
        case actionTypes.DELETE_INIT: return deleteInit(budgetSheetDetailsData, action);
        case actionTypes.DELETE_SUCCESS: return deleteSuccess(budgetSheetDetailsData, action);
        case actionTypes.DELETE_CANCEL: return deleteCancel(budgetSheetDetailsData, action);
        case actionTypes.CREATE_DEBT_INIT: return createDebtInit(budgetSheetDetailsData);
        case actionTypes.CREATE_DEBT_SUCCESS: return createDebtSuccess(budgetSheetDetailsData, action);
        case actionTypes.CREATE_DEBT_CANCEL: return createDebtCancel(budgetSheetDetailsData);
        case actionTypes.MOVE_MONEY_INIT: return moveMoneyInit(budgetSheetDetailsData);
        case actionTypes.MOVE_MONEY_SUCCESS: return moveMoneySuccess(budgetSheetDetailsData, action);
        case actionTypes.MOVE_MONEY_CANCEL: return moveMoneyCancel(budgetSheetDetailsData);
        default:
            throw new Error('[budgetSheetDetailsReducer] Unknown budgetSheetDetailsReducer action type!');
    }
};

export default budgetSheetDetailsReducer;