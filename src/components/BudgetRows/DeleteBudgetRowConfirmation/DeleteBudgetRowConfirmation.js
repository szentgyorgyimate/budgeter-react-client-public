import React from 'react';

import PopupWindow from '../../PopupWindow/PopupWindow';

import styles from './DeleteBudgetRowConfirmation.module.css';

function DeleteBudgetRowConfirmation({ budgetRow, yesClick, noClick }) {
    return (
        <PopupWindow headerText="Költségvetési sor törlése" acceptButtonText="Igen" cancelButtonText="Nem" acceptFunction={() => yesClick(budgetRow.id)} cancelFunction={noClick} >
            <div className={styles.confirmation}>
                <span>Biztosan törölni szeretnéd a következő költségvetési sort '<span className={styles.comment}>{budgetRow.comment}</span>'?</span>
            </div>
        </PopupWindow>
    );
};

export default DeleteBudgetRowConfirmation;