

function getNewState(selfState, aliveAround) {
   var alive = false;
   if (selfState===1 && aliveAround===2) alive=true;
   if (aliveAround===3) alive=true;
   return alive?1:0;
}


function getOneGeneration(cells) {
   var workCells = increaseCells(cells);
   var result=[];
   for (var i = 0; i<workCells[0].length; i++) {
      var row=[];
      for (j=0;j<workCells[i].length;j++){
         row.push (getNewState(workCells[i][j], getAliveAround(i,j,workCells)));
      }
      result.push(row);
   }
   return cropCells(result);
}


function getGeneration(cells, generations){
   var result =[...cells];
   for (var g = 0; g<generations;g++) {
      result=getOneGeneration(result);
   }
   return result;
}

function getAliveAround(row,column,cells) {
   var alive=0;
   var len = cells.length;
   for (var i = row-1; i<=row+1;i++)
      for (var j=column-1;j<=column+1;j++) 
         if (i>=0 && j>=0 && i<len && j<len) 
            if (cells[i][j]===1 && !(i===row && j===column) ) alive++;
   return alive;
}


function cropCells(cells) {
   var needCrop=true;
   for (var i=0;i<cells[0].length;i++) {
      if (cells[0][i]===1) needCrop=false;
      if (cells[cells.length-1][i]===1) needCrop=false;
      if (cells[i][0]===1) needCrop=false;
      if (cells[i][cells.length-1]===1) needCrop=false;
   }
   if (needCrop) {
      var result = [];
      for (var i=1;i<cells.length-1;i++) {
         var row = [...cells[i]].slice(1,cells[i].length-1);
         result.push(row);
      }
      return result;
   } else return cells;
}

function increaseCells(cells){
   if (cells===null) return [[]];
   if (cells===[[]]) return [[0]];
   var len = cells[0].length;
   var result = [];
   result.push(Array(len+2).fill(0));
   for (var i=0;i<len;i++){
      var row =[];
      row.push(0);
      for (var j=0;j<cells[i].length;j++) row.push(cells[i][j]);
      row.push(0);
      result.push(row);
   }
   result.push(Array(len+2).fill(0));
   return result;
}

function printCells(cells) {
   for (var i = 0; i<cells.length;i++) {
      console.log(cells[i].join(' '));
   }
   console.log('');
}

var gliders = [
   [[1,0,0],
    [0,1,1],
    [1,1,0]],
   [[0,1,0],
    [0,0,1],
    [1,1,1]],
    [[1,0,1],
     [0,0,1],
     [1,1,1]]
 ];


printCells(getGeneration(gliders[0],1));
printCells(getGeneration(gliders[0],2));
printCells(getGeneration(gliders[0],3));
printCells(getGeneration(gliders[0],4));
printCells(getGeneration(gliders[0],5));
printCells(getGeneration(gliders[0],20));
