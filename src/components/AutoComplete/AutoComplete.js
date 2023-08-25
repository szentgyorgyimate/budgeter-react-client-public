import React, { useState } from "react";

import styles from './AutoComplete.module.css';
import suggestions from "../../shared/suggestions";

function SuggestionList({ filteredSuggestions, activeSuggestionIndex, click }) {
    return (
        <div className={styles['suggestion-container']}>
            <ul className={styles.suggestions}>
                {filteredSuggestions.map((suggestion, index) => {
                    let className;

                    if (index === activeSuggestionIndex) {
                        className = 'suggestion-active';
                    }

                    return (
                        <li className={styles[className]} key={suggestion.text} onClick={click}>
                            {suggestion.text}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

function AutoComplete({ text, autoCompleteChanged, placeHolder }) {
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    function onTextChanged(e) {
        const updatedFilteredSuggestions = suggestions.filter(s => s.text.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1);

        setActiveSuggestionIndex(0);
        setFilteredSuggestions(updatedFilteredSuggestions);
        setShowSuggestions(true);

        autoCompleteChanged(null, e.target.value);
    };

    function onKeyDown(e) {
        if (e.keyCode === 13 || e.keyCode === 9) { // ENTER or TAB key
            setActiveSuggestionIndex(0);
            setShowSuggestions(false);

            const suggestion = filteredSuggestions[activeSuggestionIndex];

            if (suggestion) {
                autoCompleteChanged(suggestion.categoryId, suggestion.text);
            }
        } else if (e.keyCode === 38) { // UP key
            if (activeSuggestionIndex === 0) {
                return;
            }

            setActiveSuggestionIndex(activeSuggestionIndex - 1);
        } else if (e.keyCode === 40) { // DOWN key
            if (activeSuggestionIndex === filteredSuggestions.length - 1) {
                return;
            }

            setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
    };

    function onSuggestionClicked(e) {
        setActiveSuggestionIndex(0);
        setFilteredSuggestions([]);
        setShowSuggestions(false);

        const suggestion = filteredSuggestions.filter(s => s.text === e.currentTarget.innerText)[0];
        autoCompleteChanged(suggestion.categoryId, suggestion.text);
    };

    let suggestionList = null;

    if (showSuggestions && text && filteredSuggestions.length > 0) {
        suggestionList = (
            <SuggestionList
                filteredSuggestions={filteredSuggestions}
                activeSuggestionIndex={activeSuggestionIndex}
                click={onSuggestionClicked} />
        );
    }

    return (
        <>
            <input
                type="text"
                value={text}
                placeholder={placeHolder}
                onChange={onTextChanged}
                onKeyDown={onKeyDown}
            />
            {suggestionList}
        </>
    );
};

export default AutoComplete;