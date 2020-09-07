/**
 *           Grabbing all the grid
 */

var grid;
var algorithm;
var speed;

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

/**
 *   clear grid
 */

const clearGrid = ()=>{
    grid.forEach(row=>row.forEach(td=>{
        td.className = ''
        td.children[0].value=''
    }))
}

const clearGridBtn = document.getElementById('clearBtn');

clearGridBtn.addEventListener('click',clearGrid)





/**
 *       Specify the algo
 */
const algorithms = document.querySelectorAll(`#algorithms ~ section option`);

algorithms.forEach(option=>{
    option.addEventListener('click',(e)=>{
        algorithm = e.target.value;
        algorithms.forEach(option=> option.selected=false)
        e.target.selected = true;
        console.log(algorithm)

        grid.forEach(row=>row.forEach(td=>{
            if(!td.classList.contains('fixed')){
                td.children[0].value = '';
            }
        }))


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
 */

 grid.forEach((row,rowIdx)=>row.forEach((td,colIdx)=>{
     td.children[0].addEventListener('change',(e)=>{
         if(e.target.value==''){
             td.classList.remove('fixed');
             return;
         }
         
         if(['1','2','3','4','5','6','7','8','9'].indexOf(e.target.value)===-1){
             
             td.classList.add('wrong');
             setTimeout(()=>{
                e.target.value = '';
                td.classList.remove('wrong');
             },500)
         }else{
             td.classList.add('fixed')
             if(isRowValid(grid,rowIdx) && isColValid(grid, colIdx) && isSquareValid(grid,rowIdx,colIdx)) return;
             td.classList.remove('fixed');
             td.classList.add('wrong');
             setTimeout(()=>{
                 td.classList.remove('wrong');
                 e.target.value = ''
             },500)
         }
     })
 }))



/**
 *    specify the speed and run the algo
 */
const visualizeBtns = document.querySelectorAll(`#speed ~ section > option`)

visualizeBtns.forEach(btn=>{

    btn.addEventListener('click',(e)=>{

    speed = e.target.value;
    
    // for UI
    visualizeBtns.forEach(option=> option.selected=false)
    e.target.selected = true;

    let speedInt;
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
    }

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


})})



/**
 *            Algorithms
 */



const backtracking = (grid,speedInt,row=0,col=0,counter=null, animationList=null) =>{
   
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
        grid.forEach(row=>row.forEach(td=>{
            if(!td.classList.contains('fixed')){
                td.children[0].value = '';
            }
        }))
        animate(animationList,speedInt);
        let duration = Date.now() -  counter['startTime']
        showAlert(`Algorithm solved the puzzle successfuly in ${duration} ms.`,'success');
        return true;
    } 

    let [nextRow,nextCol] = nextEmpty;

        
    for(let possibleNum=1;possibleNum<=9;possibleNum++){
            grid[nextRow][nextCol].children[0].value=possibleNum;
            animationList.push([nextRow, nextCol,possibleNum,'wrong'])

            if(isCellValid(nextRow,nextCol)){
                animationList.push([nextRow, nextCol,possibleNum,'correct'])
               if(backtracking(grid,speedInt,nextRow,nextCol,counter,animationList)) return true;

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
        showAlert('Algorithm was taking too long. The process is terminated.','danger')
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
        return true;
    } 

    let [nextRow,nextCol,nextChoices] = nextBest;

        
    for(let choice=0;choice<nextChoices.length;choice++){

            let possibleNum = nextChoices[choice]

            grid[nextRow][nextCol].children[0].value=possibleNum;
            animationList.push([nextRow, nextCol,possibleNum,'wrong'])

            if(isCellValid(nextRow,nextCol)){
                animationList.push([nextRow, nextCol,possibleNum,'correct'])
               if(bfs(grid,speedInt,nextRow,nextCol,counter,animationList)) return true;

            }
        }

    grid[nextRow][nextCol].children[0].value='';
    animationList.push([nextRow, nextCol,'',''])
     return false;

}









const algorithmX = (grid,speedInt) =>{
    console.log('algorithmX function is gonna run' + '  '+ speed);
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




const isSquareValid = (rowIdx,colIdx)=>{
    
    let xSquare = Math.floor(colIdx/3);
    let ySquare = Math.floor(rowIdx/3);

    let numsInSquare = {}


    for(let row=ySquare*3;row<(ySquare+1)*3;row++){

        for(let col=xSquare*3;col<(xSquare+1)*3;col++){

            let currentNum = grid[row][col].children[0].value;

            if(currentNum && numsInSquare[currentNum]){
                return false;

            }else if(currentNum){

                numsInSquare[currentNum] = true;

            }
        }
    }

    return true;

}




const isCellValid = (row,col)=>{
    return isRowValid(grid,row) && isColValid(grid,col) && isSquareValid(row,col)
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
        if(isCellValid(row,col)){
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
}

const showAlert = (msg,className)=>{
    document.querySelector('.alert').classList.remove('hidden');
    document.querySelector('.alert').classList.add(className);
    document.querySelector('.alert').innerText=msg;

    setTimeout(()=>{
        document.querySelector('.alert').classList.add('hidden');
        document.querySelector('.alert').classList.remove(className);
        document.querySelector('.alert').innerText='';
    },5000)
}
