import React, {useCallback, useRef, useState, MouseEvent, useMemo} from "react";
import styles from "./ApexLink.module.scss";
import {controlPanelHeight, TApexProperties, TLineStyle, TPoints} from "../Field";
import {getAngleByPoint, getPointOfRectByAngle} from "../../../utils/geometry";

type TApexLink = {
    lineId: string,
    startApex: TApexProperties,
    endApex: TApexProperties,
    activeLine: string
    setActiveLine: (lineId: string) => void,
    style: TLineStyle,
    updateLinePoints: (lineId: string, point: Partial<TPoints>) => void,
    changeLineStyles: (lineId: string, lineStyles: Partial<TLineStyle>) => void,
}
export const ApexLink: React.FC<TApexLink> = React.memo(({
                                                             lineId,
                                                             startApex,
                                                             endApex,
                                                             activeLine,
                                                             setActiveLine,
                                                             style,
                                                             updateLinePoints,
                                                             changeLineStyles,
                                                         }) => {

    const pointPosition = useRef({cx: 0, cy: 0})

    const mouseMoveHandlerFirst = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - pointPosition.current.cx) > 5 ||
            Math.abs(event.clientY - controlPanelHeight - pointPosition.current.cy) > 5) {
            pointPosition.current.cx = -100
            pointPosition.current.cy = -100
            let startAngle = getAngleByPoint(startApex.cx, startApex.cy, event.clientX, event.clientY - controlPanelHeight)
            changeLineStyles(lineId, {startAngle})
        }
    }, [lineId, changeLineStyles, startApex])
    const lineStartPoint = useMemo(() => {
        return getPointOfRectByAngle(style.startAngle, startApex.style.widthDiv, startApex.style.heightDiv)
    }, [style.startAngle, startApex.style.widthDiv, startApex.style.heightDiv])
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
        }
    }, [lineId, updateLinePoints, endApex.cx, endApex.cy])
    const mouseMoveHandlerLast = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - pointPosition.current.cx) > 5 ||
            Math.abs(event.clientY - controlPanelHeight - pointPosition.current.cy) > 5) {
            pointPosition.current.cx = -100
            pointPosition.current.cy = -100
            let endAngle = getAngleByPoint(endApex.cx, endApex.cy, event.clientX, event.clientY - controlPanelHeight)
            changeLineStyles(lineId, {endAngle})
        }
    }, [lineId, changeLineStyles, endApex])
    const lineEndPoint = useMemo(() => {
        return getPointOfRectByAngle(style.endAngle, endApex.style.widthDiv, endApex.style.heightDiv)
    }, [style.endAngle, endApex.style.widthDiv, endApex.style.heightDiv])

    return (
        <>
            <path className={styles.line}
                  stroke={style.color}
                  strokeWidth={style.width}
                  fill={'none'}
                  strokeDasharray={style.dash}
                  style={{animationDuration: `${style.animationDuration}s`}}
                  d={`
                     M${startApex.cx + lineStartPoint.cx} ${startApex.cy + lineStartPoint.cy}
                     C${startApex.cx + style.points.second.cx} ${startApex.cy + style.points.second.cy},
                     ${endApex.cx + style.points.penultimate.cx} ${endApex.cy + style.points.penultimate.cy},
                     ${endApex.cx + lineEndPoint.cx} ${endApex.cy + lineEndPoint.cy}
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
                    <circle cx={startApex.cx + lineStartPoint.cx}
                            cy={startApex.cy + lineStartPoint.cy}
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
                                //@ts-ignore
                                document.removeEventListener('mousemove', mouseMoveHandlerPenultimate)
                            }}/>
                    <circle cx={endApex.cx + lineEndPoint.cx}
                            cy={endApex.cy + lineEndPoint.cy}
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
                                //@ts-ignore
                                document.removeEventListener('mousemove', mouseMoveHandlerLast)
                            }}/>
                    <path stroke={'blue'}
                          fill={'none'}
                          strokeDasharray={5}
                          opacity={.5}
                          style={{pointerEvents: 'none'}}
                          d={`
                     M${startApex.cx + lineStartPoint.cx} ${startApex.cy + lineStartPoint.cy}
                     L${startApex.cx + style.points.second.cx} ${startApex.cy + style.points.second.cy}
                     L${endApex.cx + style.points.penultimate.cx} ${endApex.cy + style.points.penultimate.cy}
                     L${endApex.cx + lineEndPoint.cx} ${endApex.cy + lineEndPoint.cy}
                     `}/>
                </>
            }
        </>
    )
})