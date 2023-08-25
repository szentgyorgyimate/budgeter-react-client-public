import { getDayName, sortByDateDesc, toForintString, toShortDateString } from "./utils";

test('100 toForintString() equals 100 Ft', () => {
    expect(toForintString(100)).toBe('100 Ft');
});

test('10000 toForintString() equals 10 000 Ft', () => {
    expect(toForintString(10000)).toBe('10 000 Ft');
});

test('2023-05-02T00:00:00 toShortDateString() equals 2023.05.02', () => {
    expect(toShortDateString('2023-05-02T00:00:00')).toBe('2023.05.02');
});

test('2023-05-02T00:00:00 getDayName() equals Kedd', () => {
    expect(getDayName('2023-05-02T00:00:00')).toBe('Kedd');
});

test('2023-05-02 and 2023-05-03 sortByDateDesc() returns 1', () => {
    expect(sortByDateDesc({ date: '2023-05-02' }, { date: '2023-05-03' })).toBe(1);
});

test('2023-05-03 and 2023-05-02 sortByDateDesc() returns -1', () => {
    expect(sortByDateDesc({ date: '2023-05-03' }, { date: '2023-05-02' })).toBe(-1);
});