// schemas/aboutPage.js
export default {
  name: 'aboutPage',
  title: 'O Meni Stranica',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Citat na vrhu',
      type: 'text',
      rows: 3,
    },
    {
      name: 'profileImage',
      title: 'Slika Profila',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'paragraphs',
      title: 'Odlomci Biografije',
      type: 'array',
      of: [{ type: 'text' }],
      description: 'Svaki unos je jedan odlomak teksta.',
    },
  ],
}