import {defineField, defineType} from 'sanity'

export const Blog = defineType({
  name: 'BlogPost',
  title: 'Blog',
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
    name: "image",
    title: "Main image",
    type: "image",
    options: {
        hotspot: true
    }
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