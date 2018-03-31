//import the orm
var orm = require("../config/orm.js");

var home = {
    selectAllListing: function (cb) {
        orm.selectAll("", function (res) {
            cb(res);
        });
    },
    allBlogs: function (cb) {
        orm.selectAll("blogs",function (res) {
            cb(res);
        });
    },
    selectAllMailingList: function (cb) {
        orm.selectAll("mailing_list", function (res) {
            cb(res);
        });
    },
    checkifUrsExist: function (cols, vals, cb) {
        orm.checkifUrsExist("realtor_list", cols, vals, function (res) {
            cb(res);
        });
        // orm.checkingUsr("mail_listing", cols, vals, function (res){
        //     cb(res);
        // });
    },
    validateUsrPwd: function (cols, vals, cb) {
        orm.validateUsr("realtor_list", cols, vals, function (res){
            cb(res);
        });
    },
    insertBlog: function (cols, vals, cb) {
        orm.insert("blogs", cols, vals, function (res) {
            cb(res);
        });
    },
    insertUsr: function (cols, vals, cb) {
        orm.insert("realtor_list", cols, vals, function (res) {
            cb(res);
        });
    }
};

//Export the database funciton form the controller (homesController.js)
module.exports = home;
