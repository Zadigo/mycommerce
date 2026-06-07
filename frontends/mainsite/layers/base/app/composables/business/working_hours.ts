export type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export type WorkingDay = {
  day: Days
  startTime?: string
  endTime?: string
}

export type WorkingDaysOptions = {
  /**
   * Apply the same working hours to all days.
   */
  startTime?: string
  /**
   * Apply the same working hours to all days.
   */
  endTime?: string
  /**
   * Apply working hours only to specific days.
   *  If 'Custom' is selected, the customDays property will be
   * used to determine which days are working days.
   */
  only: 'Weekdays' | 'Weekends' | 'Custom'
  /**
   * If 'Custom' is selected in the only property, this property
   * will be used to determine which days are working days and
   * their respective working hours.
   */
  customDays?: WorkingDay[]
}

/**
 * This class is responsible for calculating the working days based on the provided options.
 * It will return the working days and their respective working hours based on the options provided.
 * If 'Weekdays' is selected, it will return Monday to Friday as working days.
 * If 'Weekends' is selected, it will return Saturday and Sunday as working days.
 * If 'Custom' is selected, it will return the custom days provided in the options.
 */
class WorkingDays {
  private options: WorkingDaysOptions
  private days: Days[]
  private workingDays: Days[]
  private weekends: Days[]

  constructor(options: WorkingDaysOptions) {
    this.options = options
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    this.workingDays = this.days.filter((day) => {
      return day !== 'Saturday' && day !== 'Sunday'
    })
    this.weekends = this.days.filter((day) => {
      return day === 'Saturday' || day === 'Sunday'
    })
  }

  get workingDaysList(): WorkingDay[] {
    switch (this.options.only) {
      case 'Weekdays':
        return this.getWeekdays()
      case 'Weekends':
        return this.getWeekends()
      case 'Custom':
        return this.options.customDays || []
      default:
        return []
    }
  }

  getWeekends(): WorkingDay[] {
    if (this.options.only === 'Weekends') {
      return this.weekends.map(day => ({
        day,
        startTime: this.options.startTime,
        endTime: this.options.endTime
      }))
    } else {
      return []
    }
  }

  getWeekdays(): WorkingDay[] {
    return this.workingDays.map(day => ({
      day,
      startTime: this.options.startTime,
      endTime: this.options.endTime
    }))
  }
}

export const useWorkingDaysComposable = createGlobalState((options: WorkingDaysOptions) => {
  const instance = new WorkingDays(options)

  const workingDays = computed(() => instance.workingDaysList)
  const days = computed(() => workingDays.value.map(item => item.day))

  function _getDay(day: Days): WorkingDay | undefined {
    return workingDays.value.find(item => item.day === day)
  }

  const getDay = reactify(_getDay)

  return {
    workingDays,
    days,
    getDay
  }
})
