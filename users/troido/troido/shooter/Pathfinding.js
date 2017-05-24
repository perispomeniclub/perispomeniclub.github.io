"use strict";


// requires a priority queue implementation
var Pathfinding = {
	findPathAstar: function(beginNode, isGoalNode, getCost, getSurroundingNodes, getPrevious, isVisited, maxcost){
		// all arguments except beginNode and maxcost should be functions with as first argument a node
		// isVisited and maxcost optional
		// getCost should include the heuristic, otherwise it's Dijkstra's algorithm
		
		// Make the priority queue and insert the starting node
		var p = new priority_queue.PriorityQueue(function(node1, node2){ 
			return getCost(node1) - getCost(node2); // maybe I should turn these two around. let's see ...
		});
		p.push(beginNode);
		var test = 0;
		// here the real search happens
		while (p.length > 0){
			var node = p.shift();
			
			// if this place has been polled before, try again
			if (isVisited && isVisited(node)){
				continue;
			}
			
			// test if goal has been reached, if so, stop and return the path
			if (isGoalNode(node)){
				var steps = [];
				var pathNode = node;
				while( pathNode){ // make an array of the path
					steps.unshift(pathNode);
					pathNode = getPrevious(pathNode);
				}
				//steps.shift();
				//console.log(steps);
				return steps;
			}
			
			// put all surrounding available and free places in the priority queue
			getSurroundingNodes(node).forEach(function(newNode){
				if (!maxcost || getCost(newNode) <= maxcost){//console.log(newNode);
					//console.log(test++, getCost(newNode));
					p.push(newNode);
				}
			});
		}
		// no path found and nowhere to search, so return failure
		return null;
	},
	findPathAstar2d: function(field, startingPoint, goal, size){
// 		var teststr = "";
// 		for (var x = 0; x < field.length; x++){
// 			for(var y = 0; y < field[0].length; y++){
// 				teststr += field[y][x] ? "[]" : "  ";
// 			}
// 			teststr += "\n";
// 		}
// 		console.log(teststr);
		
		size = size || {w: 1, h: 1};
		
// 		console.log(arguments);
		startingPoint.x = Math.floor(startingPoint.x);
		startingPoint.y = Math.floor(startingPoint.y);
		goal.x = Math.floor(goal.x);
		goal.y = Math.floor(goal.y);
		
		function canStand(x, y){
			if (x < 0 || Math.ceil(x+size.w) >= field.length || y < 0 || Math.ceil(y+size.h) >= field[0].length){
				return false;
			}
			//console.log(Math.floor(y),size.h, Math.ceil(y+size.h));
			for ( var i = Math.floor(x); i<= Math.ceil(x+size.w); i++){//console.log("i: "+i);
				for ( var j = Math.floor(y); j<= Math.ceil(y+size.h); j++){//console.log("j: "+j)
					//console.log(i, j, field[i][j]);
					if (field[i][j]){
						return false;
					}
				}
			}
			return true;
		}
		
		if (!canStand(goal.x , goal.y)){
			return null;
		}
		//console.log("lala "+goal.y);
		//return null;
		
		function Node(x, y, cost, previous){
			this.x = x;
			this.y = y;
			this.cost = cost;
			this.previous = previous;
		}
		
		function isGoalNode(node){
			return node.x == goal.x && node.y == goal.y;
		}
		
		function getCost(node){
			return node.cost + Math.hypot(node.x - goal.x, node.y - goal.y);
		}
		
		function getSurroundingNodes(node){
			var surroundingNodes = [];
			var smallSteps = [[0,1],[0,-1],[1,0],[-1,0]];
			smallSteps.forEach(function(step){
				if (canStand(node.x + step[0], node.y + step[1])){
					surroundingNodes.push(new Node(node.x + step[0], node.y + step[1], node.cost + 1, node));
				}
			});
			var bigSteps = [[1,1],[-1,1],[1,-1],[-1,-1]];
			bigSteps.forEach(function(step){
				if (canStand(node.x + step[0], node.y + step[1]) && canStand(node.x, node.y + step[1]) && canStand(node.x + step[0], node.y)){
					surroundingNodes.push(new Node(node.x + step[0], node.y + step[1], node.cost + 1.414, node));
				}
			});
			return surroundingNodes;
		}
		
		function getPrevious(node){
			return node.previous;
		}
		
		var explored = new Array(field.length);
		for (var i = 0; i<explored.length; i++){
			explored[i] = field[i].concat();
			/*
			 *                       _______________________________________________________
			 *           A__A       /                                                       \         
			 *          /o  o\     | *Meow* YOU JUST WON A GREAT PRICE OF $5000000.00!       |
			 *         =  t  =  __/| JUST ENTER YOUR CARD DETAILS ON WWW.CONCAT.EXAPMLE.COM  |
			 *          `>-<       | AND WE WILL SEND YOU YOUR MONEY! *Purr*                 |
			 *          (   )      \________________________________________________________/
			 *         ( ||| )
			 *        (__O_O__)~~
			 *           " "
			 *        con-cat...
			 */
		}
		function isVisited(node){
			if (!explored[node.x][node.y]){
				explored[node.x][node.y] = true;
				return false;
			} else {
				return true;
			}
		}
		
		var startNode = new Node(startingPoint.x, startingPoint.y, 0, null);
		//console.log(startNode);
		return this.findPathAstar(startNode, isGoalNode, getCost, getSurroundingNodes, getPrevious,isVisited,500);
		
	}
}