import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import PopupWindow from '../../PopupWindow/PopupWindow';

import { getOptionsForSelect, getTodayDate, getYesterdayDate, getTheDayBeforeYesterdayDate } from '../../../shared/utils';

import styles from './MoveMoney.module.css';

function MoveMoney({ saveClick, cancelClick, defaultFinancialResource, financailResources }) {
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [date, setDate] = useState(getTodayDate());
    const [sourceFinancialResourceId, setSourceFinancialResourceId] = useState(defaultFinancialResource.id);
    const [destinationFinancialResourceId, setDestinationFinancialResourceId] = useState(defaultFinancialResource.id);

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

    return (
        <PopupWindow
            headerText="Pénz áthelyezése"
            acceptButtonText="Áthelyezés"
            cancelButtonText="Mégsem"
            acceptFunction={() => { saveClick(amount, comment, date, sourceFinancialResourceId, destinationFinancialResourceId); }}
            cancelFunction={cancelClick}
            acceptButtonEnabled={acceptEnabled}>
            <div className={styles.container}>
                <label htmlFor={styles.amount} className={styles.label}>Összeg</label>
                <input id={styles.amount} type="text" value={amount} onChange={onAmountChanged} ref={amountRef} placeholder="0" />
                <label htmlFor={styles.comment} className={styles.label}>Megjegyzés</label>
                <input id={styles.comment} type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Megjegyzés" />
                <label htmlFor={styles.date} className={styles.label}>Dátum</label>
                <input id={styles.date} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <div className={styles.buttons}>
                    <button onClick={() => setDate(getYesterdayDate())}>Tegnap</button>
                    <button onClick={() => setDate(getTheDayBeforeYesterdayDate())}>Tegnapelőtt</button>
                </div>
                <label htmlFor="sourceFinancialResourceSelector" className={styles.label}>Pénzforrás</label>
                <Select
                    defaultValue={{ value: defaultFinancialResource.id, label: defaultFinancialResource.name }}
                    options={getOptionsForSelect(financailResources)}
                    onChange={(financialResource) => setSourceFinancialResourceId(financialResource.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='sourceFinancialResourceSelector' />

                <label htmlFor="destinationFinancialResourceSelector" className={styles.label}>Pénzforrás</label>
                <Select
                    defaultValue={{ value: defaultFinancialResource.id, label: defaultFinancialResource.name }}
                    options={getOptionsForSelect(financailResources)}
                    onChange={(financialResource) => setDestinationFinancialResourceId(financialResource.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='destinationFinancialResourceSelector' />
            </div>
        </PopupWindow>
    );
};

export default MoveMoney;