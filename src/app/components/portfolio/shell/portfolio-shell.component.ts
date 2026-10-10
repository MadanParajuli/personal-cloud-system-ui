import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { APP_ROUTES } from '../../../core/app-routes';

@Component({
  selector: 'app-portfolio-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './portfolio-shell.component.html',
  styleUrl: './portfolio-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioShellComponent {
  readonly routes = APP_ROUTES;
  readonly currentYear = new Date().getFullYear();
}