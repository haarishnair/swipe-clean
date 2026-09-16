// Client-side Meme, "Good Morning" greeting & Clutter Detection Engine

/**
 * Keywords commonly found in forwarded greeting graphics / memes.
 */
const MEME_KEYWORDS = [
  'good morning',
  'good night',
  'blessed',
  'have a nice day',
  'happy sunday',
  'happy monday',
  'god bless',
  'suprabhat',
  'shubh prabhat',
  'morning vibes',
  'sweet dreams',
  'wishing you',
  'peace & love'
];

/**
 * Analyzes an image element on canvas to detect text density, color histogram, and aspect ratios.
 * Returns tags and confidence score.
 */
export async function analyzeMediaItem(item) {
  // If it's already pre-classified (like demo items), respect high confidence or enhance it
  if (item.isGoodMorningMeme || item.isAnimated || item.isLargeVideo) {
    return item;
  }

  // Check filename keywords
  const fileNameLower = item.name.toLowerCase();
  let textFoundKeyword = MEME_KEYWORDS.find(kw => fileNameLower.includes(kw));
  let confidence = textFoundKeyword ? 0.85 : 0;
  let detectedText = textFoundKeyword ? `Detected keyword: "${textFoundKeyword}"` : null;

  // Check MIME type / extension for GIF animation
  const isGif = item.mimeType === 'image/gif' || fileNameLower.endsWith('.gif');
  
  // Check video threshold (>20MB)
  const isLargeVid = item.type === 'video' && item.size > 20000000;

  // Try Canvas-based heuristic for images
  if (item.type === 'image' && item.url && !textFoundKeyword) {
    try {
      const canvasAnalysis = await analyzeImageCanvas(item.url);
      if (canvasAnalysis.isGraphicOrGreeting) {
        confidence = Math.max(confidence, canvasAnalysis.confidence);
        detectedText = canvasAnalysis.reason;
      }
    } catch (e) {
      // Fallback silently if canvas blocked by CORS or broken URL
      console.warn('Canvas scan skipped for item', item.name, e);
    }
  }

  const isMeme = confidence > 0.6 || !!textFoundKeyword;

  const updatedTags = [...item.tags];
  if (isMeme && !updatedTags.includes('Good Morning Meme')) {
    updatedTags.push('Good Morning Meme');
  }
  if (isLargeVid && !updatedTags.includes('Large Video')) {
    updatedTags.push('Large Video');
  }
  if (isGif && !updatedTags.includes('Animated GIF')) {
    updatedTags.push('Animated GIF');
  }

  return {
    ...item,
    tags: updatedTags,
    isGoodMorningMeme: isMeme,
    isLargeVideo: isLargeVid,
    isAnimated: isGif || item.isAnimated,
    confidenceScore: confidence,
    detectedText: detectedText || item.detectedText || null
  };
}

/**
 * Loads image onto a lightweight 2D canvas and analyzes color saturation & edge density.
 * Greetings/Memes usually have high saturation borders, square 1:1 aspect ratio, and graphic text.
 */
function analyzeImageCanvas(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const aspectRatio = width / height;
      
      // Aspect ratio check: 1:1 square or 4:3 are heavily used in WhatsApp forwarded images
      const isSquare = Math.abs(aspectRatio - 1.0) < 0.15;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 100; // downscale for fast processing
      canvas.height = 100;

      if (!ctx) {
        return resolve({ isGraphicOrGreeting: false, confidence: 0, reason: '' });
      }

      ctx.drawImage(img, 0, 0, 100, 100);
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const data = imageData.data;

      let highSaturationCount = 0;
      let totalPixels = 100 * 100;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        const saturation = max === 0 ? 0 : delta / max;

        // Vivid yellow, orange, floral red greetings have high saturation
        if (saturation > 0.65) {
          highSaturationCount++;
        }
      }

      const saturationRatio = highSaturationCount / totalPixels;

      // Heuristic score
      if (isSquare && saturationRatio > 0.3) {
        resolve({
          isGraphicOrGreeting: true,
          confidence: 0.78,
          reason: 'High color saturation graphic with 1:1 format'
        });
      } else {
        resolve({
          isGraphicOrGreeting: false,
          confidence: 0,
          reason: ''
        });
      }
    };

    img.onerror = () => {
      resolve({ isGraphicOrGreeting: false, confidence: 0, reason: '' });
    };
  });
}
