/*require("@babel/register");
import css from './style.css';*/

/**
 *           Grabbing all the grid
 */

var grid;
var algorithm;
var speed;
var speedInt;
var solution = null;
var inProgress = false;

const grabGrid = ()=>{
    let grid = []
    for(let row=0;row<9;row++){
       let currentRow = []
        let rowElement = document.querySelector(`.row:nth-child(${row+1})`);
        for(col=0;col<rowElement.children.length;col++){
           currentRow.push(rowElement.children[col])
        }
        grid.push(currentRow);
    }
    return grid
}





grid = grabGrid();
algorithm = 'algorithm-x';
speed = 'Fast';
speedInt = 3;









/**
 *   clear grid
 */

const clearGrid = ()=>{
    if(inProgress){
        showAlert('Animation In Progress.','danger');
        return;
    }
    grid.forEach(row=>row.forEach(td=>{
        td.className = ''
        td.children[0].value=''
    }))
    solution = null;
}

const clearGridBtn = document.getElementById('clearBtn');

clearGridBtn.addEventListener('click',clearGrid)



/**
 * Generate puzzle
 */

const generatePuzzle = ()=>{
    if(inProgress){
        showAlert('Animation In Progress.','danger');
        return;
    }

    clearGrid();

    fillDiagonalSectionsRandomly();
    backtracking(grid,0,true);
    solution = grid.map(row=>row.map(td=>{
        return td.children[0].value;
    }))

    // we have a complete valid sudoku puzzle. now we randomly delete some cells
    deleteRandomely();
    fixClasses();
   
}



const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click',generatePuzzle);



const fillDiagonalSectionsRandomly = () =>{

    let row=0;
    let col = 0 ;
    let counter=0;

    while(row!=9 && col!=9 && counter<900){
        counter++;
        let possibleNum = Math.floor(Math.random()*9) + 1;

        grid[row][col].children[0].value = possibleNum;
        grid[row][col].classList.add('fixed');

        if (row%3==0 && col%3 ==0){

            col++;

        }else if(isSquareValid(row,col,grid)){
            
            if(col%3 != 2){

                col ++;

            }else if(col%3===2){

                if(row%3===2){
                    col++;
                }else{
                    col = col-2;
                }

                row++;
                
            }


        }

    }
    
    
}



const deleteRandomely = ()=>{
    let cellsToRemoveFromPuzzle = []
    for(let i =0;i<80;i++){
        let randomCellIdx = Math.floor(Math.random()*81)
        cellsToRemoveFromPuzzle.push(randomCellIdx)

    }


    let counter = 0
    for(let row=0;row<grid.length;row++){
        for(let col=0;col<grid[row].length;col++){
            if(cellsToRemoveFromPuzzle.indexOf(counter)!==-1){
                grid[row][col].children[0].value = '';
            }
            counter++
        }
    }

}

const fixClasses = ()=>{
    grid.forEach(row=>row.forEach(td=>{
        if(td.children[0].value){
            td.className = 'fixed'
        }else{
            td.className = '';
        }
    }))
}



/**
 *       Specify the algo
 */
const algorithms = document.querySelectorAll(`#algorithms ~ ul li`);

algorithms.forEach(option=>{
    option.addEventListener('click',(e)=>{

        algorithm = e.target.getAttribute('data-value');

        algorithms.forEach(option=> option.classList.remove('active'))
        e.target.classList.add('active');
        console.log(algorithm)

        grid.forEach(row=>row.forEach(td=>{
            if(!td.classList.contains('fixed')){
                td.children[0].value = '';
                td.className='';
            }
        }))

        document.getElementById('algorithms').checked = false;


    })
})


/**
 * unable a dropdown when other one is selected
 */

 const menus = document.querySelectorAll(`nav li input[type='checkbox']`);

 menus.forEach(menu=>{
     menu.addEventListener('click',(e)=>{
         if(e.target.checked){
             menus.forEach(menu=>{
                 if(menu!==e.target){
                    menu.checked=false;
                 }})
         }
     })
 })



/**
 *     If a digit is entered validate it and  make it fixed
 * 
 *    If we have a puzzle and a solution validate the answers entered.
 */

 grid.forEach((row,rowIdx)=>row.forEach((td,colIdx)=>{
     td.children[0].addEventListener('input',(e)=>{
         if(e.target.value==''){
             td.className = '';
             return;
         }
         
         if(['1','2','3','4','5','6','7','8','9'].indexOf(e.target.value)===-1){
             
             td.classList.add('wrong');
             setTimeout(()=>{
                e.target.value = '';
                td.classList.remove('wrong');
             },500)
         }else{
             if(solution){
                if(td.children[0].value==solution[rowIdx][colIdx]){
                    td.classList.add('correct')
                }else{
                    td.classList.add('wrong')
                }
             }else{
             td.classList.add('fixed')
             if(isCellValid(rowIdx,colIdx,grid)) return;
             td.classList.remove('fixed');
             td.classList.add('wrong');
             setTimeout(()=>{
                 td.classList.remove('wrong');
                 e.target.value = ''
             },500)
         }
        }
     })
 }))



/**
 *    specify the speed
 */
const speedBtns = document.querySelectorAll(`#speed ~ ul > li`)

speedBtns.forEach(btn=>{

    btn.addEventListener('click',(e)=>{

    speed = e.target.getAttribute('data-value');
    
    // for UI
    speedBtns.forEach(option=> option.classList.remove('active'))
    e.target.classList.add('active');

    
    switch(speed){
        case 'Fast':
            speedInt = 3;
            break;
        case 'Average':
            speedInt = 10;
            break;
        case 'Slow':
            speedInt = 150;
            break;
        case 'noAnimation':
            speedInt = 0;
            break;
    }

    document.getElementById('speed').checked=false;


})})



/**
 *     VISUALIZE button
 */
const visualizeBtn = document.getElementById('visualizeBtn');

visualizeBtn.addEventListener('click',()=>{
    if(inProgress){
        showAlert('Animation in progress','danger');
        return;
    };

    //clear the grid of previous solutions.
    grid.forEach(row=>row.forEach(td=>{
        if(!td.classList.contains('fixed')){
            td.children[0].value = '';
            td.className='';
        }
    }))

    //dropDowns go away && inprogress && disabling dropdowns
    let menues = document.querySelectorAll(`ul input[type='checkbox']`);
    menues.forEach(checkbox=>{
        checkbox.checked=false;
        checkbox.disabled = true;
    })

    inProgress = true;

    
    switch(algorithm){
        case 'backtracking':
            return backtracking(grid,speedInt);
        
        case 'bfs':
            return bfs(grid,speedInt);
        
        case 'algorithm-x':
            return algorithmX(grid,speedInt);
        default:
            return algorithmX(grid,speedInt);
    }

})



/**
 *            Algorithms
 */



const backtracking = (grid,speedInt,comingFromGenerator=false,row=0,col=0,counter=null, animationList=null) =>{
   
    if(!animationList) animationList=[]

    if(!counter) counter={'iteration':0,'startTime':Date.now()}

    counter['iteration']++;
    

    if(counter['iteration']>=100000){
        showAlert('Backtracking is a naive algorithm.Please try an easier puzzle for it.', 'danger');
        return false;
    }

    if(row===grid.length && col===grid[row].length){
        clearGrid()
        animate(animationList,speedInt);
        return true
    } 
    
    let nextEmpty = findNextEmpty(grid,row,col);

    if (!nextEmpty){

        if(!comingFromGenerator){

        grid.forEach(row=>row.forEach(td=>{
            if(!td.classList.contains('fixed')){
                td.children[0].value = '';
            }
        }))

        
            animate(animationList,speedInt);

        let duration = Date.now() -  counter['startTime']
        showAlert(`Backtracking algorithm solved the puzzle successfuly in ${duration} ms.`,'success');
        }
        

        enableMenu(animationList.length);

        return true;
    } 

    let [nextRow,nextCol] = nextEmpty;

        
    for(let possibleNum=1;possibleNum<=9;possibleNum++){
            grid[nextRow][nextCol].children[0].value=possibleNum;
            animationList.push([nextRow, nextCol,possibleNum,'wrong'])

            if(isCellValid(nextRow,nextCol,grid)){
                animationList.push([nextRow, nextCol,possibleNum,'correct'])
               if(backtracking(grid,speedInt,comingFromGenerator , nextRow,nextCol,counter,animationList)) return true;

            }
        }

    grid[nextRow][nextCol].children[0].value='';
    animationList.push([nextRow, nextCol,'',''])
     return false;

    }











    
const bfs = (grid,speedInt,row=0,col=0,counter=null, animationList=null) =>{
    


    if(!animationList) animationList=[]

    if(!counter) counter={'iteration':0, 'startTime':Date.now()}

    counter['iteration']++

    if(counter['iteration']>=100000){
        showAlert('Best First Search algorithm was taking too long. The process is terminated.','danger')
        return false;
    }

    if(row===grid.length && col===grid[row].length){
        clearGrid()
        animate(animationList,speedInt);
        let duration = Date.now() -  counter['startTime']
        showAlert(`Algorithm solved the puzzle successfuly in ${duration} ms.`,'success');
        return true
    } 
    
    let nextBest = findNextBest(grid,row,col);

    if (!nextBest){
        grid.forEach(row=>row.forEach(td=>{
            if(!td.classList.contains('fixed')){
                td.children[0].value = '';
            }
        }))
        animate(animationList,speedInt);

        let duration = Date.now() -  counter['startTime']
        showAlert(`Algorithm solved the puzzle successfuly in ${duration} ms.`,'success');

        enableMenu(animationList.length);

        return true;
    } 

    let [nextRow,nextCol,nextChoices] = nextBest;

        
    for(let choice=0;choice<nextChoices.length;choice++){

            let possibleNum = nextChoices[choice];

            grid[nextRow][nextCol].children[0].value=possibleNum;
            animationList.push([nextRow, nextCol,possibleNum,'wrong'])

            // here we are sure that choices are valid choices.

                animationList.push([nextRow, nextCol,possibleNum,'correct'])
               if(bfs(grid,speedInt,nextRow,nextCol,counter,animationList)) return true;

            
        }

    grid[nextRow][nextCol].children[0].value='';
    animationList.push([nextRow, nextCol,'',''])
     return false;

}









const algorithmX = (grid,speedInt) =>{
    
    let startTime = Date.now();
    let [origin,topColumns,rowHeades] = buildDoublyLinkedList()
    insertCurrentGridValuesToLinkedList(origin,topColumns,rowHeades);

    let nodesToAnimate = [];

    solveWithDancingLinks(0,origin,nodesToAnimate);

    let endTime = Date.now();

    showAlert(`Algorithm X solved the puzzle in ${endTime - startTime} ms.`,'success')
    
    grid.forEach(row=>row.forEach(td=>{
        if(!td.classList.contains('fixed')){
            td.children[0].value = '';
        }
    }));

    animate(nodesToAnimate,speedInt);

}

class LinkedListNode{
    constructor(up,down,left,right,head,rowNumber){
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.head = head;
        this.rowNumber = rowNumber;
    }
}


class LinkedListHeaderNode{
    constructor(up, down, left,right,size){
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.size = size;
    }
}


const buildDoublyLinkedList = ()=>{
    let totalRows = 729; //81 cell * 9 possible number
    let totalCols = 324; //81 cell * 4 constraints for each

    let origin = new LinkedListHeaderNode(null, null, null, null,-1);

    let topColumns = []
    let rowHeades = []

    //set up all 324 cols first

    let prev = origin;

    for(let col=0;col<totalCols;col++){

        let colNode = new LinkedListHeaderNode(null, null,prev,null,0);

        prev.right = colNode;

        topColumns.push(colNode);
        
        prev = colNode;
        
    }

    origin.left = topColumns[topColumns.length-1]
    topColumns[topColumns.length-1].right = origin;


    //set up all 729 rows of matrix. 4 node for each row:#1one number in a cell met  #2 rowConstrain met #3 column constraint met #4 square constrain met

    for(let matrixRow=0;matrixRow<totalRows;matrixRow++){

        let puzzleRow = Math.floor(matrixRow/81);
         //each cell has 9 matrixRow and each row in puzzle has 9 cell aka each row in puzzle has 81 matrixRow

        let puzzleCol = Math.floor((matrixRow%81)/9) 
        //we have 81 matrixRow for a puzzleRow, after spotting where we are, considering 9 numbers for each cell and now we have our column.

        let numberAssociatedToThisMatrixRow = (matrixRow%9) + 1;
        //each cell has 9 number aka 9 matrixRow

        




        //finding the correct columns for our 4 constraints in this matrixRow

        //we have 81*4 columns, first 81 for uniq digit in a cell, second 81 for uniq digits in a row, third for uniq digit in a column and last 81 for uniq digit in a square

        //first constrain === we have one at the position of the cell for any number
        //e.g we have 1 at first col for g[0][0] = 1 and g[0][0] = 2 ,... and g[0][0]=9
        // So we only have to find the position of current cell in first 81 columns.

        let node1Index = puzzleRow*9 + puzzleCol;

        //second: after 81 cells, for each cell we have ones in 9 different positions for each number but cells in a row share these 9 positions for each number
        //e.g matrix[0][0] has 1 in third col for number 3, matrix[0][1] and matrix[0][2] ,... and matrix[0][8] all have 1 in third col for number 3 .  So we only have to find the row*9 + num

        let node2Index = 80 + puzzleRow*9 + numberAssociatedToThisMatrixRow;


        //Third: after two 81 cells(162 cells), for each cell in a row with different number we have a one in third 81 cells, so for row 1 we have 1 in each 81 cells(9 cells in a row with 9 different numbers), after the first row is done. for second row we start from first column and fill the whole 81 cells again so that g[0][0] will have one in third column for number 3 and g[1][0] also will have one in third column for number 3. So we only have to find the position of the cell in puzzle column and the associatedNumber of this iteration. aka col*9+num


        let node3Index = 161 + 9*puzzleCol + numberAssociatedToThisMatrixRow;


        //Last: after 3*81 columns, we have another 81, in this section cells within the same box will share columns for same numbers e.g g[0][0],g[0][1],g[1][0],... and g[2][2] will all have 1 in the same column for same number. aka in matrix first 3 cells will share columns, next 3 will share same columns and so on. until row is done. then the next 3 will share columns with first 3 of first row because they are from the same box. So we have to find out which box the cell is belong to. and after that we have 1 in box*9 + num

        let box = Math.floor(puzzleRow/3)*3 + Math.floor(puzzleCol/3);

        let node4Index = 242 + 9*box + numberAssociatedToThisMatrixRow;




        //now that we know the column idxs in which we want 1, we create a node in them.link them together with left and right properties. we cannot define up and downs yet. we have to go throw the column and do that with the help of topColumnNode for each column.

        let node1 = new LinkedListNode(null,null,null,null,topColumns[node1Index],matrixRow);

        let node2 = new LinkedListNode(null, null, node1,null,topColumns[node2Index],matrixRow);

        let node3 = new LinkedListNode(null, null,node2,null,topColumns[node3Index],matrixRow);

        let node4 = new LinkedListNode(null, null,node3,null,topColumns[node4Index],matrixRow);

        node1.right = node2;
        node2.right = node3;
        node3.right = node4;

        node4.right = node1;
        node1.left = node4;

        rowHeades.push(node1);

        //assign up and down properties:

        let topCol1 = topColumns[node1Index];
        let topCol2 = topColumns[node2Index];
        let topCol3 = topColumns[node3Index];
        let topCol4 = topColumns[node4Index];

        addNodeToBottomOfTheColumn(node1,topCol1);
        addNodeToBottomOfTheColumn(node2,topCol2);
        addNodeToBottomOfTheColumn(node3,topCol3);
        addNodeToBottomOfTheColumn(node4,topCol4);


    }


    return [origin,topColumns,rowHeades];
}



const insertCurrentGridValuesToLinkedList = (origin,topColumns,rowHeades)=>{

    grid.forEach((row,rowIdx)=>row.forEach((td,colIdx)=>{

        let num = td.children[0].value;

        if(num){

            let matrixRow = (rowIdx*81) + (colIdx*9) + (num - 1);

            //cover the whole row,Starting  from rowHead whenever sees a node cover the whole column


            let rowHead = rowHeades[matrixRow];
            
            
            coverColumn(rowHead.head); // first column

            let current = rowHead.right;

            while(current != rowHead){
                
                coverColumn(current.head);

                current = current.right;
            }


        }
    })
    )

}




const solveWithDancingLinks = (level,origin,nodesToAnimate)=>{
    if(origin==origin.right){
        return true
    }


    //algo: #1pick a column with minimum value #2 pick a row that have values in that column#3select it as the answer.aka remove row and remove all rows that share columns with it.


    //#1 pick a column with minimum size.aka possibilities
    let selectedCol = origin.right;
    let currentCol = selectedCol.right;

    while(currentCol!=origin){
        if(currentCol.size<selectedCol.size){
            selectedCol = currentCol;
        }

        currentCol = currentCol.right;
    }

    coverColumn(selectedCol)

    //#2 pick a row that have value in the col

    let row = selectedCol.down;

    while(row!=selectedCol){

        //#3-1 add row to the solution aka add info of matrixRow to the puzzle
        let puzzleRow = Math.floor(row.rowNumber/81);
        let puzzleColumn = Math.floor((row.rowNumber%81) / 9);
        let num = row.rowNumber % 9 + 1;
        grid[puzzleRow][puzzleColumn].children[0].value = num;


        nodesToAnimate.push([puzzleRow, puzzleColumn,num,'correct']);


        //#3-2 remove row from the matrix or dllist.
        let nextInRow = row.right;
        while(nextInRow != row){
            coverColumn(nextInRow.head)
            nextInRow = nextInRow.right;
        }

        if(solveWithDancingLinks(level+1,origin,nodesToAnimate)) return true

        //if we reached no answer now backtrack aka no value, row back in the list, and check other rows that have value in the column

        grid[puzzleRow][puzzleColumn].children[0].value = '';

        nodesToAnimate.push([puzzleRow, puzzleColumn,'',''])

        nextInRow = row.left;
        while(nextInRow != row){
            unCoverColumn(nextInRow.head)
            nextInRow = nextInRow.left;
        }

        row = row.down;

    }


    unCoverColumn(selectedCol);

}






/**
 * 
 *    Helper functions for algorithmX with Dancing Links
 */
const addNodeToBottomOfTheColumn = (nodeToInsert,head)=>{
    let current = head;
    while(current.down != null && current.down!=head){
        current = current.down;
    }
    current.down = nodeToInsert;
    nodeToInsert.up = current;

    //making it circular
    head.up = nodeToInsert;
    nodeToInsert.down = head;


    head.size++;
}



const coverColumn = colHeadNode =>{

    colHeadNode.right.left = colHeadNode.left;
    colHeadNode.left.right = colHeadNode.right;

    let row = colHeadNode.down;

    while(row!=colHeadNode){

        let nextInRow = row.right;

        while(nextInRow != row){
            nextInRow.up.down = nextInRow.down;
            nextInRow.down.up = nextInRow.up;

            nextInRow.head.size--;


            nextInRow = nextInRow.right;
        }

        row = row.down;
    }

}



const unCoverColumn = colHeadNode =>{

    colHeadNode.right.left = colHeadNode;
    colHeadNode.left.right = colHeadNode;

    let row = colHeadNode.up;

    while(row!=colHeadNode){

        let nextInRow = row.left;

        while(nextInRow != row){
            nextInRow.up.down = nextInRow;
            nextInRow.down.up = nextInRow;

            nextInRow.head.size++;


            nextInRow = nextInRow.left;
        }

        row = row.up;
    }

}













/**
 *                 Helper functions
 */




const isRowValid = (grid,rowIdx) =>{

    for(let row=0;row<9;row++){

        if(rowIdx===row){

            let numsInRow = {}

            for(col=0;col<9;col++){

                if (grid[rowIdx][col].children[0].value && numsInRow[grid[rowIdx][col].children[0].value]){

                    return false

                }else if(grid[rowIdx][col].children[0].value){

                    numsInRow[grid[rowIdx][col].children[0].value] = true
                }
            }

            return true;
        }

    }}







const isColValid = (grid,colIdx)=>{

    let numsInCol = {}

    for(let row=0;row<grid.length;row++){

        for(col=0;col<grid[row].length;col++){

            if(colIdx===col){

                currentNum = grid[row][col].children[0].value;

                if(currentNum &&  numsInCol[currentNum]){

                    return false;

                }else if(currentNum){

                    numsInCol[currentNum] = true;
                }
             }
        }
    }


    return true;
}




const isSquareValid = (rowIdx,colIdx,matrix)=>{
    
    let xSquare = Math.floor(colIdx/3);
    let ySquare = Math.floor(rowIdx/3);

    let numsInSquare = {}


    for(let row=ySquare*3;row<(ySquare+1)*3;row++){

        for(let col=xSquare*3;col<(xSquare+1)*3;col++){

            let currentNum = matrix[row][col].children[0].value;

            if(currentNum && numsInSquare[currentNum]){
                return false;

            }else if(currentNum){

                numsInSquare[currentNum] = true;

            }
        }
    }

    return true;

}




const isCellValid = (row,col,matrix)=>{
    return isRowValid(grid,row) && isColValid(grid,col) && isSquareValid(row,col,matrix)
}





const findNextEmpty = (grid,row,col)=>{
    for(let currentRow=0;currentRow<grid.length;currentRow++){

        for(let currentCol=0;currentCol<grid[row].length;currentCol++){

            if(!grid[currentRow][currentCol].classList.contains('fixed') && !grid[currentRow][currentCol].children[0].value){

                return [currentRow, currentCol]

            }
        }
    }
}




const findNextBest = (grid,row,col)=>{
    let leastChoices = 100;
    let result = null;


    for(let currentRow=0;currentRow<grid.length;currentRow++){

        for(let currentCol=0;currentCol<grid[row].length;currentCol++){

            if(!grid[currentRow][currentCol].classList.contains('fixed') && !grid[currentRow][currentCol].children[0].value){

                let currentCellChoices = calculateChoices(currentRow,currentCol,grid);

                if(currentCellChoices.length<leastChoices){
                    result = [currentRow, currentCol,currentCellChoices]
                    leastChoices = currentCellChoices.length;
                }


            }
        }
    }

    return result;

}


const calculateChoices = (row,col,grid)=>{
    let choices = [];

    for(let choice=1;choice<=9;choice++){
        grid[row][col].children[0].value = choice;
        if(isCellValid(row,col,grid)){
            choices.push(choice);
        }
    }

    grid[row][col].children[0].value = '';

    return choices;
}





const animate = (animationList, speedInt)=>{
    for(let event=0;event<animationList.length;event++){
        setTimeout(()=>{
            let [row,col,value,className] = animationList[event];
            grid[row][col].children[0].value= value;
            grid[row][col].className = className;
        },event*speedInt)
    }

    enableMenu(animationList.length);
}

const enableMenu = (events)=>{
    setTimeout(()=>{
        inProgress = false;

        document.querySelectorAll(`ul input[type='checkbox']`).forEach(checkbox=>{
            checkbox.disabled = false;
        })

    },events*speedInt);
}



const showAlert = (msg,className)=>{
    //create alert

    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.classList.add(className);
    alert.appendChild(document.createTextNode(msg));
    
    //append to body

    document.querySelector('body').appendChild(alert);
    
    setTimeout(()=>{
        
        document.querySelector('body').removeChild(alert);


    },5000)
}
