import dayjs from 'dayjs'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs: dayjs(),
      date: {
        formatDate: (date: Date, format: string) => dayjs(date).format(format),
        subtractFromDate: (date: Date, duration: { days?: number; months?: number }) => {
          let d = dayjs(date)
          if (duration.days) d = d.subtract(duration.days, 'day')
          if (duration.months) d = d.subtract(duration.months, 'month')
          return d.toDate()
        }
      }
    }
  }
})
