import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter',
})
export class CategoryFilterPipe implements PipeTransform {
  transform(categories: any[], searchText: string): any[] {
    if (!categories) return [];
    if (!searchText) return categories;

    searchText = searchText.toLowerCase();

    // Check if 'name' is a string and then apply the filter
    return categories.filter((category) => {
      const name = category?.name;
      return (
        name &&
        typeof name === 'string' &&
        name.toLowerCase().includes(searchText)
      );
    });
  }
}
