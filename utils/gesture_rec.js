var data = require('../data/gesture_templates.json'); 

// Constants for max/min coordinates. 
let MAX_X = 500;
let MAX_Y = 500;
let MIN_X = 0; 
let MIN_Y = 0; 

//console.log(data);

var testArr = [[3,3], [1,1],[1,2]];
var diamond = [[100,0], [200, 100], [100, 200], [0,100],[100,0]]; 
// REC Functions. 
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


var getPts = (G, Lst) => Lst.map((i)=> G[i]);   

// Five Sample, get the the first, n/4th, n/2th, 3n/4th, and last point.
var FiveSample = (G) => {
    let n = G.length; 
    return getPts(G, [0, Math.floor(0.25*n), Math.floor(0.5*n), Math.floor(0.75*n), n-1]); 
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


// Basic 5 sample matching function 
var geometric_5match = (G1, G2) =>  Gesture_distance(normalize(FiveSample(G1)), normalize(FiveSample(G2)))/5; 

const testGesture = [[237,62],[234,62],[229,60],[225,60],[217,58],[208,57],[198,56],[188,56],[180,56],[172,57],[164,60],[158,62],[150,64],[140,69],[136,72],[133,75],[127,82],[122,89],[119,95],[116,108],[116,117],[116,127],[117,141],[120,150],[123,160],[127,168],[135,179],[142,186],[149,194],[162,202],[170,206],[179,208],[196,210],[206,210],[215,208],[237,205],[247,201],[258,197],[265,193],[267,191],[268,191],[269,190],[269,190],[269,189],[269,187],[269,186],[269,184],[268,180],[267,179],[267,177],[266,177],[265,176],[265,176]]; 

//console.log(geometric_5match(testGesture,data.Datbase[0].template)); 
//console.log(geometric_5match(testGesture,data.Datbase[1].template)); 
//console.log(geometric_5match(testGesture,data.Datbase[2].template)); 
//console.log(geometric_5match(testGesture,data.Datbase[3].template)); 
module.exports = {
    five_point_rec: function (G){
                var dist_list = data.Datbase.map((x) => [x.letter, geometric_5match(G, x.template)]);
                 var curr_min = dist_list[0];
                 for (let index = 0; index < dist_list.length; index++) {
                     if (dist_list[index][1] < curr_min[1]) {
                         curr_min = dist_list[index];
                    }
        }
        return curr_min[0]; 
    }
}
// console.log(five_point_rec(testGesture)); 


    
