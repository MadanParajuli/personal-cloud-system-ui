import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/app-routes';

@Component({
  selector: 'app-portfolio-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-home.component.html',
  styleUrl: './portfolio-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioHomeComponent {
  readonly routes = APP_ROUTES;
}