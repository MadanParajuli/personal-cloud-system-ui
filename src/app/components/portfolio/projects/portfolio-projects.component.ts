import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/app-routes';

@Component({
  selector: 'app-portfolio-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-projects.component.html',
  styleUrl: './portfolio-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioProjectsComponent {
  readonly routes = APP_ROUTES;
}