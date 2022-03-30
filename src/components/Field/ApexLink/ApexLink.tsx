import React from "react";
import styles from "../Field.module.scss";
import {TApexProperties} from "../Field";

type TApexLink = {
    apex: TApexProperties,
    link: string,
    cx: number,
    cy: number,
    r: number,
    activeApex: string,
    deleteApexLink: (apexId: string) => void,
}
export const ApexLink: React.FC<TApexLink> = React.memo(({
                                                             apex,
                                                             link,
                                                             cx,
                                                             cy,
                                                             r,
                                                             activeApex,
                                                             deleteApexLink,
                                                         }) => {
    return (
        <g>
            <line stroke={'black'}
                  strokeWidth={3}
                  x1={apex.cx} y1={apex.cy}
                  x2={cx} y2={cy}
                  pointerEvents={'none'}
            />
            {
                activeApex === apex.id &&
                <g className={styles.deleteGroup}>
                    <path className={styles.deleteSign}
                          strokeWidth={2}
                          stroke={'red'}
                          d={`M${cx + (r - 3)} ${cy - (r - 3)} l6 -6 m-6 0 l6 6`}
                    />
                    <circle className={styles.deleteBackground}
                            cx={cx + r}
                            cy={cy - r}
                            r={8}
                            onClick={() => {
                                deleteApexLink(link)
                            }}/>
                </g>
            }
        </g>
    )
})