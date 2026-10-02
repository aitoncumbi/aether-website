# Aether website

The website and documentation for [Aether](https://github.com/aitoncumbi/Aeather),
S3-compatible object storage you run on your own servers.

Built with Next.js and [Fumadocs](https://fumadocs.dev), deployed by Vercel.

- `app/(home)/`: the landing page
- `content/docs/`: the documentation, one MDX file per page; `meta.json` sets the order
- `public/`: images, such as the console screenshot

## Develop

```sh
npm ci
npm run dev          # http://localhost:3000
npm run lint
npm run types:check
npm run build
```

Docs describe the current release of Aether. When a change to Aether changes
how it is installed, configured or used, update the matching page here.

## License

[MIT](LICENSE)
