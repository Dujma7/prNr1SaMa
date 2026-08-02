import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'Poticajna-misao',
  title: 'Poticajna misao',
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
        name: "misao",
        title: "misao",
        type: "string", 
    }),
    defineField({
        name: "image1",
        title: "Prva slika",
        type: "image", 
    }),
    defineField({
        name: "paragraph1",
        title: "Prvi paragraf",
        type: "string", 
    }),
    defineField({
        name: "paragraph2",
        title: "Drugi paragraf",
        type: "string", 
    }),
  ],
})