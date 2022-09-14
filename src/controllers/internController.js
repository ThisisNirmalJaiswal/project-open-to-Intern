const internModel = require("../models/internModel");
const emailValidator = require("email-validator");
const collegeModel = require("../models/collegeModel");
const { default: mongoose } = require("mongoose");
const { find } = require("../models/internModel");
const lowerCase = require("lower-case");
// ===============================================Regex For Validations================================================================================================
function validateName($name) {
    var nameReg = /^[A-Z]+[a-z ]*$/;
    if (!nameReg.test($name)) {
        return false;
    } else {
        return true;
    }
}


function validateMobile($mobile) {
    var mobileReg = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    if (!mobileReg.test($mobile)) {
        return false;
    } else {
        return true;
    }
}





// ================================================================ROUTE HANDLER FOR CREATE INTERN API====================================================================================

const createIntern = async function (req, res) {
    try {
        if (!req.body) return res.status(400).send({ status: false, msg: "Request Body Cant be Blank" })
        let internData = req.body;
    

        if (!internData.name) return res.status(400).send({ status: false, msg: "Name is A Mandatory Field,Please Input Name" });
        if (!validateName(internData.name)) return res.status(400).send({ status: false, msg: "InValid Name" });
        
        if (!internData.email) return res.status(400).send({ status: false, msg: "Email is A Mandatory Field,Please Input Email" });
        if (!emailValidator.validate(internData.email)) return res.status(400).send({ status: false, msg: "Invalid Email" });

        if (!internData.mobile) return res.status(400).send({ status: false, msg: "Mobile is A Mandatory Field,Please Input Mobile" });
        if (!validateMobile(internData.mobile)) return res.status(400).send({ status: false, msg: "InValid Mobile" });


        let uniqueMobileEmail = await internModel.find({ $or: [{ email: internData.email }, { mobile: internData.mobile }] });
        if (uniqueMobileEmail.length !== 0) {
            if (uniqueMobileEmail[0].email == internData.email) return res.status(400).send({ status: false, msg: "EmailId Already Exists,Please Input Another EmailId" })
            else { return res.status(400).send({ status: false, msg: "Mobile Number Already Exists,Please Input Another Mobile Number" }) }
        };

        let college = await collegeModel.findOne({ name: internData.collegeName, isDeleted: false });
        if (!college) return res.status(400).send({ status: false, msg: "No Such College Found,Please Enter A Valid College Name" })
        let id = college._id;


        let obj = {};
        obj.name = internData.name;
        obj.email = internData.email;
        obj.mobile = internData.mobile;
        obj.collegeId = id;


        let savedIntern = await internModel.create(obj);
        return res.status(201).send({ status: true, data: savedIntern });
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }
};


module.exports.createIntern = createIntern;


