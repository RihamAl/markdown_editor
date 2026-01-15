// AI API functions for translation and grammar checking
// Using free online API services (these services support CORS)

//const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export async function translateText(text: string, targetLanguage: string = 'es') {
  try {
    const response = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|' + targetLanguage);

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const result = await response.json();
    if (result.responseStatus === 200) {
      return result.responseData.translatedText;
    } else {
      throw new Error(result.responseStatus);
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
}

export async function fixGrammarErrors(text: string) {
  try {
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text=${encodeURIComponent(text)}&language=en-US`,
    });

    if (!response.ok) {
      throw new Error('Grammar check failed');
    }

    const result = await response.json();
    
    // Apply corrections
    let correctedText = text;
    const matches = result.matches || [];

    // Sort matches by offset in reverse order to maintain indices
    matches.sort((a: { offset: number }, b: { offset: number }) => b.offset - a.offset);

    matches.forEach((match: { replacements?: Array<{ value: string }>; offset: number; length: number }) => {
      if (match.replacements && match.replacements.length > 0) {
        const correction = match.replacements[0].value;
        const start = match.offset;
        const end = match.offset + match.length;
        correctedText = correctedText.substring(0, start) + correction + correctedText.substring(end);
      }
    });

    return correctedText;
  } catch (error) {
    console.error('Grammar check error:', error);
    throw new Error('Failed to check grammar');
  }
}

export const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];
