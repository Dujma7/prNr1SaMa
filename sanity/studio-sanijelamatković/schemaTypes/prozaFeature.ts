import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'prozaFeature',
  title: 'Proza - Obilježja',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov Obilježja',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Opis Obilježja',
      type: 'text',
      rows: 3,
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