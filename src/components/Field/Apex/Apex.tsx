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
    setApexActive: (apexID: string) => void,
    activeApexId: string,
    updateApexLinks: (apexID: string) => void,
}
export const Apex: React.FC<TApexProps> = React.memo((
    // need to refactor mouse down / mouse up

    {
        scale,
        changePosition,
        apexProperties,
        setApexActive,
        activeApexId,
        updateApexLinks,
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
        <g>
            <circle className={styles.apex}
                    cx={String(apexPosition.cx)}
                    cy={String(apexPosition.cy)}
                    r={String(apexProperties.r * scale)}
                    fill={activeApexId === apexProperties.id ? 'green' : 'black'}
                    onMouseDown={() => {
                        document.addEventListener('mousemove', onMouseMoveHandler)
                    }}
                    onMouseUp={() => {
                        changePosition(apexProperties.id, apexPosition.cx, apexPosition.cy)
                        document.removeEventListener('mousemove', onMouseMoveHandler)
                    }}
                    onDoubleClick={(event) => {
                        event.stopPropagation()
                        setApexActive(activeApexId === apexProperties.id ? '-1' : apexProperties.id)
                    }}
                    onClick={(event) => {
                        if (activeApexId && activeApexId !== apexProperties.id) {
                            updateApexLinks(apexProperties.id)
                        }
                    }}
            />
            {/*{*/}
            {/*    apexProperties.links &&*/}
            {/*    apexProperties.links.map((link, key) => {*/}
            {/*        return <line key={key}*/}
            {/*                     stroke={'black'}*/}
            {/*                     x1={apexPosition.cx} y1={apexPosition.cy}*/}
            {/*                     x2={link.cx} y2={link.cy}/>*/}
            {/*    })*/}
            {/*}*/}
            {
                activeApexId === apexProperties.id &&
                <line stroke={'black'}
                      pointerEvents={'none'}
                      strokeWidth={3}
                      x1={apexPosition.cx} y1={apexPosition.cy}
                      x2={apexProperties.cx + 10} y2={apexProperties.cy + 10}
                />
            }
        </g>
    )
})