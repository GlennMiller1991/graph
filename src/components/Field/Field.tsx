import React, {useCallback, useState, WheelEvent, MouseEvent} from "react";
import styles from './Field.module.scss'
import variables from './../../common/styles/variables.module.scss';
import {Apex} from "./Apex/Apex";
import {v1} from "uuid";

const controlPanelHeight = +variables.controlPanelHeight.slice(0, -2)

export type TLine = {
    start: string,
    end: string,
}
export type TLink = string
export type TApexProperties = {
    id: string,
    r: number,
    cx: number,
    cy: number,
    links: Array<TLink>,
    style: any,
}

type TFieldProps = {
    currentEditingId: string | undefined,
    setApexToEditBar: (apex: TApexProperties) => void,
}
export const Field: React.FC = React.memo(() => {
    // state
    // scale of field
    const [scale, setScale] = useState(1)

    // active apex
    const [activeApex, setActiveApex] = useState<TApexProperties | undefined>(undefined)

    // apexes on the field
    const [apexes, setApexes] = useState<Array<TApexProperties>>([])

    // lines on the field
    const [lines, setLines] = useState<TLine[]>([])

    // callbacks
    const onWheelHandler = (event: WheelEvent<SVGSVGElement>) => {
        // scale corrector
        setScale(scale + event.deltaY * 0.0001)
    }
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
                style: {},
            }
        ])
    }, [apexes])
    const changeApexPosition = useCallback((apexID: string, cx: number, cy: number) => {
        // find apex by id and change cx/cy if found
        let apex = apexes.find((apex) => {
            return apex.id === apexID
        })
        if (apex) {
            setApexes(apexes.map((apex) => apex.id === apexID ? {...apex, cx, cy} : apex))
        }
    }, [apexes])
    const setApexActive = useCallback((apexID: string) => {
        setActiveApex(apexes.find((apex) => apex.id === apexID))
    }, [apexes])
    const updateApexLinks = (apexID: string) => {
        setLines([
            ...lines,
            {
                //@ts-ignore
                start: activeApex.id,
                end: apexID,
            }
        ])
        setActiveApex(undefined)
    }

    return (
        <div className={styles.field}>
            <svg className={styles.svgField}
                 onWheel={onWheelHandler}
                 onDoubleClick={onDoubleClickHandler}>
                {
                    apexes.map((apex, key) => {
                        return (
                            <Apex key={key}
                                  scale={scale}
                                  apexProperties={apex}
                                  setApexActive={setApexActive}
                                  updateApexLinks={updateApexLinks}
                                  activeApexId={activeApex ? activeApex.id : ''}
                                  changePosition={changeApexPosition}
                            />
                        )
                    })
                }
                {
                    lines.length &&
                    lines.map((line, key) => {
                        let startApex = apexes.find((apex) => {
                            return apex.id === line.start
                        })
                        let endApex = apexes.find((apex) => {
                            return apex.id === line.end
                        })
                        if (startApex && endApex) {
                            return (
                                <line key={key} stroke={'black'}
                                      strokeWidth={3}
                                      x1={startApex.cx} y1={startApex.cy}
                                      x2={endApex.cx} y2={endApex.cy}
                                />
                            )
                        } else {
                        }
                    })
                }
            </svg>
        </div>
    )
})


