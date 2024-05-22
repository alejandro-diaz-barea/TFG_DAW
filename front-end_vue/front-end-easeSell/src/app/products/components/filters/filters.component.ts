import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  categories: Category[] = [];
  selectedCategories: number[] = [];
  searchTerm: string = '';
  filteredOptions: string[] = [];
  searchTermControl: FormControl = new FormControl();

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();
  @Output() filterApplied: EventEmitter<number[]> = new EventEmitter<number[]>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.searchTermControl.valueChanges.subscribe(() => this.filterOptions());
  }

  fetchCategories(): void {
    this.http.get<any>('http://127.0.0.1:8000/api/v1/categories').subscribe(
      (response: any) => {
        this.categories = response.map((category: any) => ({
          id: category.id,
          categoryname: category.categoryname
        }));
        this.filteredOptions = this.categories.map((category: any) => category.categoryname);
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }


  toggleCategorySelection(category: Category): void {
    const categoryId = category.id;
    const index = this.selectedCategories.indexOf(categoryId);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
  }





  closeFilterPopup(): void {
    this.closePopup.emit();
  }

  filterOptions(): void {
    if (!this.searchTermControl.value) {
      this.filteredOptions = this.categories.map((category: any) => category.categoryname);
    } else {
      this.filteredOptions = this.categories.filter(
        category => category.categoryname.toLowerCase().includes(this.searchTermControl.value.toLowerCase())
      ).map((category: any) => category.categoryname);
    }
  }




  applyFilter(): void {
    this.closePopup.emit();
    this.filterApplied.emit(this.selectedCategories);
    console.log('Selected categories:', this.selectedCategories);
  }

}
