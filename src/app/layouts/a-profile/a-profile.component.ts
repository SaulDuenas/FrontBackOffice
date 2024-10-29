import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from "jquery";
@Component({
  selector: 'app-a-profile',
  templateUrl: './a-profile.component.html',
  styleUrls: ['./a-profile.component.css']
})
export class AProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
