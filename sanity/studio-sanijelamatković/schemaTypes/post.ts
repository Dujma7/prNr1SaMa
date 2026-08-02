import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'Blog',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL upisa)',
      type: "slug",
      options: {
    source: 'title',
  },
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: "date",
    }),
    defineField({
        name: "paragraph1",
        title: "Prvi paragraf",
        type: "string", 
    }),
    defineField({
        name: "image1",
        title: "Prva slika",
        type: "image", 
    }),
    defineField({
        name: "paragraph2",
        title: "Drugi paragraf",
        type: "string", 
    }),
    defineField({
        name: "paragraph3",
        title: "Treći paragraf",
        type: "string", 
    }),
    defineField({
        name: "image2",
        title: "Druga slika",
        type: "image", 
    }),
    defineField({
        name: "paragraph4",
        title: "Četvrti paragraf",
        type: "string", 
    })
  ],
})