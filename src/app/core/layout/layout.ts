import { Component } from '@angular/core';
import { NavBar } from "../../shared/components/nav-bar/nav-bar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [NavBar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
