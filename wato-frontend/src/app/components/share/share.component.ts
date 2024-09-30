import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html'
})
export class ShareComponent {
  id: string = "";

  constructor(private readonly route: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  protected readonly window = window;
}
