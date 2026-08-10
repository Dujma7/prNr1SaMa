// schemas/homePage.js
export default {
  name: 'homePage',
  title: 'Početna Stranica',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Naslov',
      type: 'string',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Podnaslov',
      type: 'string',
    },
    {
      name: 'aboutTitle',
      title: 'O Nama - Naslov',
      type: 'string',
    },
    {
      name: 'aboutText',
      title: 'O Nama - Tekst',
      type: 'text',
    },
    {
      name: 'galleryImages',
      title: 'Sany ARTS Galerija',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'promoVideo1',
      title: 'Prva Promocija (Video)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Naslov', type: 'string' },
        { name: 'subtitle', title: 'Podnaslov', type: 'string' },
        { name: 'description', title: 'Opis', type: 'text' },
        { name: 'embedUrl', title: 'YouTube Embed URL', type: 'url' },
      ],
    },
    {
      name: 'promoVideo2',
      title: 'Druga Promocija (Video)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Naslov', type: 'string' },
        { name: 'subtitle', title: 'Podnaslov', type: 'string' },
        { name: 'embedUrl', title: 'YouTube Embed URL', type: 'url' },
      ],
    },
  ],
}