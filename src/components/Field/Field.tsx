import React, {MouseEvent, useCallback, useRef, useState} from "react";
import styles from './Field.module.scss'
import variables from './../../common/styles/variables.module.scss';
import {v1} from "uuid";
import {Apex} from "./Apex/Apex";
import {ApexLink} from "./ApexLink/ApexLink";
import {EditBar} from "./EditBar/EditBar";

export const controlPanelHeight = +variables.controlPanelHeight.slice(0, -2)

export type TLink = string
export type TApexProperties = {
    id: string,
    r: number,
    cx: number,
    cy: number,
    links: Array<TLink>,
    style: any,
}


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
                style: {
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'black',
                    backgroundColor: 'red',
                    opacity: 1,
                    widthDiv: 100,
                    heightDiv: 15
                },
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
                    return apex.id === activeApex ?
                        {
                            ...apex,
                            links: [...apex.links.filter((link) => link !== linkToId), linkToId]
                        } :
                        apex
                })
        })

    }, [activeApex])
    const deleteApexById = useCallback((apexId: string) => {
        setActiveApex('')
        setApexes((apexes) => {
            return apexes.filter((apex) => apex.id !== apexId)
        })
    }, [])
    const deleteApexLink = useCallback((linkId: string) => {
        setApexes((apexes) => {
            let newApexes = apexes.map((apex) => {
                return apex.id === activeApex ?
                    {
                        ...apex,
                        links: apex.links.filter((link) => link !== linkId)
                    } :
                    apex
            })
            return newApexes
        })
    }, [activeApex])
    const updateApexStyles = useCallback((apexId: string, apexStyles: Partial<TApexProperties>) => {
        setApexes((apexes) => {
            return apexes.map((apex) => apex.id === apexId ? {...apex, style: {...apex.style, ...apexStyles}} : apex)
        })
    }, [])

    return (
        <div className={styles.field}>
            <svg className={styles.svgField}
                 onDoubleClick={onDoubleClickHandler}
                 onWheel={(event) => {
                     let newApexes
                     if (event.deltaY > 0) {
                         newApexes = apexes.map((apex) => {
                             return {
                                 ...apex,
                                 cx: apex.cx * 1.01,
                                 cy: apex.cy * 1.01,
                                 r: apex.r * 1.01,
                             }
                         })
                     } else {
                         newApexes = apexes.map((apex) => {
                             return {
                                 ...apex,
                                 cx: apex.cx / 1.01,
                                 cy: apex.cy / 1.01,
                                 r: apex.r / 1.01,
                             }
                         })
                     }

                     setApexes(newApexes)
                 }}>
                {
                    apexes.map((apex, key) => {
                        return (
                            <g key={key}>
                                {
                                    apex.links.map((link, key) => {
                                        let linkApex = apexes.find(
                                            (apex) => apex.id === link
                                        )
                                        if (linkApex) {
                                            let [cx, cy, r] = [linkApex.cx, linkApex.cy, linkApex.r]
                                            return (
                                                <ApexLink key={key}
                                                          apex={apex}
                                                          activeApex={activeApex}
                                                          deleteApexLink={deleteApexLink}
                                                          link={link}
                                                          cx={cx}
                                                          cy={cy}
                                                          r={r}
                                                />
                                            )
                                        }
                                        return ''
                                    })
                                }
                                <Apex key={key}
                                      movingApex={movingApex}
                                      activeApex={activeApex}
                                      apex={apex}
                                      updateApexLinks={updateApexLinks}
                                      deleteApexById={deleteApexById}
                                    //@ts-ignore
                                      onMouseMoveHandler={onMouseMoveHandler}
                                      setActiveApex={setActiveApex}
                                />
                            </g>
                        )
                    })
                }
            </svg>
            {
                activeApex &&
                <EditBar apex={apexes.find((apex) => apex.id === activeApex) as TApexProperties}
                         deleteApexById={deleteApexById}
                         updateApexStyles={updateApexStyles}/>
            }
        </div>
    )
})