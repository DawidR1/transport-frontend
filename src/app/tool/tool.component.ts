import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css']
})
export class ToolComponent implements OnInit {

  constructor() { }
  private is: boolean
  ngOnInit() {
  }

  showLocation() {
    this.is = true;
  }
}
