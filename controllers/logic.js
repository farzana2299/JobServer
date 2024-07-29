const { admin, user, company, jobPost, userJob, savedJob } = require("../models/collection")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//adminLogin
const adminLogin = (req, res) => {
    const { uname, psw } = req.body
    admin.findOne({ uname }).then(ad => {
        if (ad) {
            if (ad.psw == psw) {
                res.status(200).json({
                    message: "Login succesfully",
                    status: true,
                    statusCode: 200,
                })
            } else {
                res.status(404).json({
                    message: "Incorrect Password",
                    status: false,
                    statusCode: 404
                })
            }
        } else {
            res.status(404).json({
                message: "Incorrect data",
                status: false,
                statusCode: 404
            })
        }
    })

}

//admin-userdata
const usersData = (req, res) => {
    user.find().then(data => {
        if (data) {
            res.status(200).json({
                message: data,
                status: true,
                statusCode: 200
            })
        } else {
            alert("error in loading data")
        }
    })
}
//admin-company data
const companyData = (req, res) => {
    company.find().then(data => {
        if (data) {
            res.status(200).json({
                message: data,
                status: true,
                statusCode: 200
            })
        } else {
            alert("error in loading data")
        }
    })
}
//company reg
const companyReg = async (req, res, next) => {
    const { cname, email, psw, logo } = req.body;
    if (!cname || !email || !psw || !logo) {
        return next("Company name, email, and password are all required");
    }
    const hashedPw = await bcrypt.hash(psw, 10);
    const existingUser = await user.findOne({ email });
    if (existingUser) {
        return next("Email already registered as a user");
    }
    const existingCompany = await company.findOne({ email });
    if (existingCompany) {
        return res.status(400).json({
            message: "Email already registered",
            status: false,
            statusCode: 400,
        });
    }
    const newCompany = await company.create({ cname, email, psw: hashedPw, logo });
    res.status(201).json({
        message: "Registered Successfully",
        status: true,
        statusCode: 201,
        company: newCompany,
    });
};




//company login

const companyLogin = async (req, res) => {
    const { email, psw } = req.body;
    if (!email || !psw) {
        return next("Please Provide all fields")
    }
    try {
        const comp = await company.findOne({ email })
        if (comp) {
            const token = jwt.sign({ _id: comp._id }, "superkey123")
            res.status(200).json({
                message: "Login successfully",
                status: true,
                statusCode: 200,
                _id: comp._id,
                cname: comp.cname,
                logo: comp.logo,
                token
            });
        }
        else {
            res.status(404).json("incorrect username or password")
        }


    } catch (err) {
        res.status(401).json("Login api not working")


    }

}
//add job
const addJob = async (req, res, next) => {
    const { title, category, role, location, state, salary, jobtype, experience, cname, cid, logo } = req.body


    if (!cid) {
        return next("cid requirerd")
    }

    if (!title) {
        return next("Title required")
    }
    if (!category) {
        return next("Category required")
    }
    if (!role) {
        return next("Job role required")
    }
    if (!state) {
        return next("State required")
    }
    if (!salary) {
        return next("Salary required")
    }
    if (!jobtype) {
        return next("Job type required")
    }
    if (!experience) {
        return next("Experience required")
    }

    if (cid) {
        const Data = await company.findOne({ _id: cid });
        if (Data) {
            try {
                const jobadd = await jobPost.create({
                    // jid,
                    title,
                    category,
                    role,
                    location,
                    salary,
                    state,
                    jobtype,
                    experience,
                    cname,
                    cid,
                    logo: Data.logo
                });

                res.status(201).json({
                    message: "Job Posted",
                    status: true,
                    statusCode: 201,
                    jobadd,
                });
            } catch (error) {
                return next(error);
            }

        }
        else {
            res.status(400).json("no such data")
        }
    }
    else {
        res.status(401).json("no such id")
    }
}
//company job details
const allJob = async (req, res) => {
    const cid = req.payload
    const data = await jobPost.find({ cid })
    if (data) {
        res.status(200).json({
            message: data,
            status: true,
            statusCode: 200
        })
    } else {
        alert("error in loading data")
    }
}
//edit job
const editJob = async (req, res, params) => {

    const { id } = req.params
    console.log("query", req.params);
    const { title, category, role, location, salary, state, jobtype, experience, } = req.body
    try {
        const data = await jobPost.findById(id)

        if (data) {
            data.title = title,
                data.category = category,
                data.role = role,
                data.location = location,
                data.salary = salary,
                data.state = state,
                data.jobtype = jobtype,
                data.experience = experience


            await data.save()
            res.status(200).json({
                message: "Data Updated",
                status: true,
                statusCode: 200
            })
        }
        else {
            res.status(400).json("Job not found")
        }
    }

    catch (err) {
        res.status(401).json("Job edit api is not working", err)
    }
}
//delete job by company
const deleteJob = (req, res) => {
    const { id } = req.params;
    jobPost.deleteOne({ _id: id })
        .then(data => {
            savedJob.deleteOne({ jid: id }) // Use the same 'id' variable
                .then(udata => {
                    userJob.deleteOne({ jid: id })
                        .then(adata => {
                            res.status(200).json({
                                message: "Job deleted",
                                status: true,
                                statusCode: 200
                            });
                        })

                })
                .catch(error => {
                    res.status(500).json({
                        message: "Error deleting the job from saved jobs",
                        status: false,
                        statusCode: 500
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error deleting the job post",
                status: false,
                statusCode: 500
            });
        });
};

//user register

const userReg = async (req, res, next) => {
    // console.log('REQ=>',req)
    // console.log('REQBODY=>',req.body)
    const { username, email, psw, fname, lname, location, state, dob, gender, cod, ph, category, resume } = req.body;
    
    if (!username || !email || !psw) {
        return next("All fields are required");
    }
    const hashedPw = await bcrypt.hash(psw, 10);
    const existingCompany = await company.findOne({ email });
    if (existingCompany) {
        return next("Email already registered as a Company");
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: "Email already registered",
            status: false,
            statusCode: 400,
        });
    }
    const newUser = await user.create({
        username,
        email,
        psw: hashedPw,
        fname,
        lname,
        location,
        state,
        dob,
        gender,
        cod,
        ph,
        category,
        resume
   

    });
    console.log(newUser);
    res.status(201).json({
        newUser,
        message: "Registered Successfully",
        status: true,
        statusCode: 201,
        user: newUser,
    });
};

//user login
const userLogin = async (req, res, next) => {
    const { email, psw } = req.body
    if (!email || !psw) {
        return next("Please Provide all fields")
    }

    const ur = await user.findOne({ email });

    if (ur) {

        const token = jwt.sign({ _id: ur._id }, "superkey123");
        res.status(200).json({
            message: "Login successfully",
            status: true,
            statusCode: 200,
            _id: ur._id,
            fname: ur.fname,
            category: ur.category,
            token
        });

    }
    else {
        res.status(404).json({
            message: "No user Found",
            status: false,
            statusCode: 404
        });
    }

};

// logined user details
const getUserDetails = async (req, res) => {
    const uid = req.payload; 
// console.log(uid);
    try {
        const data = await user.findOne({ _id: uid });

        if (data) {
            res.status(200).json({
                message: data,
                status: true,
                statusCode: 200
            });
        } else {
            res.status(404).json({
                message: "No such data",
                status: false,
                statusCode: 404
            });
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            message: "Internal Server Error",
            status: false,
            statusCode: 500
        });
    }
};
//all job details for loggine duser
const allCompanyJob = async (req, res) => {
    const searchData = req.query.search
    try {
        //req exp query
        const query = {
            languages: { $regex: searchData, $options: "i" }
        }
        const data = await jobPost.find({});

        if (data.length > 0) {
            res.status(200).json({
                message: data,
                status: true,
                statusCode: 200
            });
        } else {
            res.status(404).json({
                message: "No data found",
                status: false,
                statusCode: 404
            });
        }
    } catch (error) {
        console.error("Error in loading data:", error);
        res.status(500).json({
            message: "Internal server error",
            status: false,
            statusCode: 500
        });
    }
};
//4 jobs for landing page
const allLimitJobs = async (req, res) => {
    try {
        const alljobs = await jobPost.find().limit(4);
        if (alljobs.length > 0) {
            res.status(200).json(alljobs);
        } else {
            res.status(200).json("No projects added yet");
        }
    } catch (err) {
        console.error("Error in project get API:", err);
        res.status(500).json("Internal server error");
    }
};

//user applying job 
const applyJob = async (req, res) => {
    try {
        const { cid, jid, uid } = req.body;
        const udata = await user.findOne({ _id: uid });
        console.log("user data=",udata);
        if (!udata) {
            return res.status(404).json({
                message: "Login to Apply",
                status: false,
                statusCode: 404,
            });
        }
        const existingJob = await userJob.findOne({ cid, jid, uid });

        if (existingJob) {
            return res.status(208).json({
                message: "Already Applied",
                status: false,
                statusCode: 208,
            });
        }
        const jobData = await jobPost.findOne({ _id: jid });
        console.log("Job data=",jobData);
        if (jobData) {
            const newUserJob = await userJob.create({
                cid,
                jid,
                uid,
                title: jobData.title,
                email: udata.email,
                location: jobData.location,
                state: jobData.state,
                fname: udata.fname,
                lname: udata.lname,
                cname: jobData.cname,
                ph: udata.ph,
                resume: udata.resume
            },
                { timestamps: true }
            );

            return res.status(201).json({
                message: "Job Applied !!",
                status: true,
                statusCode: 201,
                userJob: newUserJob,
            });
            
        } else {
            return res.status(404).json({
                message: "Job not found",
                status: false,
                statusCode: 404,
            });
        }


    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "Internal Server Error",
            status: false,
            statusCode: 500,
            error: error.message,
        });
    }
};



//user applied jobs
const userAppliedJob = (req, res) => {
    const { _id } = req.params
    userJob.find({ uid:_id }).then(data => {
        console.log("User applied jobs=",data);
        if (data.length > 0) {
            res.status(200).json({
                message: data,
                status: true,
                statusCode: 200,
            })
        } else {
            return res.status(204).json({
                message: "You haven't applied for any job yet",
                status: false,
                statusCode: 204,
            });
        }
    })
}

module.exports = {
    adminLogin, userReg, userLogin, companyReg,
    companyLogin, addJob, allJob, editJob,  deleteJob, applyJob, getUserDetails,
    allCompanyJob, allLimitJobs,usersData, companyData, userAppliedJob
//     oneJob,
//    , userSaveJob, savedJoblist,
//     deleteSavedJob, deleteSavedAll, viewApplicantsJob, changeStatus,
//     , deleteCompany, deleteUser, ,getOneJob,
//    ,allCompanies,allUsers
}