
const sample_gest =[[288,108],[276,103],[263,97],[236,91],[219,90],[196,91],[174,97],[156,104],[144,111],[127,126],[113,144],[100,161],[86,193],[81,212],[78,231],[78,257],[79,270],[83,280],[88,289],[95,293],[104,295],[117,298],[144,300],[159,300],[179,300],[188,298],[195,297],[197,295],[197,295],[197,293],[197,292],[196,292],[196,291],[195,290]];
;
const req = require('./gesture_rec')

console.log(req.k_pt_rec(sample_gest,10)); 

console.log(req.five_pt_rec(sample_gest,5)); 
