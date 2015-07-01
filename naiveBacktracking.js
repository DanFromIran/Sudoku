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

var totalNodes;
var dim=3;

function makeNode(val)
{
	var i;
	var val;
	var node= new Object;

	 val = Number(val);

	if((val>0) && (val<10))
	{
		node.val = val;
		node.dom = null;
	}
	else
	{
		node.val=0;
		node.dom = [];
    	for( i=1;i<10;i++) node.dom.push(i);
	}
return node;
}

function duplicateState(source)// returns duplicate of a game state
{
var dup = createMultiDimensionalArray(4);
var i, k, j, l;
  
    for (i = 0; i < dim; i++)
      for (k = 0; k < dim; k++)
        for (j = 0; j < dim; j++)
          for (l = 0; l < dim; l++) 
          { dup[i][j][k][l] = makeNode(1); //dummy variable 
          	dup[i][j][k][l].val = source[i][j][k][l].val;
          	var tmp = [];
          	var z;
          		for (z in source[i][j][k][l].dom)
          		{
          			tmp.push(source[i][j][k][l].dom[z]);
          		}
          	dup[i][j][k][l].dom = tmp;
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

var i, k, j, l;
var e = 0;
  with (top.document.forms[0])
    for (i = 0; i < dim; i++)
      for (j = 0; j < dim; j++)
        for (k = 0; k < dim; k++)
          for (l = 0; l < dim; l++) board[i][j][k][l] = makeNode(elements[e++].value);
  
  return board;
}

function solvePuzzle()
{

var gameState = initializeBoard();

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
			writeDebug("total nodes with simple backtracking is " + totalNodes);
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

	var newVal = successor[q[0]][q[1]][q[2]][q[3]].dom.pop();

	if(newVal == null) // i think this should never happen because  check consistency in first line should make sure any unasigned square has non empty domain
	{
		alert("tried to pop domain and got null")
		return false;
	}


	successor[q[0]][q[1]][q[2]][q[3]].val=newVal;


	var possibleAnswer = recursiveSolver(successor,numOfEmpty-1);
		while(possibleAnswer == false)
		{
			newVal = successor[q[0]][q[1]][q[2]][q[3]].dom.pop();
			if(newVal==null) return false;// all of the possible domain values have been tried but none is correct
			successor[q[0]][q[1]][q[2]][q[3]].val=newVal;
			possibleAnswer = recursiveSolver(successor,numOfEmpty-1);
		}
		//at this point if we have not returned false, that means possibleAnswer is real answer
		return possibleAnswer;
	}
}

function pickASquare(boardState)
{
var i, k, j, l;
var ans;


for (i = 0; i < dim; i++)
      for (j = 0; j < dim; j++)
        for (k = 0; k < dim; k++)
          for (l = 0; l < dim; l++) 
          {
          	if(boardState[i][j][k][l].val==0)
          	{
          		ans=[i,j,k,l];
          		return ans;
          	}
          }
}

function checkConsistency(boardState) //returns true if board is consistent, false otherwise
{
var i,j,k,l;
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
						var nn = boardState[i][j][k][l].val;
						if ( nn != 0) //ignore multiple 0s on same row
						{
							if (tmp[nn-1] == 1) return false;
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
						var nn = boardState[i][j][k][l].val;
						if ( nn != 0) //ignore multiple 0s on same row
						{
							if (tmp[nn-1] == 1) return false;
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
						var nn = boardState[i][j][k][l].val;
						if ( nn != 0) //ignore multiple 0s on same row
						{
							if (tmp[nn-1] == 1) return false;
							else tmp[nn-1] = 1; 
						}
					}
			}
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



