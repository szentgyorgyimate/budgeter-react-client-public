import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import BudgetSheets from '../../containers/BudgetSheets/BudgetSheets';
import BudgetSheetDetails from '../../containers/BudgetSheetDetails/BudgetSheetDetails';
import Debts from '../../containers/Debts/Debts';

import * as paths from '../../shared/paths';

function Routes() {
    return (
        <Switch>
            <Route path={paths.BUDGETSHEET_DETAILS}>
                <BudgetSheetDetails />
            </Route>
            <Route path={paths.BUDGETSHEETS}>
                <BudgetSheets />
            </Route>
            <Route path={paths.DEBTS}>
                <Debts />
            </Route>
            <Redirect to={paths.BUDGETSHEETS} />
        </Switch>
    );
}

export default Routes;