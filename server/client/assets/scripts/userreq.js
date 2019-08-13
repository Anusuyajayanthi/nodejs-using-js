var xmlhttp = new XMLHttpRequest();
function userReg()
{
    var storeData = {
        username : document.getElementById("username").value,
        email : document.getElementById("email").value,
        password : document.getElementById("password").value,
        cPassword : document.getElementById("confirm_password").value
    };
    if(storeData.password==storeData.cPassword){
        message.innerHTML = "ok!"
    }
    else{
        message.innerHTML="Wrong";
        return;
    }
    if((storeData.username == "" )||(storeData.email == "") || (storeData.password == "") || (storeData.cPassword == ""))
    {
        alert("please fill all fields");
        return;
    }
    var email = document.getElementById("email").value;
    console.log(document.getElementById("email").value);
    xmlhttp.onreadystatechange = function(){
        console.log(this.readyState == 4 && this.status == 200);
        if(this.readyState == 4 && this.status == 200)
        {
            window.location="/login";
            alert("register successfully");
        }
        else if(this.readyState == 4 && this.status == 401){
            message.innerHTML = "unauthorized user";
            window.location="/register.html";
        }
        else {
            message.innerHTML ="error";
        }
    };
    xmlhttp.open("POST", "/userRegister");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(storeData));

}





function log_user(){
    var checkData = {
        email : document.getElementById("email").value,
        password : document.getElementById("password").value
    };
    xmlhttp.open("POST", "/login", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(checkData));
    xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 )
        {
            if(this.status ===200)
            {   
                alert("login successfully");
                window.localStorage.setItem('mystorage',xmlhttp.response); 
                location.href="/home";
            } 
        }
        console.log("login failed");
        document.getElementById("demo").innerHTML="login failed";
    }
}
   

//product insert page//
function insert_product(){
    alert("fdsfds");
    console.log(document.getElementById("prod_name").value);
    var getvalue = JSON.parse(localStorage.getItem('mystorage'));
    var product = {
        productname : document.getElementById("prod_name").value,
        ownername  : getvalue.username,
        ownerid : getvalue._id,
        producturl : document.getElementById("product_url").value
    };
    xmlhttp.onreadystatechange = function(){
        console.log(this.readyState == 4 && this.status == 200);
        if(this.readyState == 4 && this.status == 200){
            console.log("added success");
            window.location="/home";
            window.localStorage.setItem('updateid',xmlhttp.response); 
        }
    };
    xmlhttp.open("POST", "/product");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(product));
}


function insert_value(){
    window.location="/product.html";
};


//show data  

function createTable(){
    var getvalue = JSON.parse(localStorage.getItem('mystorage'));
    var product = {
         ownerid : getvalue._id,
    };
    xmlhttp.open("POST", "/product_show");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(product));
    xmlhttp.onreadystatechange = function(){
        console.log(this.readyState == 4 && this.status == 200);
        if(this.readyState == 4 && this.status == 200){
            var ret_data = JSON.parse(xmlhttp.response);
            // console.log(JSON.stringify(ret_data));
            var tbl1 = '';
            console.log(ret_data.length, "length");
            for(var i=0 ; i < ret_data.length ; i++){
                tbl1 += `
                <tr><td id ="pro_id">${ret_data[i]._id}</td>
                <td>${ret_data[i].productname}</td>
                <td>${ret_data[i].ownername}</td>
                <td>${ret_data[i].ownerid}</td>
                <td>${ret_data[i].producturl}</td>
                <td><input type="button" name="edit" objid=${ret_data[i]._id} value="edit" onclick="window.location = 'editproduct?id=${ret_data[i]._id}'"</td>
                <td><input type="button" name="del" setAttribute("object_id", ${ret_data[i]._id}) value="delete" onclick="deletedata(this)"/></td></tr> `;
            }
            var div = document.getElementById('productsInformation');
            div.innerHTML += tbl1;
            
        }
        
    };
}

//update product

function update_product(){
    var parameters = new URL(window.location).searchParams;
    var del= {id:parameters.get('id')};
    console.log(del);
    xmlhttp.open("POST", "/find_product");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(del));
    xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        
        var row_value = JSON.parse(xmlhttp.response);
        console.log(row_value);
       document.getElementById("prod_name").value = row_value[0].productname;
       document.getElementById("product_url").value = row_value[0].producturl;
    }
}
}

function update(obj){
    // var data=obj.getAttribute("object_id");
    var parameters = new URL(window.location).searchParams;
    var del= {id:parameters.get('id')};
    console.log(del);
    var upData = {
        productname : document.getElementById("prod_name").value,
        producturl : document.getElementById("product_url").value,
        id:del.id
};
    xmlhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            window.location="/home";   
        }
        console.log(upData);
    };
    xmlhttp.open("POST", "/update_product");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(upData));
}



//Delete product

function deletedata(data){
   console.log(data.parentNode.parentNode.childNodes[0].innerHTML);
   var del_data = ({id:data.parentNode.parentNode.childNodes[0].innerHTML});
//    console.log(del_data);
//   console.log(data.parentNode.parentNode.childNodes[1].innerHTML);
    xmlhttp.onreadystatechange = function(){
       
        console.log(this.readyState == 4 && this.status == 200);
        if(this.readyState == 4 && this.status == 200){

            console.log("delete success");
            window.location="/home";
           
        }
    };
    xmlhttp.open("POST", "/deleteproduct");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(del_data));
}
            
