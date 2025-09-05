import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

// IMPORTANT: Replace these with your actual Sanity project details
export default defineConfig({
  name: 'default',
  title: 'CVG Family Law Content',

  // TODO: Replace with your Sanity project ID and dataset
  projectId: 'your-project-id', // Find this in manage.sanity.io
  dataset: 'production', // Usually 'production' or 'development'

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .child(
                S.documentList()
                  .title('All Blog Posts')
                  .filter('_type == "blogPost"')
              ),
            S.listItem()
              .title('Authors')
              .child(
                S.documentList()
                  .title('All Authors')
                  .filter('_type == "author"')
              ),
            S.listItem()
              .title('Categories')
              .child(
                S.documentList()
                  .title('All Categories')
                  .filter('_type == "category"')
              ),
            S.divider(),
            S.listItem()
              .title('Emergency Resources')
              .child(
                S.documentList()
                  .title('Emergency Contacts')
                  .filter('_type == "emergencyResource"')
              ),
            S.listItem()
              .title('Local Services')
              .child(
                S.documentList()
                  .title('Kent Area Services')
                  .filter('_type == "localService"')
              ),
          ]),
    }),
    visionTool(), // Query testing tool
  ],

  schema: {
    types: schemaTypes,
  },
});
