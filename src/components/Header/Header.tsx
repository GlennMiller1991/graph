import React from "react";
import styles from './Header.module.scss'

export const Header: React.FC = React.memo(() => {
    return (
        <div className={styles.controlPanel}>
            Control panel
        </div>
    )
})