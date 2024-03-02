const base = `https://docs.google.com/spreadsheets/d/13vXih5gnCe6CyZpnl3Asa-MyVae7Uh9Hcp3Nm8w3fgQ/gviz/tq?`;
let UrlUsers = base + "&sheet=Users&tq=" + encodeURIComponent('Select *');
let DataUsers = [];
let UrlAccounts = base + "&sheet=PrinterType&tq=" + encodeURIComponent('Select *');
let DataCustomers = [];
document.addEventListener('DOMContentLoaded', LoadScript)
function LoadScript() {
    let Loading=document.getElementById("LoadingFormBrowser");
    let FormLoad=document.getElementById("FormLoad");
    Loading.className="fa fa-refresh fa-spin";
    ConvertMode();
    LoadUsers();
    const myTimeout = setTimeout(function(){ 
      FormLoad.style.display="none";
      Loading.className="fa fa-refresh";
    clearTimeout(myTimeout);
    }, 2500);
  if (typeof(Storage) !== "undefined") {
    if( localStorage.getItem("PassWord")!=null){
      document.getElementById("User_PassWord").value=localStorage.getItem("PassWord");
    }
    if( localStorage.getItem("User_Index")!=null){
        ShowSelectForm(localStorage.getItem("ActiveForm"));
      if(localStorage.getItem("ActiveForm")=="purchasesWi"){
        LoadpurchasesWi();
      }
      if(localStorage.getItem("ActiveForm")=="purchasesWi1"){
        LoadpurchasesWi1();
      }
      document.getElementById("Myusername").value=localStorage.getItem("User_Name");
      
    }
  }
}



function ShowSelectForm(ActiveForm){
  document.getElementById("loginPage").style.display="none";
  document.getElementById("Main").style.display="none";
  document.getElementById("purchasesWi").style.display="none";
  document.getElementById("purchasesWi1").style.display="none";
  document.getElementById(ActiveForm).style.display="flex";
  localStorage.setItem("ActiveForm",ActiveForm);
}


// *************************************Main**************

function ShowpurchasesWi1(){
  ShowSelectForm("purchasesWi1");
  LoadpurchasesWi1();
}

function ShowpurchasesWi(){
  ShowSelectForm("purchasesWi");
   LoadpurchasesWi();
}

function SignOutUser(){
  localStorage.removeItem("User_Index");
  localStorage.removeItem("User_Name");
  localStorage.removeItem("UserCode");
  document.getElementById('Myusername').value="";
  ShowSelectForm("loginPage");
}
function GoToMain(){
  ShowSelectForm("Main");
}
// **********************Loading*****************
function LoadUsers(){
  DataUsers=[];
  fetch(UrlUsers)
  .then(res => res.text())
  .then(rep => {
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      const colzUser = [];
      jsonData.table.cols.forEach((heading) => {
          if (heading.label) {
              let columnUser = heading.label;
              colzUser.push(columnUser);
          }
      })
      jsonData.table.rows.forEach((rowData) => {
          const rowUser = {};
          colzUser.forEach((ele, ind) => {
              rowUser[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
          })
          DataUsers.push(rowUser);
      })
  })
}

function LoadCustomers(){
  DataCustomers=[];
  fetch(UrlAccounts)
  .then(res => res.text())
  .then(rep => {
      const jsonData1 = JSON.parse(rep.substring(47).slice(0, -2));
      const colzCustomers = [];
      jsonData1.table.cols.forEach((heading1) => {
          if (heading1.label) {
              let columnCustomers = heading1.label;
              colzCustomers.push(columnCustomers);
          }
      })
      jsonData1.table.rows.forEach((rowData1) => {
          const rowCustomers = {};
          colzCustomers.forEach((ele, ind) => {
              rowCustomers[ele] = (rowData1.c[ind] != null) ? rowData1.c[ind].v : '';
          })
          DataCustomers.push(rowCustomers);
      })
      LoadCustomerName()
  })
}

function LoadCustomerName(){
  let CustomerName,AccountNum;
  let optionClass;
  let ListCustomers =document.getElementById("Device_Type");
  ListCustomers.innerHTML="";
  for (let index = 0; index < DataCustomers.length; index++) {
    AccountNum=DataCustomers[index].AccountNum;
    CustomerName=DataCustomers[index].CustomerName;
    if(AccountNum!=""){
      optionClass=document.createElement("option");
      optionClass.value=CustomerName;
      optionClass.textContent=CustomerName;
      ListCustomers.appendChild(optionClass);
    }
  }
}
// ***************Sign On**************
function IsfoundUser(TPassWord){
  let error_User_ID= document.getElementById("error_User_ID");
    for (let index = 0; index < DataUsers.length; index++) {
      if(TPassWord==DataUsers[index].PassWord){
        localStorage.setItem("User_Index", index);
        return true;
      }
    }
      error_User_ID.className="fa fa-warning";
      return false ;
  }

  function foundIndex(TPassWord){
      for (let index = 0; index < DataUsers.length; index++) {
        if(TPassWord==DataUsers[index].PassWord){
          return index;
        }
      }
      return -1
    }
  
function Istrue(TPassWord){
  let error_User_ID= document.getElementById("error_User_ID");
  if(TPassWord===""){ error_User_ID.className="fa fa-warning"; return false;}else{ error_User_ID.className="" }
  if(IsfoundUser(TPassWord)===false){return false}else{error_User_ID.className=""}
  return true;
}

function Sign_In(){
  let User_PassWord= document.getElementById("User_PassWord");
  if (Istrue(User_PassWord.value)===true){
    let User_Index = localStorage.getItem("User_Index");
    if(DataUsers[User_Index].IsM=="Yes"){
    localStorage.setItem("User_Name", DataUsers[User_Index].UserName);
    localStorage.setItem("PassWord",DataUsers[User_Index].PassWord);
    localStorage.setItem("UserCode",DataUsers[User_Index].UserCode);
    ShowSelectForm("Main");
    location.reload();
  };
  }
}

function ShowPassword(){
  let User_PassWord= document.getElementById("User_PassWord");
  let Eye_Password= document.getElementById("Eye_Password");
  if (Eye_Password.className=="fa fa-eye"){
    User_PassWord.type="text";
    Eye_Password.className="fa fa-eye-slash";
  }else{
    User_PassWord.type="password";
    Eye_Password.className="fa fa-eye";
  }
}

// ***********************Mode*********************
function ConvertMode(){
  if (localStorage.getItem("FColor")==1){
    ConvertModeToSun();
  }else{
    ConvertModeToMoon();
  }
 }

function ConvertModeToSun(){
  localStorage.setItem("FColor", 1);
  document.getElementById("Moon").style.display="inline-block";
  document.getElementById("Sun").style.display="none";
  document.querySelector(':root').style.setProperty('--FColor', "wheat"); 
  document.querySelector(':root').style.setProperty('--EColor', "white");
  document.querySelector(':root').style.setProperty('--loginColor', "whitesmoke"); 
  document.querySelector(':root').style.setProperty('--FontColor', "#f2a20b"); 
  document.querySelector(':root').style.setProperty('--Font2Color', "#a53333"); 
  document.querySelector(':root').style.setProperty('--Font3Color', "#a53333");
  document.querySelector(':root').style.setProperty('--THColor', "wheat");  
  document.querySelector(':root').style.setProperty('--TDColor', "yellow"); 
} 
function ConvertModeToMoon(){
  localStorage.setItem("FColor", 2);
  document.getElementById("Sun").style.display="inline-block";
  document.getElementById("Moon").style.display="none";
  document.querySelector(':root').style.setProperty('--FColor', "#141e30"); 
  document.querySelector(':root').style.setProperty('--EColor', "#243b55");
  document.querySelector(':root').style.setProperty('--loginColor', "#00000080"); 
  document.querySelector(':root').style.setProperty('--FontColor', "white"); 
  document.querySelector(':root').style.setProperty('--Font2Color', "#d3f6f8"); 
  document.querySelector(':root').style.setProperty('--Font3Color', "black"); 
  document.querySelector(':root').style.setProperty('--THColor', "gray");  
  document.querySelector(':root').style.setProperty('--TDColor', "Red"); 
}  

// ********************purchasesWi
function LoadpurchasesWi(){
  let Loading=document.getElementById("LoadingFormBrowser");
  let FormLoad=document.getElementById("FormLoad");
  Loading.className="fa fa-refresh fa-spin";
  FormLoad.style.display="flex";
  const myTimeout = setTimeout(function(){ 
    FormLoad.style.display="none";
    Loading.className="fa fa-refresh";
  clearTimeout(myTimeout);
  }, 1000);
}
 function OnchangeMyinput(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxt").textContent = curFiles ;
  }
  function OnchangeMyinput1(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxt1").textContent = curFiles ;
  }
  function OnchangeMyinput2(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxt2").textContent = curFiles ;
  }
  function OnchangeMyinput3(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxt3").textContent = curFiles ;
  }
  function OnchangeMyinput4(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxt4").textContent = curFiles ;
  }
  function OnchangeMyinput5(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxt5").textContent = curFiles ;
  }
  function DeleteMyinput(){
    document.getElementById("Myfile").value = '' ;
    document.getElementById("MyfileTxt").textContent = '' ;
  }
  function DeleteMyinput1(){
    document.getElementById("Myfile1").value = '' ;
    document.getElementById("MyfileTxt1").textContent = '' ;
  }
  function DeleteMyinput2(){
    document.getElementById("Myfile2").value = '' ;
    document.getElementById("MyfileTxt2").textContent = '' ;
  }
  function DeleteMyinput3(){
    document.getElementById("Myfile3").value = '' ;
    document.getElementById("MyfileTxt3").textContent = '' ;
  }
  function DeleteMyinput4(){
    document.getElementById("Myfile4").value = '' ;
    document.getElementById("MyfileTxt4").textContent = '' ;
  }
  function DeleteMyinput5(){
    document.getElementById("Myfile5").value = '' ;
    document.getElementById("MyfileTxt5").textContent = '' ;
  }
// **************************purchasesBrowser***********
function LoadpurchasesWi1(){
  let Loading=document.getElementById("LoadingFormBrowser");
  let FormLoad=document.getElementById("FormLoad");
  Loading.className="fa fa-refresh fa-spin";
  FormLoad.style.display="flex";
  LoadCustomers();
  const myTimeout = setTimeout(function(){ 
    FormLoad.style.display="none";
    Loading.className="fa fa-refresh";
  clearTimeout(myTimeout);
  }, 1000);
}
 function OnchangeMyinputp(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxtp").textContent = curFiles ;
  }
  function OnchangeMyinputp1(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxtp1").textContent = curFiles ;
  }
  function OnchangeMyinputp2(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxtp2").textContent = curFiles ;
  }
  function OnchangeMyinputp3(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxtp3").textContent = curFiles ;
  }
  function OnchangeMyinputp4(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxtp4").textContent = curFiles ;
  }
  function OnchangeMyinputp5(myfile){
    if(myfile.value===undefined){return} ; 
    let curFiles = myfile.files.item(0).name;
    document.getElementById("MyfileTxtp5").textContent = curFiles ;
  }
  function DeleteMyinputp(){
    document.getElementById("Myfilep").value = '' ;
    document.getElementById("MyfileTxtp").textContent = '' ;
  }
  function DeleteMyinputp1(){
    document.getElementById("Myfilep1").value = '' ;
    document.getElementById("MyfileTxtp1").textContent = '' ;
  }
  function DeleteMyinputp2(){
    document.getElementById("Myfilep2").value = '' ;
    document.getElementById("MyfileTxtp2").textContent = '' ;
  }
  function DeleteMyinputp3(){
    document.getElementById("Myfilep3").value = '' ;
    document.getElementById("MyfileTxtp3").textContent = '' ;
  }
  function DeleteMyinputp4(){
    document.getElementById("Myfilep4").value = '' ;
    document.getElementById("MyfileTxtp4").textContent = '' ;
  }
  function DeleteMyinputp5(){
    document.getElementById("Myfilep5").value = '' ;
    document.getElementById("MyfileTxtp5").textContent = '' ;
  }
