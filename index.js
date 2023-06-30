//const http=require('http');

import Express from "express";
import mySQL from 'mysql';
import path from 'path';
import { fileURLToPath } from "url";
import fs, { readFile } from 'fs';


//console.log(logged_data);
let datum={};
const App=Express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const con=mySQL.createPool({
    host:"sql12.freesqldatabase.com",
    user:"sql12629742",
    password:"QBpwr8EgJr",
    database:"sql12629742",
    port:"3306"
});
function Query(query){
    con.query(query,function(err,data){
        if(err){console.log(err);return;}
      //  console.log(JSON.stringify(data));
    })
}

function Valid(){
    con.query("select * from userregis",(err,data)=>{
        if(err){console.log(err);return;}
        datum=JSON.parse(JSON.stringify(data));
      //  console.log(datum);
    })
}
function checkInDB(data){
    const {Email,password}=data;
   // console.log(datum);
    for(let i=0;i<datum.length;i++){
        if((datum[i].Email===Email || datum[i].UserName===Email)&& datum[i].password===password){
            return true;
        }
    }
    return false;
}


Valid();
//MIddleWare
App.use(Express.urlencoded({extended:true}));
App.use(Express.json());
App.use(Express.static('public'));
//const home=fs.readFileSync("./index.html","utf-8");


 

//Server Suing expresss
App.post('/submitted',(req,res)=>{
    console.log(req.body);
   let {Firstname,Lastame,Email,UserName,password}=req.body;
    Query(`insert into userregis values("${Firstname}","${Lastame}","${Email}","${UserName}","${password}");`)
    res.sendFile(__dirname+"/template/successpage.html")
    Firstname=undefined;Lastame=undefined;Email=undefined;UserName=undefined;password=undefined;
})

App.get('/logout',  function (req, res, next)  {
   res.sendFile(__dirname+"/template/index.html");
});

App.get('/',(req,res)=>{
   // res.setHeader("Content-type","text/html")
    res.status(200);
    res.sendFile(__dirname+"/template/index.html");
})
App.post('/profile',(req,res)=>{
    let index=fs.readFileSync(__dirname+'/template/index.html',"utf-8");
    
    const reqCon=req.body;
    console.log(reqCon);
    const flag=checkInDB(reqCon);
    console.log(flag);
    index=index.replace(/"%flag%"/g,flag);
    if(!flag)
        res.status(200).header("Content-type","text/html").send(index);
    else{
    let logged_data=fs.readFileSync(__dirname+"/template/logged page.html","utf-8");
    function checkAdmin(email=undefined,pass=undefined,username=undefined){
       // console.log(email,pass,username);
        const Email="vanshajtiwari62@gmail.com";
        const userName="vanshajt01";
        const password="123456789";
        let i=0;
        for(;i<datum.length;i++){
            if((email===Email || username===userName)&&(password===pass)){
               return true;
            }
            else return false;
        }

    }
  //  console.log(req.body);
    const {Email,password}=req.body;
    if(checkAdmin(Email,password,Email)){
        let  data="";
        logged_data=logged_data.replace(/%username%/g,Email);   
        logged_data=logged_data.replace(/%admin%/g,Email);
     //   let htmlCon="";
        for(let i=0;i<datum.length;i++){
            data+=`<tr>
            <td>%Firstname%</td>
            <td>%Lastname%</td>
            <td>%Username%</td>
            <td>%Email%</td>
            <td>%password%</td>
      </tr>`;
            data=data.replace(/%Firstname%/g,datum[i].FirstName);
            data=data.replace(/%Lastname%/g,datum[i].LastName);
            data=data.replace(/%Username%/g,datum[i].Email);
            data=data.replace(/%Email%/g,datum[i].UserName);
            data=data.replace(/%password%/g,datum[i].password);
        }
       
        logged_data=logged_data.replace(/%datum%/g,data);
        res.status(200);
        res.setHeader("Content-type",'text/html');
        res.send(logged_data);
        data=""; 
    }
    // 
   else {
    logged_data=logged_data.replace(/%username%/g,Email); 
    res.status(200);
    res.header("Content-type",'text/html');  
    res.send(logged_data);}
    }});
App.listen("3000","127.0.0.1",console.log("Server Listening Your Requests"));


// http.createServer((req,res)=>{
//     const pathName=req.url;
//     http.get();
//     if(pathName==="/" || pathName==="Home" || pathName==="home")
//         res.end(home);
// }).listen(8000,'127.0.0.1',()=>{
//     console.log('Listening to request on port 8000');
// }); 