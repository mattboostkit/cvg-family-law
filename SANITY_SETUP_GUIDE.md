# Sanity CMS Setup Guide for CVG Family Law

This guide will walk you through connecting your Sanity instance to the CVG Family Law website for content management.

## 📋 Prerequisites

- A Sanity account (create one at [sanity.io](https://www.sanity.io))
- Access to your project's environment variables
- Basic understanding of content management systems

---

## 🚀 Step 1: Create Your Sanity Project

### Option A: Create New Project via Sanity CLI
1. Install Sanity CLI globally:
   ```bash
   npm install -g @sanity/cli
   ```

2. Create a new Sanity project:
   ```bash
   sanity init
   ```
   - Choose "Create new project"
   - Project name: "CVG Family Law Content"
   - Use default dataset configuration: `production`
   - Choose "Clean project with no predefined schemas"

### Option B: Create Project via Sanity Dashboard
1. Go to [manage.sanity.io](https://manage.sanity.io)
2. Click "Create new project"
3. Name: "CVG Family Law Content"
4. Keep default dataset: `production`

---

## 🔧 Step 2: Get Your Project Credentials

After creating your project, you'll need two key pieces of information:

1. **Project ID**: Found in your Sanity dashboard at manage.sanity.io
2. **Dataset**: Usually `production` (default)

Example:
- Project ID: `abc123def`
- Dataset: `production`

---

## 🌐 Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# In /mnt/c/Dev/Cascade/cvgnext/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

**Important**: Replace `your-actual-project-id-here` with your actual Sanity project ID.

---

## ⚙️ Step 4: Update Configuration Files

### Update sanity.config.ts
Replace the placeholder values in `/sanity.config.ts`:

```typescript
export default defineConfig({
  name: 'default',
  title: 'CVG Family Law Content',
  
  // Replace these with your actual values
  projectId: 'your-actual-project-id', // Your Sanity project ID
  dataset: 'production', // Your dataset name
  
  // ... rest of config stays the same
});
```

### Verify lib/sanity.client.ts
The client configuration should automatically use your environment variables:

```typescript
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
```

---

## 📊 Step 5: Set Up Content Schemas

Your project already includes blog post schemas. To deploy them to your Sanity project:

1. Navigate to your project directory:
   ```bash
   cd /mnt/c/Dev/Cascade/cvgnext
   ```

2. Deploy schemas to your Sanity project:
   ```bash
   npx sanity deploy
   ```

This creates the content structure for:
- **Blog Posts**: Articles with rich content, categories, tags
- **Authors**: Writer profiles and bios
- **Categories**: Content categorization
- **Emergency Resources**: Local support contacts
- **Local Services**: Kent area service directories

---

## 🖥️ Step 6: Access Sanity Studio

### Option A: Local Development Studio
1. Start the local studio:
   ```bash
   npx sanity dev
   ```
2. Open http://localhost:3333 in your browser

### Option B: Hosted Studio (Recommended for Team Use)
1. Deploy your studio to Sanity's hosted platform:
   ```bash
   npx sanity deploy
   ```
2. Choose a studio hostname (e.g., `cvg-family-law`)
3. Access at: `https://cvg-family-law.sanity.studio`

---

## 📝 Step 7: Create Initial Content

### Add Authors
1. Go to "Authors" in your Sanity Studio
2. Create author profiles for your team:
   - **Name**: e.g., "CVG Family Law Team"
   - **Bio**: Brief professional description
   - **Image**: Professional headshot

### Add Categories
Create these essential categories:
- **Legal Updates**: News and law changes
- **Survivor Resources**: Support and guidance
- **Local Resources**: Kent-specific services
- **Understanding Abuse**: Educational content
- **Children & Family**: Child-focused articles

### Create Your First Blog Post
1. Click "Blog Posts" → "Create"
2. Fill in the required fields:
   - **Title**: Your article headline
   - **Slug**: Auto-generates from title
   - **Author**: Select from dropdown
   - **Category**: Choose relevant category
   - **Content**: Use the rich text editor
   - **Featured**: Check to show on homepage

---

## 🔒 Step 8: Configure API Permissions

### For Public Website Data
Your current setup uses public, read-only access which is perfect for displaying blog content.

### For Admin Content Management
If you need to create/edit content via the website:
1. Go to manage.sanity.io → Your Project → API
2. Add API tokens if needed
3. Set appropriate permissions

---

## 🧪 Step 9: Test the Connection

### Verify Environment Variables
```bash
# Check your variables are loaded
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET
```

### Test the Blog Page
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Visit http://localhost:3000/blog
3. Check browser console for any Sanity connection errors

### Test Content Queries
In your Sanity Studio, use the "Vision" tab to test GROQ queries:
```groq
*[_type == "blogPost"] | order(publishedAt desc) [0...5] {
  title,
  slug,
  publishedAt,
  "author": author->name
}
```

---

## 🚨 Troubleshooting

### Common Issues

**"Project not found" error**
- Double-check your `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
- Ensure the project ID matches exactly from manage.sanity.io

**"Unauthorized" errors**
- Verify your dataset name (usually `production`)
- Check if your project has public read access enabled

**Schema not found errors**
- Run `npx sanity deploy` to deploy your schemas
- Check that schemas are correctly exported in `sanity/schemas/index.ts`

**Images not loading**
- Verify the `urlFor` function is working
- Check that your project has public image access

### Getting Help

1. **Sanity Documentation**: [sanity.io/docs](https://www.sanity.io/docs)
2. **Community**: [sanity.io/help](https://www.sanity.io/help)
3. **Project Issues**: Check the project's GitHub issues

---

## 📈 Step 10: Content Strategy

### Recommended Content Schedule
- **Weekly**: 1-2 blog posts on domestic abuse support
- **Monthly**: Legal update articles for Kent region
- **Quarterly**: Resource guides and comprehensive content

### Content Types Priority
1. **Domestic Abuse Support Articles** - Primary focus
2. **Local Kent Resources** - Community-specific help
3. **Legal Updates** - Current law changes
4. **FAQ Content** - Common questions answered

### SEO Optimization
- Include location keywords: "Kent", "Tunbridge Wells", "Sevenoaks"
- Use relevant legal terms: "domestic abuse solicitor", "family law"
- Write meta descriptions for better search visibility

---

## ✅ Final Checklist

- [ ] Sanity project created
- [ ] Project ID and dataset obtained
- [ ] Environment variables configured
- [ ] Schemas deployed
- [ ] Studio accessible
- [ ] Authors and categories created
- [ ] Test blog post published
- [ ] Website displays content correctly

---

## 🔐 Security Notes

- **Never commit** `.env.local` to git (it's already in `.gitignore`)
- Use **environment variables** for all sensitive data
- Enable **CORS** only for your domain in Sanity settings
- Set up **API rate limits** if using tokens

---

*This guide was created for the CVG Family Law website. For technical support, consult the project documentation or contact your development team.*