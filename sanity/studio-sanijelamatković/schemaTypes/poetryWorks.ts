import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'poezijaWork',
  title: 'Poezija - Pojedinačno Djelo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov Pjesme',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stanzas',
      title: 'Strofe',
      type: 'array',
      of: [{ type: 'text', rows: 5 }],
      description: 'Svaki unos je jedna strofa. Unutar strofe novi redak postaje <br>.',
    }),
  ],
});