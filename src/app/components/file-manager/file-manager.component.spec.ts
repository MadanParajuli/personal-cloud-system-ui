import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FileManagerComponent } from './file-manager.component';
import { FileService } from '../../services/file.service';
import { FolderService } from '../../services/folder.service';

describe('FileManagerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileManagerComponent],
      providers: [
        { provide: FileService, useValue: { list: () => of([]) } },
        { provide: FolderService, useValue: { list: () => of([]) } },
      ],
    }).compileComponents();
  });

  it('renders the empty state when the current folder has no items', () => {
    const fixture = TestBed.createComponent(FileManagerComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nothing here yet');
    expect(fixture.nativeElement.textContent).toContain('Upload files');
  });
});
