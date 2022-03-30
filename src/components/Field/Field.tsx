import React, {useCallback, useState, WheelEvent, MouseEvent, useRef} from "react";
import styles from './Field.module.scss'
import variables from './../../common/styles/variables.module.scss';
import {v1} from "uuid";

const controlPanelHeight = +variables.controlPanelHeight.slice(0, -2)


export type TLink = string
export type TApexProperties = {
    id: string,
    r: number,
    cx: number,
    cy: number,
    links: Array<TLink>,
    style: any,
}

export const Field: React.FC = React.memo(() => {

    // state
    // current apexes on the svg
    const [apexes, setApexes] = useState<TApexProperties[]>([])

    // active edit apex
    const [activeApex, setActiveApex] = useState<string>('')

    // apex that is moving now without state
    const movingApex = useRef<string>('')


    // callbacks
    const onDoubleClickHandler = useCallback((event: MouseEvent<SVGSVGElement>) => {
        // create new apex on the field
        setApexes([
            ...apexes,
            {
                r: 15,
                cx: event.clientX,
                cy: event.clientY - controlPanelHeight,
                id: v1(),
                links: [],
                style: {},
            }
        ])
    }, [apexes])
    const onMouseMoveHandler = useCallback((event: MouseEvent) => {
        // filter apex by id then change its position
        setApexes((apexes) => {
            return apexes.map((outerApex) => {
                    return outerApex.id === movingApex.current ?
                        {...outerApex, cx: event.clientX, cy: event.clientY - controlPanelHeight} :
                        outerApex
                }
            )
        })
    }, [])
    const updateApexLinks = useCallback((linkToId: string) => {
        setApexes((apexes) => {
            return apexes.map(
                (apex) => {
                    console.log(apex)
                    return apex.id === activeApex ?
                        {
                            ...apex,
                            links: [...apex.links.filter((link) => link !== linkToId), linkToId]
                        } :
                        apex
                })
        })

    }, [activeApex])
    const deleteApexById = useCallback((apexId: string) => {
        setApexes((apexes) => {
            return apexes.filter((apex) => apex.id !== apexId)
        })
    }, [])

    return (
        <div className={styles.field}>
            <svg className={styles.svgField} onDoubleClick={onDoubleClickHandler}>
                {
                    apexes.map((apex, key) => {

                        return (
                            <g key={key}>
                                {
                                    apex.links.map((link, key) => {
                                        let linkApex = apexes.find(
                                            (apex) => apex.id === link
                                        )
                                        if (linkApex) {
                                            let [cx, cy] = [linkApex.cx, linkApex.cy]
                                            return (
                                                <line key={key}
                                                      stroke={'black'}
                                                      strokeWidth={3}
                                                      x1={apex.cx} y1={apex.cy}
                                                      x2={cx} y2={cy}
                                                      pointerEvents={'none'}
                                                />
                                            )
                                        }
                                        return ''
                                    })
                                }
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
                            </g>
                        )
                    })
                }
            </svg>
        </div>
    )
})


