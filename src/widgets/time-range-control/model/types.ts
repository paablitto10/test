export const TTimeRangeControl = {
  ByMonth: 'BY_MONTH',
  ByYear: 'BY_YEAR',
} as const

export type TTimeRangeControl = (typeof TTimeRangeControl)[keyof typeof TTimeRangeControl]
