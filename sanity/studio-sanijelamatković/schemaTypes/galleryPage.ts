// schemas/galleryPage.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryPage',
  title: 'Slikarstvo',
  type: 'document',
  fields: [
    defineField({
      name: 'albumTitle',
      title: 'Naslov Albuma',
      type: 'string',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Slike u Albumu',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryImageItem',
          title: 'Slika i Naziv',
          fields: [
            defineField({
              name: 'title',
              title: 'Naziv Slike',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Slika',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
          },
        },
      ],
    }),
  ],
})