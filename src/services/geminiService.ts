import { GoogleGenAI } from '@google/genai'
import { ToneType } from '@/types'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export const generateGreeting = async (occasion: 'День Рожденья' | 'Новый Год', name: string, age: string, interests: string, tone: string, language: 'Русский' | 'Белорусский' | 'English' | 'Deutsch' | 'Español' | 'Français'): Promise<string> => {
  try {
    const prompt = `
        Напиши уникальное поздравление на языке: ${language}.

        Повод: ${occasion},
        Для кого: ${name},
        Возраст: ${age ? age : 'Не указан'},
        Интересы/хобби: ${interests ? interests : 'Не указаны'},
        Тон: ${tone}

        Инструкции по стилю (адаптируй под культурный контекст языка ${language}):
        - Официальный: Сдержанный, уважительный.
        - Дружеский: Теплый, неформальный.
        - Юмористический: Веселый, забавный, с доброй шуткой.
        - Романтический: Нежный, любящий, чувственный.
        - Трогательный: Душевный, эмоциональный.
        - 18+: Дерзкое, с перчинкой, сарказмом или взрослыми шутками. (Только если уместно для контекста 18+).

        Общие требования:
        - Обязательно учитывай возраст и интересы человека.
        - Длина: От 2 до 5 предложений.
        - Используй 2-3 подходящих по смыслу эмодзи.
        - Форматирование: Просто текст, без markdown заголовков.
        - Язык ответа СТРОГО: ${language}.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: tone === ToneType.ADULT ? 0.9 : 0.8,
      },
    })

    if (response.text) {
      return response.text
    }

    throw new Error('Не удалось сгенерировать текст.')

  } catch (error) {
    console.error('Gemini text API error', error)

    throw new Error('[generateGreeting] Ошибка генерации')
  }
}

export const generateGreetingImage = async (occasion: 'День Рожденья' | 'Новый Год', tone: string, interests: string): Promise<string | null> => {
  try {
    const prompt = `
      High quality digital illustration for a greeting card.
      Occasion: ${occasion}.
      Mood/Tone: ${tone}.
      ${interests ? `Themes/Interests: ${interests}` : ''}.
      Style: Colorful, artistic, high resolution, aesthetically pleasing. 
      No text in the image.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: '4:3',
        },
      },
    })

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data

        return `data:image/png;base64,${base64EncodeString}`
      }
    }

    return null

  } catch (error) {
    console.error('Gemini image API error', error)

    return null
  }
}
