import { Component } from '@angular/core';
import { ProjectItem } from 'src/app/models/project-item.model';
import { projectsItems } from 'src/assets/content/projects/project-content';

@Component({
	selector: 'app-projects-page',
	templateUrl: './projects-page.component.html',
	styleUrls: ['./projects-page.component.scss'],
	standalone: false,
})
export class ProjectsPageComponent {
	projects: ProjectItem[] = projectsItems;
}
