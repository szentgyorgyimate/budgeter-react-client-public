import React, { useState } from 'react';

import styles from './EditBudgetSheet.module.css';
import PopupWindow from '../../PopupWindow/PopupWindow';

function EditBudgetSheet({ saveClick, cancelClick, financialResources }) {
    const [financialResourceList, setFinancialResourceList] = useState(financialResources);

    function onAmountChange(id, amount) {
        if (amount && !isNaN(amount)) {
            const updatedAmount = parseInt(amount);

            const updatedFinancialResources = financialResourceList.map(fr => {
                if (fr.id === id) {
                    return {
                        ...fr,
                        initialAmount: updatedAmount
                    }
                } else {
                    return fr;
                }
            });

            setFinancialResourceList(updatedFinancialResources);
        }
    };

    function acceptFunction() {
        const financialResourceData = financialResourceList.map(fr => {
            return {
                id: fr.id,
                initialAmount: fr.initialAmount,
                name: fr.name
            };
        });

        saveClick(financialResourceData);
    };

    return (
        <PopupWindow
            headerText="Költségvetési lap módosítása"
            acceptButtonText="Mentés"
            cancelButtonText="Mégsem"
            acceptFunction={acceptFunction}
            cancelFunction={cancelClick}>
            <div className={styles.container}>
                {financialResourceList.map(fr => {
                    return (
                        <div className={styles['financial-resource-row']} key={fr.id}>
                            <label htmlFor={`amount_${fr.id}`}>{fr.name}</label>
                            <input
                                id={`amount_${fr.id}`}
                                type="text"
                                value={fr.initialAmount}
                                onChange={(e) => onAmountChange(fr.id, e.target.value)} />
                        </div>
                    );
                })}
            </div>
        </PopupWindow>
    );
};

export default EditBudgetSheet;