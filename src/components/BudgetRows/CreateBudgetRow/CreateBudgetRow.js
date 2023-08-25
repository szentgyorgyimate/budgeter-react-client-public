import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import PopupWindow from '../../PopupWindow/PopupWindow';
import AutoComplete from '../../AutoComplete/AutoComplete';

import { getOptionsForSelect, getDataFromSelect, getTodayDate, getYesterdayDate, getTheDayBeforeYesterdayDate } from '../../../shared/utils';

import styles from './CreateBudgetRow.module.css';

function CreateBudgetRow({ saveClick, cancelClick, categories, defaultCategory, financailResources, defaultFinancialResource, directions, defaultDirection }) {
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [date, setDate] = useState(getTodayDate());
    const [category, setCategory] = useState(defaultCategory);
    const [financialResourceId, setFinancialResourceId] = useState(defaultFinancialResource.id);
    const [directionId, setDirectionId] = useState(defaultDirection.id);

    const amountRef = useRef(null);

    useEffect(() => {
        amountRef.current.focus();
    }, []);

    const acceptEnabled = amount && comment && date;

    function onAmountChanged(e) {
        const updatedAmount = e.target.value;

        if (!isNaN(updatedAmount)) {
            setAmount(parseInt(updatedAmount));
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
            headerText="Költségvetési sor létrehozása"
            acceptButtonText="Létrehozás"
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
                    defaultValue={{ value: defaultFinancialResource.id, label: defaultFinancialResource.name }}
                    options={getOptionsForSelect(financailResources)}
                    onChange={(financialResource) => setFinancialResourceId(financialResource.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='financialResourceSelector' />
                <label htmlFor="directionSelector" className={styles.label}>Irány</label>
                <Select
                    defaultValue={{ value: defaultDirection.id, label: defaultDirection.name }}
                    options={getOptionsForSelect(directions)}
                    onChange={(direction) => setDirectionId(direction.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='directionSelector' />
            </div>
        </PopupWindow>
    );
};

export default CreateBudgetRow;