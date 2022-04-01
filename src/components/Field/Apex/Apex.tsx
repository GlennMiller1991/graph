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
    updateApexLinks: (linkFromId: string, linkToId: string) => void,
    onMouseMoveHandler: (event: MouseEvent) => void,
}

export const Apex: React.FC<TApexProps> = React.memo(({
                                                          apex,
                                                          activeApex,
                                                          movingApex,
                                                          setActiveApex,
                                                          updateApexLinks,
                                                          onMouseMoveHandler,
                                                      }) => {

    const [moveStatus, setMoveStatus] = useState<TMoveStatus>(false)
    const apexPosition = useRef({cx: 0, cy: 0})

    const mouseMoveHandler = useCallback((event: MouseEvent) => {
        if (Math.abs(event.clientX - apexPosition.current.cx) > 20 ||
            Math.abs(event.clientY - controlPanelHeight - apexPosition.current.cy) > 20) {
            apexPosition.current.cx = -100
            apexPosition.current.cy = -100
            movingApex.current = apex.id
            onMouseMoveHandler(event)
            setMoveStatus(true)
        }
    }, [movingApex, onMouseMoveHandler, apex.id])

    return (
        <>
            <path className={`${styles.apex}`}
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
                          updateApexLinks(activeApex, apex.id)
                      }
                  }}
            />
        </>
    )
})

