// Sample Gesture database
var data = require('../data/gesture_templates.json'); 

// Constants for max/min coordinates. 
let MAX_X = 500;
let MAX_Y = 500;
let MIN_X = 0; 
let MIN_Y = 0; 



var testArr = [[3,3], [1,1],[1,2]];
var diamond = [[100,0], [200, 100], [100, 200], [0,100],[100,0]]; 

/* 
Functions for manupulating points. 
*/ 
var getX = (pt) => pt[0];
var getY = (pt) => pt[1];

// Translate Gesture, translates a gesture G by x-offset and y-offset
var translate = (G,x,y) => G.map((pt)=>[getX(pt)+x, getY(pt)+y]);

// Scale Gesture, scales a gesture by x in x direction and y in y direction
var scale = (G,x,y) => G.map((pt)=>[getX(pt)*x, getY(pt)*y]);

// Bounding box, get the bounding box for gesture G. (Difference of max and min coordinates). 
var Bbox = (G) =>{
    var max_x = G.reduce((acc,v) =>  Math.max(acc, getX(v)), MIN_X);
    var min_x = G.reduce((acc,v) =>  Math.min(acc, getX(v)), MAX_X);

    var max_y = G.reduce((acc,v) =>  Math.max(acc, getY(v)), MIN_Y);
    var min_y = G.reduce((acc,v) =>  Math.min(acc, getY(v)), MAX_Y);

    
    return [[min_x,min_y], [max_x, max_y]]; 
}

// Point Dist: 
var pointDist = (a,b) => Math.sqrt((getX(b)-getX(a))**2 + (getY(b)-getY(a))**2); 

// Gesture Len, get the length of the gesture.  
function GestureLength(G){

    if(G.length == 0 || G.length == 1){
        return 0; 
    }
    else {
        return (pointDist(G[0], G[1]) + GestureLength(G.slice(1))); 
    }
}

// Move gesture to Origin and scale by sx,sy
var MoveAndScale = (G,sx,sy) => scale(translate(G, -1*getX(Bbox(G)[0]), -1*getY(Bbox(G)[0])), sx, sy); 

// Standard Size of Samples: 
let minW = 30; 
let minH = 30; 
let normSize = 200; 

var vertical_test = (G)=> {
    return	getX(Bbox(MoveAndScale(G,1,1))[1]) < minW;
}

var horizontal_test = (G)=> {
    return	getY(Bbox(MoveAndScale(G,1,1))[1]) < minH;
}

var get_scale = (G,n) => [n/(getX(Bbox(G)[1])), n/(getY(Bbox(G)[1]))];


/** Normalizing gesture */
function normalize(G){
    if(vertical_test(G)){
        return MoveAndScale(MoveAndScale(G,1,1),1,get_scale(G,normSize)[1]); 
    }
    else if(horizontal_test(G)){
        return MoveAndScale(MoveAndScale(G,1,1),get_scale(G,normSize)[0], 1); 
    }
    else {
        // Scale both ways
        return MoveAndScale(MoveAndScale(G,1,1), get_scale(G,normSize)[0], get_scale(G,normSize)[1]); 
    }
}



// Sampling functions

var getPts = (G, Lst) => Lst.map((i)=> G[i]);   

// Five Sample, get the the first, n/4th, n/2th, 3n/4th, and last point.
var FiveSample = (G,k) => {
    let n = G.length; 
    return getPts(G, [0, Math.floor(0.25*n), Math.floor(0.5*n), Math.floor(0.75*n), n-1]); 
}

// Gets k sample points from gesture
var sub_sample = (G,k) => {
    const len = G.length;
    var index_lst = []; 

    for (let i = 0; i < k; i++) {
        if (i === k-1) {
			index_lst.push(len-1); 
		}
		else{
			var index = Math.floor((i*len)*1/(k-1));
			index_lst.push(index); 
		}
    }
    return getPts(G,index_lst); 
}



/**Finds the distance bewteen 2 gestures G1,G2*/
// requires: |G1| = |G2|
function Gesture_distance(G1,G2){
    if(G1.length==0){
        return 0; 
    }
    else{
        
        return pointDist(G1[0], G2[0]) + Gesture_distance(G1.slice(1),G2.slice(1)); 
    }
}


/*Matching Functions*/
// Basic 5 sample matching function 
var geometric_5match = (G1, G2) =>  matching_engine(G1, G2, Gesture_distance, FiveSample, 5, normalize); 

// Matching based on k points
var geometric_kmatch = (G1, G2, k) => matching_engine(G1, G2, Gesture_distance,sub_sample, k, normalize); 



function recognizer_engine(Gesture, metric,dataset,k){
    var dist_list = dataset.Datbase.map((x) =>{ return [x.letter, metric(Gesture, x.template,k)]});

	var curr_min = dist_list[0];

	for (let index = 0; index < dist_list.length; index++) {
		if (dist_list[index][1] < curr_min[1]) {
			curr_min = dist_list[index];
		}
    }
   // console.log(dist_list); 
	return curr_min[0];
}

function matching_engine(Gesture1, Gesture2, distance, sampling,k, normalize){
		return distance(normalize(sampling(Gesture1,k)), normalize(sampling(Gesture2,k)))/k; 
}
function five_point_rec(G,k){
    return recognizer_engine(G,geometric_5match, data,k); 
}
function k_point_rec(G,k){
    return recognizer_engine(G,geometric_kmatch,data,k); 
}

module.exports = {
    five_pt_rec:  five_point_rec,
    k_pt_rec: k_point_rec
};


