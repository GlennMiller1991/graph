import React from 'react'
import styles from "../Field.module.scss";
import {TApexProperties} from "../Field";

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
    return (
        <>
            <circle className={`${styles.apex} ${activeApex === apex.id ? styles.activeApex : ''}`}
                    cx={String(apex.cx)}
                    cy={String(apex.cy)}
                    r={String(apex.r)}
                    onMouseDown={() => {
                        movingApex.current = apex.id
                        //@ts-ignore
                        document.addEventListener('mousemove', onMouseMoveHandler)
                    }}
                    onMouseUp={() => {
                        movingApex.current = ''
                        //@ts-ignore
                        document.removeEventListener('mousemove', onMouseMoveHandler)
                    }}
                    onDoubleClick={(event) => {
                        event.stopPropagation()
                        setActiveApex(
                            apex.id === activeApex ?
                                '' :
                                apex.id
                        )
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