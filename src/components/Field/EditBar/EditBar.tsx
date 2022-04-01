import React, {useState} from "react";
import styles from "../Field.module.scss";
import {TApexProperties} from "../Field";

type TEditBarProps = {
    apex: TApexProperties,
    deleteApexById: (apexId: string) => void,
    updateApexStyles: (apexId: string, apexProperty: Partial<TApexProperties>) => void,
}
export const EditBar: React.FC<TEditBarProps> = React.memo(({
                                                                apex,
                                                                deleteApexById,
                                                                updateApexStyles,
                                                            }) => {

    const [side, setSide] = useState<'left' | 'right'>('right')
    console.log(`${side === 'right' ?
        apex.cx + apex.style.widthDiv + 29 :
        apex.cx - apex.style.widthDiv - 29 - 300
    }px ${apex.cx}`)
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
                {apex.id}
            </div>
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