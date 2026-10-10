import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-publications',
  standalone: true,
  templateUrl: './portfolio-publications.component.html',
  styleUrl: './portfolio-publications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioPublicationsComponent {
  readonly publications = [
    {
      title: 'Deep-learning detection of mild cognitive impairment from sleep electroencephalography for patients with Parkinson’s disease',
      authors: 'Madan Parajuli, A. Amara, M. Shaban',
      venue: 'PLOS ONE',
      year: 2023,
      doi: '10.1371/journal.pone.0286506',
    },
    {
      title: 'A Novel Deep-Learning Based Approach for Mild Cognitive Impairment Screening in Patients with Parkinson’s Disease',
      authors: 'Madan Parajuli, A. Amara, M. Shaban',
      venue: 'IEEE International Conference on Artificial Intelligence, Blockchain, and Internet of Things',
      year: 2023,
      doi: '10.1109/AIBThings58340.2023.10292456',
    },
    {
      title: 'Screening of Mild Cognitive Impairment in Patients with Parkinson’s Disease Using a Variational Mode Decomposition Based Deep-Learning',
      authors: 'Madan Parajuli, A. Amara, M. Shaban',
      venue: 'International IEEE/EMBS Conference on Neural Engineering',
      year: 2023,
      doi: '10.1109/NER52421.2023.10123759',
    },
    {
      title: 'Efficient Identification of Melanocytic Nuclei in Pathology Images for Melanoma Diagnosis Using a Weakly-Supervised Deep Learning Framework',
      authors: 'Madan Parajuli, M. Shaban, Thuy Phung',
      venue: 'SoutheastCon',
      year: 2022,
      doi: '10.1109/SoutheastCon48659.2022.9764004',
    },
    {
      title: 'Automated differentiation of skin melanocytes from keratinocytes in high-resolution histopathology images using a weakly-supervised deep-learning framework',
      authors: 'Madan Parajuli, M. Shaban, Thuy Phung',
      venue: 'International Journal of Imaging Systems and Technology',
      year: 2022,
      doi: '10.1002/ima.22810',
    },
    {
      title: 'Deep-Learning-Based Detection of Skin Cells in High-Resolution Histopathology Images for Melanoma Diagnosis',
      authors: 'Madan Parajuli',
      venue: 'University of South Alabama, Thesis',
      year: 2022,
      doi: 'https://www.proquest.com/openview/706c2c7bd4cf1f3d6724fd4311c74bcf/1?pq-origsite=gscholar&cbl=18750&diss=y',
    }
  ] as const;
}