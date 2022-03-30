import React, {useCallback, useEffect, useRef, useState} from 'react'
import styles from "../Field.module.scss";
import {controlPanelHeight, TApexProperties} from "../Field";

type TMoveStatus = false | true
type TApexProps = {
    apex: TApexProperties,
    activeApex: string,
    movingApex: {
        current: string
    },
    setActiveApex: (apexId: string) => void,
    updateApexLinks: (apexId: string) => void,
    deleteApexById: (apexId: string) => void,

    onMouseMoveHandler: (event: MouseEvent) => void,
}

export const Apex: React.FC<TApexProps> = React.memo(({
                                                          apex,
                                                          activeApex,
                                                          movingApex,
                                                          setActiveApex,
                                                          updateApexLinks,
                                                          deleteApexById,
                                                          onMouseMoveHandler,
                                                      }) => {

    const [moveStatus, setMoveStatus] = useState<TMoveStatus>(false)
    // const [apexPosition, setApexPosition] = useState<{ cx: number, cy: number }>({cx: 0, cy: 0})
    const apexPosition = useRef({cx: 0, cy: 0})

    const mouseMoveHandler = useCallback((event: MouseEvent) => {
        if (Math.abs(event.clientX - apexPosition.current.cx) > 20 ||
            Math.abs(event.clientY - controlPanelHeight - apexPosition.current.cy) > 20) {
            movingApex.current = apex.id
            onMouseMoveHandler(event)
            setMoveStatus(true)
        }
    }, [movingApex, onMouseMoveHandler, apex.id])

    return (
        <>
            <circle className={`${styles.apex} ${activeApex === apex.id ? styles.activeApex : ''}`}
                    cx={String(apex.cx)}
                    cy={String(apex.cy)}
                    r={String(apex.r)}
                    onMouseDown={() => {
                        apexPosition.current.cx = apex.cx
                        apexPosition.current.cy = apex.cy
                        //@ts-ignore
                        document.addEventListener('mousemove', mouseMoveHandler)
                    }}
                    onMouseUp={() => {
                        if (moveStatus) {
                            // if drag - stop drag
                            setMoveStatus(false)
                            movingApex.current = ''
                        }
                        document.removeEventListener('mousemove', mouseMoveHandler)
                    }}
                    onDoubleClick={(event) => {
                        event.stopPropagation()
                        if (!activeApex) {
                            setActiveApex(apex.id)
                        } else {
                            if (activeApex === apex.id) {
                                setActiveApex('')
                            }
                        }
                    }}
                    onClick={() => {
                        if (activeApex && activeApex !== apex.id) {
                            updateApexLinks(apex.id)
                        }
                    }}
            />
            {
                activeApex === apex.id &&
                <g className={styles.deleteGroup}>
                    <path className={styles.deleteSign}
                          strokeWidth={1}
                          stroke={'#857272'}
                          d={`M${apex.cx + apex.r} ${apex.cy - apex.r} l6 -6 m-6 0 l6 6`}/>
                    <circle className={styles.deleteBackground}
                            cx={apex.cx + apex.r + 3}
                            cy={apex.cy - apex.r - 3}
                            r={8}
                            onClick={() => {
                                deleteApexById(apex.id)
                            }}/>
                </g>
            }
        </>
    )
})