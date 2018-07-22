const LOCAL_STORAGE_PREFIX = 'translate_manager';

export default class Tools {

    static parseJson(input) {
        try {
            return JSON.parse(input);
        } catch (error) {
            return String(input);
        }
    }

    static setStorage(key, value) {
        try {
            const newValue = JSON.stringify(value);
            localStorage.setItem(LOCAL_STORAGE_PREFIX + '_' + key, newValue);
        } catch (error) {
            console.log(error);
        }
    }

    static setStorageObj(input) {
        for (let key in input) {
            const value = input[key];
            this.setStorage(key, value);
        }
    }

    static getStorageObj(key) {
        try {
            let value = this.parseJson(localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + key));
            if (value && typeof value === 'object') {
                return value;
            }
            return {};
        } catch (error) {
            return {};
        }
    }

    static getStorageStr(key) {
        try {
            let value = this.parseJson(localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + key));
            if (!value || typeof value === 'object') {
                return '';
            }
            return String(value);
        } catch (error) {
            return '';
        }
    }

    static removeStorage(key) {
        localStorage.removeItem(LOCAL_STORAGE_PREFIX + '_' + key);
    }
}
