import React, {useCallback, useState} from 'react';
import styles from './App.module.scss';
import {Field, TApexProperties} from "./components/Field/Field";

function App() {

    return (
        <div className={styles.app}>
            <div className={styles.controlPanel}>

            </div>
            <Field/>
        </div>
    );
}

export default App;



