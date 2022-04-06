import React, {useCallback, useRef, useState, MouseEvent} from "react";
import styles from "./ApexLink.module.scss";
import {controlPanelHeight, TApexProperties, TLineStyle, TPoints} from "../Field";
import {getPointOfRectByAngle} from "../../../utils/geometry";

type TApexLink = {
    lineId: string,
    startApex: TApexProperties,
    endApex: TApexProperties,
    activeLine: string
    setActiveLine: (lineId: string) => void,
    style: TLineStyle,
    updateLinePoints: (lineId: string, point: Partial<TPoints>) => void,
}
export const ApexLink: React.FC<TApexLink> = React.memo(({
                                                             lineId,
                                                             startApex,
                                                             endApex,
                                                             activeLine,
                                                             setActiveLine,
                                                             style,
                                                             updateLinePoints,
                                                         }) => {

    const [moveStatus, setMoveStatus] = useState(false)
    const pointPosition = useRef({cx: 0, cy: 0})

    const mouseMoveHandlerFirst = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - pointPosition.current.cx) > 5 ||
            Math.abs(event.clientY - controlPanelHeight - pointPosition.current.cy) > 5) {
            pointPosition.current.cx = -100
            pointPosition.current.cy = -100
            let clientX = event.clientX
            let widthDiv = startApex.style.widthDiv
            let clientY = event.clientY - controlPanelHeight
            let heightDiv = startApex.style.heightDiv
            let cx =
                clientX >= startApex.cx - widthDiv &&
                clientX <= startApex.cx + widthDiv ?
                    clientX - startApex.cx
                    :
                    clientX - startApex.cx >= 0 ?
                        widthDiv :
                        -widthDiv

            let
                cy =
                    clientY >= startApex.cy - heightDiv &&
                    clientY <= startApex.cy + heightDiv ?
                        clientY - startApex.cy
                        :
                        clientY - startApex.cy >= 0 ?
                            heightDiv :
                            -heightDiv
            updateLinePoints(
                lineId,
                {
                    first: {
                        cx,
                        cy,
                    }
                }
            )
            setMoveStatus(true)
        }
    }, [lineId, updateLinePoints, startApex])
    const mouseMoveHandlerSecond = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - pointPosition.current.cx) > 5 ||
            Math.abs(event.clientY - controlPanelHeight - pointPosition.current.cy) > 5) {
            pointPosition.current.cx = -100
            pointPosition.current.cy = -100
            updateLinePoints(
                lineId,
                {
                    second: {
                        cx: event.clientX - startApex.cx,
                        cy: event.clientY - controlPanelHeight - startApex.cy,
                    }
                }
            )
            setMoveStatus(true)
        }
    }, [lineId, updateLinePoints, startApex.cx, startApex.cy])
    const mouseMoveHandlerPenultimate = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - pointPosition.current.cx) > 5 ||
            Math.abs(event.clientY - controlPanelHeight - pointPosition.current.cy) > 5) {
            pointPosition.current.cx = -100
            pointPosition.current.cy = -100
            updateLinePoints(
                lineId,
                {
                    penultimate: {
                        cx: event.clientX - endApex.cx,
                        cy: event.clientY - controlPanelHeight - endApex.cy,
                    }
                }
            )
            setMoveStatus(true)
        }
    }, [lineId, updateLinePoints, endApex.cx, endApex.cy])
    const mouseMoveHandlerLast = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - pointPosition.current.cx) > 5 ||
            Math.abs(event.clientY - controlPanelHeight - pointPosition.current.cy) > 5) {
            pointPosition.current.cx = -100
            pointPosition.current.cy = -100
            let clientX = event.clientX
            let widthDiv = endApex.style.widthDiv
            let clientY = event.clientY - controlPanelHeight
            let heightDiv = endApex.style.heightDiv
            let cx =
                clientX >= endApex.cx - widthDiv &&
                clientX <= endApex.cx + widthDiv ?
                    clientX - endApex.cx
                    :
                    clientX - endApex.cx >= 0 ?
                        widthDiv :
                        -widthDiv

            let
                cy =
                    clientY >= endApex.cy - heightDiv &&
                    clientY <= endApex.cy + heightDiv ?
                        clientY - endApex.cy
                        :
                        clientY - endApex.cy >= 0 ?
                            heightDiv :
                            -heightDiv
            updateLinePoints(
                lineId,
                {
                    last: {
                        cx,
                        cy,
                    }
                }
            )
            setMoveStatus(true)
        }
    }, [lineId, updateLinePoints, endApex])

    return (
        <>
            <path className={styles.line}
                  stroke={style.color}
                  strokeWidth={style.width}
                  fill={'none'}
                  strokeDasharray={style.dash}
                  style={{animationDuration: `${style.animationDuration}s`}}
                  d={`
                     M${startApex.cx + style.points.first.cx} ${startApex.cy + style.points.first.cy}
                     C${startApex.cx + style.points.second.cx} ${startApex.cy + style.points.second.cy},
                     ${endApex.cx + style.points.penultimate.cx} ${endApex.cy + style.points.penultimate.cy},
                     ${endApex.cx + style.points.last.cx} ${endApex.cy + style.points.last.cy}
                     `}
                  onDoubleClick={(event) => {
                      event.stopPropagation()
                      if (!activeLine) {
                          setActiveLine(lineId)
                      } else {
                          if (activeLine === lineId) {
                              setActiveLine('')
                          }
                      }
                  }}
            />
            {
                activeLine === lineId &&
                <>
                    <circle cx={startApex.cx + style.points.first.cx}
                            cy={startApex.cy + style.points.first.cy}
                            r={5}
                            fill={'blue'}
                            opacity={.5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = startApex.cx + style.points.second.cx
                                pointPosition.current.cy = startApex.cy + style.points.second.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', mouseMoveHandlerFirst)
                            }}
                            onMouseUp={(event: MouseEvent<SVGCircleElement>) => {
                                event.stopPropagation()
                                if (moveStatus) {
                                    setMoveStatus(false)
                                }
                                //@ts-ignore
                                document.removeEventListener('mousemove', mouseMoveHandlerFirst)
                            }}
                    />
                    <circle cx={startApex.cx + style.points.second.cx}
                            cy={startApex.cy + style.points.second.cy}
                            r={5}
                            fill={'blue'}
                            opacity={.5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = startApex.cx + style.points.second.cx
                                pointPosition.current.cy = startApex.cy + style.points.second.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', mouseMoveHandlerSecond)
                            }}
                            onMouseUp={(event: MouseEvent<SVGCircleElement>) => {
                                event.stopPropagation()
                                if (moveStatus) {
                                    setMoveStatus(false)
                                }
                                //@ts-ignore
                                document.removeEventListener('mousemove', mouseMoveHandlerSecond)
                            }}
                    />
                    <circle cx={endApex.cx + style.points.penultimate.cx}
                            cy={endApex.cy + style.points.penultimate.cy}
                            r={5}
                            fill={'blue'}
                            opacity={.5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = startApex.cx + style.points.second.cx
                                pointPosition.current.cy = startApex.cy + style.points.second.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', mouseMoveHandlerPenultimate)
                            }
                            }
                            onMouseUp={(event: MouseEvent<SVGCircleElement>) => {
                                event.stopPropagation()
                                if (moveStatus) {
                                    setMoveStatus(false)
                                }
                                //@ts-ignore
                                document.removeEventListener('mousemove', mouseMoveHandlerPenultimate)
                            }}/>
                    <circle cx={endApex.cx + style.points.last.cx}
                            cy={endApex.cy + style.points.last.cy}
                            r={5}
                            fill={'blue'}
                            opacity={.5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = startApex.cx + style.points.second.cx
                                pointPosition.current.cy = startApex.cy + style.points.second.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', mouseMoveHandlerLast)
                            }}
                            onMouseUp={(event: MouseEvent<SVGCircleElement>) => {
                                event.stopPropagation()
                                if (moveStatus) {
                                    setMoveStatus(false)
                                }
                                //@ts-ignore
                                document.removeEventListener('mousemove', mouseMoveHandlerLast)
                            }}/>
                    <path stroke={'blue'}
                          fill={'none'}
                          strokeDasharray={5}
                          opacity={.5}
                          style={{pointerEvents: 'none'}}
                          d={`
                     M${startApex.cx + style.points.first.cx} ${startApex.cy + style.points.first.cy}
                     L${startApex.cx + style.points.second.cx} ${startApex.cy + style.points.second.cy}
                     L${endApex.cx + style.points.penultimate.cx} ${endApex.cy + style.points.penultimate.cy}
                     L${endApex.cx + style.points.last.cx} ${endApex.cy + style.points.last.cy}
                     `}/>
                </>
            }
        </>
    )
})