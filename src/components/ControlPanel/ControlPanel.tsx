import React from "react";
import styles from './ControlPanel.module.scss'

export const ControlPanel: React.FC = React.memo(() => {
    return (
        <div className={styles.controlPanel}>
            Control panel
        </div>
    )
})