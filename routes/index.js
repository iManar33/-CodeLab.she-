var express = require('express');
var router = express.Router();
const Nexmo = require('nexmo');
var mongoose=require('mongoose'); //add(call) a package called mongoose to use the database
// To connect using a driver via the standard MongoDB URI
mongoose.connect('mongodb://iManar:3356776533mmm@ds233238.mlab.com:33238/codelab_me').then(function (){ 

	console.log("connected")

}
).catch(

function (error){
console.log(error.message)
});

//Product API Model
var Brand =mongoose.model('Brand',{ 
	brandName:String,
	brandImg:String,
	brandDescriptiopn:String,
	product:{
		productName:String,
		productPrice:Number, 
		productExpDate:Date , 
		productImg:String, 
		productDescription:String, 
		productType:String,
			},
});
var val = Math.floor(1000 + Math.random() * 9000);
console.log(val);

// render the Home Page
router.get('/',function(req,res){
res.render('index');
});

// render the MakeUP Page
router.get('/MakeUP',function(req,res){
res.render('MakeUP');
});

// render the skinCare Page
router.get('/skinCare',function(req,res){
res.render('skinCare');
});

// render the tools Page
router.get('/tools',function(req,res){
res.render('tools');
});

// render the dashBoard Page
router.get('/dashboard',function(req,res){
res.render('dashboard');
});

// the Products API
router.get('/api/brands',function(req,res){
 Brand.find(function (error, brands) {
        res.json(brands);
})
});

// initial the Nexmo API Library
const nexmo = new Nexmo({
  apiKey: '7a4fae2f',
  apiSecret: '9aGqilp9mwDryexe'
});

 // SMS API model
var Sms =mongoose.model('Sms',{
toNumber:String,
verifyCode:String,
});

// the SMS API
router.get('/api/sms',function(req,res){
 Sms.find(function (error, smss) {
        res.json(smss);
})
});
// add the Phone number to the API
router.post('/api/sms', function (req, res) {
    var adding = req.param('sms')
     var val = Math.floor(1000 + Math.random() * 9000); //create a random 4-digit number
     adding.verifyCode=val;
     console.log( adding.verifyCode);
    var newSms = new Sms(adding);
    newSms.save().then(function () {
        res.json({
            isSuccess: true,
            message: "Saved!",        

        });
         //send SMS
        const from = 'Nexmo';
var to = adding.toNumber;
var text = 'the code for ' +adding.toNumber+' is '+adding.verifyCode;

nexmo.message.sendSms(from, to, text, (error, response) => {
  if(error) {
    throw error;
  } else if(response.messages[0].status != '0') {
    console.error(response);
    throw 'Nexmo returned back a non-zero status';
  } else {
    	console.log(response);
  	
  	   }
});


    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    })
});

// delete a Product from the API
router.delete('/api/brands',function (req,res) {
    var id = req.param('id');
   Brand.findByIdAndRemove(id).then(function () {
       res.json({
           isSuccess: true,
           message: "Deleted!",
       });
   }).catch(function (error) {
       res.json({
           isSuccess: false,
           message: error.message,
       });
   })
});

// update a Product from the API
router.put('/api/brands',function (req,res) {
   var editing = req.param('brand');
    Brand.findByIdAndUpdate(editing._id,editing).then(function () {
        res.json({
            isSuccess: true,
            message: "Updated!",
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message,
        });
    });
});

// create a Product in the API
router.post('/api/brands', function (req, res) {
    var adding = req.param('brand')
    var newBrand = new Brand(adding);
    newBrand.save().then(function () {
        res.json({
            isSuccess: true,
            message: "Saved!",
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    })
});
// /* GET home page. */
// router.get('/', function(req, res) {
//  var mm=new Sms({
// toNumber:'+9647702876880',
// verifyCode:'3333',
//  });
//  mm.save().then(function () {
//         res.json({
//             isSuccess: true,
//             message: "Saved!"
//         });
//     }).catch(function (error) {
//         res.json({
//             isSuccess: false,
//             message: error.message
//         });
//     })
// res.json(mm);
//  res.render('index');
// });



//  var Maybelline= new Brand({ 
// brandName:"Maybelline",
// brandImg:"https://www.shopaholic.com.pk/image/cache/catalog/brands/maybelline-logo-600x315.jpg",
// brandDescriptiopn:"Maybelline LLC, branded as Maybelline New York, is a major American makeup brand sold worldwide and a subsidiary of French cosmetics company L'Oréal",
// toNumber:"+9647702876880",
// verifyCode:"3333",
// product:{
// 	productName:"LASH SENSATIONAL® WASHABLE MASCARA", 
// 	productPrice:15, 
// 	productExpDate:2019/12/12 , 
// 	productImg:"https://images-na.ssl-images-amazon.com/images/I/818RQ2zeQ%2BL._SY355_.jpg", 
// 	productDescription:"Achieve layers of lashes for a sensational full-fan effect.",
// 	productType:"makeup"},
// });
//  // Maybelline.save();
 
//  //insert customer object
// // Maybelline.save((err,cust) => {
// //     if(err) return console.error(err);

// //     //this will print inserted record from database
// //     console.log(cust);

// Maybelline.save().then(function () {
//         res.json({
//             isSuccess: true,
//             message: "Brand Saved!"
//         });
//     }).catch(function (error) {
//         res.json({
//             isSuccess: false,
//             message: error.message
//         });
//     })
// res.json(Maybelline);
//  // res.render('index');
// });

module.exports = router;
