import { Injectable } from '@angular/core';

@Injectable()
export class MemberService {

    constructor() { }

    getMembers(): Promise<any> {
        return Promise.resolve([
            { name: 'Joen' },
            { name: 'Glennie' }
        ]);
    }

}
