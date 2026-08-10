import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'prozaReview',
  title: 'Proza - Recenzije Knjiga',
  type: 'document',
  fields: [
    defineField({
      name: 'bookTitle',
      title: 'Naslov Knjige',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewText',
      title: 'Tekst Recenzije',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Redoslijed prikaza',
      type: 'number',
      initialValue: 0,
    }),
  ],
});