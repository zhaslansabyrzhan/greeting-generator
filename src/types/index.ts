export const OccasionType = {
  BIRTHDAY: 'День Рожденья',
  NEW_YEAR: 'Новый Год',
} as const

export type OccasionType = typeof OccasionType[keyof typeof OccasionType]

export const ToneType = {
  OFFICIAL: 'Официальный',
  FRIENDLY: 'Дружеский',
  HUMOROUS: 'Юмористический',
  ROMANTIC: 'Романтический',
  TOUCHING: 'Трогательный',
  ADULT: '18+',
}

export type ToneType = typeof ToneType[keyof typeof ToneType]

export type LanguageType = 'Русский' | 'Белорусский' | 'English' | 'Deutsch' | 'Español' | 'Français'

export interface GenerateGreetingOptions {
  occasion: OccasionType
  name: string
  age?: string
  interests?: string
  tone: ToneType
  language: LanguageType
}

export interface GenerateGreetingImageOptions {
  occasion: OccasionType
  tone: ToneType
  interests: string
}
