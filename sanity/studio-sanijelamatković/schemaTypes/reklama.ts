import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sponsorAd',
  title: 'Sponzori i Reklame',
  type: 'document',
  fields: [
    defineField({
      name: 'sponsorName',
      title: 'Naziv sponzora',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'desktopImage',
      title: 'Slika za Desktop / Računala (Horizontalna)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Slika za Mobitela (Opcionalno - Kvadratna ili uža slika)',
      type: 'image',
      description: 'Ako se ne prenese, koristit će se Desktop slika.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'destinationUrl',
      title: 'Link / URL sponzora',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktivna reklama (Prikazuje se na stranici)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});