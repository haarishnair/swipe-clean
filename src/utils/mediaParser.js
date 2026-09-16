// Utility for parsing media, calculating file sizes, extracting metadata, and generating demo data.

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Generate realistic mock sample data for instant interactive app demo
export function generateDemoMedia() {
  const demoItems = [
    {
      id: 'demo-1',
      name: 'IMG_4902_4K_60FPS.MOV',
      type: 'video',
      mimeType: 'video/mp4',
      size: 148000000, // ~148 MB
      formattedSize: '148.0 MB',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      dimensions: '3840 x 2160',
      duration: '01:42',
      dateAdded: new Date(Date.now() - 3600000 * 2).toISOString(),
      tags: ['Large Video', '4K'],
      isGoodMorningMeme: false,
      isLargeVideo: true,
      isAnimated: false,
      isBlurry: false,
      confidenceScore: 0,
      status: 'pending' // 'pending', 'keep', 'trash'
    },
    {
      id: 'demo-2',
      name: 'WhatsApp_Good_Morning_Sunflowers.jpg',
      type: 'image',
      mimeType: 'image/jpeg',
      size: 4200000, // 4.2 MB
      formattedSize: '4.2 MB',
      url: 'https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=800&auto=format&fit=crop',
      dimensions: '1080 x 1080',
      dateAdded: new Date(Date.now() - 3600000 * 12).toISOString(),
      tags: ['Good Morning Meme', 'WhatsApp Graphic'],
      isGoodMorningMeme: true,
      isLargeVideo: false,
      isAnimated: false,
      isBlurry: false,
      confidenceScore: 0.95,
      detectedText: 'Good Morning! Have a Blessed & Joyful Day 🌻✨',
      status: 'pending'
    },
    {
      id: 'demo-3',
      name: 'IMG_9103_RAW_Sunset.CR2',
      type: 'image',
      mimeType: 'image/jpeg',
      size: 48500000, // 48.5 MB
      formattedSize: '48.5 MB',
      url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1200&auto=format&fit=crop',
      dimensions: '6000 x 4000',
      dateAdded: new Date(Date.now() - 3600000 * 24).toISOString(),
      tags: ['Large Photo', 'RAW Format'],
      isGoodMorningMeme: false,
      isLargeVideo: false,
      isAnimated: false,
      isBlurry: false,
      confidenceScore: 0,
      status: 'pending'
    },
    {
      id: 'demo-4',
      name: 'Good_Night_Blessings_Quotes.png',
      type: 'image',
      mimeType: 'image/png',
      size: 3100000, // 3.1 MB
      formattedSize: '3.1 MB',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
      dimensions: '1200 x 1200',
      dateAdded: new Date(Date.now() - 3600000 * 36).toISOString(),
      tags: ['Good Morning/Night Meme', 'Graphic Text'],
      isGoodMorningMeme: true,
      isLargeVideo: false,
      isAnimated: false,
      isBlurry: false,
      confidenceScore: 0.92,
      detectedText: 'Good Night & Sweet Dreams ⭐ Peace Be With You',
      status: 'pending'
    },
    {
      id: 'demo-5',
      name: 'Dancing_Cat_Sticker.gif',
      type: 'image',
      mimeType: 'image/gif',
      size: 8900000, // 8.9 MB
      formattedSize: '8.9 MB',
      url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnVzeGk5N3N1eXh3aDZxcndwbzZ5b2JybWFleXNhZmh4Y3BhdnJsNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbnUQpnihPSIgIXuZv/giphy.gif',
      dimensions: '480 x 480',
      dateAdded: new Date(Date.now() - 3600000 * 48).toISOString(),
      tags: ['Animated GIF', 'Sticker'],
      isGoodMorningMeme: false,
      isLargeVideo: false,
      isAnimated: true,
      isBlurry: false,
      confidenceScore: 0.88,
      status: 'pending'
    },
    {
      id: 'demo-6',
      name: 'VID_20240915_Drone_Beach.MP4',
      type: 'video',
      mimeType: 'video/mp4',
      size: 92000000, // 92 MB
      formattedSize: '92.0 MB',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      dimensions: '1920 x 1080',
      duration: '00:58',
      dateAdded: new Date(Date.now() - 3600000 * 60).toISOString(),
      tags: ['Large Video'],
      isGoodMorningMeme: false,
      isLargeVideo: true,
      isAnimated: false,
      isBlurry: false,
      confidenceScore: 0,
      status: 'pending'
    },
    {
      id: 'demo-7',
      name: 'Blurry_Pocket_Photo.jpg',
      type: 'image',
      mimeType: 'image/jpeg',
      size: 1200000, // 1.2 MB
      formattedSize: '1.2 MB',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      dimensions: '1920 x 1080',
      dateAdded: new Date(Date.now() - 3600000 * 72).toISOString(),
      tags: ['Blurry / Pocket Shot'],
      isGoodMorningMeme: false,
      isLargeVideo: false,
      isAnimated: false,
      isBlurry: true,
      confidenceScore: 0.85,
      status: 'pending'
    },
    {
      id: 'demo-8',
      name: 'Coffee_Cup_Morning_Vibes.jpg',
      type: 'image',
      mimeType: 'image/jpeg',
      size: 2800000, // 2.8 MB
      formattedSize: '2.8 MB',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      dimensions: '1440 x 1440',
      dateAdded: new Date(Date.now() - 3600000 * 84).toISOString(),
      tags: ['Good Morning Meme', 'Greeting'],
      isGoodMorningMeme: true,
      isLargeVideo: false,
      isAnimated: false,
      isBlurry: false,
      confidenceScore: 0.91,
      detectedText: 'Good Morning! Fresh Coffee & Happy Sunday ☕❤️',
      status: 'pending'
    }
  ];

  // Always sort demo files from largest to smallest by default
  return demoItems.sort((a, b) => b.size - a.size);
}

// Parse imported native user files
export async function parseUserFile(file) {
  const isVideo = file.type.startsWith('video/');
  const isGif = file.type === 'image/gif' || file.name.endsWith('.gif');
  const url = URL.createObjectURL(file);

  return {
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: isVideo ? 'video' : 'image',
    mimeType: file.type,
    size: file.size,
    formattedSize: formatBytes(file.size),
    url: url,
    videoUrl: isVideo ? url : null,
    fileObject: file,
    dateAdded: new Date(file.lastModified || Date.now()).toISOString(),
    dimensions: 'Processing...',
    tags: [isVideo ? 'Video' : isGif ? 'GIF' : 'Photo'],
    isGoodMorningMeme: false,
    isLargeVideo: isVideo && file.size > 20000000, // >20MB
    isAnimated: isGif,
    isBlurry: false,
    confidenceScore: 0,
    status: 'pending'
  };
}
