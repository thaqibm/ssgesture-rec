// Managing HTTP requests. 


const getBtn = document.getElementById('get-btn');

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

const sendData = () => { 
    const points = get_pts(); 
    const data = {
        data: points
    }
    SendReq('POST', './users', data).then(res=>console.log(res)).catch(err => console.log(err)); 
}

getBtn.addEventListener('click', sendData); 