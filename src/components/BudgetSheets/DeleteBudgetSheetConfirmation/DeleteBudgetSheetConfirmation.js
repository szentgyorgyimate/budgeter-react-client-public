import React from 'react';

import PopupWindow from '../../PopupWindow/PopupWindow';

import { toShortDateString } from '../../../shared/utils';

import styles from './DeleteBudgetSheetConfirmation.module.css';

function DeleteBudgetSheetConfirmation({ budgetSheet, yesClick, noClick }) {
    return (
        <PopupWindow headerText="Költségvetési lap törlése" acceptButtonText="Igen" cancelButtonText="Nem" acceptFunction={() => yesClick(budgetSheet.id)} cancelFunction={noClick} >
            <div className={styles.confirmation}>
                <span>Biztosan törölni szeretnéd a következő költségvetési lapot '<span className={styles.startdate}>{toShortDateString(budgetSheet.startDate)}</span>'?</span>
            </div>
        </PopupWindow>
    );
};

export default DeleteBudgetSheetConfirmation;