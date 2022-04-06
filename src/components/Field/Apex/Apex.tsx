import React, {useCallback, useRef, useState} from 'react'
import styles from "../Field.module.scss";
import {controlPanelHeight, TApexProperties, TApexStyle, TPoint} from "../Field";
import {getPointOfRectByAngle} from "../../../utils/geometry";

type TApexProps = {
    apex: TApexProperties,
    activeApexObj: TApexProperties,
    movingApex: {
        current: string
    },
    movingApexOffsets: {
        current: {
            offsetX: number,
            offsetY: number,
        }
    },
    setActiveApex: (apexId: string) => void,
    updateApexLinks: (linkFromId: string, linkToId: string, points: TPoint[]) => void,
    onMouseMoveHandler: (event: MouseEvent) => void,
    isSelected: boolean,
    isCtrlPressed: {
        current: boolean,
    },
    addApexToSelected: (apexId: string, isSelected: boolean) => void,
    updateApexStyles: (apexId: string, styles: Partial<TApexStyle>) => void,
}

export const Apex: React.FC<TApexProps> = React.memo(({
                                                          apex,
                                                          activeApexObj,
                                                          movingApex,
                                                          setActiveApex,
                                                          updateApexLinks,
                                                          onMouseMoveHandler,
                                                          isSelected,
                                                          movingApexOffsets,
                                                          isCtrlPressed,
                                                          addApexToSelected,
                                                          updateApexStyles,
                                                      }) => {

    const [moveStatus, setMoveStatus] = useState(false)
    const [textSize, setTextSize] = useState({left: -100, top: -100, right: -100, bottom: -100})

    const apexPosition = useRef({cx: 0, cy: 0})
    const pointPosition = useRef({cx: 0, cy: 0})

    const onPointMoveHandler = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - pointPosition.current.cx) > 5 ||
            Math.abs(event.clientY - controlPanelHeight - apexPosition.current.cy) > 5) {
            pointPosition.current.cx = -100
            pointPosition.current.cy = -100
            let widthDiv = Math.abs(event.clientX - apex.cx)
            let heightDiv = Math.abs(event.clientY - controlPanelHeight - apex.cy)
            let newStyles = {
                widthDiv,
                heightDiv,
            }
            updateApexStyles(apex.id, newStyles)
        }
    }, [apex.id, updateApexStyles, apex.cx, apex.cy])
    const mouseMoveHandler = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        if (Math.abs(event.clientX - apexPosition.current.cx + movingApexOffsets.current.offsetX) > 20 ||
            Math.abs(event.clientY - controlPanelHeight - apexPosition.current.cy + movingApexOffsets.current.offsetY) > 20) {
            apexPosition.current.cx = -100
            apexPosition.current.cy = -100
            movingApex.current = apex.id
            onMouseMoveHandler(event)
            setMoveStatus(true)
        }
    }, [movingApexOffsets, movingApex, onMouseMoveHandler, apex.id])

    return (
        <g>
            <path className={`${styles.apex}`}
                  style={isSelected ? {opacity: .3} : {}}
                  stroke={apex.style.borderColor}
                  strokeWidth={apex.style.borderWidth}
                  fill={apex.style.backgroundColor}
                  opacity={apex.style.opacity}
                  d={`M${apex.cx} ${apex.cy}
                      m0 ${-apex.style.heightDiv}
                      l${apex.style.widthDiv - apex.style.borderRadius} 0
                      c0 0,${apex.style.borderRadius} 0,${apex.style.borderRadius} ${apex.style.borderRadius}
                      l0 ${(apex.style.heightDiv - apex.style.borderRadius) * 2}
                      c0 0,0 ${apex.style.borderRadius},${-apex.style.borderRadius} ${apex.style.borderRadius}
                      l${-((apex.style.widthDiv - apex.style.borderRadius) * 2)} 0
                      c0 0,${-apex.style.borderRadius} 0,${-apex.style.borderRadius} ${-apex.style.borderRadius}
                      l0 ${-((apex.style.heightDiv - apex.style.borderRadius) * 2)}
                      c0 0,0 ${-apex.style.borderRadius},${apex.style.borderRadius} ${-apex.style.borderRadius}
                      z`}
                  onMouseDown={(event) => {
                      event.stopPropagation()
                      apexPosition.current.cx = apex.cx
                      apexPosition.current.cy = apex.cy
                      movingApexOffsets.current.offsetX = apex.cx - event.clientX
                      movingApexOffsets.current.offsetY = apex.cy - (event.clientY - controlPanelHeight)
                      //@ts-ignore
                      document.addEventListener('mousemove', mouseMoveHandler)
                  }}
                  onMouseUp={(event) => {
                      event.stopPropagation()
                      if (moveStatus) {
                          // if drag - stop drag
                          setMoveStatus(false)
                          movingApex.current = ''
                      }
                      document.removeEventListener('mousemove', mouseMoveHandler)
                  }}
                  onDoubleClick={(event) => {
                      event.stopPropagation()
                      if (!activeApexObj.id) {
                          setActiveApex(apex.id)
                      } else {
                          if (activeApexObj.id === apex.id) {
                              setActiveApex('')
                          }
                      }
                  }}
                  onClick={(event) => {
                      event.stopPropagation()
                      if (isCtrlPressed.current) {
                          addApexToSelected(apex.id, isSelected)
                      } else {
                          if (!isSelected) {
                              let points = [
                                  getPointOfRectByAngle(90, activeApexObj.style.widthDiv + 100, activeApexObj.style.heightDiv + 100),
                                  getPointOfRectByAngle(-90, apex.style.widthDiv + 100, apex.style.heightDiv + 100),
                              ]
                              if (activeApexObj.id && activeApexObj.id !== apex.id) {
                                  updateApexLinks(
                                      activeApexObj.id,
                                      apex.id,
                                      points,
                                  )
                              }
                          }
                      }
                  }}
            />
            <text className={styles.svgText}
                  x={apex.cx + apex.style.widthOffset}
                  y={apex.cy + apex.style.heightOffset + apex.style.fontSize / 2}
                  textAnchor={'middle'}
                  fontSize={apex.style.fontSize}
                  ref={(node) => {
                      if (node) {
                          if (activeApexObj.id === apex.id) {
                              let {left, right, top, bottom, ...rest} = node.getBoundingClientRect()
                              console.log(left, right, top, bottom)
                          }
                      }
                  }}
            >
                {apex.style.header}
            </text>
            {
                activeApexObj.id === apex.id &&
                <g>
                    <path
                        stroke={'blue'}
                        opacity={.5}
                        strokeWidth={1}
                        strokeDasharray={5}
                        fill={'none'}
                        d={`
                            M${apex.cx - apex.style.widthDiv - 5} ${apex.cy - apex.style.heightDiv - 5}
                            l${apex.style.widthDiv * 2 + 10} 0
                            l0 ${apex.style.heightDiv * 2 + 10}
                            l${-(apex.style.widthDiv * 2 + 10)} 0z
                        `}
                    />
                    <circle fill={'blue'}
                            opacity={.5}
                            r={10}
                            cx={apex.cx - apex.style.widthDiv - 5}
                            cy={apex.cy - apex.style.heightDiv - 5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = apex.cx
                                pointPosition.current.cy = apex.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', onPointMoveHandler)
                            }}
                            onMouseUp={(event) => {
                                event.stopPropagation()
                                document.removeEventListener('mousemove', onPointMoveHandler)
                            }}
                    />
                    <circle fill={'blue'}
                            opacity={.5}
                            r={10}
                            cx={apex.cx + apex.style.widthDiv + 5}
                            cy={apex.cy - apex.style.heightDiv - 5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = apex.cx
                                pointPosition.current.cy = apex.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', onPointMoveHandler)
                            }}
                            onMouseUp={(event) => {
                                event.stopPropagation()
                                document.removeEventListener('mousemove', onPointMoveHandler)
                            }}
                    />
                    <circle fill={'blue'}
                            opacity={.5}
                            r={10}
                            cx={apex.cx + apex.style.widthDiv + 5}
                            cy={apex.cy + apex.style.heightDiv + 5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = apex.cx
                                pointPosition.current.cy = apex.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', onPointMoveHandler)
                            }}
                            onMouseUp={(event) => {
                                event.stopPropagation()
                                document.removeEventListener('mousemove', onPointMoveHandler)
                            }}
                    />
                    <circle fill={'blue'}
                            opacity={.5}
                            r={10}
                            cx={apex.cx - apex.style.widthDiv - 5}
                            cy={apex.cy + apex.style.heightDiv + 5}
                            onMouseDown={(event) => {
                                event.stopPropagation()
                                pointPosition.current.cx = apex.cx
                                pointPosition.current.cy = apex.cy
                                //@ts-ignore
                                document.addEventListener('mousemove', onPointMoveHandler)
                            }}
                            onMouseUp={(event) => {
                                event.stopPropagation()
                                document.removeEventListener('mousemove', onPointMoveHandler)
                            }}
                    />
                </g>
            }
        </g>
    )
})

