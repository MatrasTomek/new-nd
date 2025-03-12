import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
	public itemSelected$ = new BehaviorSubject<ProjectItem | null>(null);

	selectItem(item: ProjectItem) {
		this.itemSelected$.next(item);
	}
}
