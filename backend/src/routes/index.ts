import express from 'express'

import * as auth from './users'
import * as event from './event'
import * as modules from './modules'

import verifyLogin from '../middleware/verifyLogin'

import * as ModuleManager from '../modules'

const router = express.Router()

router.post('/login', auth.login)
router.post('/logout', auth.logout)
router.post('/register', auth.register)

router.get('/user', verifyLogin, auth.getUser)
router.post('/user/username', verifyLogin, auth.updateUsername)
router.post('/user/email', verifyLogin, auth.updateEmail)
router.post('/user/password', verifyLogin, auth.updatePassword)
router.get('/user/verify/:token', auth.verifyEmail)
router.get('/user/changeEmail/:token', auth.changeEmail)
router.post('/user/sendReset', auth.sendReset)
router.post('/user/resetPassword', auth.resetPassword)

router.get('/event/', verifyLogin, event.listEvents)
router.post('/event/', verifyLogin, event.createEvent)
router.get('/event/:eventId', verifyLogin, event.getEvent)
router.put('/event/:eventId', verifyLogin, event.updateEvent)
router.delete('/event/:eventId', verifyLogin, event.deleteEvent)

router.get('/customCover', verifyLogin, event.listCustomCovers)
router.post('/customCover', verifyLogin, event.addCustomCover)
router.delete('/customCover/:id', verifyLogin, event.removeCustomCover)

router.get('/event/:eventId/cover', verifyLogin, event.listCovers)
router.post('/event/:eventId/cover', verifyLogin, event.updateCover)
router.post('/event/:eventId/customCover', verifyLogin, event.updateCustomCover)
router.get('/event/:eventId/module', verifyLogin, modules.listEventModules)
router.put('/event/:eventId/module', verifyLogin, modules.enableModuleOnEvent)
router.delete('/event/:eventId/module', verifyLogin, modules.disableModuleOnEvent)
router.use('/event/:eventId/module/:moduleId', verifyLogin, modules.verifyModuleEnabled)
router.use('/event/:eventId/module/', verifyLogin, ModuleManager.ModuleRouter)

router.get('/module', modules.list)
router.get('/module/:moduleId', modules.get)
router.get('/modulePackage', modules.listPackages)

export default router
