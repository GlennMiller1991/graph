import React, {useCallback, useState} from "react";
import styles from './Apex.module.scss';
import variables from './../../../common/styles/variables.module.scss';
import {TApexProperties} from "../Field";


const controlPanelHeight = +variables.controlPanelHeight.slice(0, -2)

type TApexPosition = {
    cx: number,
    cy: number,
}

type TApexProps = {
    scale: number,
    changePosition: (apexID: string, cx: number, cy: number) => void,
    apexProperties: TApexProperties,
}
export const Apex: React.FC<TApexProps> = React.memo((
    {
        scale,
        changePosition,
        apexProperties
    }) => {

    // state
    // current apex position
    const [apexPosition, setApexPosition] = useState<TApexPosition>({
        cx: apexProperties.cx,
        cy: apexProperties.cy
    })

    const onMouseMoveHandler = useCallback((event: MouseEvent) => {
        setApexPosition({
            cx: event.clientX,
            cy: event.clientY - controlPanelHeight
        })
    }, [])


    return (
        <circle className={styles.apex}
                cx={String(apexPosition.cx)}
                cy={String(apexPosition.cy)}
                r={String(apexProperties.r * scale)}
                onMouseDown={() => {
                    document.addEventListener('mousemove', onMouseMoveHandler)
                }}
                onMouseUp={() => {
                    changePosition(apexProperties.id, apexPosition.cx, apexPosition.cy)
                    document.removeEventListener('mousemove', onMouseMoveHandler)
                }}
        />
    )
})