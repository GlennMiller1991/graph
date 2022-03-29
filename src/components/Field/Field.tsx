import React, {useCallback, useState, WheelEvent, MouseEvent} from "react";
import styles from './Field.module.scss'
import variables from './../../common/styles/variables.module.scss';
import {Apex} from "./Apex/Apex";
import { v1 } from "uuid";

const controlPanelHeight = +variables.controlPanelHeight.slice(0, -2)

export type TApexProperties = {
    id: string,
    r: number,
    cx: number,
    cy: number,
}

export const Field: React.FC = React.memo(() => {

    // state
    // scale of field
    const [scale, setScale] = useState(1)

    // apexes on the field
    const [apexes, setApexes] = useState<Array<TApexProperties>>([])

    // callbacks
    const onWheelHandler = (event: WheelEvent<SVGSVGElement>) => {
        // scale corrector
        setScale(scale + event.deltaY * 0.0001)
    }
    const onDoubleClickHandler = useCallback((event: MouseEvent<SVGSVGElement>) => {
        // create new apex on the field
        setApexes([...apexes, {r: 40, cx: event.clientX, cy: event.clientY - controlPanelHeight, id: v1()}])
    }, [apexes])
    const changeApexPosition = useCallback((apexID: string, cx: number, cy: number) => {
        // find apex by id and change cx/cy if found
        let apex = apexes.find((apex) => {
            return apex.id === apexID
        })
        if (apex) {
            setApexes(apexes.map((apex) => apex.id === apexID ? {...apex, cx, cy} : apex))
        }
    }, [])

    return (
        <div className={styles.field}>
            <svg className={styles.svgField}
                 onWheel={onWheelHandler}
                 onDoubleClick={onDoubleClickHandler}>
                {
                    apexes.map((apex, key) => {
                        return <Apex key={key}
                                     scale={scale}
                                     apexProperties={apex}
                                     changePosition={changeApexPosition}/>
                    })
                }
            </svg>
        </div>
    )
})


