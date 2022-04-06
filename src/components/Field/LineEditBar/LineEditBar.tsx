import React from "react";
import styles from "../Field.module.scss";
import {TApexProperties, TLineProperties, TLineStyle} from "../Field";

type TLineEditBarProps = {
    line: TLineProperties,
    changeLineStyles: (lineId: string, lineStyles: Partial<TLineStyle>) => void,
    deleteApexLink: (lineId: string) => void,
    setActiveLine: (lineId: string) => void,
}
export const LineEditBar: React.FC<TLineEditBarProps> = React.memo(({
                                                                        line,
                                                                        changeLineStyles,
                                                                        deleteApexLink,
                                                                        setActiveLine,
                                                                    }) => {
    return (
        <div className={styles.lineEditBar}>
            <div>
                <input type={'color'}
                       value={line.style.color}
                       data-property={'color'}
                       onChange={(event) => {
                           changeLineStyles(line.id, {[event.currentTarget.dataset.property as string]: event.currentTarget.value})
                       }}
                />
            </div>
            <div>
                <input type={'range'}
                       max={10}
                       min={1}
                       step={.1}
                       value={line.style.width}
                       data-property={'width'}
                       onChange={(event) => {
                           changeLineStyles(line.id, {[event.currentTarget.dataset.property as string]: +event.currentTarget.value})
                       }}
                />
            </div>
            <div>
                <input type={'range'}
                       max={100}
                       min={0}
                       step={1}
                       value={line.style.dash}
                       data-property={'dash'}
                       onChange={(event) => {
                           let value = +event.currentTarget.value
                           let newStyles = {
                               [event.currentTarget.dataset.property as string]: +event.currentTarget.value
                           }
                           if (!value) {
                               if (line.style.animationDuration) {
                                   newStyles.animationDuration = 0
                               }
                           }
                           changeLineStyles(line.id, newStyles)
                       }}/>
            </div>
            <div>
                <input type={'range'}
                       max={50}
                       min={0}
                       step={2}
                       value={line.style.animationDuration}
                       data-property={'animationDuration'}
                       onChange={(event) => {
                           if (line.style.dash) {
                               changeLineStyles(line.id, {[event.currentTarget.dataset.property as string]: +event.currentTarget.value})
                           }
                       }}/>
            </div>
            <button onClick={() => {
                deleteApexLink(line.id)
            }}>
                del
            </button>
            <button onClick={() => {
                setActiveLine('')
            }}>
                close
            </button>
        </div>
    )
})