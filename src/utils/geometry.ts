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
    let point = {x: 0, y: 0}
    if (newAngle > 90) {
        newAngle = 180 - newAngle
    }
    switch (newAngle) {
        case 0:
            point.x = halfWidth
            point.y = 0
            break
        case 90:
            point.x = 0
            point.y = halfHeight
            break
        default:
            let diagAngle = angleFromArctan(halfHeight * 2, halfWidth * 2)
            if (newAngle <= diagAngle) {
                point.x = halfWidth
                point.y = Math.tan(degToRad(newAngle)) * halfWidth
            } else {
                newAngle = 90 - newAngle
                point.x = Math.tan(degToRad(newAngle)) * halfHeight
                point.y = halfHeight
            }
            break
    }
    if (angle <= 180 && angle >= 90) {
        point.x = -Math.abs(point.x)
        point.y = Math.abs(point.y)
    } else if (angle <= 90 && angle >= 0) {
        point.x = Math.abs(point.x)
        point.y = Math.abs(point.y)
    } else if (angle <= 0 && angle >= -90) {
        point.x = Math.abs(point.x)
        point.y = -Math.abs(point.y)
    } else {
        point.x = -Math.abs(point.x)
        point.y = -Math.abs(point.y)
    }
    return point
}