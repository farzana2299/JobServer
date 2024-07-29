const { adminLogin, userReg, userLogin, companyReg, companyLogin,
  addJob, allJob,  editJob, deleteJob, applyJob, allCompanyJob,allLimitJobs,getUserDetails,
  usersData, companyData,userAppliedJob
  // ,oneJob,
  // , deleteCompany, deleteUser,getOneJob,
  // ,allCompanies,allUsers 
} = require('../controllers/logic')
const { jwtMiddleware } = require('../middlewares/token');
const express = require('express')
const router = new express.Router()
const upload = require('../middlewares/resume');
const path = require('path');
const fs = require('fs');


//admin router
router.post('/admin/login', adminLogin)
router.get('/admin/userData', usersData)
router.get('/admin/companyData', companyData)
// router.delete('/admin/delete/company/:cid', deleteCompany)
// router.delete('/admin/delete/user/:uid', deleteUser)

//user Router
router.post('/user/register', upload.single('resume'), userReg)
router.post('/user/login', userLogin)

//company Router

router.post('/company/register', companyReg)
router.post('/company/login', companyLogin)
router.post('/company/addjob',jwtMiddleware, addJob)
router.get('/company/getJobDetails',jwtMiddleware, allJob)
// router.get('/company/getJobDetail/:id', oneJob)    //view job
router.put('/company/job/edit/:id',jwtMiddleware, editJob)
router.delete('/company/delete/job/:id',jwtMiddleware, deleteJob)
// router.get('/company/getapplicantDetails/:cid', viewApplicantsJob)
// router.put('/company/application/status/:cid/:uid/:jid', changeStatus)
// router.get('/company/Details',allCompanies);

//user
// router.get('/user/view/job/:id',jwtMiddleware,getOneJob)   //user single view job
router.get('/user/all/company/job',jwtMiddleware,allCompanyJob)
router.get('/user/applied/job/:uid', jwtMiddleware, userAppliedJob)
// router.post('/user/saved/job/:uid/:jid', jwtMiddleware, userSaveJob)
// router.get('/user/saved/job/list/:uid', jwtMiddleware, savedJoblist)
// router.delete('/user/delete/job/:id', jwtMiddleware, deleteSavedJob)
// router.delete('/user/delete/job/all/:id', jwtMiddleware, deleteSavedAll)
router.get('/user/details',jwtMiddleware,getUserDetails)
// router.get('/user/getDetails',allUsers);

//others
router.get('/job/alljob', allJob)
router.post('/user/apply/job', jwtMiddleware, applyJob)
router.get('/user/get-limited-jobs',allLimitJobs)


module.exports = router 