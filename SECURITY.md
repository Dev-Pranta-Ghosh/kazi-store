# Security Policy

## Supported Versions

Security updates are provided for the latest version of this project.

| Version | Supported |
| ------- | --------- |
| Latest  | ✅ Yes     |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it privately rather than opening a public GitHub issue.

Please include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any relevant screenshots or technical details

You can report security issues by contacting:

**Pranta Ghosh**

GitHub: [Dev-Pranta-Ghosh](https://github.com/Dev-Pranta-Ghosh)

## Security Notes

- Do not commit API keys, passwords, tokens, or other sensitive credentials.
- Environment variables should be stored in `.env` or `.env.local` files.
- Sensitive environment files are excluded through `.gitignore`.
- Production payment credentials and third-party API keys should never be exposed in frontend code.
- Production deployments should use HTTPS and properly configured backend security controls.

Thank you for helping keep this project secure.
