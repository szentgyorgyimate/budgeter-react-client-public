import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { getOptionsForSelect, getDataFromSelect, getYesterdayDate, getTheDayBeforeYesterdayDate } from '../../../shared/utils';

import PopupWindow from '../../PopupWindow/PopupWindow';
import AutoComplete from '../../AutoComplete/AutoComplete';

import styles from './EditBudgetRow.module.css';

function EditBudgetRow({ saveClick, cancelClick, budgetRow, categories, financailResources, directions }) {
    const [amount, setAmount] = useState(budgetRow.amount);
    const [comment, setComment] = useState(budgetRow.comment);
    const [date, setDate] = useState(budgetRow.date.replaceAll('.', '-'));
    const [category, setCategory] = useState({ id: budgetRow.budgetCategoryId, name: budgetRow.categoryName });
    const [financialResourceId, setFinancialResourceId] = useState(budgetRow.financialResourceId);
    const [directionId, setDirectionId] = useState(budgetRow.directionId);

    const amountRef = useRef(null);

    useEffect(() => {
        amountRef.current.focus();
    }, []);

    const acceptEnabled = amount && comment && date;

    const onAmountChanged = e => {
        const updatedAmount = e.target.value;

        if (updatedAmount) {
            if (!isNaN(updatedAmount)) {
                setAmount(parseInt(updatedAmount));
            }
        } else {
            setAmount(0);
        }
    };

    function autoCompleteChanged(newCategoryId, text) {
        if (newCategoryId) {
            const newCategory = categories.filter(c => c.id === newCategoryId)[0];

            if (newCategory) {
                setCategory(newCategory);
            }
        }

        setComment(text);
    };

    return (
        <PopupWindow
            headerText="Költségvetési sor módosítása"
            acceptButtonText="Mentés"
            cancelButtonText="Mégsem"
            acceptFunction={() => { saveClick(amount, comment, date, category, financialResourceId, directionId); }}
            cancelFunction={cancelClick}
            acceptButtonEnabled={acceptEnabled}>
            <div className={styles.container}>
                <label htmlFor={styles.amount} className={styles.label}>Összeg</label>
                <input id={styles.amount} type="text" value={amount} onChange={onAmountChanged} ref={amountRef} placeholder="0" />
                <label htmlFor={styles.comment} className={styles.label}>Megjegyzés</label>
                <AutoComplete text={comment} autoCompleteChanged={autoCompleteChanged} placeHolder="Megjegyzés" />
                <label htmlFor={styles.date} className={styles.label}>Dátum</label>
                <input id={styles.date} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <div className={styles.buttons}>
                    <button onClick={() => setDate(getYesterdayDate())}>Tegnap</button>
                    <button onClick={() => setDate(getTheDayBeforeYesterdayDate())}>Tegnapelőtt</button>
                </div>
                <label htmlFor="categorySelector" className={styles.label}>Kategória</label>
                <Creatable
                    key={`category_${category.id}`}
                    defaultValue={{ value: category.id, label: category.name }}
                    options={getOptionsForSelect(categories)}
                    onChange={(category) => setCategory(getDataFromSelect(category))}
                    formatCreateLabel={(inputValue) => `Kategória létrehozása ${inputValue}`}
                    isClearable={false}
                    className={styles.selector}
                    inputId="categorySelector" />
                <label htmlFor="financialResourceSelector" className={styles.label}>Pénzforrás</label>
                <Select
                    defaultValue={{ value: budgetRow.financialResourceId, label: budgetRow.financialResourceName }}
                    options={getOptionsForSelect(financailResources)}
                    onChange={(financialResource) => setFinancialResourceId(financialResource.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='financialResourceSelector' />
                <label htmlFor="directionSelector" className={styles.label}>Irány</label>
                <Select
                    defaultValue={{ value: budgetRow.directionId, label: budgetRow.directionName }}
                    options={getOptionsForSelect(directions)}
                    onChange={(direction) => setDirectionId(direction.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='directionSelector' />
            </div>
        </PopupWindow>
    );
};

export default EditBudgetRow;