module core {

    export class SysEvent {
        title: string;
        date: Date;
        authenticated: boolean;
        userProfile: {
            email: string
        }
        
        constructor(title: string) {
            this.title = title;
            this.date = new Date();
        }
    }
}
