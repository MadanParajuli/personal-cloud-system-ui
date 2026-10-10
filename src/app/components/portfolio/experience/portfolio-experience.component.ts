import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-experience',
  standalone: true,
  templateUrl: './portfolio-experience.component.html',
  styleUrl: './portfolio-experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioExperienceComponent {}