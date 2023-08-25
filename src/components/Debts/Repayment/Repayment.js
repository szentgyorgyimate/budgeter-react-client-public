import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import PopupWindow from '../../PopupWindow/PopupWindow';

import { getOptionsForSelect, getTodayDate, getYesterdayDate, getTheDayBeforeYesterdayDate, toForintString } from '../../../shared/utils';

import styles from './Repayment.module.css';

function Repayment({ saveClick, cancelClick, financialResourceTypes, defaultFinancialResourceType, repaymentTypes, defaultRepaymentType, selectedDebt }) {
    const [amount, setAmount] = useState(selectedDebt.remainingAmount);
    const [date, setDate] = useState(getTodayDate);
    const [financialResourceTypeId, setFinancialResourceTypeId] = useState(defaultFinancialResourceType.id);
    const [repaymentTypeId, setRepaymentTypeId] = useState(defaultRepaymentType.id);

    const amountRef = useRef(null);

    useEffect(() => {
        amountRef.current.focus();
    }, []);

    const acceptEnabled = amount && amount <= selectedDebt.remainingAmount && date;

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

    return (
        <PopupWindow
            headerText="Törlesztés"
            acceptButtonText="Mentés"
            cancelButtonText="Mégsem"
            acceptFunction={() => { saveClick(amount, date, financialResourceTypeId, repaymentTypeId); }}
            cancelFunction={cancelClick}
            acceptButtonEnabled={acceptEnabled}>
            <div className={styles.container}>
                <label className={styles.label}>Tartozás összeg</label>
                <span>{toForintString(selectedDebt.amount)}</span>
                <label className={styles.label}>Fizetett összeg</label>
                <span className={styles['paid-amount']}>{toForintString(selectedDebt.paidAmount)}</span>
                <label className={styles.label}>Maradék összeg</label>
                <span className={styles['remaining-amount']}>{toForintString(selectedDebt.remainingAmount)}</span>
                <label htmlFor={styles.amount} className={styles.label}>Összeg</label>
                <input id={styles.amount} type="text" value={amount} onChange={onAmountChanged} ref={amountRef} placeholder="0" />
                <label htmlFor={styles.date} className={styles.label}>Dátum</label>
                <input id={styles.date} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <div className={styles.buttons}>
                    <button onClick={() => setDate(getYesterdayDate())}>Tegnap</button>
                    <button onClick={() => setDate(getTheDayBeforeYesterdayDate())}>Tegnapelőtt</button>
                </div>
                <label htmlFor="financialResourceTypeSelector" className={styles.label}>Pénzforrás</label>
                <Select
                    defaultValue={{ value: defaultFinancialResourceType.id, label: defaultFinancialResourceType.name }}
                    options={getOptionsForSelect(financialResourceTypes)}
                    onChange={(financialResourceType) => setFinancialResourceTypeId(financialResourceType.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='financialResourceTypeSelector' />
                <label htmlFor="repaymentTypeSelector" className={styles.label}>Típus</label>
                <Select
                    defaultValue={{ value: defaultRepaymentType.id, label: defaultRepaymentType.name }}
                    options={getOptionsForSelect(repaymentTypes)}
                    onChange={(repaymentType) => setRepaymentTypeId(repaymentType.value)}
                    isClearable={false}
                    className={styles.selector}
                    inputId='repaymentTypeSelector' />
            </div>
        </PopupWindow>
    );
};

export default Repayment;