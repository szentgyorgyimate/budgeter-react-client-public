export const BASE_URL = process.env.REACT_APP_BUDGETER_API_URL;
export const MAIN = '/main';
export const BUDGETSHEETS = '/budgetsheets';
export const BUDGETROWS = '/budgetrows';
export const BUDGETSHEETS_BY_YEAR = `${BUDGETSHEETS}/year`; // /budgetsheets/year
export const BUDGETSHEET_DETAILS = `${BUDGETSHEETS}/:urlslug`; // /budgetsheets/:urlslug
export const DEBT = '/debt';
export const DEBTS = '/debts';
export const MOVE_MONEY = '/movemoney';