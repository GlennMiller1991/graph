import React from "react";
import styles from "../Field.module.scss";
import {TApexProperties, TLineProperties, TLineStyle} from "../Field";

type TLineEditBarProps = {
    line: TLineProperties,
    changeLineStyles: (lineId: string, lineStyles: Partial<TLineStyle>) => void,
    deleteApexLink: (lineId: string) => void,
}
export const LineEditBar: React.FC<TLineEditBarProps> = React.memo(({
                                                                        line,
                                                                        changeLineStyles,
                                                                        deleteApexLink,
                                                                    }) => {
    return (
        <div className={styles.lineEditBar}>
            {line.id}
            <div>
                <input type={'range'}
                       max={180}
                       min={-179}
                       step={1}
                       value={line.style.startAngle}
                       data-property={'startAngle'}
                       onChange={(event) => {
                           changeLineStyles(line.id, {[event.currentTarget.dataset.property as string]: +event.currentTarget.value})
                       }}/>
                <input type={'range'}
                       max={180}
                       min={-179}
                       step={1}
                       value={line.style.endAngle}
                       data-property={'endAngle'}
                       onChange={(event) => {
                           changeLineStyles(line.id, {[event.currentTarget.dataset.property as string]: +event.currentTarget.value})
                       }}/>
            </div>

            <button onClick={() => {
                deleteApexLink(line.id)
            }}>
                del
            </button>
        </div>
    )
})