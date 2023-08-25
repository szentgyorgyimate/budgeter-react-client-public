import React from 'react';

import styles from './PopupWindow.module.css';

function PopupWindow({ children, headerText, acceptButtonText, cancelButtonText, acceptFunction, cancelFunction, acceptButtonEnabled = true }) {
    let acceptButton = (
        <button type='button' className={`${styles['accept-button-disabled']} ${styles.accept}`}>
            <i className='fas fa-check'></i><span>{acceptButtonText}</span>
        </button>
    );

    if (acceptButtonEnabled) {
        acceptButton = (
            <button type='button' className={`${styles['accept-button']} ${styles.accept}`} onClick={acceptFunction}>
                <i className='fas fa-check'></i><span>{acceptButtonText}</span>
            </button>
        );
    }

    return (
        <div className={styles.backdrop}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>{headerText}</h2>
                    <i className="fas fa-times" onClick={cancelFunction}></i>
                </div>
                <div>
                    {children}
                </div>
                <div className={styles.buttons}>
                    <button type='button' className={styles['cancel-button']} onClick={cancelFunction}>
                        <i className='fas fa-times'></i><span>{cancelButtonText}</span>
                    </button>
                    {acceptButton}
                </div>
            </div>
        </div>
    );
};

export default PopupWindow;