import React from "react";
import styles from "./ApexLink.module.scss";
import {TApexProperties, TLineStyle} from "../Field";
import {getPointOfRectByAngle} from "../../../utils/geometry";

type TApexLink = {
    lineId: string,
    startApex: TApexProperties,
    endApex: TApexProperties,
    activeLine: string
    setActiveLine: (lineId: string) => void,
    style: TLineStyle,
}
export const ApexLink: React.FC<TApexLink> = React.memo(({
                                                             lineId,
                                                             startApex,
                                                             endApex,
                                                             activeLine,
                                                             setActiveLine,
                                                             style,
                                                         }) => {

    const lineStartPosition = getPointOfRectByAngle(style.startAngle, startApex.style.widthDiv, startApex.style.heightDiv)
    const secondPointStartLine = getPointOfRectByAngle(style.startAngle, startApex.style.widthDiv + 100, startApex.style.heightDiv + 100)
    const lineEndPosition = getPointOfRectByAngle(style.endAngle, endApex.style.widthDiv, endApex.style.heightDiv)
    const secondPointEndLine = getPointOfRectByAngle(style.endAngle, endApex.style.widthDiv + 100, endApex.style.heightDiv + 100)

    return (
        <path className={styles.line}
              stroke={'black'}
              strokeWidth={1}
              fill={'none'}
              d={`
                     M${lineStartPosition.x + startApex.cx} ${lineStartPosition.y + startApex.cy}
                     C${secondPointStartLine.x + startApex.cx- 10} ${secondPointStartLine.y + startApex.cy - 10},
                     ${secondPointEndLine.x + endApex.cx} ${secondPointEndLine.y + endApex.cy},
                     ${lineEndPosition.x + endApex.cx} ${lineEndPosition.y + endApex.cy}
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
    )
})