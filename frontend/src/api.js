// @ts-check

import axios from 'axios'
import app from './main'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api/',
  withCredentials: true
})

export default {
  /**
   * @param {string} method
   * @param {string} resource
   * @param {object} [data]
   * @param {object} [headers]
   */
  async execute (method, resource, data, headers) {
    if (app) app.$Progress.start()

    // @ts-ignore
    const request = axiosInstance({
      method,
      url: resource,
      data,
      headers,
      validateStatus: () => true
    })

    request.then(() => {
      if (app) app.$Progress.finish()
    })

    return request
  },

  /* AUTHENTICATION */
  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.username
   * @param {string} data.password
   */
  login (data) {
    return this.execute('POST', '/login', {
      username: data.username,
      password: data.password
    })
  },

  /** Destroys current session */
  logout () {
    return this.execute('POST', '/logout')
  },

  /**
   * Creates new user account
   * @param {object} data
   * @param {string} data.username
   * @param {string} data.email
   * @param {string} data.password
   */
  register (data) {
    return this.execute('POST', '/register', {
      username: data.username,
      email: data.email,
      password: data.password
    })
  },

  /** Gets current logged in user */
  getUser () {
    return this.execute('GET', '/user')
  },

  /**
   * Updates logged in user
   * @param {object} data
   * @param {string} [data.currentPassword]
   * @param {string} [data.password]
   * @param {string} [data.username]
   * @param {string} [data.email]
   */
  updateUser (data) {
    return this.execute('PATCH', '/user', data)
  },

  /**
   * Updates logged in user
   * @param {object} data
   * @param {string} [data.username]
   */
  updateUsername (data) {
    return this.execute('POST', '/user/username', data)
  },

  /**
   * Updates logged in user
   * @param {object} data
   * @param {string} [data.password]
   * @param {string} [data.email]
   */
  updateEmail (data) {
    return this.execute('POST', '/user/email', data)
  },

  /**
   * Updates logged in user
   * @param {object} data
   * @param {string} [data.currentPassword]
   * @param {string} [data.password]
   */
  updatePassword (data) {
    return this.execute('POST', '/user/password', data)
  },

  /**
   * Sends email with link to reset password
   * @param {string} email
   */
  sendPasswordResetEmail (email) {
    return this.execute('POST', '/user/sendReset', { email })
  },

  /**
   * Resets user password
   * @param {object} data
   * @param {string} data.token
   * @param {string} data.password
   */
  resetPassword (data) {
    return this.execute('POST', '/user/resetPassword', data)
  },

  /* EVENTS */
  /**
   * Creates new event
   * @param {object} data
   * @param {string} data.name
   * @param {string} [data.packageId]
   */
  createEvent (data) {
    return this.execute('POST', '/event', data)
  },

  /**
   * Gets event data
   * @param {string} eventID
   */
  getEvent (eventID) {
    return this.execute('GET', `/event/${eventID}`)
  },

  /**
   * Updates event
   * @param {string} eventID
   * @param {object} data
   * @param {string} [data.name]
   */
  updateEvent (eventID, data) {
    return this.execute('PUT', `/event/${eventID}`, data)
  },

  /**
   * Deletes event
   * @param {string} eventID
   */
  deleteEvent (eventID) {
    return this.execute('DELETE', `/event/${eventID}`)
  },

  /** List all events */
  listEvents () {
    return this.execute('GET', '/event')
  },

  /**
  * Sets event cover
  * @param {string} eventID
  * @param {object} data
  * @param {string} data.ID
  */
  SetEventCover (eventID, data) {
    return this.execute('POST', `/event/${eventID}/cover`, data)
  },

  /**
   * Lists all covers
   * @param {string} eventID
   */
  listCovers (eventID) {
    return this.execute('GET', `/event/${eventID}/cover`)
  },

  /**
  * Sets custom event cover
  * @param {string} eventID
  * @param {object} data
  * @param {string} data.ID
  */
  setEventCustomCover (eventID, data) {
    return this.execute('POST', `/event/${eventID}/customCover`, data)
  },

  /**
  * Lists all custom covers
  * @param {string} eventID
  */
  listCustomCovers (eventID) {
    return this.execute('GET', '/customCover')
  },
  /**
  * Adds new custom cover
  * @param {object} data
  * @param {file} data.cover
  */
  addCustomCover (data) {
    return this.execute('POST', '/customCover', data, { 'Content-Type': 'multipart/form-data' })
  },
  /**
  * Removes custom cover
  * @param {string} customCoverID
  */
  removeCustomCover (customCoverID) {
    return this.execute('DELETE', `/customCover/${customCoverID}`)
  },

  /* MODULES */
  /**
   * Enables module
   * @param {string} eventID
   * @param {object} data
   * @param {string} data.module Module ID
   */
  enableModule (eventID, data) {
    return this.execute('PUT', `/event/${eventID}/module`, data)
  },

  /**
   * Disables module
   * @param {string} eventID
   * @param {object} data
   */
  disableModule (eventID, data) {
    return this.execute('DELETE', `/event/${eventID}/module`, data)
  },

  /**
   * Lists activated modules on event
   * @param {string} eventID
   */
  activeModules (eventID) {
    return this.execute('GET', `/event/${eventID}/module`)
  },

  /** Lists all available modules */
  listModules () {
    return this.execute('GET', '/module')
  },

  /**
   * Gets module info
   * @param {string} moduleID
   */
  getModule (moduleID) {
    return this.execute('GET', `/module/${moduleID}`)
  },

  /**
   * Lists all available module packages
   */
  listModulePackages () {
    return this.execute('GET', '/modulePackage')
  },

  /* TODO */
  /**
   * Creates new todo item
   * @param {string} eventID
   * @param {object} data
   * @param {string} data.name
   * @param {'todo'|'inprogress'|'done'} [data.status]
   */
  createTodoItem (eventID, data) {
    return this.execute('POST', `/event/${eventID}/module/todo`, data)
  },

  /**
   * Import todo schema
   * @param {string} eventID
   * @param {object} data
   * @param {string} data.packageId
   */
  importTodos (eventID, data) {
    return this.execute('POST', `/event/${eventID}/module/todo/import`, data)
  },

  /**
 * List todo schemats
 * @param {string} eventID
 */
  listTodoPackages (eventID) {
    return this.execute('GET', `/event/${eventID}/module/todo/packages`)
  },

  /**
   * Gets todo item
   * @param {string} eventID
   * @param {string} todoID
   */
  getTodoItem (eventID, todoID) {
    return this.execute('GET', `/event/${eventID}/module/todo/${todoID}`)
  },

  /**
   * Edits todo item
   * @param {string} eventID
   * @param {string} todoID
   * @param {object} data
   * @param {string} [data.name]
   * @param {'todo'|'inprogress'|'done'} [data.status]
   */
  editTodoItem (eventID, todoID, data) {
    return this.execute('PUT', `/event/${eventID}/module/todo/${todoID}`, data)
  },

  /**
   * Deletes todo item
   * @param {string} eventID
   * @param {string} todoID
   */
  deleteTodoItem (eventID, todoID) {
    return this.execute('DELETE', `/event/${eventID}/module/todo/${todoID}`)
  },

  /**
   * Lists all todo items
   * @param {string} eventID
   */
  listTodoItems (eventID) {
    return this.execute('GET', `/event/${eventID}/module/todo`)
  },

  /* GUESTLIST */
  /**
   * Lists all guests
   * @param {string} eventID
   */
  listGuestItems (eventID) {
    return this.execute('GET', `/event/${eventID}/module/guestList`)
  },

  /**
   * Add new guest
   * @param {string} eventID
   * @param {object} data
   * @param {string} data.firstname
   * @param {string} data.lastname
   * @param {string} [data.phoneNumber]
   * @param {string} [data.email]
   * @param {'invite'|'invited'|'confirmed'} [data.status]
   */
  addGuestItem (eventID, data) {
    return this.execute('POST', `/event/${eventID}/module/guestList`, data)
  },
  /**
   * Gets guest
   * @param {string} eventID
   * @param {string} guestID
   */
  getGuestItem (eventID, guestID) {
    return this.execute('GET', `/event/${eventID}/module/guestList/${guestID}`)
  },
  /**
   * Edits guest
   * @param {string} eventID
   * @param {string} guestID
   * @param {object} data
   * @param {string} [data.firstname]
   * @param {string} [data.lastname]
   * @param {string} [data.phoneNumber]
   * @param {string} [data.email]
   * @param {'invite'|'invited'|'confirmed'} [data.status]
   */
  editGuestItem (eventID, guestID, data) {
    return this.execute('PUT', `/event/${eventID}/module/guestList/${guestID}`, data)
  },

  /**
   *
   * @param {string} eventID
   * @param {string} guestID
   * @param {'invite'|'invited'|'confirmed'} status
   */
  editGuestStatus (eventID, guestID, status) {
    return this.execute('POST', `/event/${eventID}/module/guestList/${guestID}/status`, status)
  },

  /**
   * Deletes guest
   * @param {string} eventID
   * @param {string} guestID
   */
  deleteGuestItem (eventID, guestID) {
    return this.execute('DELETE', `/event/${eventID}/module/guestList/${guestID}`)
  },
  /**
   * Add new note
   * @param {string} eventID
   * @param {object} data
   * @param {string} data.name
   * @param {string} data.content
   */
  addNoteItem (eventID, data) {
    return this.execute('POST', `/event/${eventID}/module/notepad`, data)
  },
  /**
   * Lists all note items
   * @param {string} eventID
   */
  listNoteItems (eventID) {
    return this.execute('GET', `/event/${eventID}/module/notepad`)
  },
  /**
   * Gets note
   * @param {string} eventID
   * @param {string} noteID
   */
  getNoteItem (eventID, noteID) {
    return this.execute('GET', `/event/${eventID}/module/notepad/${noteID}`)
  },

  /**
   * Edits note
   * @param {string} eventID
   * @param {string} noteID
   * @param {object} data
   * @param {string} [data.name]
   * @param {string} [data.content]
   */
  editNoteItem (eventID, noteID, data) {
    return this.execute('PUT', `/event/${eventID}/module/notepad/${noteID}`, data)
  },
  /**
   * Deletes note
   * @param {string} eventID
   * @param {string} noteID
   */
  deleteNoteItem (eventID, noteID) {
    return this.execute('DELETE', `/event/${eventID}/module/notepad/${noteID}`)
  },
  /**
  * Lists budget items
  * @param {string} eventID
  */
  listBudgetItems (eventID) {
    return this.execute('GET', `/event/${eventID}/module/budget`)
  },
  /**
   * Add new budget item
   * @param {string} eventID
   * @param {object} data
   * @param {string} data.name
   * @param {boolean} [data.bought]
   * @param {number} [data.price]
   */
  addBudgetItem (eventID, data) {
    return this.execute('POST', `/event/${eventID}/module/budget`, data)
  },
  /**
   * Gets budget item
   * @param {string} eventID
   * @param {string} budgetId
   */
  getBudgetItem (eventID, budgetId) {
    return this.execute('GET', `/event/${eventID}/module/guestList/${budgetId}`)
  },
  /**
   * Edits budget item
   * @param {string} eventID
   * @param {string} budgetId
   * @param {object} data
   * @param {string} [data.name]
   * @param {boolean} [data.bought]
   * @param {number} [data.price]
   */
  editBudgetItem (eventID, budgetId, data) {
    return this.execute('PUT', `/event/${eventID}/module/budget/${budgetId}`, data)
  },
  /**
   *
   * @param {string} eventID
   * @param {string} budgetId
   */
  deleteBudgetItem (eventID, budgetId) {
    return this.execute('DELETE', `/event/${eventID}/module/budget/${budgetId}`)
  },
  /**
  * Lists food items
  * @param {string} eventID
  */
  listFoodItems (eventID) {
    return this.execute('GET', `/event/${eventID}/module/food`)
  },
  /**
   * Add new food item
   * @param {string} eventID
   * @param {object} data
   * @param {string} [data.dish]
   * @param {string} [data.owner]
   */
  addFoodItem (eventID, data) {
    return this.execute('POST', `/event/${eventID}/module/food`, data)
  },
  /**
   * Gets food item
   * @param {string} eventID
   * @param {string} foodId
   */
  getFoodItem (eventID, foodId) {
    return this.execute('GET', `/event/${eventID}/module/food/${foodId}`)
  },
  /**
   * Edits food item
   * @param {string} eventID
   * @param {string} foodId
   * @param {object} data
   * @param {string} [data.dish]
   * @param {string} [data.owner]
   */
  editFoodItem (eventID, foodId, data) {
    return this.execute('PUT', `/event/${eventID}/module/food/${foodId}`, data)
  },
  /**
   *
   * @param {string} eventID
   * @param {string} foodId
   */
  deleteFoodItem (eventID, foodId) {
    return this.execute('DELETE', `/event/${eventID}/module/food/${foodId}`)
  },
  /* PlacementGuests */
  /**
   * Lists all tables
   * @param {string} eventID
   */
  listTableItems (eventID) {
    return this.execute('GET', `/event/${eventID}/module/guestPlacement`)
  },

  /**
   * Add new table
   * @param {string} eventID
   * @param {object} data
   * @param {array} data.guests
   */
  addTableItem (eventID, data) {
    return this.execute('POST', `/event/${eventID}/module/guestPlacement`, data)
  },
  /**
   * Gets guest
   * @param {string} eventID
   * @param {string} tableID
   */
  getTableItem (eventID, tableID) {
    return this.execute('GET', `/event/${eventID}/module/guestPlacement/${tableID}`)
  },

  /**
   * Edits guest
   * @param {string} eventID
   * @param {string} tableID
   * @param {object} data
   * @param {[]} [data.guests]
   */
  editTableItem (eventID, tableID, data) {
    return this.execute('PUT', `/event/${eventID}/module/guestPlacement/${tableID}`, data)
  },

  /**
   * Deletes guest
   * @param {string} eventID
   * @param {string} tableID
   */
  deleteTableItem (eventID, tableID) {
    return this.execute('DELETE', `/event/${eventID}/module/guestPlacement/${tableID}`)
  }
}
