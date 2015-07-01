

// the div element used for debug output.  created in enableDebug.
var debugDiv;


// call this function from a script within the document for which to enable debug output
function enableDebug() {
  document.write("<div id='debugContent' style='display:block; position:absolute; top:7px; right:7px; padding:10px; width:300px; background:#ccc; color:white; border:solid 1px black;'></div>");
  debugDiv = document.getElementById("debugContent");
  writeClearLink();
}

// writes the string passed to it to the page
function writeDebug(message) {
  if (debugDiv)
    debugDiv.innerHTML += message + "<br\/>";
}

// writes the value of some code expression.
// eg: writeEval("document.location"); // writes "document.location = http://drewnoakes.com"
function writeEval(code) {
  writeDebug(code + " = " + eval(code));
}

// writes all of the properties of the object passed to it
function writeDebugObject(object) {
   for (property in object)
      writeDebug(property);
}

// clears the debug output.  called either manually or by the user clicking the 'clear' link in the debug div.
function clearDebug() {
  if (debugDiv) {
    debugDiv.innerHTML = "";
    writeClearLink();
  }
}

// writes a link in the debug div that clears debug output
function writeClearLink() {
  writeDebug("<a href='#' onclick='clearDebug(); return false;'>clear</a>");
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

enableDebug();

var dim=3;
var totalNodes;
function makeNode(v)
{
	var i;
	var v2;
	var node= new Object;

	 v2 = Number(v);

	if((v2>0) && (v2<10))
	{
		node.val = v2;
		node.dom = [0,0,0,0,0,0,0,0,0];
	//	node.dom[v2-1] = 1;

	}
	else
	{
		node.val=0;
		node.dom = [1,1,1,1,1,1,1,1,1]; //could be anything
	}
return node;
}


function duplicateState(source)// returns duplicate of a game state
{

var dup = createMultiDimensionalArray(4);
var i, k, j, l,z;
  
    for (i = 0; i < dim; i++)
      for (k = 0; k < dim; k++)
        for (j = 0; j < dim; j++)
          for (l = 0; l < dim; l++) 
          { 
          dup[i][j][k][l] = makeNode(1); //dummy variable just to make a node. we change the value immediately
          	dup[i][j][k][l].val = source[i][j][k][l].val;
 
          		for (z in source[i][j][k][l].dom) dup[i][j][k][l].dom[z] = source[i][j][k][l].dom[z];
          		
  			}
  			
  return dup;
}


function createMultiDimensionalArray(dimension) //dimension should be non-negative
{

	if(dimension==0) return null;
	var y = new Array(dim); 
	var i;
	for(i=0; i<dim; i++)	y[i] = createMultiDimensionalArray(dimension-1);
    return y;

}

function initializeBoard() //its job is to create the game board for beginning the game
{

var board  = createMultiDimensionalArray(4); 

var i, k, j, l,z;
var e = 0;
  with (top.document.forms[0])
    for (i = 0; i < dim; i++)
      for (j = 0; j < dim; j++)
        for (k = 0; k < dim; k++)
          for (l = 0; l < dim; l++) board[i][j][k][l] = makeNode(elements[e++].value);
  


  //now we have to make sure there are no duplicates

//check horizontal rows
for (i=0; i<dim; i++)
	{
		for (k=0; k<dim; k++)
		{
			var tmp = [0,0,0,0,0,0,0,0,0]; 
			//each position is for values 1 2 3 4 5 6 7 8 9 
			// 0 means the value has not appeared in row, 1 means otherwise
			for (j=0; j<dim; j++)
			{
				for (l=0; l<dim; l++)
					{
						var nn = board[i][j][k][l].val;
						if ( nn != 0) //ignore multiple 0s on same row
						{
							if (tmp[nn-1] == 1) return null;
							else tmp[nn-1] = 1; 
						}

					}
			}
		}
	}

//check vertical columns
for (j=0; j<dim; j++)
	{
		for (l=0; l<dim; l++)
		{
			var tmp = [0,0,0,0,0,0,0,0,0]; 
			//each position is for values 1 2 3 4 5 6 7 8 9 
			// 0 means the value has not appeared in row, 1 means otherwise
			for (i=0; i<dim; i++)
			{
				for (k=0; k<dim; k++)
					{
						var nn = board[i][j][k][l].val;
						if ( nn != 0) //ignore multiple 0s on same row
						{
							if (tmp[nn-1] == 1) return null;
							else tmp[nn-1] = 1; 
						}

					}


			}
		}
	}

//check boxes
	for (i=0; i<dim; i++)
	{
		for (j=0; j<dim; j++)
		{
			var tmp = [0,0,0,0,0,0,0,0,0]; 
			//each position is for values 1 2 3 4 5 6 7 8 9 
			// 0 means the value has not appeared in row, 1 means otherwise
			for (k=0; k<dim; k++)
			{
				for (l=0; l<dim; l++)
					{
						var nn = board[i][j][k][l].val;
						if ( nn != 0) //ignore multiple 0s on same row
						{
							if (tmp[nn-1] == 1) return null;
							else tmp[nn-1] = 1; 
						}
					}


			}
		}
	}
	
//now that there are no duplicates, we should fix the domain of all squares
for (i = 0; i < dim; i++)
      for (j = 0; j < dim; j++)
        for (k = 0; k < dim; k++)
          for (l = 0; l < dim; l++)
          {
          	if (board[i][j][k][l].val!=0)
          	{
          		var tmp = board[i][j][k][l].val;
          		var square = [i,j,k,l];
          		removeFromDomains(square, board, tmp);

          		
          	}
          
          }

  return board;
}

function solvePuzzle()
{
var gameState = initializeBoard();

if (gameState==null) 
{
alert ("this puzzle is inconsistent");
}

else{
//find the number of empty spots on the board,
	var i, k, j, l, ctr;
	ctr=0;

	for (i = 0; i < dim; i++)
	      for (j = 0; j < dim; j++)
	        for (k = 0; k < dim; k++)
	          for (l = 0; l < dim; l++) 
	          {
	          	if(gameState[i][j][k][l].val==0) ctr++;
	          }

	
	var startTime = new Date();

totalNodes=0;
var gg ;
for(gg=0; gg<1; gg++)
	var possibleAnswer = recursiveSolver (gameState , ctr);


		if(possibleAnswer==false)
		{
			alert("this puzzle is unsolvable")
		}
		else
		{
		

			printBoard(possibleAnswer);
		
			var endTime = new Date();
			writeDebug(endTime - startTime);
			writeDebug("total nodes is " + totalNodes);
		}



}
}

function recursiveSolver(currentState, numOfEmpty)
{
totalNodes++;
//base case
	if(!checkConsistency(currentState)) return false; //if board is not consistent return false for answer. 
	else if(numOfEmpty==0) return currentState; //board is consistent but no more empty spots => we have answer
	else{
	//board is consistent with itself but still has empty spots

	var q = pickASquare(currentState);
	var successor = duplicateState(currentState);
	var newVal = selectFromArray(successor[q[0]][q[1]][q[2]][q[3]].dom); //pick the first value that is possibly correct from the domain array

	if(newVal == null) // I think this should never happen because  check consistency in first line should make sure any unasigned square has non empty domain
	{
		alert("tried to pop domain and got null")
		return false;
	}
	
	successor[q[0]][q[1]][q[2]][q[3]].val=newVal;
	removeFromDomains(q,successor,newVal);
	//but we should avoid the 000 000 000 situation for a 

	 var possibleAnswer = recursiveSolver(successor,numOfEmpty-1);

		while(possibleAnswer == false)
		{

			//our value didnt work out, first we need to restore the domains to what they were in the original state
			restoreDomains(q, successor, currentState, newVal);
			//but we just restored all domain values, we need to cross out the value we just tried and didnt work, or else we get an infinite loop
			successor[q[0]][q[1]][q[2]][q[3]].dom[newVal-1]=0

			//lets try again
			newVal = selectFromArray(successor[q[0]][q[1]][q[2]][q[3]].dom);

			if(newVal == null) return false;// all of the possible domain values have been tried but none is correct


			successor[q[0]][q[1]][q[2]][q[3]].val=newVal;
		    removeFromDomains(q,successor,newVal);
			possibleAnswer = recursiveSolver(successor,numOfEmpty-1);
		}

		//at this point if we have not returned false, that means possibleAnswer is real answer
		return possibleAnswer;
	
	}

}

function removeFromDomains(square, gameBoard, domVal)
{

    var i,j,k,l;
//remove value from domain of boxes sharing the row
   for (j=0; j<dim ; j++)
    	for(l=0;l<dim; l++)
    	{
    		gameBoard[square[0]][j][square[2]][l].dom[domVal-1]=0;
    	}
//remove value from domain of boxes sharing the column
    for (i=0; i<dim ; i++)
    	for(k=0;k<dim; k++)
    	{
    		gameBoard[i][square[1]][k][square[3]].dom[domVal-1]=0;
    	}
//remove value from domain of boxes sharing the block
    	for (k=0; k<dim ; k++)
    	for(l=0;l<dim; l++)
    	{
    		gameBoard[square[0]][square[1]][k][l].dom[domVal-1]=0;
    	}

}

function restoreDomains(square, gameBoard, sourceBoard, domVal)
{
			//restore value for domain of boxes sharing the row
			   for (j=0; j<dim ; j++)
			    	for(l=0;l<dim; l++)
			    	{
			    		gameBoard[square[0]][j][square[2]][l].dom[domVal-1]=sourceBoard[square[0]][j][square[2]][l].dom[domVal-1];
			    	}
			//restore value for domain of boxes sharing the column
			    for (i=0; i<dim ; i++)
			    	for(k=0;k<dim; k++)
			    	{
			    		gameBoard[i][square[1]][k][square[3]].dom[domVal-1]=sourceBoard[i][square[1]][k][square[3]].dom[domVal-1];
			    	}
			//restore value fordomain of boxes sharing the block
			    for (k=0; k<dim ; k++)
			    	for(l=0;l<dim; l++)
			    	{
			    		gameBoard[square[0]][square[1]][k][l].dom[domVal-1]=sourceBoard[square[0]][square[1]][k][l].dom[domVal-1];
			    	}
	
}

function selectFromArray(arr)
{
	for(i in arr)
	{
		if(arr[i] != 0) return (Number(i)+1);
	}

return null;
}

function pickASquare(boardState)
{
var i, k, j, l;
var ans;
var min=10;
var indicesOfMin=[];

for (i = 0; i < dim; i++)
      for (j = 0; j < dim; j++)
        for (k = 0; k < dim; k++)
          for (l = 0; l < dim; l++) 
          {
          	if(boardState[i][j][k][l].val==0)
          	{
          		var sizeOfDomain=countOnes(boardState[i][j][k][l].dom);
          		if( sizeOfDomain < min)
          		{
          		indicesOfMin=[i,j,k,l];
          		min=sizeOfDomain;
          	    }
          		
          		
          	}
          }
          return indicesOfMin;

        
         
}
function countOnes(ar) //used to count the number of available domain for boxes
{
	var i;
	var ctr=0;
	for(i=0;i<ar.length;i++) if(ar[i]==1) ctr++;
	return ctr;
}

function checkConsistency(boardState) //returns true if board is consistent, false otherwise
{

	//we do not need to worry about duplicate values in any row, column, or block, 
	//because the program only selects values to try from the possible domain, 
	//if user enters duplicate values in a row, column or block, it will be caught by initializeBoard()
var i,j,k,l,z;
//check horizontal rows
for (i = 0; i < dim; i++)
      for (j = 0; j < dim; j++)
        for (k = 0; k < dim; k++)
          for (l = 0; l < dim; l++)
          {
          	if(boardState[i][j][k][l].val == 0) //if value is already set, we dont worry about its domain
          	{
          	var tmp = boardState[i][j][k][l].dom;
          	var ctr = 0;
          	for(z in tmp) if (tmp[z]==0) ctr++;
          	if (ctr>8) return false;
      		}
          }

	return true;
}


function printBoard(board)
{
var i, k, j, l;
var e = 0;

for (i = 0; i < dim; i++)
      for (j = 0; j < dim; j++)
        for (k = 0; k < dim; k++)
          for (l = 0; l < dim; l++) document.getElementById(e++).value = board[i][j][k][l].val;
}


function verify(e) {
  with (top.document.forms[0].elements[e]) {
    if (value != '1'
        && value != '2'
        && value != '3'
        && value != '4'
        && value != '5'
        && value != '6'
        && value != '7'
        && value != '8'
        && value != '9')
      value = '';
  }
  return true;
}

