import { RenderMode, ServerRoute } from '@angular/ssr';
import { APP_ROUTE_SEGMENTS } from './core/app-routes';

export const serverRoutes: ServerRoute[] = [
  { path: APP_ROUTE_SEGMENTS.root, renderMode: RenderMode.Prerender },
  { path: APP_ROUTE_SEGMENTS.home, renderMode: RenderMode.Prerender },
  { path: APP_ROUTE_SEGMENTS.experience, renderMode: RenderMode.Prerender },
  { path: APP_ROUTE_SEGMENTS.projects, renderMode: RenderMode.Prerender },
  { path: APP_ROUTE_SEGMENTS.publications, renderMode: RenderMode.Prerender },
  { path: APP_ROUTE_SEGMENTS.cloud, renderMode: RenderMode.Client },
  { path: `${APP_ROUTE_SEGMENTS.cloud}/**`, renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
