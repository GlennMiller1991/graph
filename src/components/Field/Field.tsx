import React, {useCallback, useState, WheelEvent, MouseEvent, useRef} from "react";
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
// export const Field: React.FC = React.memo(() => {
//     // state
//     // scale of field
//     const [scale, setScale] = useState(1)
//
//     // active apex
//     const [activeApex, setActiveApex] = useState<TApexProperties | undefined>(undefined)
//
//     // apexes on the field
//     const [apexes, setApexes] = useState<Array<TApexProperties>>([])
//
//     // lines on the field
//     const [lines, setLines] = useState<TLine[]>([])
//
//     // callbacks
//     const onWheelHandler = (event: WheelEvent<SVGSVGElement>) => {
//         // scale corrector
//         setScale(scale + event.deltaY * 0.0001)
//     }
//     const onDoubleClickHandler = useCallback((event: MouseEvent<SVGSVGElement>) => {
//         // create new apex on the field
//         setApexes([
//             ...apexes,
//             {
//                 r: 15,
//                 cx: event.clientX,
//                 cy: event.clientY - controlPanelHeight,
//                 id: v1(),
//                 links: [],
//                 style: {},
//             }
//         ])
//     }, [apexes])
//     const changeApexPosition = useCallback((apexID: string, cx: number, cy: number) => {
//         // find apex by id and change cx/cy if found
//         let apex = apexes.find((apex) => {
//             return apex.id === apexID
//         })
//         if (apex) {
//             setApexes(apexes.map((apex) => apex.id === apexID ? {...apex, cx, cy} : apex))
//         }
//     }, [apexes])
//     const setApexActive = useCallback((apexID: string) => {
//         setActiveApex(apexes.find((apex) => apex.id === apexID))
//     }, [apexes])
//     const updateApexLinks = (apexID: string) => {
//         setApexes(
//             apexes.map((apex) => apex.id === activeApex?.id ?
//                 {
//                     ...apex,
//                     // is new link already exist ???
//                     links: [...apex.links, apexID]
//                 } :
//                 apex)
//         )
//         setActiveApex(undefined)
//     }
//
//     return (
//         <div className={styles.field}>
//             <svg className={styles.svgField}
//                  onWheel={onWheelHandler}
//                  onDoubleClick={onDoubleClickHandler}>
//                 {
//                     apexes.map((apex, key) => {
//                         return (
//                             <Apex key={key}
//                                   apexes={apexes}
//                                   scale={scale}
//                                   apexProperties={apex}
//                                   setApexActive={setApexActive}
//                                   updateApexLinks={updateApexLinks}
//                                   activeApexId={activeApex ? activeApex.id : ''}
//                                   changePosition={changeApexPosition}
//                             />
//                         )
//                     })
//                 }
//             </svg>
//         </div>
//     )
// })

export const Field: React.FC = React.memo(() => {

    // state
    // current apexes on the svg
    const [apexes, setApexes] = useState<TApexProperties[]>([])

    // active edit apex
    const [activeApex, setActiveApex] = useState<string>('')

    // apex that is moving now without state
    const movingApex = useRef<string>('')


    // callbacks
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
    const onMouseMoveHandler = useCallback((event: MouseEvent) => {
        // filter apex by id then change its position
        setApexes((apexes) => {
            return apexes.map((outerApex) => {
                    return outerApex.id === movingApex.current ?
                        {...outerApex, cx: event.clientX, cy: event.clientY - controlPanelHeight} :
                        outerApex
                }
            )
        })
    }, [])
    const updateApexLinks = useCallback((linkToId: string) => {
        setApexes((apexes) => {
            return apexes.map(
                (apex) => {
                    console.log(apex)
                    return apex.id === activeApex ?
                        {
                            ...apex,
                            links: [...apex.links.filter((link) => link !== linkToId), linkToId]
                        } :
                        apex
                })
        })

    }, [activeApex])

    return (
        <div className={styles.field}>
            <svg className={styles.svgField} onDoubleClick={onDoubleClickHandler}>
                {
                    apexes.map((apex, key) => {

                        return (
                            <g key={key}>
                                <circle className={styles.apex}
                                        cx={String(apex.cx)}
                                        cy={String(apex.cy)}
                                        r={String(apex.r)}
                                        fill={
                                            activeApex === apex.id ?
                                                'green' :
                                                'black'
                                        }
                                        onMouseDown={() => {
                                            movingApex.current = apex.id
                                            //@ts-ignore
                                            document.addEventListener('mousemove', onMouseMoveHandler)
                                        }}
                                        onMouseUp={() => {
                                            movingApex.current = ''
                                            //@ts-ignore
                                            document.removeEventListener('mousemove', onMouseMoveHandler)
                                        }}
                                        onDoubleClick={(event) => {
                                            event.stopPropagation()
                                            setActiveApex(
                                                apex.id === activeApex ?
                                                    '' :
                                                    apex.id
                                            )
                                        }}
                                        onClick={() => {
                                            if (activeApex && activeApex !== apex.id) {
                                                updateApexLinks(apex.id)
                                            }
                                        }}
                                />
                                {
                                    apex.links.map((link, key) => {
                                        let linkApex = apexes.find(
                                            (apex) => apex.id === link
                                        )
                                        if (linkApex) {
                                            let [cx, cy] = [linkApex.cx, linkApex.cy]
                                            return (
                                                <line key={key}
                                                      stroke={'black'}
                                                      strokeWidth={3}
                                                      x1={apex.cx} y1={apex.cy}
                                                      x2={cx} y2={cy}
                                                      pointerEvents={'none'}
                                                />
                                            )
                                        }
                                        return ''
                                    })
                                }
                            </g>
                        )
                    })
                }
            </svg>
        </div>
    )
})


