# Contributing to Picasso

Thank you for your interest in contributing to Picasso!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Set up environment variables (see SETUP_GUIDE.md)
5. Run development server: `npm run dev`

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API routes
│   ├── page.tsx     # Main page
│   └── layout.tsx   # Root layout
├── components/       # React components
└── lib/             # Utilities and types
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and single-purpose

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages: `git commit -m "Add feature: description"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Testing

Before submitting a PR, test:

- [ ] Voice connection works
- [ ] Conversation flows naturally
- [ ] Image generation completes
- [ ] Download functionality works
- [ ] Mobile responsive design
- [ ] Error handling
- [ ] Browser compatibility (Chrome, Safari, Firefox)

## Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure code has no linter errors
- Update documentation if needed

## Areas for Contribution

- **Bug fixes**: Check open issues
- **UI/UX improvements**: Enhance the design
- **Features**: See Future Enhancements in README
- **Documentation**: Improve guides and comments
- **Testing**: Add test coverage
- **Performance**: Optimize loading and generation

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

Open an issue or discussion on GitHub.

Thank you for contributing! 🎨

