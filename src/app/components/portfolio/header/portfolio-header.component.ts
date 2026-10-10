import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationService } from '../../../core/navigation.service';

@Component({
  selector: 'app-portfolio-header',
  standalone: true,
  templateUrl: './portfolio-header.component.html',
  styleUrl: './portfolio-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioHeaderComponent {
  private readonly navigation = inject(NavigationService);
  readonly homeHref = this.navigation.homeUrl();
  readonly experienceHref = this.navigation.experienceUrl();
  readonly projectsHref = this.navigation.projectsUrl();
  readonly publicationsHref = this.navigation.publicationsUrl();
  readonly cloudHref = this.navigation.cloudUrl();

  get homeActive(): boolean {
    return this.navigation.isActive(this.homeHref);
  }

  get experienceActive(): boolean {
    return this.navigation.isActive(this.experienceHref);
  }

  get projectsActive(): boolean {
    return this.navigation.isActive(this.projectsHref);
  }

  get publicationsActive(): boolean {
    return this.navigation.isActive(this.publicationsHref);
  }

  openHome(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.navigation.goHome();
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
}