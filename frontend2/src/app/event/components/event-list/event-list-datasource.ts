import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, Observable, of as observableOf } from "rxjs";
import { map } from "rxjs/operators";

// TODO: Replace this with your own data model type
export interface EventListItem {
  name: string;
  id: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: EventListItem[] = [
  { id: 1, name: "Hydrogen Event " },
  { id: 2, name: "Helium Event" },
  { id: 3, name: "Lithium Event" },
  { id: 4, name: "Beryllium Event" },
  { id: 5, name: "Boron Event" },
  { id: 6, name: "Carbon Event" },
  { id: 7, name: "Nitrogen Event" },
  { id: 8, name: "Oxygen Event" },
  { id: 9, name: "Fluorine Event" },
  { id: 10, name: "Neon Event" },
  { id: 11, name: "Sodium Event" },
  { id: 12, name: "Magnesium Event" },
  { id: 13, name: "Aluminum Event" },
  { id: 14, name: "Silicon Event" },
  { id: 15, name: "Phosphorus Event" },
  { id: 16, name: "Sulfur Event" },
  { id: 17, name: "Chlorine Event" },
  { id: 18, name: "Argon Event" },
  { id: 19, name: "Potassium Event" },
  { id: 20, name: "Calcium Event" },
];

/**
 * Data source for the EventList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EventListDataSource extends DataSource<EventListItem> {
  data: EventListItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<EventListItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange,
    ];

    return merge(...dataMutations).pipe(
      map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: EventListItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: EventListItem[]) {
    if (!this.sort.active || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "name":
          return compare(a.name, b.name, isAsc);
        case "id":
          return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
