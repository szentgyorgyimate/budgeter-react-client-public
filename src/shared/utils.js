export function toForintString(amount) {
    const forintPostFix = ' Ft';
    const numberToSeparateMinLength = 4;
    const separatedChunkLength = 3;
    const amountArray = [...amount.toString()];

    if (amountArray.length < numberToSeparateMinLength) {
        return amountArray.join('') + forintPostFix;
    } else {
        let separatorIndex = amountArray.length % separatedChunkLength;

        if (separatorIndex === 0) {
            separatorIndex = separatedChunkLength;
        }

        return amountArray.map((a, index) => {
            if (index === separatorIndex) {
                separatorIndex += separatedChunkLength;

                return ' ' + a;
            } else {
                return a;
            }
        }).join('') + forintPostFix;
    }
}

export function toShortDateString(date) {
    return date.replaceAll('-', '.').split('T')[0];
}

export function getDayName(date) {
    let dayName = '';

    switch (new Date(date).getDay()) {
        case 0:
            dayName = 'Vasárnap';
            break;
        case 1:
            dayName = 'Hétfő';
            break;
        case 2:
            dayName = 'Kedd';
            break;
        case 3:
            dayName = 'Szerda';
            break;
        case 4:
            dayName = 'Csütörtök';
            break;
        case 5:
            dayName = 'Péntek';
            break;
        case 6:
            dayName = 'Szombat';
            break;
        default:
            break;
    }

    return dayName;
};

export function sortByDateDesc(first, second) {
    let result = 0;

    if (first.date < second.date) {
        result = 1;
    } else if (first.date > second.date) {
        result = -1;
    }

    return result;
};

export function sortByStartDateDesc(first, second) {
    let result = 0;

    if (first.startDate < second.startDate) {
        result = 1;
    } else if (first.startDate > second.startDate) {
        result = -1;
    }

    return result;
};

export function sortByName(first, second) {
    let result = 0;

    if (first.name < second.name) {
        result = -1;
    } else if (first.name > second.name) {
        result = 1;
    }

    return result;
};

export function sortAsc(first, second) {
    let result = 0;

    if (first < second) {
        result = -1;
    } else if (first > second) {
        result = 1;
    }

    return result;
};

export function getTodayDate() {
    return getDateString(new Date());
};

export function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return getDateString(yesterday);
};

export function getTheDayBeforeYesterdayDate() {
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    return getDateString(dayBeforeYesterday);
};

function getDateString(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export function getOptionsForSelect(collection) {
    return collection.map(c => {
        return {
            value: c.id,
            label: c.name
        };
    });
};

export function getDataFromSelect(option) {
    const data = { id: null, name: '' };

    if (option) {
        data.id = option.__isNew__ ? 0 : option.value;
        data.name = option.label;
    }

    return data;
};
