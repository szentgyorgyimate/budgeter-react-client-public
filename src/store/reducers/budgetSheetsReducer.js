import * as actionTypes from '../actions/budgetSheetsActionTypes';
import { UI_STATE_LOADING, UI_STATE_INIT, UI_STATE_ADDING, UI_STATE_EDITING, UI_STATE_DELETING } from '../../shared/uiStates';

function init(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        yearList: action.data.years,
        selectedYear: action.data.years[0],
        budgetSheetList: action.data.budgetSheets,
        financialResourceTypeList: action.data.financialResourceTypes,
        uiState: UI_STATE_INIT
    };
};

function addInit(budgetSheetsData) {
    return {
        ...budgetSheetsData,
        uiState: UI_STATE_ADDING
    };
};

function addSuccess(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        yearList: action.yearList,
        budgetSheetList: action.budgetSheetList,
        uiState: UI_STATE_INIT
    };
};

function addCancel(budgetSheetsData) {
    return {
        ...budgetSheetsData,
        uiState: UI_STATE_INIT
    };
};

function editInit(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        selectedBudgetSheetId: action.selectedBudgetSheetId,
        uiState: UI_STATE_EDITING
    };
};

function editSuccess(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        budgetSheetList: action.budgetSheetList,
        selectedBudgetSheetId: null,
        uiState: UI_STATE_INIT
    };
};

function editCancel(budgetSheetDetailsData) {
    return {
        ...budgetSheetDetailsData,
        selectedBudgetSheetId: null,
        uiState: UI_STATE_INIT
    };
};

function deleteInit(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        selectedBudgetSheetId: action.selectedBudgetSheetId,
        uiState: UI_STATE_DELETING
    };
};

function deleteSuccess(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        budgetSheetList: action.budgetSheetList,
        selectedBudgetSheetId: null,
        uiState: UI_STATE_INIT
    };
};

function deleteCancel(budgetSheetsData) {
    return {
        ...budgetSheetsData,
        selectedBudgetSheetId: null,
        uiState: UI_STATE_INIT
    };
};

function getBudgetSheetsByYearStart(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        selectedYear: action.year,
        uiState: UI_STATE_LOADING
    };
};

function setYear(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        selectedYear: action.year,
        uiState: UI_STATE_INIT
    };
};

function setLoadedBudgetSheets(budgetSheetsData, action) {
    return {
        ...budgetSheetsData,
        budgetSheetList: action.budgetSheets,
        uiState: UI_STATE_INIT
    };
};

function budgetSheetsReducer(budgetSheetsData, action) {
    switch (action.type) {
        case actionTypes.INIT: return init(budgetSheetsData, action);
        case actionTypes.ADD_INIT: return addInit(budgetSheetsData);
        case actionTypes.ADD_SUCCESS: return addSuccess(budgetSheetsData, action);
        case actionTypes.ADD_CANCEL: return addCancel(budgetSheetsData);
        case actionTypes.EDIT_INIT: return editInit(budgetSheetsData, action);
        case actionTypes.EDIT_SUCCESS: return editSuccess(budgetSheetsData, action);
        case actionTypes.EDIT_CANCEL: return editCancel(budgetSheetsData, action);
        case actionTypes.DELETE_INIT: return deleteInit(budgetSheetsData, action);
        case actionTypes.DELETE_SUCCESS: return deleteSuccess(budgetSheetsData, action);
        case actionTypes.DELETE_CANCEL: return deleteCancel(budgetSheetsData, action);
        case actionTypes.GET_BUDGETSHEETS_BY_YEAR_START: return getBudgetSheetsByYearStart(budgetSheetsData, action);
        case actionTypes.SET_YEAR: return setYear(budgetSheetsData, action);
        case actionTypes.SET_LOADED_BUDGETSHEETS: return setLoadedBudgetSheets(budgetSheetsData, action);

        default:
            throw new Error('[budgetSheetsReducer] Unknown budgetSheetsReducer action type!');
    }
};

export default budgetSheetsReducer;