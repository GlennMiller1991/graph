import React from 'react';
import styles from './App.module.scss';
import {Field} from "./components/Field/Field";


function App() {

    return (
        <div className={styles.app}>
            <div className={styles.controlPanel}>
                ControlPanel
            </div>
            <Field/>
        </div>
    );
}

export default App;

