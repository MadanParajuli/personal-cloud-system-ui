import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { NavigationService } from '../../../core/navigation.service';

@Component({
  selector: 'app-portfolio-home',
  standalone: true,
  templateUrl: './portfolio-home.component.html',
  styleUrl: './portfolio-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioHomeComponent {
  private readonly navigation = inject(NavigationService);
  readonly publicationsHref = this.navigation.publicationsUrl();
  readonly cloudHref = this.navigation.cloudUrl();
  readonly experienceHref = this.navigation.experienceUrl();
  readonly projectsHref = this.navigation.projectsUrl();

  openPublications(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.navigation.goToPublications();
  }

  openPersonalCloud(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.navigation.goToCloud();
  }

  openExperience(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.navigation.goToExperience();
  }

  openProjects(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.navigation.goToProjects();
  }
}