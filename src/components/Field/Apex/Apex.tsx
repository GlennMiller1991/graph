import React, {useCallback, useRef, useState} from 'react'
import styles from "../Field.module.scss";
import {controlPanelHeight, TApexProperties} from "../Field";

type TMoveStatus = false | true
type TApexProps = {
    apex: TApexProperties,
    activeApex: string,
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
    updateApexLinks: (linkFromId: string, linkToId: string) => void,
    onMouseMoveHandler: (event: MouseEvent) => void,
    isSelected: boolean,
    isCtrlPressed: {
        current: boolean,
    },
    addApexToSelected: (apexId: string, isSelected: boolean) => void,
}

export const Apex: React.FC<TApexProps> = React.memo(({
                                                          apex,
                                                          activeApex,
                                                          movingApex,
                                                          setActiveApex,
                                                          updateApexLinks,
                                                          onMouseMoveHandler,
                                                          isSelected,
                                                          movingApexOffsets,
                                                          isCtrlPressed,
                                                          addApexToSelected,
                                                      }) => {

    const [moveStatus, setMoveStatus] = useState<TMoveStatus>(false)

    const apexPosition = useRef({cx: 0, cy: 0})


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
                      if (!activeApex) {
                          setActiveApex(apex.id)
                      } else {
                          if (activeApex === apex.id) {
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
                              if (activeApex && activeApex !== apex.id) {
                                  updateApexLinks(activeApex, apex.id)
                              }
                          }
                      }
                  }}
            />
            <text className={styles.svgText}
                  x={apex.cx - apex.style.widthDiv + apex.style.borderRadius + apex.style.widthOffset}
                  y={apex.cy - apex.style.heightDiv + apex.style.borderRadius + apex.style.heightOffset}
                  fontSize={apex.style.fontSize}>
                {apex.style.header}
            </text>
        </g>
    )
})

