import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portfolio-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-projects.component.html',
  styleUrl: './portfolio-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioProjectsComponent {}