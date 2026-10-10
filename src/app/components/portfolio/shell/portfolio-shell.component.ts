import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioHeaderComponent } from '../header/portfolio-header.component';

@Component({
  selector: 'app-portfolio-shell',
  standalone: true,
  imports: [PortfolioHeaderComponent, RouterOutlet],
  templateUrl: './portfolio-shell.component.html',
  styleUrl: './portfolio-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioShellComponent {
  readonly currentYear = new Date().getFullYear();
}