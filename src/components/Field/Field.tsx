import React, {MouseEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styles from './Field.module.scss'
import variables from './../../common/styles/variables.module.scss';
import {v1} from "uuid";
import {Apex} from "./Apex/Apex";
import {ApexLink} from "./ApexLink/ApexLink";
import {EditBar} from "./EditBar/EditBar";
import {LineEditBar} from "./LineEditBar/LineEditBar";

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
    header: string,
    nameHeight: number,
    fontSize: number,
    heightOffset: number,
    widthOffset: number,
}
export type TLineProperties = {
    id: string,
    start: string,
    end: string,
    style: TLineStyle
}
export type TLineStyle = {
    startAngle: number,
    endAngle: number,
    color: string,
    width: number,
    dash: number,
    animationDuration: number,
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
    const movingApexOffsets = useRef({offsetX: 0, offsetY: 0})


    // selection login
    const [selectionStatus, setSelectionStatus] = useState(false)
    const [cursorCurrentPosition, setCursorCurrentPosition] = useState({top: 0, left: 0, width: 0, height: 0})
    const cursorStartPosition = useRef({cx: 0, cy: 0})
    const onSelectionHandler = useCallback(function (event: MouseEvent<SVGSVGElement>) {
        if (Math.abs(event.clientX - cursorStartPosition.current.cx) > 20 ||
            Math.abs(event.clientY - controlPanelHeight - cursorStartPosition.current.cy) > 20) {
            setSelectionStatus(true)
            setCursorCurrentPosition({
                top: cursorStartPosition.current.cy < event.clientY - controlPanelHeight ?
                    cursorStartPosition.current.cy :
                    event.clientY - controlPanelHeight,
                left: cursorStartPosition.current.cx < event.clientX ?
                    cursorStartPosition.current.cx :
                    event.clientX,
                width: Math.abs(event.clientX - cursorStartPosition.current.cx),
                height: Math.abs(event.clientY - controlPanelHeight - cursorStartPosition.current.cy),
            })
        }
    }, [])
    const selectedApexes = useRef<string[]>([])
    const activeLineObj: undefined | { line: TLineProperties, startApexObj: TApexProperties, endApexObj: TApexProperties } = useMemo(() => {
        let activeLineObj = lines.find((line) => line.id === activeLine)
        let retObj: any = {}
        if (activeLineObj) {
            //@ts-ignore
            let startApexObj = apexes.find((apex) => apex.id === activeLineObj.start)
            //@ts-ignore
            let endApexObj = apexes.find((apex) => apex.id === activeLineObj.end)
            if (!startApexObj || !endApexObj) {
                deleteApexLink(activeLine)
                setActiveLine('')
            } else {
                retObj.line = activeLineObj
                retObj.startApexObj = startApexObj
                retObj.endApexObj = endApexObj
            }
        } else {
            setActiveLine('')
        }
        return retObj
    }, [activeLine, lines])
    const isCtrlPressed = useRef(false)

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
                    heightDiv: 15,
                    header: 'NODE',
                    nameHeight: 16,
                    fontSize: 10,
                    heightOffset: 0,
                    widthOffset: 0,
                },
            }
        ])
    }, [apexes])
    const onMouseMoveHandler = useCallback((event: MouseEvent) => {
        if (!selectedApexes.current.includes(movingApex.current)) {
            setApexes((apexes) => {
                return apexes.map((outerApex) => {
                        return outerApex.id === movingApex.current ?
                            {
                                ...outerApex,
                                cx: event.clientX + movingApexOffsets.current.offsetX,
                                cy: (event.clientY - controlPanelHeight) + movingApexOffsets.current.offsetY,
                            } :
                            outerApex
                    }
                )
            })
        } else {
            setApexes((apexes) => {
                let movingApexObj = apexes.find((apex) => apex.id === movingApex.current)
                if (movingApexObj) {
                    let baseCoords = {cx: movingApexObj.cx, cy: movingApexObj.cy}
                    let newApexes = apexes.map((apex) => {
                        if (selectedApexes.current.includes(apex.id)) {
                            return {
                                ...apex,
                                cx: event.clientX - (baseCoords.cx - apex.cx) + movingApexOffsets.current.offsetX,
                                cy: event.clientY - controlPanelHeight - (baseCoords.cy - apex.cy) + movingApexOffsets.current.offsetY,
                            }
                        } else {
                            return apex
                        }
                    })
                    return newApexes
                }
                return apexes
            })
        }
    }, [])
    const updateApexLinks = useCallback((linkFromId: string, linkToId: string) => {
        setLines((lines) => {
            let lineIndex = lines.findIndex((line) => line.start === linkFromId && line.end === linkToId)
            if (lineIndex === -1) {
                return [
                    ...lines,
                    {
                        id: v1(),
                        start: linkFromId,
                        end: linkToId,
                        style: {
                            startAngle: 90,
                            endAngle: -90,
                            color: '#9b7d7d',
                            width: 1,
                            dash: 0,
                            animationDuration: 0,
                        }
                    }
                ]
            } else {
                return lines
            }
        })
    }, [])
    const deleteApexById = useCallback((apexId: string) => {
        setActiveApex('')
        setApexes((apexes) => {
            return apexes.filter((apex) => apex.id !== apexId)
        })
        setLines((lines) => {
            return lines.filter((line) => line.start !== apexId && line.end !== apexId)
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
    const redrawApex = useCallback((apexId: string, below: boolean) => {
        setApexes((apexes) => {
            let apex = apexes.find((apex) => apex.id === apexId)
            if (apex) {
                if (below) {
                    return [
                        {
                            ...apex
                        },
                        ...apexes.filter((apex) => apex.id !== apexId)
                    ]
                } else {
                    return [
                        ...apexes.filter((apex) => apex.id !== apexId),
                        {
                            ...apex
                        }
                    ]
                }

            } else {
                return apexes
            }
        })
    }, [])
    const addApexToSelected = useCallback((apexId: string, isSelected: boolean) => {
        if (isSelected) {
            selectedApexes.current = selectedApexes.current.filter((apex) => apex !== apexId)
        } else {
            selectedApexes.current.push(apexId)
        }
        setApexes((apexes) => {
            return [...apexes]
        })
    }, [])

    const deleteSelectedApexes = useCallback(() => {
        setApexes((apexes) => {
            return apexes.filter((apex) => !selectedApexes.current.includes(apex.id))
        })
    }, [])
    const copySelectedApexes = useCallback(() => {
        setApexes((apexes) => {
            let addApexes = apexes
                .filter((apex) => selectedApexes.current.includes(apex.id))
                .map((apex) => {
                    return {
                        ...apex,
                        id: v1(),
                        cx: apex.cx + 10,
                        cy: apex.cy + 10,
                    }
                })
            return [
                ...apexes,
                ...addApexes,
            ]
        })
    }, [])
    const onSvgKeyDownHandler = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Control') {
            isCtrlPressed.current = true
            return
        } if (event.key === 'Delete') {
            deleteSelectedApexes()
        } else {
            if (isCtrlPressed.current) {
                if (event.key === 'v') {
                    copySelectedApexes()
                }
            }
        }
    }, [copySelectedApexes])
    const onSvgKeyUpHandler = useCallback((event) => {
        if (event.key === 'Control') {
            isCtrlPressed.current = false
        }
    }, [])

    useEffect(() => {
     return () => {
         document.removeEventListener('keydown', onSvgKeyDownHandler)
         document.removeEventListener('keydown', onSvgKeyUpHandler)
     }
    }, [onSvgKeyDownHandler, onSvgKeyUpHandler])

    return (
        <div className={styles.field}>
            <svg className={styles.svgField}
                 ref={(node) => {
                     if (node) {
                         document.addEventListener('keydown', onSvgKeyDownHandler)
                         document.addEventListener('keyup', onSvgKeyUpHandler)
                     }
                 }}
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
                 }}
                 onMouseDown={(event) => {
                     cursorStartPosition.current.cx = event.clientX
                     cursorStartPosition.current.cy = event.clientY - controlPanelHeight
                     //@ts-ignore
                     document.addEventListener('mousemove', onSelectionHandler)
                 }}
                 onMouseUp={(event) => {
                     //@ts-ignore
                     document.removeEventListener('mousemove', onSelectionHandler)
                     if (selectionStatus) {
                         if (window.getSelection) {
                             window?.getSelection()?.removeAllRanges();
                         }
                         let selectedElements = apexes.filter((apex) => {
                             if (
                                 apex.cx - apex.style.widthDiv > cursorCurrentPosition.left &&
                                 apex.cx + apex.style.widthDiv < cursorCurrentPosition.left + cursorCurrentPosition.width &&
                                 apex.cy - apex.style.heightDiv > cursorCurrentPosition.top &&
                                 apex.cy + apex.style.heightDiv < cursorCurrentPosition.top + cursorCurrentPosition.height
                             ) {
                                 return true
                             } else {
                                 return false
                             }
                         }).map((apex) => apex.id)
                         selectedApexes.current = selectedElements
                         setSelectionStatus(false)
                     }
                     else {
                         selectedApexes.current = []
                         setApexes([...apexes])
                     }
                 }}
            >
                {
                    apexes.map((apex, key) => {
                        return (
                            <Apex key={key}
                                  isSelected={selectedApexes.current.includes(apex.id)}
                                  redrawApex={redrawApex}
                                  movingApex={movingApex}
                                  movingApexOffsets={movingApexOffsets}
                                  activeApex={activeApex}
                                  apex={apex}
                                  updateApexLinks={updateApexLinks}
                                  deleteApexById={deleteApexById}
                                //@ts-ignore
                                  onMouseMoveHandler={onMouseMoveHandler}
                                  setActiveApex={setActiveApex}
                                  isCtrlPressed={isCtrlPressed}
                                  addApexToSelected={addApexToSelected}
                            />
                        )
                    })
                }
                {
                    lines.map((line, key) => {
                        let startApex = apexes.find((apex) => apex.id === line.start)
                        let endApex = apexes.find((apex) => apex.id === line.end)
                        if (startApex && endApex) {
                            return (
                                <ApexLink lineId={line.id}
                                          style={line.style}
                                          key={key}
                                          startApex={startApex}
                                          endApex={endApex}
                                          activeLine={activeLine}
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
                             updateApexStyles={updateApexStyles} redrawApex={redrawApex}/> :
                    activeLine && activeLineObj ?
                        <LineEditBar line={activeLineObj.line}
                                     changeLineStyles={changeLineStyles}
                                     deleteApexLink={deleteApexLink}
                                     setActiveLine={setActiveLine}
                        /> :
                        false
            }
            {
                selectionStatus &&
                <div style={{
                    position: 'absolute',
                    border: '1px dashed blue',
                    backgroundColor: 'rgba(97,121,222,0.3)',
                    top: cursorCurrentPosition.top,
                    left: cursorCurrentPosition.left,
                    width: cursorCurrentPosition.width,
                    height: cursorCurrentPosition.height,
                    pointerEvents: 'none',
                }}/>
            }
        </div>
    )
})

