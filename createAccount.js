
const Port=process.env.PORT||3000;

const express = require("express");

const app = express();


app.listen(Port, function()
{
  console.log("Server started on port 3000.");

console.log("welcome2");
});


const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://nitesh:qwerty%401234554321@cluster0.j7e4p.mongodb.net/left-right?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});

mongoose.set("useCreateIndex",true);

var insuser=new mongoose.Schema({
name:String,
una:String,
pass:String,
email:String,
});

var iuser=new mongoose.model("iuser",insuser);



const {PROXYARR}=require('./config.js');


const { Builder, By, Key, until,Capabilities,executeScript} = require('selenium-webdriver');
const accountInfo = require('./accountInfoGenerator');
const verifiCode = require('./getCode');
const email = require('./createFakeMail');
var fs = require('fs');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var chrd=require('chromedriver');
let option;
var PROXY = "103.42.195.70:53281";
var prco=0;
option = new chrome.Options();
//option.addArguments(`--proxy-server=http://${PROXY}`);
 option.addArguments("--headless");
    option.addArguments("--disable-gpu");
    option.addArguments("--no-sandbox");
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);


const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));


var crea=1;

async function start(){
for(crea=1;crea<3;crea++){
console.log("cration start");
if(crea%15==0){
PROXY=PROXYARR[prco];prco=((prco+1)%PROXYARR.length);
//option = new chrome.Options().addArguments(`--proxy-server=http://${PROXY}`);
 option.addArguments("--headless");
    option.addArguments("--disable-gpu");
    option.addArguments("--no-sandbox");
}
console.log(crea,PROXY);

await fakeInstagramAccount();
console.log("cration end");
}

console.log("end");
}
async function fakeInstagramAccount() {
  
let browser = await new Builder().withCapabilities(Capabilities.chrome()).forBrowser('chrome').setChromeOptions(option).build();
 

    await browser.manage().deleteAllCookies();
 try {
    await browser.get("https://www.instagram.com/accounts/emailsignup/");
   var te1=await browser.findElement(By.tagName("body")).getText();
   console.log("intex ",te1);
   console.log("waiting 1 min");
    await sleep(60000);
    await sleep(5000);
    let fakeMail = await email.getFakeMail();
   console.log("fake mail ",fakeMail);
    await browser.findElement(By.name("emailOrPhone")).sendKeys(fakeMail, Key.RETURN);

var nam1=await accountInfo.generatingName();
    await browser.findElement(By.name("fullName")).sendKeys(nam1, Key.RETURN);
  
var una1=await accountInfo.username();
  await browser.findElement(By.name("username")).sendKeys(una1, Key.RETURN);
    await sleep(3000);
   
var newpass=Math.random().toString(36).slice(-8);
 await browser.findElement(By.name("password")).sendKeys(newpass, Key.RETURN);
 

await browser.findElement(By.xpath("//*[@type='submit']")).click();
  await sleep(4000);
    
console.log("birth start");   /*
await browser.findElement(By.xpath("//*[@id='react-root']/section/main/div/article/div/div[1]/div/div[4]/div/div/span/span[1]/select/option[3]")).click();
    await sleep(3000);
    await browser.findElement(By.xpath("//*[@id='react-root']/section/main/div/article/div/div[1]/div/div[4]/div/div/span/span[2]/select/option[12]")).click();
    await sleep(3000);
    await browser.findElement(By.xpath("//*[@id='react-root']/section/main/div/article/div/div[1]/div/div[4]/div/div/span/span[3]/select/option[26]")).click();*/
  

 await browser.findElement(By.xpath("//*[@title='Year:']/option[26]")).click();
//await executeScript(ms);
await sleep(3000);
 
//await executeScript(ms2).then((val)=>{console.log("ex",val);});
await browser.findElement(By.xpath("//*[@id='react-root']/section/main/div/div/div/div/div[6]/button")).click();
  

//await browser.findElement(By.xpath("//*[@type='button']")).click();
  

await sleep(5000);

    let fMail = fakeMail.split("@");
    let mailName = fMail[0];
    let domain = fMail[1];
  
await sleep(5000);

  let veriCode = await verifiCode.getInstCode(domain, mailName, browser);
    console.log("var ",veriCode);
    sleep(2000);
    await browser.findElement(By.name("email_confirmation_code")).sendKeys(veriCode, Key.RETURN);
var dat=String(new Date());
var fidata={
created_at:dat,
email:fakeMail,
pass:newpass,
name:nam1,
unam:una1
}
var neuse=new iuser({
name:nam1,
una:una1,
pass:newpass,
email:fakeMail
});

await neuse.save();



  } catch (e) {
    console.log(e);
  } finally { await browser.quit();
 sleep(2000); console.log("briwquit");} 

}
start();
