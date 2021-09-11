/**
 * Water trapping
 * N non-negative integers
 * let height = [0,1,0,2,1,0,1,3,2,1,2,1] === 6
 * let height = [4,2,0,3,2,5] === 9
 * @Param {number[]} height
 * @Return {totalWater: number,waterData:[{waterVol,barHeight}]}
 */
const trap = function (height = []) {
    let totalWater = 0;
    let dataLength = height.length;
    let rightMaxCache = Array(dataLength);
    let leftMaxCache = Array(dataLength);

    //Calc left max of each point
    leftMaxCache[0] = height[0];
    for (let i = 1; i < dataLength; i++) {
        leftMaxCache[i] = Math.max(leftMaxCache[i - 1], height[i]);
    }

    //Calc right max of each point
    rightMaxCache[dataLength - 1] = height[dataLength - 1];
    for (let i = dataLength - 2; i >= 0; i--) {
        rightMaxCache[i] = Math.max(rightMaxCache[i + 1], height[i]);
    }

    const waterData = [];
    for (let i = 0; i < dataLength; i++) {
        const levelOfWater = Math.min(leftMaxCache[i], rightMaxCache[i]);
        const waterVol = levelOfWater - height[i];
        totalWater += waterVol;
        waterData.push({
            waterVol,
            barHeight: height[i]
        })
    }

    return {
        totalWater,
        waterData
    };

};

class Grid {
    BLOCK_SIZE_PX
    GRID_WIDTH = 25
    GRID_HEIGHT = 15

    _graph
    _waterBlock
    _wallBlock

    // Draw basic grid
    _init(placeHolder) {
        this._graph = new joint.dia.Graph;

        new joint.dia.Paper({
            el: document.getElementById(placeHolder),
            model: this._graph,
            width: this.BLOCK_SIZE_PX * this.GRID_WIDTH + 1,
            height: this.BLOCK_SIZE_PX * this.GRID_HEIGHT + 1,
            gridSize: this.BLOCK_SIZE_PX,
            interactive: false,
            drawGrid: {
                name: 'mesh',
                args: {
                    color: 'black'
                }
            },
            background: {
                color: 'Aliceblue'
            }
        });

        let rect = new joint.shapes.standard.Rectangle();
        rect.position(0, 0);
        rect.resize(this.BLOCK_SIZE_PX, this.BLOCK_SIZE_PX);
        rect.attr({
            body: {
                fill: 'CornflowerBlue',
                stroke: '#474241',
            },
            label: {
                fill: 'white'
            }
        });
        this._waterBlock = rect;
        let wallRect = rect.clone();
        wallRect.attr({
            body: {
                fill: '#211E1E',
                stroke: '#635656',
            }
        })
        this._wallBlock = wallRect;

        let text = new joint.shapes.standard.TextBlock();
        text.resize(this.BLOCK_SIZE_PX, this.BLOCK_SIZE_PX);

        text.attr('body/fill', 'lightgray');
        text.attr('body/stroke', 'Darkgray');

        for (let i = 1; i < this.GRID_WIDTH; i++) {
            let txtBlock = text.clone();
            txtBlock.position(this.BLOCK_SIZE_PX * i, this.BLOCK_SIZE_PX * (this.GRID_HEIGHT - 1));
            txtBlock.attr('root/title', i);
            txtBlock.attr('label/text', i);
            txtBlock.addTo(this._graph)
        }
        for (let i = this.GRID_HEIGHT - 2; i >= 0; i--) {
            let txtBlock = text.clone();
            txtBlock.position(0, this.BLOCK_SIZE_PX * i);
            txtBlock.attr('root/title', this.GRID_HEIGHT - i - 1);
            txtBlock.attr('label/text', this.GRID_HEIGHT - i - 1);
            txtBlock.addTo(this._graph)
        }

    }

    drawWater(x = 0, y = 0) {
        if (x > 0 && x < this.BLOCK_SIZE_PX && y > 0 && y < this.BLOCK_SIZE_PX) {
            let block = this._waterBlock.clone();
            block.position(this.BLOCK_SIZE_PX * x, this.BLOCK_SIZE_PX * (this.GRID_HEIGHT - y - 1));
            block.addTo(this._graph);
        }

    }

    drawWall(x = 0, y = 0) {
        if (x > 0 && x < this.BLOCK_SIZE_PX && y > 0 && y < this.BLOCK_SIZE_PX) {
            let block = this._wallBlock.clone();
            block.position(this.BLOCK_SIZE_PX * x, this.BLOCK_SIZE_PX * (this.GRID_HEIGHT - y - 1));
            block.addTo(this._graph);
        }
    }

    constructor(blockSizePX = 30, placeHolder = 'myholder') {
        this.BLOCK_SIZE_PX = blockSizePX;
        this._init(placeHolder);
    }
}

class DrawChart {
    _grid

    constructor(grid) {
        this._grid = grid;
    }

    draw(input) {
        const {totalWater, waterData} = trap(input);

        for (let i = 0; i < waterData.length; i++) {
            const {waterVol, barHeight} = waterData[i];
            this._drawBar(i + 1, barHeight, waterVol);
        }

        return {
            totalWater,
            waterData
        };
    }

    _drawBar(x, barHeight, waterVol) {
        for (let y = 1; y <= barHeight; y++) {
            this._grid.drawWall(x, y)
        }

        for (let y = barHeight + 1; y <= barHeight + waterVol; y++) {
            this._grid.drawWater(x, y)
        }
    }
}

class RandomGenerator {
    constructor(maxWidth, maxHeight) {
        this._maxWidth = maxWidth;
        this._maxHeight = maxHeight;
    }

    _randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRandomArray() {
        const arrayLength = this._randomInRange(4, this._maxWidth - 2);
        return  Array.from({length: arrayLength}, () => this._randomInRange(0, this._maxHeight - 3));
    }
}
