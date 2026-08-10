import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'poezijaPage',
  title: 'Poezija - Glavna Stranica',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Hero Citat',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Autor Citata',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Naslov Sekcije',
      type: 'string',
      initialValue: 'Poezija Sanijele Matković',
    }),
    defineField({
      name: 'paragraphs',
      title: 'Opisni Odlomci',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      description: 'Svaki unos ovdje stvara novi odlomak (<p>) u opisnoj sekciji.',
    }),
  ],
});