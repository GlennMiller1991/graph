import React, {MouseEvent, useCallback, useRef, useState} from "react";
import styles from './Field.module.scss'
import variables from './../../common/styles/variables.module.scss';
import {v1} from "uuid";
import {Apex} from "./Apex/Apex";
import {ApexLink} from "./ApexLink/ApexLink";
import {EditBar} from "./EditBar/EditBar";
import {getPointOfRectByAngle} from "../../utils/geometry";

export const controlPanelHeight = +variables.controlPanelHeight.slice(0, -2)

export type TLink = string
export type TApexProperties = {
    id: string,
    r: number,
    cx: number,
    cy: number,
    links: Array<TLink>,
    style: TApexStyle,
}
export type TApexStyle = {
    borderRadius: number,
    borderWidth: number,
    borderColor: string,
    backgroundColor: string,
    opacity: number,
    widthDiv: number,
    heightDiv: number,
}
export type TLineProperties = {
    id: string,
    start: {
        id: string,
    },
    end: {
        id: string,
    },
    style: TLineStyle
}
export type TLineStyle = {
    startAngle: number,
    endAngle: number,
}

export const Field: React.FC = React.memo(() => {
    // state

    // current apexes and lines on the svg
    const [apexes, setApexes] = useState<TApexProperties[]>([])
    const [lines, setLines] = useState<TLineProperties[]>([])

    // active edit apex and line
    const [activeApex, setActiveApex] = useState<string>('')
    const [activeLine, setActiveLine] = useState<string>('')

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
                style: {
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#343434',
                    backgroundColor: '#a0a0a0',
                    opacity: 1,
                    widthDiv: 100,
                    heightDiv: 15
                },
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
    const updateApexLinks = useCallback((linkFromId: string, linkToId: string) => {
        setLines((lines) => {
            return [
                ...lines,
                {
                    id: v1(),
                    start: {
                        id: linkFromId,
                    },
                    end: {
                        id: linkToId,
                    },
                    style: {
                        startAngle: 90,
                        endAngle: -90,
                    }
                }
            ]
        })
    }, [])
    const deleteApexById = useCallback((apexId: string) => {
        setActiveApex('')
        setApexes((apexes) => {
            return apexes.filter((apex) => apex.id !== apexId)
        })
    }, [])
    const deleteApexLink = useCallback((lineId: string) => {
        setLines((lines) => {
            return lines.filter((line) => line.id !== lineId)
        })
        setActiveLine('')
    }, [])
    const updateApexStyles = useCallback((apexId: string, apexStyles: Partial<TApexStyle>) => {
        setApexes((apexes) => {
            return apexes.map((apex) => apex.id === apexId ? {...apex, style: {...apex.style, ...apexStyles}} : apex)
        })
    }, [])
    const changeLineStyles = useCallback((lineId: string, lineStyles: Partial<TLineStyle>) => {
        setLines((lines) => {
            return lines.map((line) => line.id === lineId ?
                {
                    ...line,
                    style: {
                        ...line.style,
                        ...lineStyles
                    }
                } :
                line)
        })
    }, [])

    return (
        <div className={styles.field}>
            <svg className={styles.svgField}
                 onDoubleClick={onDoubleClickHandler}
                 onWheel={(event) => {
                     let newApexes
                     if (event.deltaY > 0) {
                         newApexes = apexes.map((apex) => {
                             return {
                                 ...apex,
                                 cx: apex.cx * 1.01,
                                 cy: apex.cy * 1.01,
                                 r: apex.r * 1.01,
                             }
                         })
                     } else {
                         newApexes = apexes.map((apex) => {
                             return {
                                 ...apex,
                                 cx: apex.cx / 1.01,
                                 cy: apex.cy / 1.01,
                                 r: apex.r / 1.01,
                             }
                         })
                     }

                     setApexes(newApexes)
                 }}>
                {
                    apexes.map((apex, key) => {
                        return (
                            <Apex key={key}
                                  movingApex={movingApex}
                                  activeApex={activeApex}
                                  apex={apex}
                                  updateApexLinks={updateApexLinks}
                                  deleteApexById={deleteApexById}
                                //@ts-ignore
                                  onMouseMoveHandler={onMouseMoveHandler}
                                  setActiveApex={setActiveApex}
                            />
                        )
                    })
                }
                {
                    lines.map((line, key) => {
                        let startApex = apexes.find((apex) => apex.id === line.start.id)
                        let endApex = apexes.find((apex) => apex.id === line.end.id)
                        if (startApex && endApex) {
                            return (
                                <ApexLink lineId={line.id}
                                          style={line.style}
                                          key={key}
                                          startApex={startApex}
                                          endApex={endApex}
                                          activeApex={activeApex}
                                          activeLine={activeLine}
                                          deleteApexLink={deleteApexLink}
                                          setActiveLine={setActiveLine}/>
                            )
                        } else {
                            deleteApexLink(line.id)
                            return ''
                        }

                    })
                }
            </svg>
            {
                activeApex ?
                    <EditBar apex={apexes.find((apex) => apex.id === activeApex) as TApexProperties}
                             deleteApexById={deleteApexById}
                             updateApexStyles={updateApexStyles}/> :
                    activeLine ?
                        <LineEditBar activeLine={activeLine} startApex={apexes.find((apex) => {
                            let line = lines.find((line) => line.id === activeLine)
                            if (line) {
                                //@ts-ignore
                                let startApex = apexes.find((apex) => apex.id === line.start.id)
                                if (startApex) return startApex
                            }
                            return undefined
                        }) as TApexProperties}
                                     changeLineStyles={changeLineStyles}/> :
                        false
            }
        </div>
    )
})

type TLineEditBarProps = {
    activeLine: string,
    startApex: TApexProperties,
    changeLineStyles: (lineId: string, lineStyles: Partial<TLineStyle>) => void,
}
export const LineEditBar: React.FC<TLineEditBarProps> = React.memo(({
                                                                        activeLine,
                                                                        startApex,
                                                                        changeLineStyles,
                                                                    }) => {
    return (
        <div className={styles.lineEditBar}>
            line {activeLine}
            <input type={'range'}
                   max={180}
                   min={-179}
                   step={1}
                   onChange={(event) => {
                       changeLineStyles(activeLine, {startAngle: +event.currentTarget.value})
                   }}/>
        </div>
    )
})