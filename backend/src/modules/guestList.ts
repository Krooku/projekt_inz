import { EventModule } from './'
import { GuestItem } from '../models'
import { Request, Response } from 'express'

export default new EventModule({
  id: 'guestList',
  name: 'Lista gości',
  routesHandler: (router) => {
    router.get('/', listGuestItems)
    router.post('/', addGuestItem)
    router.get('/:guestId', getGuestItem)
    router.put('/:guestId', editGuestItem)
    router.delete('/:guestId', deleteGuestItem)
    router.post('/:guestId/status', updateGuestItemStatus)
  },
  onDisabled: async (eventId) => {
    return GuestItem.deleteMany({ eventId }).exec()
  }
})

async function listGuestItems (req: Request, res: Response) {
  const { eventId } = req.params
  const guestItems = await GuestItem.find({ eventId }, { eventId: 0 }).lean().exec()
  res.status(200).json(guestItems)
}

async function addGuestItem (req: Request, res: Response) {
  const { eventId } = req.params
  const { firstname, lastname, phoneNumber, email, plusOne, plusOneFullName, status = 'invite' } = req.body

  if (!firstname || !lastname) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const guestItem = new GuestItem({
    eventId, firstname, lastname, phoneNumber, email, plusOne, plusOneFullName, status
  })

  try {
    await guestItem.save()
  } catch (error) {
    return res.status(400).json({
      message: 'Could not create guest'
    })
  }

  res.status(200).json(guestItem)
}

async function editGuestItem (req: Request, res: Response) {
  const { eventId, guestId } = req.params
  const { firstname, lastname, phoneNumber, plusOne, plusOneFullName, email, status } = req.body

  if (!firstname || !lastname || !status) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const updateQuery = {
    firstname,
    lastname,
    phoneNumber,
    plusOne,
    plusOneFullName,
    email,
    status
  }

  const guestItem = await GuestItem.findOneAndUpdate({
    _id: guestId,
    eventId
  }, updateQuery, {
    new: true
  }).lean().exec()

  if (!guestItem) {
    return res.status(400).json({
      message: 'Guest does not exist or no permission'
    })
  }

  res.status(200).json(guestItem)
}

async function updateGuestItemStatus (req: Request, res: Response) {
  const { eventId, guestId } = req.params
  const { status } = req.body

  if (!status) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const guestItem = await GuestItem.findOneAndUpdate({
    _id: guestId,
    eventId
  }, {
    status
  }, {
    new: true
  }).lean().exec()

  if (!guestItem) {
    return res.status(400).json({
      message: 'Guest does not exist or no permission'
    })
  }

  res.status(200).json(guestItem)
}

async function getGuestItem (req: Request, res: Response) {
  const { eventId, guestId } = req.params

  const guestItem = await GuestItem.findOne({
    _id: guestId,
    eventId
  }, {
    eventId: 0
  }).lean().exec()

  if (!guestItem) {
    return res.status(400).json({
      message: 'Guest does not exist or no permission'
    })
  }

  res.status(200).json(guestItem)
}

async function deleteGuestItem (req: Request, res: Response) {
  const { eventId, guestId } = req.params

  const guestItem = await GuestItem.findOne({
    _id: guestId,
    eventId
  }).exec()

  if (!guestItem) {
    return res.status(400).json({
      message: 'Guest does not exist or no permission'
    })
  }

  await guestItem.remove()
  res.status(200).end()
}
