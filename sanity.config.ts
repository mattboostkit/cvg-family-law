import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

function safeEnv(name: string, fallback: string) {
  const value = process.env[name];
  if (!value) {
    console.warn(`Missing ${name} environment variable. Falling back to ${fallback}.`);
    return fallback;
  }
  return value;
}

const projectId = safeEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '0f7hvf5c');
const dataset = safeEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');

export default defineConfig({
  name: 'default',
  title: 'CVG Family Law Content',
  projectId,
  dataset,
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
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
