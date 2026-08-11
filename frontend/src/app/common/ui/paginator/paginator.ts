import { Component, computed, input, output } from '@angular/core';
import { range } from '../../util';

type PaginatorInfo = {
  currentPage: number;
  totalPages: number;
  perPage: number;
}

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  readonly info = input.required<PaginatorInfo>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => range(1, this.info().totalPages));
  protected readonly current = computed(() => this.info().currentPage);

  protected readonly theresNoPrevious = computed(() => this.info().currentPage == 1);
  protected readonly theresNoNext = computed(() => this.info().currentPage === this.info().totalPages);
}
