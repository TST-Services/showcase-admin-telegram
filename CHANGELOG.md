# Changelog

## [2.0.0] - Migration to Next.js

### Added

- ✅ Next.js 15 with App Router
- ✅ Server Actions instead of REST API
- ✅ Image upload component with ImgBB integration
- ✅ Automatic image upload for logos, category images, and product icons
- ✅ Image preview before upload
- ✅ Client-side validation (file type, size)
- ✅ Telegram Web App integration
- ✅ Dark theme support

### Changed

- 🔄 Migrated from Vite + Express to Next.js
- 🔄 Replaced React Router with Next.js routing
- 🔄 Changed from REST API to Server Actions
- 🔄 Updated all forms to use image upload instead of URL input

### Removed

- ❌ Express server
- ❌ Separate API endpoints
- ❌ React Router DOM
- ❌ Vite configuration
- ❌ Manual URL input for images

### Technical Details

- Prisma Client with singleton pattern
- Server Actions with `"use server"` directive
- Client Components with `"use client"` directive
- Tailwind CSS v3
- TypeScript strict mode

## [1.0.0] - Initial Release (Vite + Express)

### Features

- User authentication via Telegram ID
- Showcase management (CRUD)
- Topics management
- Categories management
- Products management
- Telegram Mini App integration
