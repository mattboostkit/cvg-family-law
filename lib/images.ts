// Professional stock images from Unsplash for family law website
// All images are free to use via Unsplash API

export const images = {
  // Hero and general images
  hero: {
    main: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=1080&fit=crop", // Professional woman lawyer
    support: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&h=1080&fit=crop", // Supportive hands
    family: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&h=1080&fit=crop", // Family together
  },
  
  // Service specific images
  services: {
    domesticAbuse: "https://images.unsplash.com/photo-1559234938-b60fff04894d?w=800&h=600&fit=crop", // Supportive embrace
    childrenLaw: "https://images.unsplash.com/photo-1471565661762-b9dfae862dbe?w=800&h=600&fit=crop", // Child and parent hands
    divorce: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800&h=600&fit=crop", // Rings on paper
    financial: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop", // Calculator and documents
  },
  
  // Team images
  team: {
    partner1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop", // Professional male lawyer
    partner2: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop", // Professional female lawyer
    office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop", // Modern law office
  },
  
  // Support and hope images
  hope: {
    sunrise: "https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1920&h=600&fit=crop", // Hopeful sunrise
    handsSupport: "https://images.unsplash.com/photo-1461532257246-777de18cd58b?w=800&h=600&fit=crop", // Supporting hands
    counselling: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop", // Counselling session
    familyWalking: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=600&fit=crop", // Family walking together
  },
  
  // Testimonial avatars
  testimonials: {
    sarah: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", // Female avatar 1
    michael: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop", // Male avatar
    emma: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop", // Female avatar 2
  },
  
  // Legal and trust images
  legal: {
    scales: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=600&fit=crop", // Scales of justice
    courthouse: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop", // Courthouse
    documents: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop", // Legal documents
    consultation: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=1200&h=600&fit=crop", // Legal consultation
  },
  
  // Background patterns and textures
  patterns: {
    warmGradient: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop", // Warm gradient
    lightTexture: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1920&h=1080&fit=crop", // Light abstract
  },
};

// Image optimization function for Next.js
export const getOptimizedImageUrl = (url: string, width?: number, height?: number) => {
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('fit', 'crop');
  params.append('q', '80'); // Quality 80 for good balance
  params.append('auto', 'format'); // Auto format selection
  
  return `${baseUrl}?${params.toString()}`;
};