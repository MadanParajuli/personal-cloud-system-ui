import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { NavigationService } from '../../../core/navigation.service';

@Component({
  selector: 'app-portfolio-projects',
  standalone: true,
  templateUrl: './portfolio-projects.component.html',
  styleUrl: './portfolio-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioProjectsComponent {
  private readonly navigation = inject(NavigationService);
  readonly cloudHref = this.navigation.cloudUrl();

  openPersonalCloud(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.navigation.goToCloud();
  }
}