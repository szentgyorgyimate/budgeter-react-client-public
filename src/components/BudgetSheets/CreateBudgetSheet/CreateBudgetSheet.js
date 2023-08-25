import React, { useState } from 'react';

import { getTodayDate } from '../../../shared/utils';

import styles from './CreateBudgetSheet.module.css';
import PopupWindow from '../../PopupWindow/PopupWindow';

function getFinancialResources(financialResourceTypes) {
    return financialResourceTypes.map(frt => {
        return {
            typeId: frt.id,
            name: frt.name,
            description: frt.description,
            amount: 0,
            selected: false
        }
    });
};

function CreateBudgetRow({ saveClick, cancelClick, financialResourceTypes }) {
    const [date, setDate] = useState(getTodayDate());
    const [financialResources, setFinancialResources] = useState(getFinancialResources(financialResourceTypes));

    const acceptEnabled = date && financialResources.some(fr => fr.selected);

    function onSelectedChange(typeId, selected) {
        const updatedFinancialResources = financialResources.map(fr => {
            if (fr.typeId === typeId) {
                return {
                    ...fr,
                    selected: selected
                }
            } else {
                return fr;
            }
        });

        setFinancialResources(updatedFinancialResources);
    };

    function onAmountChange(typeId, amount) {
        if (amount && !isNaN(amount)) {
            const updatedAmount = parseInt(amount);

            const updatedFinancialResources = [...financialResources];

            updatedFinancialResources.forEach(fr => {
                if (fr.typeId === typeId) {
                    fr.amount = updatedAmount;
                }
            });

            setFinancialResources(updatedFinancialResources);
        }
    };

    function acceptFunction() {
        const selectedFinancialResources = financialResources.filter(fr => fr.selected);

        const financialResourceData = selectedFinancialResources.map(fr => {
            return {
                financialResourceTypeId: fr.typeId,
                amount: fr.amount
            };
        });

        saveClick(date, financialResourceData);
    };

    return (
        <PopupWindow
            headerText="Költségvetési lap létrehozása"
            acceptButtonText="Létrehozás"
            cancelButtonText="Mégsem"
            acceptFunction={acceptFunction}
            cancelFunction={cancelClick}
            acceptButtonEnabled={acceptEnabled}>
            <div className={styles.container}>
                <label htmlFor={styles.date} className={styles.label}>Dátum</label>
                <input id={styles.date} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                {financialResources.map(fr => {
                    return (
                        <div className={styles['financial-resource-row']} key={fr.typeId}>
                            <div className={styles['financial-resource-selector']}>
                                <input id={`check_${fr.typeId}`} type="checkbox" checked={fr.selected} onChange={(e) => onSelectedChange(fr.typeId, e.target.checked)} />
                                <label htmlFor={`check_${fr.typeId}`} title={fr.description}>{fr.name}</label>
                            </div>
                            <input
                                id={`amount_${fr.typeId}`}
                                type="text"
                                value={fr.amount}
                                onChange={(e) => { onAmountChange(fr.typeId, e.target.value) }}
                                className={fr.selected ? '' : styles['not-selected']}
                                readOnly={!fr.selected} />
                        </div>
                    );
                })}
            </div>
        </PopupWindow>
    );
};

export default CreateBudgetRow;