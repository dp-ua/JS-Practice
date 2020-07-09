// Return the array of movements to execute to get out of the maze

function replaceAt(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

const isLog = true;
const isPrintMap = true;

function escape(maze) {
    // Have a nice sleep ;)
    const start = new Date().getTime();

    if (isLog && isPrintMap) {
        console.log("Input: ");
        maze.forEach(a => console.log(a));
    }
    const mySymbols = "<>v^"; //symbols for my Element;
    const input = [...maze].slice();

    let { scanBoard, me, exits } = getScanBoardStatus(input, mySymbols);

    if (me !== null) {
        if (isLog)
            console.log("Me: " + me.toString());

        if (exits.length > 0) {
            let accessiblePointsFromMyPoint = getAccessiblePointsFromPoint(scanBoard, me);

            let closetsExit = getClosestExit(exits, accessiblePointsFromMyPoint);

            if (closetsExit == null) return [];

            let result = getMovesForWay(me, closetsExit);


            if (isLog && isPrintMap) {
                console.log("Result map: ");
                closetsExit.way.forEach(p => {
                    input[p.y] = replaceAt(input[p.y], p.x, "8");
                })
                input.forEach(a => console.log(a));
            }

            const end = new Date().getTime();
            if (isLog) console.log('Time: ' + (end - start) + 'ms');
            return result;

        } else return [];
    }


}

function getMovesForWay(me, closetsExit) {
    const start = new Date().getTime();

    let currentPosition = me.s;
    let way = closetsExit.way;
    let result = [];
    for (let i = 0; i < way.length - 1; i++) {
        let current = way[i];
        let next = way[i + 1];
        let direction = getDirectionBetweenCoors(current.getCoor(), next.getCoor());
        let moveForDirection = getChangeMoveForDirection(currentPosition, direction);
        if (moveForDirection !== "")
            result.push(moveForDirection);
        result.push("F");
        currentPosition = getNextSymbolForDirection(direction);
    }
    const end = new Date().getTime();
    if (isLog) console.log('getMovesForWay: ' + (end - start) + 'ms');

    return result;
}

function getClosestExit(exits, accessiblePointsFromPoint) {
    const start = new Date().getTime();

    let closetsExit = { point: null, way: [] };

    exits.forEach(p => {
        if (accessiblePointsFromPoint.has(p)) {
            let way = accessiblePointsFromPoint.get(p);
            if (closetsExit.point == null) {
                closetsExit.point = p;
                closetsExit.way = way;
            } else {
                if (closetsExit.way.length > way.length) {
                    closetsExit.point = p;
                    closetsExit.way = way;
                }

            }
        }
    });
    const end = new Date().getTime();
    if (isLog) console.log('getClosestExit: ' + (end - start) + 'ms');

    return closetsExit;
}

function getAccessiblePointsFromPoint(board, point) {
    const start = new Date().getTime();

    let mainMap = new Map();
    let newAddedPoints = new Map();
    mainMap.set(point, [point]);
    newAddedPoints.set(point, [point]);

    let alreadyPassPoint = new Set();
    while (true) {
        let tempMap = new Map();
        for (let e of newAddedPoints.entries()) {
            let p = e[0];
            let way = [...e[1]];
            if (!alreadyPassPoint.has(p)) {
                alreadyPassPoint.add(p);
                for (let pAround of getStepPointsAround(board, p)) {
                    let newWay = way.slice();
                    newWay.push(pAround);
                    tempMap.set(pAround, newWay);
                }
            }
        }

        newAddedPoints.clear();
        for (let e of tempMap) {
            let p = e[0];
            let way = e[1];
            if (mainMap.has(p)) {
                let wayForPInMain = mainMap.get(p);
                if (wayForPInMain.length > way.length) {
                    mainMap.set(p, way);
                    newAddedPoints.set(p, way);
                }
            } else {
                mainMap.set(p, way);
                newAddedPoints.set(p, way);
            }
        }
        if (newAddedPoints.size == 0) break;

    }
    const end = new Date().getTime();
    if (isLog) console.log('getAccesiblePoints: ' + (end - start) + 'ms');

    return mainMap;
}

function getStepPointsAround(board, point) {
    let points = [];
    getDirections().forEach(d => {
        let coor = changeCoorsByDirection(point.getCoor(), d);
        if (isCoorsInBoard(coor.x, coor.y, board)) {
            n = board[coor.y][coor.x];
            if (n.step === true) points.push(n);
        }
    });
    return points;
}

function getNextSymbolForDirection(direction) {
    switch (direction) {
        case "RIGHT":
            return ">";
        case "LEFT":
            return "<";
        case "UP":
            return "^";
        case "DOWN":
            return "v";
    }
}

function getChangeMoveForDirection(positionSymbol, direction) {
    switch (positionSymbol) {
        case "^":
            if (direction === "RIGHT") return "R";
            if (direction === "DOWN") return "B"
            if (direction === "LEFT") return "L"
            if (direction === "UP") return "";
        case ">":
            if (direction === "RIGHT") return "";
            if (direction === "DOWN") return "R"
            if (direction === "LEFT") return "B"
            if (direction === "UP") return "L";
        case "v":
            if (direction === "RIGHT") return "L";
            if (direction === "DOWN") return ""
            if (direction === "LEFT") return "R"
            if (direction === "UP") return "B";
        case "<":
            if (direction === "RIGHT") return "B";
            if (direction === "DOWN") return "L"
            if (direction === "LEFT") return ""
            if (direction === "UP") return "R";
    }
}

function getDirectionBetweenCoors(coor1, coor2) {
    if (coor1.x < coor2.x) return "RIGHT";
    if (coor1.x > coor2.x) return "LEFT";
    if (coor1.y > coor2.y) return "UP";
    if (coor1.y < coor2.y) return "DOWN";
}

function changeCoorsByDirection(coor, direction) {
    let result = { x: coor.x, y: coor.y };
    switch (direction) {
        case "RIGHT":
            result.x++;
            break;
        case "LEFT":
            result.x--;
            break;
        case "DOWN":
            result.y++;
            break;
        case "UP":
            result.y--;
            break;
    }
    return result;
}

function getDirections() {
    return ["RIGHT", "UP", "DOWN", "LEFT"];
}

function isCoorsInBoard(x, y, board) {
    if (y < 0 || y >= board.length) return false;
    if (x < 0 || x >= board[0].length) return false;
    return true;
}

function getScanBoardStatus(input, mySymbols) {
    let scanBoard = []; // отсканированный двумерный массив точек. 
    let exits = []; // выходы

    let me = null;
    for (let y = 0; y < input.length; y++) {
        scanBoard.push([]);
        for (let x = 0; x < input[y].length; x++) {
            let s = input[y][x];
            let point = new Point(x, y, s);
            if (x === 0 || y === 0 || x === input[0].length - 1 || y === input.length - 1)
                if (point.step === true) {
                    point.exit = true;
                    exits.push(point);
                }

            scanBoard[y].push(point);
            if (mySymbols.search(s) >= 0)
                me = point;
        }
    }
    return { scanBoard, me, exits };
}

class Point {
    constructor(x, y, s) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.step = s === "#" ? false : true;
        this.exit = false;
    }

    getCoor() {
        return { x: this.x, y: this.y };
    }

    toString() {
        return ("{x:" + this.x +
            ", y:" + this.y +
            ", s:" + this.s +
            ", out:" + this.exit +
            ", step:" + this.step +
            "}");
    }
}

console.log("Output: " +
    escape([
        "#####################",
        "#     #   #   #      ",
        "# ### ### ### # ### #",
        "# #   #         # # #",
        "# # ### # ####### # #",
        "# # #   #   #     # #",
        "# ### ####### ##### #",
        "#   # #     # #     #",
        "### # # ### # # #####",
        "#   # #   #   # #   #",
        "# ### ### ##### # # #",
        "# #   #         # # #",
        "# # ### # ######### #",
        "#   #   #       #   #",
        "##### ######### # ###",
        "#   #       # # # # #",
        "# # ####### # # # # #",
        "# # #   #   #       #",
        "# # # # # ####### ###",
        "# #   # #       #   #",
        "# ### # ####### ### #",
        "#   # #         #   #",
        "### ####### ##### ###",
        "# # #       #   #   #",
        "# # # ####### ### ###",
        "# # #   #           #",
        "# # ### ######### # #",
        "# # #   #     #   # #",
        "# # ### # ### #######",
        "#   #   #   #       #",
        "##### ##### ####### #",
        "#     #   #     # # #",
        "# ##### # ##### # # #",
        "# #     # #     #   #",
        "# # ### ### #########",
        "# #   #     # #     #",
        "# ### ##### # # # # #",
        "#     #   #     # # #",
        "####### ##### ### # #",
        "#     #       #   # #",
        "# ### # ####### ### #",
        "# #   # #     #   # #",
        "# # ### # ### ### # #",
        "# # #   #   # # # # #",
        "# # ##### # # # # # #",
        "# # #   # # # # # # #",
        "# # # # # ### # # ###",
        "# # # #     #   #   #",
        "# ### ### # ####### #",
        "# #     # #         #",
        "# # ### # ####### ###",
        "#   #   # #         #",
        "# ### ##### ##### # #",
        "# # #   #   # #   # #",
        "# # ##### ### # ### #",
        "#   #     # #   #   #",
        "##### ##### # # # ###",
        "#     #     # # #   #",
        "# ##### ##### # ### #",
        "# #     # #   #   # #",
        "# # ### # # # ### # #",
        "# #   # # # # # # # #",
        "# ### ### # # # # ###",
        "# #   #   # #   #   #",
        "# # ### ### ####### #",
        "# #   #   # #       #",
        "# ### ### # # ##### #",
        "# #   #     #   #   #",
        "# # # # ####### # ###",
        "#   # #   #     #   #",
        "######### ######### #",
        "#       #     #   # #",
        "# ##### ##### # # # #",
        "#     #       # #   #",
        "# ### ######### ### #",
        "# #           #   # #",
        "# # ######### ### # #",
        "# #         # #   # #",
        "########### # ##### #",
        "#   #   #   #     # #",
        "# # # # # ####### ###",
        "# #   #   #     #   #",
        "# ######### ### ### #",
        "#           #   #   #",
        "############### # ###",
        "#     # #     # # # #",
        "# # # # # ### # # # #",
        "# # # #   #     #   #",
        "### # # ### #########",
        "#   # #   # #       #",
        "# ### ##### ####### #",
        "# # #   #   #     # #",
        "# # # # # # # # # # #",
        "# # # # # # # # #   #",
        "# # # # # # ### #####",
        "#   # # # #   # #   #",
        "##### # # ### # # # #",
        "#     # #   #   # # #",
        "# ####### # ##### # #",
        "#     #   # #   # # #",
        "##### # ### # # # ###",
        "# #   # # #   # #   #",
        "# # ### # ##### # # #",
        "#       #     #   # #",
        "########### # # #####",
        "#   #       # # #   #",
        "# # # ####### # # # #",
        "# #   #   #   #   # #",
        "####### # # ### # # #",
        "#     # # #     # # #",
        "# ### # # ####### # #",
        "# # # # #       # # #",
        "# # # ######### ### #",
        "#   # #             #",
        "##### # ####### # ###",
        "#   #     #     #   #",
        "# # ### ### ####### #",
        "# # # # #     #   # #",
        "# # # # # ### # ### #",
        "# # #   # #   #     #",
        "# # ##### # # # #####",
        "# #   #   # # #     #",
        "# ### # ### # ##### #",
        "# #   #   # # #   # #",
        "# ######### # # # # #",
        "#     # #   # # #   #",
        "##### # # ##### #####",
        "#   # # # #     #   #",
        "# # # # # ######### #",
        "# #     #     #     #",
        "# ##### ##### # #####",
        "#     #         #   #",
        "##### ########### ###",
        "#   #   #   #       #",
        "# ##### ### # ### # #",
        "#   #     #     # # #",
        "### # ### # ### # ###",
        "#   #   # #   # #   #",
        "# ### # # ### # ### #",
        "#     # #     #   # #",
        "####### ######### ###",
        "#     #   #     #   #",
        "# ### ### # ### ### #",
        "# # # #   #   #   # #",
        "# # # # ##### ##### #",
        "#   # #     #       #",
        "# # # ##### # # # ###",
        "# # #       # # #   #",
        "# # ######### # # ###",
        "# #   #   #   # #   #",
        "# ### # # # ####### #",
        "#   # # #   #     # #",
        "##### # ##### # ### #",
        "#     # #     #   # #",
        "# ####### ####### # #",
        "# #   #   #     # # #",
        "# ### # ### ### # ###",
        "# #   #   #   # #   #",
        "# # ##### ### # ### #",
        "# #     # #   #     #",
        "# ##### ### #########",
        "# #       #         #",
        "# # ##### ######### #",
        "# # #   # #     #   #",
        "# # # # # # ### ### #",
        "# # # #   #   #     #",
        "# ### ####### #######",
        "# #   #     #       #",
        "# # ### ### ####### #",
        "# #     # #         #",
        "# ####### ######### #",
        "# #   #             #",
        "# # # ### ### ##### #",
        "#   #     #   # #   #",
        "############### # ###",
        "#     #   #   #   # #",
        "# # # # # # # # ### #",
        "# # # # # # # # #   #",
        "# ### # # # # # # # #",
        "#   #   # # # #   # #",
        "### ##### # ### #####",
        "#   #   #           #",
        "##### # ########### #",
        "#   # #     #     # #",
        "# # # ##### # ### # #",
        "# # #   #   #   # # #",
        "# # ### ######### # #",
        "# #   #     #   # # #",
        "# ### # ### # # # # #",
        "#   # #   # # #   # #",
        "### ### ### # ##### #",
        "#       #           #",
        "######### ### #######",
        "#   #   #   #   #   #",
        "# # # # ##### ### # #",
        "# # # #     #   # # #",
        "# # # ##### ### # # #",
        "# #   #   #   #   # #",
        "# ####### # # ##### #",
        "#^#         #       #",
        "#####################"
    ]));


console.log("Output: " +
    escape([
        '# #',
        ' > ',
        '# #'
    ]));

console.log("Output: " +
    escape([
        '##########',
        '#>       #',
        '######## #'
    ]));

console.log("Output: " +
    escape([
        '# ########',
        '#       >#',
        '##########'
    ]));
console.log("Output: " +
    escape([
        '####### #',
        '#>#   # #',
        '#   #   #',
        '#########'
    ]));
console.log("Output: " +
    escape([
        '##########',
        '#        #',
        '#  ##### #',
        '#  #   # #',
        '#  #^# # #',
        '#  ### # #',
        '#      # #',
        '######## #'
    ]));
console.log("Output: " +
    escape([
        "#########################################",
        "#<    #       #     #         # #   #   #",
        "##### # ##### # ### # # ##### # # # ### #",
        "# #   #   #   #   #   # #     #   #   # #",
        "# # # ### # ########### # ####### # # # #",
        "#   #   # # #       #   # #   #   # #   #",
        "####### # # # ##### # ### # # # #########",
        "#   #     # #     # #   #   # # #       #",
        "# # ####### ### ### ##### ### # ####### #",
        "# #             #   #     #   #   #   # #",
        "# ############### ### ##### ##### # # # #",
        "#               #     #   #   #   # #   #",
        "##### ####### # ######### # # # ### #####",
        "#   # #   #   # #         # # # #       #",
        "# # # # # # ### # # ####### # # ### ### #",
        "# # #   # # #     #   #     # #     #   #",
        "# # ##### # # ####### # ##### ####### # #",
        "# #     # # # #   # # #     # #       # #",
        "# ##### ### # ### # # ##### # # ### ### #",
        "#     #     #     #   #     #   #   #    ",
        "#########################################"
    ]));