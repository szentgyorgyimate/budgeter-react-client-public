import * as actionTypes from '../actions/debtsActionTypes';
import { UI_STATE_INIT, UI_STATE_REPAYING } from '../../shared/uiStates';

function init(debtsData, action) {
    return {
        ...debtsData,
        debtList: action.debtList,
        financialResourceTypes: action.financialResourceTypes,
        repaymentTypes: action.repaymentTypes,
        uiState: UI_STATE_INIT
    };
};

function debtListChange(debtsData, action) {
    return {
        ...debtsData,
        debtList: action.debtList,
    };
};

function repaymentInit(debtsData, action) {
    return {
        ...debtsData,
        selectedBudgetRowId: action.selectedBudgetRowId,
        uiState: UI_STATE_REPAYING
    };
};

function repaymentSuccess(debtsData, action) {
    return {
        ...debtsData,
        debtList: action.debtList,
        selectedBudgetRowId: null,
        uiState: UI_STATE_INIT
    };
};

function repaymentCancel(debtsData) {
    return {
        ...debtsData,
        selectedBudgetRowId: null,
        uiState: UI_STATE_INIT
    };
};

function debtsReducer(debtsData, action) {
    switch (action.type) {
        case actionTypes.INIT: return init(debtsData, action);
        case actionTypes.DEBTLIST_CHANGE: return debtListChange(debtsData, action);
        case actionTypes.REPAYMENT_INIT: return repaymentInit(debtsData, action);
        case actionTypes.REPAYMENT_SUCCESS: return repaymentSuccess(debtsData, action);
        case actionTypes.REPAYMENT_CANCEL: return repaymentCancel(debtsData);
        default:
            throw new Error('[debtsReducer] Unknown debtsReducer action type!');
    }
};

export default debtsReducer;