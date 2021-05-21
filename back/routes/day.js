const express = require('express')
const router = express.Router()
const { Day, User } = require('../db')
const security = require('../utils/security')
const schemas = require('../utils/validations/schemas')
const query = require('querymen').middleware
const moment = require('moment')

router.get('/:dayId', [security.permit.day.userIsInDay], async (request, response, next) => {
  // Rota p/ popular a tela do painel
  const { dayId } = request.params

  Day.find({ _id: dayId }).limit(1).lean().then(dayDB => {
    if (dayDB.length > 0) {
      const sellersList = []
      const currDay = dayDB[0]
      // Vamos passar por cada evento, contabilizando o evento e subtraindo do tempo da fila
      currDay.events.forEach(event => {
        const sellerIndex = sellersList.findIndex(seller => String(seller.sellerId) === String(event.sellerId))
        const eventDuration = Math.abs((event.period.end.getTime() - event.period.start.getTime()) / 1000)
        // console.log('event: ', eventDuration/60)
        if (sellerIndex < 0) {
          sellersList.push({
            sellerId: event.sellerId,
            events: [event],
            activities: [],
            success: event.success ? 1 : 0,
            fail: event.success ? 0 : 1,
            time: {
              line: -eventDuration,
              working: eventDuration
            }
          })
        } else {
          sellersList[sellerIndex].events.push(event)
          sellersList[sellerIndex].time.line -= eventDuration
          sellersList[sellerIndex].time.working += eventDuration
          if (event.success) {
            sellersList[sellerIndex].success += 1
          } else {
            sellersList[sellerIndex].fail += 1
          }
        }
      })
      // A partir daqui, já deve ter todos os sellers que estão nas atividades(sellersList)
      // Então, fazemos a verificação de tempo na fila desses sellers

      // Ordena as atividades por tempo
      currDay.activities.sort((a, b) => a.date.getTime() - b.date.getTime())

      // Vamos passar por cada atividade
      currDay.activities.forEach((activity, i) => {
        const currSellerId = String(activity.sellerId)
        const sellerIndex = sellersList.findIndex(seller => String(seller.sellerId) === currSellerId)
        // Verifica se tem o seller, pq se não tiver, quer dizer que não veio nenhum evento ainda
        if (sellerIndex < 0) {
          sellersList.push({
            sellerId: currSellerId,
            events: [],
            activities: [activity],
            success: 0,
            fail: 0,
            time: {
              line: 0,
              working: 0
            }
          })
        } else {
          sellersList[sellerIndex].activities.push(activity)
        }

        if (activity.type.indexOf('end') >= 0) {
          // Todas as atividades até o end atual
          const actUntilEnd = [...currDay.activities].splice(0, i)
          // Reverte para pegar o start mais próximo do fim da lista e do mesmo seller
          const reverseIndex = [...actUntilEnd].reverse().findIndex(a => a.type === 'start' && String(a.sellerId) === currSellerId)
          const startIndex = reverseIndex <= 0 ? reverseIndex : actUntilEnd.length - reverseIndex - 1
          if (startIndex >= 0) {
            // Encontrou o start desse end, caso não tenha o start algo deu muito errado e será desconsiderado

            // Activity do start do end atual
            const start = actUntilEnd[startIndex]
            // O end atual é o próprio activity

            // Pega o objeto do seller atual do dia atual
            const currSellerObject = sellersList.find(seller => String(seller.sellerId) === currSellerId)
            const activityDuration = Math.abs((activity.date.getTime() - start.date.getTime()) / 1000)
            // console.log('line: ',activityDuration/60)

            // Encontrou o objeto
            // O tempo na fila é igual ao tempo do intervalo activity-start menos a quantidade de tempo que ficou trabalhando (que foi considerada anteriormente)
            // Como vai passar por todos os intervalos, eventualmente ele terá subtraído tudo que deve
            if (currSellerObject) currSellerObject.time.line += activityDuration
          }
        }
      })

      // Agora todos os sellers já tem as suas respectivas atividades
      // Devemos ver se algum seller ficou com uma activity em aberto (Apenas com start, sem o end),
      // e restituir o tempo que foi descontado da fila, pq no código acima ele só somou as activities completas ao valor negativo da line
      sellersList.forEach((seller, iSeller) => {
        if (seller.activities.length > 0 && seller.events.length > 0) {
          const lastActivity = seller.activities[seller.activities.length - 1]
          const lastEvent = seller.events[seller.events.length - 1]
          if (lastActivity.type === 'start') {
            // A última atividade desse seller é um start, que está em aberto por não ter nenhum end em seguida
            // Vamos considerar o tempo entre o início dessa atividade e o fim do último evento para contar o tempo de fila p/ restituir
            const lineDuration = Math.abs((lastActivity.date.getTime() - lastEvent.period.end.getTime()) / 1000)
            // console.log('deducted line: ', lineDuration/60)

            sellersList[iSeller].time.line += lineDuration
          }
        }
      })

      User.populate(sellersList, { path: 'sellerId', select: { name: 1, photo: 1 } }).then(populatedSellers => {
        response.json({ sellers: populatedSellers })
      }).catch(err => console.log(err))
    } else {
      console.log('não encontrou')
    }
  }).catch(err => console.log(err))
})

router.post('/store/:storeId', [schemas.day.create, security.permit.store.userIsLinked('storeId')], async (request, response, next) => {
  const { storeId } = request.params

  const newDay = (date, storeId) => new Day({
    date,
    lastSync: new Date(),
    events: [],
    activities: [],
    storeId
  })

  const push = (list, event, isEvent = true) => list.push(isEvent ? {
    type: event.type,
    entryType: event.entryType,
    success: event.success,
    period: event.period,
    sellerId: event.sellerId,
    selected: event.selected
  } : {
    type: event.type,
    date: event.date,
    sellerId: event.sellerId
  })

  const events = request.body.events ? request.body.events.map(event => ({
    ...event,
    dayDate: new Date(event.period.end.substring(0, 10) + 'T15:00:00.000Z'),
    period: { start: new Date(event.period.start), end: new Date(event.period.end) }
  })) : []
  const activities = request.body.activities ? request.body.activities.map(activity => ({
    ...activity,
    dayDate: new Date(activity.date.substring(0, 10) + 'T15:00:00.000Z'),
    date: new Date(activity.date)
  })) : []

  const reasons = [
    'exists', // Já existe
    'missing_start', // Evento sem start
    'missing_day' // Evento sem dia inicializado
  ]

  const rejected = {
    activities: [],
    events: []
  }

  try {
    const dayList = await Day.find({
      storeId,
      date: {
        $in: [...events, ...activities].map(x => x.dayDate)
          .filter((value, index, self) => self.map(d => d.toISOString()).indexOf(value.toISOString()) === index)
      }
    }).exec()

    // Faz a verificação das atividades
    activities.forEach(activity => {
      const dayIndex = dayList.findIndex(day => new Date(day.date).toISOString() === activity.dayDate.toISOString())
      if (dayIndex < 0) {
        // Não encontrou o dia na lista, então com certeza não existe a atividade, pq não existe nem o dia que poderia conter ela
        const day = newDay(activity.dayDate, storeId)
        push(day.activities, activity, false)
        dayList.push(day)
      } else {
        dayList[dayIndex].lastSync = new Date()
        // Encontrou o dia na lista, tem que verificar se a atividade já foi criada
        const activityIndex = dayList[dayIndex].activities.findIndex(a => JSON.stringify({ date: a.date, sellerId: a.sellerId, type: a.type }) === JSON.stringify({ date: activity.date, sellerId: activity.sellerId, type: activity.type }))
        if (activityIndex < 0) {
          // Não encontrou a atividade no dia, show
          push(dayList[dayIndex].activities, activity, false)
        } else {
          rejected.activities.push({ ...activity, reason: reasons[0] })
        }
      }
    })

    // Faz a verificação dos eventos
    events.forEach(event => {
      const dayIndex = dayList.findIndex(day => new Date(day.date).toISOString() === event.dayDate.toISOString())
      if (dayIndex < 0) {
        // Não encontrou o dia na lista, então com certeza não existe o evento, pq não existe nem o dia que poderia conter o evento
        rejected.events.push({ ...event, reason: reasons[2] })
        // const day = newDay(event.dayDate, storeId)
        // push(day.events, event)
        // dayList.push(day)
      } else {
        dayList[dayIndex].lastSync = new Date()
        // Encontrou o dia na lista, tem que verificar se o evento já foi criado
        const eventIndex = dayList[dayIndex].events.findIndex(e => JSON.stringify({ date: e.period.end, sellerId: e.sellerId }) === JSON.stringify({ date: event.period.end, sellerId: event.sellerId }))
        if (eventIndex < 0) {
          // Não encontrou o evento no dia, show
          // Temos que verificar se nesse dia já tem uma activity de start p/ esse seller
          const activityIndex = dayList[dayIndex].activities.findIndex(activity => activity.type === 'start' && String(activity.sellerId) === String(event.sellerId))
          if (activityIndex >= 0) {
            push(dayList[dayIndex].events, event)
          } else {
            rejected.events.push({ ...event, reason: reasons[1] })
          }
        } else {
          rejected.events.push({ ...event, reason: reasons[0] })
        }
      }
    })

    Promise.all(dayList.map(day => day.save())).then(() => {
      response.json({ days: dayList, rejected })
    }).catch(err => next({
      status: 500,
      code: 2,
      friendlyMsg: 'Erro ao atualizar eventos.',
      message: err,
      console: true
    }))
  } catch (err) {
    next({
      status: 500,
      code: 2,
      friendlyMsg: 'Erro ao registrar eventos.',
      message: err,
      console: true
    })
  }
})

router.get('/store/:storeId/report', [schemas.period, security.permit.store.userIsLinked('storeId')], async (request, response, next) => {
  // Rota p/ popular a tela do painel
  const { storeId } = request.params
  const { from, to } = request.query

  const period = {
    start: moment(from).locale('pt-BR').set({ hour: process.env.NODE_ENV !== 'production' ? 12 : 15, minute: 0, second: 0, millisecond: 0 }),
    end: moment(to).locale('pt-BR').set({ hour: process.env.NODE_ENV !== 'production' ? 12 : 15, minute: 0, second: 0, millisecond: 0 })
  }

  if (!from && !to) {
    period.start.set('D', 1)
    period.end = period.start.clone().add(1, 'M').subtract(1, 'D')
  }

  Day.find({
    date: {
      $gte: period.start,
      $lte: period.end
    },
    storeId
  }).lean().then(dayDB => {
    // Passa por cada dia
    const total = dayDB.reduce((acc, currDay) => {
      // Vamos passar por cada evento, contabilizando o evento e subtraindo do tempo da fila
      currDay.events.forEach(event => {
        acc.success += Number(event.success)
        acc.fail += Number(!event.success)
        acc.avg += 1 / dayDB.length

        const sellerIndex = acc.sellers.findIndex(seller => String(seller.sellerId) === String(event.sellerId))
        const eventDuration = Math.abs((event.period.end.getTime() - event.period.start.getTime()) / 1000)
        // console.log('event: ', eventDuration/60)
        if (sellerIndex < 0) {
          acc.sellers.push({
            sellerId: event.sellerId,
            events: [event],
            activities: [],
            success: event.success ? 1 : 0,
            fail: event.success ? 0 : 1,
            time: {
              line: -eventDuration,
              working: eventDuration
            }
          })
        } else {
          acc.sellers[sellerIndex].events.push(event)
          acc.sellers[sellerIndex].time.line -= eventDuration
          acc.sellers[sellerIndex].time.working += eventDuration
          if (event.success) {
            acc.sellers[sellerIndex].success += 1
          } else {
            acc.sellers[sellerIndex].fail += 1
          }
        }
      })
      // A partir daqui, já deve ter todos os sellers que estão nas atividades(acc.sellers)
      // Então, fazemos a verificação de tempo na fila desses sellers

      // Ordena as atividades por tempo
      currDay.activities.sort((a, b) => a.date.getTime() - b.date.getTime())

      // Vamos passar por cada atividade
      currDay.activities.forEach((activity, i) => {
        const currSellerId = String(activity.sellerId)
        const sellerIndex = acc.sellers.findIndex(seller => String(seller.sellerId) === currSellerId)
        // Verifica se tem o seller, pq se não tiver, quer dizer que não veio nenhum evento ainda
        if (sellerIndex < 0) {
          acc.sellers.push({
            sellerId: currSellerId,
            events: [],
            activities: [activity],
            success: 0,
            fail: 0,
            time: {
              line: 0,
              working: 0
            }
          })
        } else {
          acc.sellers[sellerIndex].activities.push(activity)
        }

        if (activity.type.indexOf('end') >= 0) {
          // Todas as atividades até o end atual
          const actUntilEnd = [...currDay.activities].splice(0, i)
          // Reverte para pegar o start mais próximo do fim da lista e do mesmo seller
          const reverseIndex = [...actUntilEnd].reverse().findIndex(a => a.type === 'start' && String(a.sellerId) === currSellerId)
          const startIndex = reverseIndex <= 0 ? reverseIndex : actUntilEnd.length - reverseIndex - 1
          if (startIndex >= 0) {
            // Encontrou o start desse end, caso não tenha o start algo deu muito errado e será desconsiderado

            // Activity do start do end atual
            const start = actUntilEnd[startIndex]
            // O end atual é o próprio activity

            // Pega o objeto do seller atual do dia atual
            const currSellerObject = acc.sellers.find(seller => String(seller.sellerId) === currSellerId)
            const activityDuration = Math.abs((activity.date.getTime() - start.date.getTime()) / 1000)
            // console.log('line: ',activityDuration/60)

            // Encontrou o objeto
            // O tempo na fila é igual ao tempo do intervalo activity-start menos a quantidade de tempo que ficou trabalhando (que foi considerada anteriormente)
            // Como vai passar por todos os intervalos, eventualmente ele terá subtraído tudo que deve
            if (currSellerObject) currSellerObject.time.line += activityDuration
          }
        }
      })

      // Agora todos os sellers já tem as suas respectivas atividades
      // Devemos ver se algum seller ficou com uma activity em aberto (Apenas com start, sem o end),
      // e restituir o tempo que foi descontado da fila, pq no código acima ele só somou as activities completas ao valor negativo da line
      acc.sellers.forEach((seller, iSeller) => {
        if (seller.activities.length > 0 && seller.events.length > 0) {
          const lastActivity = seller.activities[seller.activities.length - 1]
          const lastEvent = seller.events[seller.events.length - 1]
          if (lastActivity.type === 'start') {
            // A última atividade desse seller é um start, que está em aberto por não ter nenhum end em seguida
            // Vamos considerar o tempo entre o início dessa atividade e o fim do último evento para contar o tempo de fila p/ restituir
            const lineDuration = Math.abs((lastActivity.date.getTime() - lastEvent.period.end.getTime()) / 1000)
            // console.log('deducted line: ', lineDuration/60)

            acc.sellers[iSeller].time.line += lineDuration
          }
        }
      })

      return acc
    }, { sellers: [], success: 0, fail: 0, avg: 0 })
    User.populate(total.sellers, { path: 'sellerId', select: { name: 1, photo: 1 } }).then(populatedSellers => {
      total.sellers = populatedSellers
      response.json(total)
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
})

router.get('/store/:storeId', [query(), security.permit.store.userIsLinked('storeId')], function (request, response, next) {
  const query = {
    storeId: request.params.storeId
  }
  Day.paginate(query, {
    sort: request.query.sort,
    page: request.query.page || 1,
    limit: Number(request.query.limit) || 10,
    select: {
      _id: 1,
      date: 1,
      events: 1,
      updatedAt: 1
    },
    lean: true
  }).then(data => response.json({
    items: data.docs.map(day => ({
      ...day,
      ...day.events.reduce((acc, event) => {
        if (event.success) {
          acc.success++
        } else {
          acc.fail++
        }
        return acc
      }, { success: 0, fail: 0 })
    })),
    metadata: {
      pagination: {
        currentPage: Number(data.page) || 1,
        pageCount: data.totalPages,
        totalCount: data.totalDocs || 0,
        limit: data.limit
      },
      sorting: request.query.sort
    }
  })).catch(err => next(err))
})

module.exports = router
