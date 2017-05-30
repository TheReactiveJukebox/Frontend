import { Component, OnInit } from '@angular/core';
import { Title } from '../../models/title';
import { TitleService } from '../../services/title.service';

@Component({
    selector: 'title-list',
    templateUrl: './title-list.component.html',
    styleUrls: ['./title-list.component.css']
})
export class TitleListComponent implements OnInit {
    titles: Title[];
    
    constructor(private titleService: TitleService) {}
    
    ngOnInit(): void {
        this.getTitles();
    }
    
    getTitles(): void {
        this.titleService.getTitles().then(titles => this.titles = titles);
    }
}
