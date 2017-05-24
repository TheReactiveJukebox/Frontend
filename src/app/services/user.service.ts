import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IUser } from '../models/user';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

    public userId: number;
    private userBeh: BehaviorSubject<IUser>;

    constructor(private http: Http) {
        this.userBeh = new BehaviorSubject(null);
    }

    public setUser(user: IUser): void {
        this.userBeh.next(user);
    }

    public getUserObservable(): Observable<IUser> {
        return this.userBeh.asObservable();
    }

    public getUser(): IUser {
        return this.userBeh.getValue();
    }

}