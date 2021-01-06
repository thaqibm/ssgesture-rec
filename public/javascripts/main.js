// Managing HTTP requests. 


var getBtn;

document.addEventListener('DOMContentLoaded', start, false);
function start(){
  getBtn = document.getElementById("get-btn")
  getBtn.addEventListener('click',sendData,false); 
}



// Wrapper for requests: 
const SendReq = (method, url, data) =>{
    const promise = new Promise((resolve, reject) =>{
        const xhr = new XMLHttpRequest(); 
        xhr.open(method, url); 

        xhr.responseType = 'json';

        if (data) {
          xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.onload = () => {
            if (xhr.status >= 400) {
              reject(xhr.response);
            } else {
              resolve(xhr.response);
            }
          };
      
          xhr.onerror = () => {
            reject('Something went wrong!');
          };
      
          xhr.send(JSON.stringify(data));
    }); 
    return promise; 
}


function get_pts(){
    var x = document.getElementById("points").value; 
    return x;     
}

function updateVal(k){
    const txt = document.getElementById("k"); 
    txt.innerHTML ="K = "+ k; 
}

const getK = () => {
	const x = document.getElementById("K").innerText.slice(3); 
	if(x!=""){
		return x;
	}
	else{
		return 5;
	}
} 

const sendData = () => { 
  console.log("CLICK")
    const points = get_pts(); 
    const k = getK(); 
    const data = {
        data: points, 
        k: k
    }
    const result_text = document.getElementById("sym")
    if (result_text != "") {
		SendReq('POST', './users', data).then(res=>{result_text.innerHTML = "Result: " + res;})
		.catch(err => result_text.innerHTML = "Result: Error!"); 
	}
}
