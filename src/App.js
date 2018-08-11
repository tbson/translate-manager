import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tools from './utils/Tools';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.uploadDefault = this.uploadDefault.bind(this);
        this.uploadTranslation = this.uploadTranslation.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderRows = this.renderRows.bind(this);
    }

    componentDidMount() {
        const state = Tools.getStorageObj('state');
        this.setState(state);
    }

    uploadDefault(event) {
        const reader = new window.FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = event => {
            const translated = [];
            const defaultJson = JSON.parse(event.target.result);
            const {langs, defaultLang, needToTranslate} = defaultJson;
            for (let translation of needToTranslate) {
                const translationUnit = {};
                for (let lang of langs) {
                    translationUnit[lang] = '';
                    if (lang === defaultLang) {
                        translationUnit[lang] = translation;
                    }
                }
                translated.push(translationUnit);
            }
            const translations = {defaultLang, translated};
            const state = {langs, translations};
            Tools.setStorage('state', state);
            this.setState(state);
        };
    }

    uploadTranslation(event) {
        const reader = new window.FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = event => {
            const translations = JSON.parse(event.target.result);
            const {translated} = translations;
            if (translated && translated.length) {
                const langs = Object.keys(translated[0]);
                const state = {langs, translations};
                Tools.setStorage('state', state);
                this.setState(state);
            }
        };
    }

    handleChange(index, lang) {
        return event => {
            const {value} = event.target;
            const {translations} = this.state;
            const {translated} = translations;
            translated[index][lang] = value;
            this.setState({translations});
        };
    }

    handleSave() {
        Tools.setStorage('state', this.state);
    }

    handleExport() {
        const {translations} = this.state;
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(translations, null, 4));
        const dlAnchorElem = document.getElementById('download');
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', 'translations.json');
        dlAnchorElem.click();
    }

    demoDefaultJson() {
        const defaultJson = {
            langs: ['vi', 'en', 'fr'],
            defaultLang: 'vi',
            needToTranslate: ['xin chào', 'làm việc']
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(defaultJson, null, 4));
        const dlAnchorElem = document.getElementById('demoDefaultJson');
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', 'default.json');
        dlAnchorElem.click();
    }

    demoTranslationsJson() {
        const translations = {
            defaultLang: 'vi',
            translated: [
                {
                    vi: 'xin chào',
                    en: '',
                    fr: ''
                },
                {
                    vi: 'làm việc',
                    en: '',
                    fr: ''
                }
            ]
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(translations, null, 4));
        const dlAnchorElem = document.getElementById('demoTranslationsJson');
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', 'translations.json');
        dlAnchorElem.click();
    }

    handleAdd() {
        const {langs, translations} = this.state;
        const {translated} = translations;
        const item = {};
        for (let lang of langs) {
            item[lang] = '';
        }
        translated.unshift(item);
        this.setState({translations});
    }

    handleRemove(index) {
        const {translations} = this.state;
        const {translated} = translations;
        translated.splice(index, 1);
        this.setState({translations});
    }

    renderHeader() {
        const {langs} = this.state;
        if (!langs) return null;
        const headings = [...langs, 'Action'];
        return headings.map(heading => {
            if (heading !== 'Action') {
                return (
                    <th key={heading} scope="col">
                        {heading.toUpperCase()}
                    </th>
                );
            }
            return (
                <th key={heading} scope="col" style={{width: 100}}>
                    {heading}
                </th>
            );
        });
    }

    renderRows() {
        const {langs, translations} = this.state;
        if (!langs || !translations || !translations.translated) return null;
        const {translated} = translations;
        const langsWithRemoveButton = [...langs, 'Remove'];
        let index = -1;
        return translated.map(translation => {
            const renderRow = (translation, index) => {
                return langsWithRemoveButton.map(
                    lang => {
                        if (lang !== 'Remove') {
                            return (
                                <td key={lang}>
                                    <input
                                        className="form-control"
                                        value={translation[lang]}
                                        onChange={this.handleChange(index, lang)}
                                    />
                                </td>
                            );
                        }
                        return (
                            <td key={lang}>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => this.handleRemove(index)}>
                                    Remove
                                </button>
                            </td>
                        );
                    },
                    undefined,
                    translation,
                    index
                );
            };
            index++;
            return <tr key={index}>{renderRow(translation, index)}</tr>;
        });
    }

    render() {
        return (
            <div className="App">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm">
                            <h3>
                                <a href="#" id="demoDefaultJson" onClick={this.demoDefaultJson}>
                                    default.json
                                </a>
                            </h3>
                            <div>
                                <input type="file" onChange={this.uploadDefault} />
                            </div>
                        </div>
                        <div className="col-sm">
                            <h3>
                                <a href="#" id="demoTranslationsJson" onClick={this.demoTranslationsJson}>
                                    translations.json
                                </a>
                            </h3>
                            <div>
                                <input type="file" onChange={this.uploadTranslation} />
                            </div>
                        </div>
                        <div className="col-sm">
                            <h3>Actions</h3>
                            <div>
                                <button className="btn btn-info btn-sm" type="button" onClick={this.handleAdd}>
                                    Add
                                </button>
                                &nbsp;
                                <button className="btn btn-primary btn-sm" type="button" onClick={this.handleSave}>
                                    SAVE
                                </button>
                                &nbsp;
                                <a href="#" id="download" onClick={this.handleExport}>
                                    Export
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <table className="table table-striped">
                    <thead>
                        <tr>{this.renderHeader()}</tr>
                    </thead>
                    <tbody>{this.renderRows()}</tbody>
                </table>
            </div>
        );
    }
}

export default App;
