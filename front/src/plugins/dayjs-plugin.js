import i18n from '../i18n'

var duration = require('dayjs/plugin/duration')
var dayjs = require('dayjs')


dayjs.extend(duration)
dayjs.locale(i18n.locale)

window.dayjs = dayjs

export default dayjs
