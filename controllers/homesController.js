var express = require("express");
var request = require("request");

var home = require("../models/homesModel");

var router = express.Router();

var notifier = require('node-notifier');


//create all route

//root route to sherlock homes main page
router.get("/", function (req, res) {
    res.render("index");
});

//landing page for realtors
router.get("/realtor/:name", function (req, res) {
    var name = req.params.name;
    home.selectAllMailingList(function (data) {
        var mailingData = {
            mailings: data,
            name: name
        }
        res.render("realtor", mailingData);
    });
    notifier.notify("Successfully Logged In");
});

//sherlock homes admin page
router.get("/admin", function (req, res) {
    home.allBlogs(function (data) {
        var blogData = {
            blogs: data
        }
        res.render("admin", blogData);
    });
    notifier.notify("Successfully Logged In");
});

router.get("/login",function (req,res) {
    res.render("login");
});

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.get("/listings", function (req, res) {
    res.render("listing");
});

router.get("/blog", function (req, res) {
    home.allBlogs(function (data) {
        var blogData = {
            blogs: data
        }
        res.render("blog", blogData);
    });
});


//all post routes

//post route to check if the user exists and if so allow user to login
router.post("/login", function (req, res) {

    //check the database to check if the username exists
    home.checkifUrsExist(["email"],[
            req.body.username],
        function(result) {

            //if the user exist, then query the database. else redirect them to the sign up page
            if (result[0].total === 1){


                //query the data and get users informaiton
                home.validateUsrPwd(["email"],[
                    req.body.username],
                function(result) {

                    //if the username and pwd provide equal the same informin the database, then redirect them to the admin page
                    //else redirect them back to the login page
                    if (req.body.username === result[0].email && req.body.pwd === result[0].password) {

                        if(result[0].access_type === "admin"){
                            notifier.notify("Successfully Logged In");
                            return res.status(200).send({result: "redirect", url: "/admin"});
                        } else {
                            var name = result[0].first_name + " " + result[0].last_name;
                            notifier.notify("Successfully Logged In");
                            return res.status(200).send({result: "redirect", url: "/realtor/"+ name});
                        }
                    } else {
                        notifier.notify("Wrong Password");
                        return res.status(200).send({result: "redirect", url: "/login"});
                    }
                });

            } else {
                notifier.notify("You do not have an Account with Sherlock Homes! Please create an account");
                return res.status(200).send({result: "redirect", url: "/signup"});

            }
        });

});

//adding new usering into the database
router.post("/signup/newuser", function (req, res) {

    //check to see if the users email already exist in the system.
    home.checkifUrsExist(["email"],[req.body.email], function (result) {

        //if the user exist, then redirect them to the login page. else add the new user to the database
        if (result[0].total === 1) {
            //let the user know that the they exist in the database
            notifier.notify("Your Account already exists!");
            //redirect to login
            return res.status(200).send({result: "redirect", url: "/signup"});

        } else {
            //set access to user level
            var access_type = "user";
            //split the email
            var emailChecker = req.body.email.split("@");

            //if the email end with sherlockhomes.com, then upgrade the account to admin level access
            if (emailChecker[1] === "sherlockhomes.com") {
                access_type = "admin"
            }

            //insert the user in the database
            home.insertUsr(["email","first_name","last_name","password","company","access_type"],[req.body.email, req.body.firstName, req.body.lastName, req.body.pwd, req.body.company, access_type], function (ressult) {
                res.status(200).end()
            });
            //let the user know their account has been created
            notifier.notify("Your account has been sucessuflly created");
            //redirect to the login page
            return res.status(200).send({ result: "redirect", url: "/signup" });

        }
    });

});


//post router on getting property API
router.post("/listings/query", function (req, res) {
    console.log(req.body);
    console.log("post route fired");
    var state = req.body.state;
    var city = req.body.city;
    var zipcode = req.body.zipcode;

    var baseURL = 'https://search.onboard-apis.com/propertyapi/v1.0.0/assessment/detail?postalcode=' + zipcode;

    //===============================================================================================================================================

    request({
        url: baseURL,
        method: "GET",
        headers: {
            apikey: "4b1160e947405c82fcd5633d6fa81929",
            accept: "application/json"
        }
    }, function (error, response, body) {
        // console.log(response)
        var body = JSON.parse(body);
        var data = body.property.map(function (p) {
            return {

                address: p.address.oneLine,
                marketValue: p.assessment.market.mktttlvalue,
                Taxes: p.assessment.tax.taxamt,
                yearBuilt: p.summary.yearbuilt
            }

        });
        console.log(data);

        res.json(data);


    });


});

router.post("/admin/newblog",function (req, res) {

    home.insertBlog(["title_header","title_descrip","created_at","blog_content"],
        [req.body.header, req.body.title, req.body.created_at, req.body.cont], function (result) {
            res.status(200).end()
        });
});


//Export routes for homesServer.js to use
module.exports = router;
