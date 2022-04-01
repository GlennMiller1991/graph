import React from "react";
import styles from "./ApexLink.module.scss";
import {TApexProperties, TLineStyle} from "../Field";
import {getPointOfRectByAngle} from "../../../utils/geometry";

type TApexLink = {
    lineId: string,
    startApex: TApexProperties,
    endApex: TApexProperties,
    activeApex: string,
    activeLine: string
    deleteApexLink: (lineId: string) => void,
    setActiveLine: (lineId: string) => void,
    style: TLineStyle,
}
export const ApexLink: React.FC<TApexLink> = React.memo(({
                                                             lineId,
                                                             startApex,
                                                             endApex,
                                                             activeApex,
                                                             activeLine,
                                                             deleteApexLink,
                                                             setActiveLine,
                                                             style,
                                                         }) => {

    const lineStartPosition = getPointOfRectByAngle(style.startAngle, startApex.style.widthDiv, startApex.style.heightDiv)
    const lineEndPosition = getPointOfRectByAngle(style.endAngle, endApex.style.widthDiv, endApex.style.heightDiv)

    return (
        <g>
            <path className={styles.line}
                  stroke={'black'}
                  strokeWidth={1}
                  fill={'none'}
                  d={`
                     M${lineStartPosition.x + startApex.cx} ${lineStartPosition.y + startApex.cy}
                     C${startApex.cx} ${startApex.cy},
                     ${endApex.cx - startApex.cx} ${endApex.cy - startApex.cy}, 
                     ${lineEndPosition.x + endApex.cx} ${lineEndPosition.y + endApex.cy}`}
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
                activeApex === startApex.id &&
                <g className={styles.deleteGroup}>
                    <path className={styles.deleteSign}
                          strokeWidth={2}
                          stroke={'red'}
                          d={`M${endApex.cx + (endApex.style.widthDiv - 3)} ${endApex.cy - (endApex.style.heightDiv - 3)} l6 -6 m-6 0 l6 6`}
                    />
                    <circle className={styles.deleteBackground}
                            cx={endApex.cx + endApex.style.widthDiv}
                            cy={endApex.cy - endApex.style.heightDiv}
                            r={8}
                            onClick={() => {
                                deleteApexLink(lineId)
                            }}/>
                </g>
            }
        </g>
    )
})