import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

// TODO: Replace this with your own data model type
export interface MemberListItem {
  name: string;
  id: number;
  number: string;
  team: string;
  email: string;
  birthDate: string;
  startDate: string;
  hasOutstandingMembershipPayment: boolean;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: MemberListItem[] = [
  {
    id: 1,
    name: 'Hydrogen',
    number: '32123',
    email: 'hydrogen@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 2,
    name: 'Helium',
    number: '32124',
    email: 'helium@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 3,
    name: 'Lithium',
    number: '32125',
    email: 'lithium@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 4,
    name: 'Beryllium',
    number: '32126',
    email: 'beryllium@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 5,
    name: 'Boron',
    number: '32127',
    email: 'boron@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 6,
    name: 'Carbon',
    number: '32128',
    email: 'carbon@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 7,
    name: 'Nitrogen',
    number: '32129',
    email: 'nitrogen@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 8,
    name: 'Oxygen',
    number: '32130',
    email: 'oxygen@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 9,
    name: 'Fluorine',
    number: '32131',
    email: 'fluorine@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 10,
    name: 'Neon',
    number: '32132',
    email: 'neon@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 11,
    name: 'Sodium',
    number: '32133',
    email: 'sodium@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 12,
    name: 'Magnesium',
    number: '32134',
    email: 'magnesium@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 13,
    name: 'Aluminum',
    number: '32135',
    email: 'aluminum@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 14,
    name: 'Silicon',
    number: '32136',
    email: 'silicon@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 15,
    name: 'Phosphorus',
    number: '32137',
    email: 'phosphorus@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 16,
    name: 'Sulfur',
    number: '32138',
    email: 'sulfur@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 17,
    name: 'Chlorine',
    number: '32139',
    email: 'chlorine@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 18,
    name: 'Argon',
    number: '32140',
    email: 'argon@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 19,
    name: 'Potassium',
    number: '32141',
    email: 'potassium@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
  {
    id: 20,
    name: 'Calcium',
    number: '32142',
    email: 'calcium@gmail.com',
    team: 'Mellemholdet',
    birthDate: '2005-12-11',
    startDate: '2018-04-21',
    hasOutstandingMembershipPayment: true,
  },
];

/**
 * Data source for the MemberList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MemberListDataSource extends DataSource<MemberListItem> {
  data: MemberListItem[] = EXAMPLE_DATA;
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
  connect(): Observable<MemberListItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [observableOf(this.data), this.paginator.page, this.sort.sortChange];

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
  private getPagedData(data: MemberListItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: MemberListItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      this.sort.active = 'name';
      this.sort.direction = 'asc';
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'number':
          return compare(a.number, b.number, isAsc);
        case 'email':
          return compare(a.email, b.email, isAsc);
        case 'id':
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
