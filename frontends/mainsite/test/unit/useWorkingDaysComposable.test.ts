import { describe, it, expect } from 'vitest'
import { useWorkingDaysComposable, WorkingDays, type Days, type WorkingDaysOptions } from '../../layers/base/app/composables/business/working_hours'

describe('WorkingDays', () => {
  it('should return correct working day list', () => {
    const instance = new WorkingDays({
      only: 'Weekdays',
      startTime: '09:00',
      endTime: '17:00'
    })

    const workingDays = instance.workingDaysList
    
    expect(workingDays).toBeDefined()
    expect(Array.isArray(workingDays)).toBe(true)
    expect(workingDays.length).toBe(5)
  })

  it('should return correct weekends list', () => {
    const instance = new WorkingDays({
      only: 'Weekends',
      startTime: '10:00',
      endTime: '15:00'
    })

    const weekends = instance.getWeekends()

    expect(weekends).toBeDefined()
    expect(Array.isArray(weekends)).toBe(true)
    expect(weekends.length).toBe(2)
  })
})

describe('useWorkingDaysComposable', () => {
  it('should return correct working days for Weekdays option', () => {
    const { workingDays } = useWorkingDaysComposable({
      only: 'Weekdays',
      startTime: '09:00',
      endTime: '17:00'
    })

    expect(workingDays).toBeDefined()
    expect(isRef(workingDays)).toBe(true)
    expect(Array.isArray(toValue(workingDays))).toBe(true)

    toValue(workingDays).forEach(day => {
      expect(day).toHaveProperty('day')
      expect(day).toHaveProperty('startTime')
      expect(day).toHaveProperty('endTime')
    })
  })

  it('should return correct working days for Weekdays option', () => {
    const { days } = useWorkingDaysComposable({
      only: 'Weekdays',
      startTime: '09:00',
      endTime: '17:00'
    })

    expect(days).toBeDefined()
    expect(isRef(days)).toBe(true)
    expect(Array.isArray(toValue(days))).toBe(true)
    expect(toValue(days)).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  })

  it('should be able to get a working day', () => {
    const { getDay } = useWorkingDaysComposable({
      only: 'Weekdays',
      startTime: '09:00',
      endTime: '17:00'
    })

    expect(getDay).toBeDefined()
    expect(typeof getDay).toBe('function')

    const day = getDay('Monday')
    expect(day).toBeDefined()
    expect(isRef(day)).toBe(true)
    expect(toValue(day)).toHaveProperty('day', 'Monday')
    expect(toValue(day)).toHaveProperty('startTime', '09:00')
    expect(toValue(day)).toHaveProperty('endTime', '17:00')
  })

  const testCases: { only: WorkingDaysOptions[ 'only' ], expectedDays: Days[], customDays: WorkingDaysOptions['customDays'] }[] = [
    {
      only: 'Weekdays',
      expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      customDays: []
    },
    {
      only: 'Weekends',
      expectedDays: ['Saturday', 'Sunday'],
      customDays: []
    },
    {
      only: 'Custom',
      expectedDays: ['Monday', 'Wednesday', 'Friday'],
      customDays: [
        {
          day: 'Monday',
          startTime: '10:00',
          endTime: '16:00'
        }
      ]
    },
    {
      // @ts-ignore Test a null value for the 'only' property
      only: null,
      expectedDays: [],
      customDays: []
    }
  ]

  testCases.forEach(testCase => {
    it.todo(`should return the correct case for ${testCase.only} days`, () => {
      const { days } = useWorkingDaysComposable({
        only: testCase.only,
        customDays: testCase.customDays,
      })
  
      expect(toValue(days)).toEqual(testCase.expectedDays)
    })
  })
})
