import {defineField, defineType} from 'sanity'

export const RaSl = defineType({
  name: 'blogPost',
  title: 'Radionica slikanja',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Datum',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'content',
      title: 'Sadržaj',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      validation: Rule => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
    },
  },
})