import { Globals } from "./globals.js"

export class Draw {
    constructor(ctx) {
        this.ctx = ctx
        
        this.rectangleArray = []
        this.drawedRectsArray = []

        this.upperTex;
        this.sideTex;

        this.columns = 15
        this.rows = 15

        this.angle = 0
    }

    clearRect(w, h) {
        this.ctx.fillStyle = "gray"
        this.ctx.fillRect(0, 0, w, h)
    }

    movementX = 0;
    movementY = 0;

    customShape(w, h, centered = true, x = 0, y = 0) {

        let rows = this.rows;
        let columns = this.columns;

        let iniX = x;
        let iniY = y;

        this.movementX = Globals.camX + this.movementX
        this.movementY = Globals.camY + this.movementY

        const cube = [
            [0,0,0],
            [0,0,Globals.widthFactor],
            [0,Globals.widthFactor,0],
            [0,Globals.widthFactor,Globals.widthFactor],
            [Globals.widthFactor,0,0],
            [Globals.widthFactor,0,Globals.widthFactor],
            [Globals.widthFactor,Globals.widthFactor,0],
            [Globals.widthFactor,Globals.widthFactor,Globals.widthFactor]
        ]

        let faces = [
            [2, 3, 7, 6],
            [0, 2, 6, 4],
            [0, 1, 3, 2],
            [4, 5, 7, 6],
            [1, 3, 7, 5],
            [0, 1, 5, 4],
        ]

        const colors = [
            "white",
            "rgb(59, 59, 59)"
        ]

        function degToRad(deg) {
            return deg * (Math.PI / 180);
        }
        function getCenter(x, y, z) {
            return {
                x: x + (Globals.widthFactor * rows) / 2,
                y: Globals.widthFactor / 2,
                z: y + (Globals.widthFactor * columns) / 2
            }
        }

        function rotYplane(x, y, z, angleDeg, cx, cy, cz) {
            let angle = degToRad(angleDeg)

            let translatedX = x - cx
            let translatedY = y - cy
            let translatedZ = z - cz

            let rotatedX = translatedX*Math.cos(angle) + translatedZ*Math.sin(angle)
            let rotatedY = translatedY
            let rotatedZ = translatedZ*Math.cos(angle) - translatedX*Math.sin(angle)

            return {
                x: rotatedX + cx,
                y: rotatedY + cy,
                z: rotatedZ + cz 
            }
        }

        function projection2D(x, y, z, alphaDeg, betaDeg) {
            let alpha = degToRad(alphaDeg)
            let beta = degToRad(betaDeg)

            let a_x = x;
            let a_y = y;
            let a_z = z;

            return {
                x: ((a_x)*Math.cos(beta) - a_z*Math.sin(beta)),
                y: (a_y*Math.cos(alpha) + a_z*Math.cos(beta)*Math.sin(alpha) + a_x*Math.sin(alpha)*Math.sin(beta)),
                z: (a_z*Math.cos(alpha) * Math.cos(beta) - a_y*Math.sin(alpha) + a_x*Math.cos(alpha)*Math.sin(beta))
            }
        }

        const center = getCenter(x,y,0)
        this.angle += Globals.angle

        let nCubes = 0
        let cubes = []
        for(let j = 0; j<rows; j++) {
            for(let k = 0; k<columns; k++) {

                let cubeWorldX = x + k * Globals.widthFactor;
                let cubeWorldY = 0;
                let cubeWorldZ = j * Globals.widthFactor; 
                
                let isoX = ((iniX) * 0.5) + (iniY * (-0.5)) + (centered ? (w/2) : 0) + this.movementX;
                let isoY = ((0.29) * ((iniX) + (iniY))) - (Globals.widthFactor) + (centered ? ((h/2) - (rows * (Globals.widthFactor/2 * Globals.zoomFactor)) - (Globals.widthFactor/2 )) : 0) + this.movementY;
                
                let targetCube = []; 
                let target3DCube = [];
                for (let i = 0; i<cube.length; i++) {
                    let vx = cube[i][0];
                    let vy = cube[i][1];
                    let vz = cube[i][2];
                    
                    let worldVx = vx + cubeWorldX;
                    let worldVy = vy + cubeWorldY;
                    let worldVz = vz + cubeWorldZ;

                    let rotatedVertex = rotYplane(worldVx, worldVy, worldVz, this.angle, center.x, center.y, center.z);
                    target3DCube.push(rotatedVertex)
                    let projectedPoint = projection2D(rotatedVertex.x, rotatedVertex.y, rotatedVertex.z, 35.264, 45);

                    projectedPoint.x += isoX;
                    projectedPoint.y += isoY;

                    targetCube.push(projectedPoint);
                }

                let midPoints = {
                    "0132": (targetCube[0].z + targetCube[1].z)/2 ,
                    "0264": (targetCube[0].z + targetCube[4].z)/2 ,
                    "1375": (targetCube[5].z + targetCube[1].z)/2 ,
                    "4576": (targetCube[5].z + targetCube[4].z)/2
                }

                let sortedMidPointsArray = []
                Object.keys(midPoints).forEach((key) => {
                    sortedMidPointsArray.push([key, midPoints[key]])
                })

                sortedMidPointsArray = sortedMidPointsArray.sort((a, b) => {
                    return a[1] - b[1]
                })

                sortedMidPointsArray.forEach((value, index) => {
                    let key = value[0].split('').map(Number)
                    faces[index + 1] = key
                })

                cubes.push({
                    "target": targetCube,
                    "faceArray": faces 
                })
                nCubes += 1
                let contains = this.rectangleArray.some((element) => {
                    return (JSON.stringify({targetCube: targetCube, faceArray: faces, nCube:nCubes}.nCube) === (JSON.stringify(element.nCube)))
                })

                if(!contains) {
                    this.rectangleArray.push({targetCube: targetCube, faceArray: faces, nCube:nCubes})
                } else if (contains) {
                    this.rectangleArray[nCubes - 1] = {targetCube: targetCube, faceArray: faces,nCube:nCubes}
                }
            }
            iniX = x
        }

        let sortedCubeArray = []
        cubes.forEach((value, index) => {
            let targetPoint = value.target[0].z
            sortedCubeArray.push([cubes[index], targetPoint])
        })

        sortedCubeArray = sortedCubeArray.sort((a,b) => {
            return a[1] - b[1]
        })

        for(let i = 0; i<sortedCubeArray.length; i++) {
            const faces = sortedCubeArray[i][0].faceArray;
            for(let j = 0; j<faces.length; j++) {
                const vertex = faces[j]
                if(j == 5) {
                    this.ctx.fillStyle = colors[0];
                } else {
                    this.ctx.fillStyle = colors[1];
                }

                let coords = []
                for (const vIndex of vertex) {
                    coords.push(sortedCubeArray[i][0].target[vIndex])
                }
                this.ctx.beginPath();
                this.ctx.moveTo(coords[0].x, coords[0].y);
                for (let p = 1; p < coords.length; p++) {
                    this.ctx.lineTo(coords[p].x, coords[p].y);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }

    drawPosGrid(x, y) {
        const topFace = [0, 1, 5, 4]
        let addedArray = this.rectangleArray
        let highlightedArrays = []

        addedArray.forEach(element => {
            let centerPointX = (element.targetCube[0].x + element.targetCube[1].x + element.targetCube[5].x + element.targetCube[4].x)/4
            let centerPointY = (element.targetCube[0].y + element.targetCube[1].y + element.targetCube[5].y + element.targetCube[4].y)/4

            let dist = Math.sqrt(Math.pow(x - centerPointX, 2) + Math.pow(y - centerPointY, 2))
            if (dist <= Globals.widthFactor/2) {
                Globals.selectedCube = element.targetCube[0]
                highlightedArrays.push([element, dist])
            }
            highlightedArrays = highlightedArrays.sort((a, b) => {
                return a[1] - b[1]
            })
        })

        if(highlightedArrays.length != 0) {
            highlightCube(highlightedArrays[0][0], this.ctx)
        }

        function highlightCube(element, ctx) {
            ctx.fillStyle = Globals.color
            let coords = []
            for (const vIndex of topFace) {
                coords.push(element.targetCube[vIndex])
            }
            ctx.beginPath();
            ctx.moveTo(Math.round(coords[0].x), Math.round(coords[0].y));
            for (let p = 1; p < coords.length; p++) {
                ctx.lineTo(Math.round(coords[p].x), Math.round(coords[p].y));
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    drawRect(click) {
        const topFace = [0, 1, 5, 4]
        if(click && Globals.selectedCube) {
            for (const [key, value] of Object.entries(this.rectangleArray)) {
                if (value.targetCube[0].x == Globals.selectedCube.x && value.targetCube[0].y == Globals.selectedCube.y) {
                    this.drawedRectsArray.push({"key": key, "color": Globals.color})
                }
            }
        }
        this.drawedRectsArray.forEach(element => {
            this.ctx.fillStyle = element.color
            const cube = this.rectangleArray[element.key]
            const faces = cube.faceArray
            for(let j = 0; j<faces.length; j++) {
                const vertex = faces[j]

                let coords = []
                for (const vIndex of topFace) {
                    coords.push(cube.targetCube[vIndex])
                }
                this.ctx.beginPath();
                this.ctx.moveTo(coords[0].x, coords[0].y);
                for (let p = 1; p < coords.length; p++) {
                    this.ctx.lineTo(coords[p].x, coords[p].y);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            }
        })
    }
}

