import React, {createRef, useRef, useState} from "react";
import styles from "../Field.module.scss";
import {TApexProperties, TApexStyle} from "../Field";

type TEditBarProps = {
    apex: TApexProperties,
    deleteApexById: (apexId: string) => void,
    updateApexStyles: (apexId: string, apexProperty: Partial<TApexStyle>) => void,
}
export const EditBar: React.FC<TEditBarProps> = React.memo(({
                                                                apex,
                                                                deleteApexById,
                                                                updateApexStyles,
                                                            }) => {

    const [side, setSide] = useState<'left' | 'right'>('right')

    return (
        <div className={styles.editBar} style={{
            top: `${apex.cy - 120}px`,
            left: `${side === 'right' ?
                apex.cx + +apex.style.widthDiv + 29 :
                apex.cx - +apex.style.widthDiv - 29 - 300
            }px`
        }}
             ref={(node) => {
                 if (node) {
                     let parent = node.parentElement
                     if (parent) {
                         let parentSizes = parent.getBoundingClientRect()
                         let nodeSizes = node.getBoundingClientRect()
                         if (side === 'right') {
                             if (nodeSizes.right + 4 > parentSizes.width) {
                                 setSide('left')
                             }
                         } else {
                             if (nodeSizes.left - 4 < 0) {
                                 setSide('right')
                             }
                         }
                     }
                 }
             }}>
            <div className={styles.editBarPointer}
                 style={side === 'left' ? {right: '-20px'} : {left: '-20px'}}/>
            <div className={styles.editBarPointerCover}
                 style={side === 'left' ? {right: '0'} : {left: '0'}}/>
            <div className={styles.editBarHeader}>
                <input type={'text'}
                       defaultValue={apex.style.header}
                       data-property={'header'}
                       onChange={(event) => {
                           let newValue = event.currentTarget.value
                           let newStyle = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           updateApexStyles(apex.id, newStyle)
                       }}/>
            </div>
            <div className={styles.inputsContainer}>
                <input type={'range'}
                       data-property={'fontSize'}
                       min={10}
                       max={36}
                       step={.1}
                       value={apex.style.fontSize}
                       onChange={(event) => {
                           let newValue = +event.currentTarget.value
                           let newStyle = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           updateApexStyles(apex.id, newStyle)
                       }}
                />
                <input type={'range'}
                       data-property={'heightOffset'}
                       value={apex.style.heightOffset}
                       min={-100}
                       max={100}
                       step={1}
                       onChange={(event) => {
                           let newValue = +event.currentTarget.value
                           let newStyle = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           updateApexStyles(apex.id, newStyle)
                       }}
                />
                <input type={'range'}
                       data-property={'widthOffset'}
                       value={apex.style.widthOffset}
                       min={-100}
                       max={1000}
                       step={1}
                       onChange={(event) => {
                           let newValue = +event.currentTarget.value
                           let newStyle = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           updateApexStyles(apex.id, newStyle)
                       }}
                />
            </div>
            <div style={{borderBottom: '1px solid black', width: '80%'}}/>
            <div className={styles.inputsContainer}>
                <input type={'file'}/>
            </div>
            <div style={{borderBottom: '1px solid black', width: '80%'}}/>
            <div className={styles.changeR}>
                <input type={"range"} max={100} min={5} step={1} data-property={'widthDiv'} value={apex.style.widthDiv}
                       onChange={(event) => {
                           let newValue = +event.currentTarget.value
                           let newStyles = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           if (newValue < apex.style.borderRadius) {
                               newStyles.borderRadius = newValue
                           }
                           updateApexStyles(apex.id, newStyles)
                       }}/>
                <input type={"range"} max={50} min={5} step={1} data-property={'heightDiv'} value={apex.style.heightDiv}
                       onChange={(event) => {
                           let newValue = +event.currentTarget.value
                           let newStyles = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           if (newValue < apex.style.borderRadius) {
                               newStyles.borderRadius = newValue
                           }
                           updateApexStyles(apex.id, newStyles)
                       }}/>
                <input type={"range"}
                       max={apex.style.widthDiv < +apex.style.heightDiv ? apex.style.widthDiv : apex.style.heightDiv}
                       min={0}
                       step={1}
                       data-property={'borderRadius'}
                       value={apex.style.borderRadius}
                       onChange={(event) => {
                           let newValue = +event.currentTarget.value
                           let newStyles = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           updateApexStyles(apex.id, newStyles)
                       }}/>
                <input type={"range"}
                       max={10}
                       min={0}
                       step={0.1}
                       data-property={'borderWidth'}
                       value={apex.style.borderWidth}
                       onChange={(event) => {
                           let newValue = +event.currentTarget.value
                           let newStyles = {
                               [event.currentTarget.dataset.property as string]: newValue
                           }
                           updateApexStyles(apex.id, newStyles)
                       }}/>
                <div className={styles.colors}>
                    <input type={"color"}
                           data-property={'borderColor'}
                           value={apex.style.borderColor}
                           onChange={(event) => {
                               let newValue = event.currentTarget.value
                               let newStyles = {
                                   [event.currentTarget.dataset.property as string]: newValue
                               }
                               updateApexStyles(apex.id, newStyles)
                           }}/>
                    <input type={"color"}
                           data-property={'backgroundColor'}
                           value={apex.style.backgroundColor}
                           onChange={(event) => {
                               let newValue = event.currentTarget.value
                               let newStyles = {
                                   [event.currentTarget.dataset.property as string]: newValue
                               }
                               updateApexStyles(apex.id, newStyles)
                           }}/>
                </div>

            </div>
            <div>

            </div>
            <div className={styles.deleteApex}>
                <button className={styles.button} onClick={() => deleteApexById(apex.id)}>
                    del
                </button>
            </div>
        </div>
    )
})