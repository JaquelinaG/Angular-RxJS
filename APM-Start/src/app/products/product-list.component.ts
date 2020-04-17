import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { ProductService } from './product.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  private errorMessageSubject = new Subject<string>();
  private categorySelectedSubject = new BehaviorSubject<number>(0);

  errorMessage$ = this.errorMessageSubject.asObservable();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();


  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(p => selectedCategoryId ? p.categoryId == selectedCategoryId : true)),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  categories$ = this.categoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private productService: ProductService,
    private categoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
