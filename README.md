# Madan Parajuli | Research Portfolio

Angular 22 SSR portfolio with a public home page and publications entry, plus the existing Personal Cloud client for the Spring Boot API.

## Routes

| Route | Page |
| --- | --- |
| `/` | Redirects to `/home` |
| `/home` | Portfolio home |
| `/experience` | Work experience |
| `/projects` | Selected projects |
| `/publications` | Publication profile linked to Google Scholar |
| `/cloud` | Redirects to the cloud dashboard when signed in, otherwise to sign-in |
| `/cloud/login` | Personal Cloud sign-in |
| `/cloud/dashboard` | Cloud overview |
| `/cloud/files` | File manager |
| `/cloud/storage` | Storage details |

## Angular structure

```text
src/app/
├── app.ts, app.html, app.scss, app.spec.ts
├── components/
│   ├── portfolio/
│   │   ├── cloud-entry/
│   │   ├── experience/
│   │   ├── home/
│   │   ├── projects/
│   │   ├── publications/
│   │   └── shell/
│   ├── dashboard/
│   ├── file-manager/
│   ├── login/
│   ├── shell/
│   └── storage/
├── services/
│   ├── auth.service.ts / auth.service.spec.ts
│   ├── file.service.ts / file.service.spec.ts
│   ├── folder.service.ts / folder.service.spec.ts
│   ├── health.service.ts / health.service.spec.ts
│   └── storage.service.ts / storage.service.spec.ts
└── core/
	├── guards/
	├── interceptors/
	└── shared models and utilities
```

Each portfolio component has its own folder, keeping its `.ts`, `.html`, and `.scss` files together. Components and services are standalone/injectable and are referenced by their owning routes or consumers.

## Development server

Start the backend, then run:

```bash
npm install
npm start
```

Open `http://localhost:4200/` for the portfolio or `http://localhost:4200/cloud` for Personal Cloud. Development API requests use `http://localhost:8080/api/v1`, configured in `src/environments/environment.ts`. Set the production API base in `src/environments/environment.prod.ts`.

## Backend integration

The client follows the repository's `/api/v1` contract:

| Capability                      | Endpoint                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| Health and capacity             | `GET /health`, `GET /storage`                                                                 |
| Login, refresh, logout          | `POST /auth/login`, `/auth/refresh`, `/auth/logout`                                           |
| List files                      | `GET /files?path=...`                                                                         |
| Upload one file                 | `POST /files/upload` with multipart `file` and `path` fields                                  |
| Download / rename / delete file | `GET /files/{id}/download`, `PATCH /files/{id}?name=...&parentPath=...`, `DELETE /files/{id}` |
| List folders                    | `GET /folders?path=...`                                                                       |
| Create / rename / delete folder | `POST /folders`, `PATCH /folders/{id}`, `DELETE /folders/{id}`                                |

Access and refresh tokens are held in memory only. A full page reload clears the session and requires signing in again. Access-token expiry is handled with the backend's rotating refresh endpoint.

The backend exposes storage totals and health, but no recent-activity endpoint. The UI omits Recent rather than inventing activity.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
