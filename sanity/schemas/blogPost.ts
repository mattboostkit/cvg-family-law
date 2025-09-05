// Blog Post Schema - This defines what fields your team can edit
export default {
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Article Title',
      type: 'string',
      description: 'The main headline of your article',
      validation: (Rule: any) => Rule.required().min(10).max(100),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'This will be the web address for your article (auto-generated from title)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Who wrote this article?',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'The main image that appears at the top of the article',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility - describe what the image shows',
        },
      ],
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Select which categories this article belongs to',
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When should this article be published?',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'excerpt',
      title: 'Article Summary',
      type: 'text',
      description: 'A short summary that appears in article previews (2-3 sentences)',
      validation: (Rule: any) => Rule.max(200),
    },
    {
      name: 'body',
      title: 'Article Content',
      type: 'array',
      description: 'Write your article content here',
      of: [
        {
          type: 'block',
          title: 'Block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 1', value: 'h1' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
        {
          type: 'object',
          name: 'callToAction',
          title: 'Call to Action Box',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'CTA Title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'CTA Description',
            },
            {
              name: 'buttonText',
              type: 'string',
              title: 'Button Text',
            },
            {
              name: 'buttonLink',
              type: 'url',
              title: 'Button Link',
            },
          ],
        },
        {
          type: 'object',
          name: 'emergencyBox',
          title: 'Emergency Contact Box',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Emergency Title',
              initialValue: 'Need Urgent Help?',
            },
            {
              name: 'phoneNumber',
              type: 'string',
              title: 'Emergency Phone',
              initialValue: '07984 782 713',
            },
            {
              name: 'message',
              type: 'text',
              title: 'Emergency Message',
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add relevant tags to help people find this article',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Should this article be featured on the homepage?',
      initialValue: false,
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines (leave blank to use main title)',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Description for search engines (leave blank to use excerpt)',
      validation: (Rule: any) => Rule.max(160),
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection: any) {
      const { author, publishedAt } = selection;
      return {
        ...selection,
        subtitle: `${author ? `by ${author}` : 'No author'} • ${
          publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'
        }`,
      };
    },
  },
};
