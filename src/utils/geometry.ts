export function degToRad(deg: number) {
    return deg / 180 * Math.PI
}

export function radToDeg(rad: number) {
    return rad / Math.PI * 180
}

export function angleFromArctan(a: number, b: number) {
    return 180 / Math.PI * Math.atan2(a, b)
}

export function getPointOfRectByAngle(angle: number, halfWidth: number, halfHeight: number) {
    let newAngle = Math.abs(angle)
    let point = {cx: 0, cy: 0}
    if (newAngle > 90) {
        newAngle = 180 - newAngle
    }
    switch (newAngle) {
        case 0:
            point.cx = halfWidth
            point.cy = 0
            break
        case 90:
            point.cx = 0
            point.cy = halfHeight
            break
        default:
            let diagAngle = angleFromArctan(halfHeight * 2, halfWidth * 2)
            if (newAngle <= diagAngle) {
                point.cx = halfWidth
                point.cy = Math.tan(degToRad(newAngle)) * halfWidth
            } else {
                newAngle = 90 - newAngle
                point.cx = Math.tan(degToRad(newAngle)) * halfHeight
                point.cy = halfHeight
            }
            break
    }
    if (angle <= 180 && angle >= 90) {
        point.cx = -Math.abs(point.cx)
        point.cy = Math.abs(point.cy)
    } else if (angle <= 90 && angle >= 0) {
        point.cx = Math.abs(point.cx)
        point.cy = Math.abs(point.cy)
    } else if (angle <= 0 && angle >= -90) {
        point.cx = Math.abs(point.cx)
        point.cy = -Math.abs(point.cy)
    } else {
        point.cx = -Math.abs(point.cx)
        point.cy = -Math.abs(point.cy)
    }
    return point
}