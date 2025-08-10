import { Component } from '@angular/core';
import { NavBar } from "../../shared/components/nav-bar/nav-bar";

@Component({
  selector: 'app-layout',
  imports: [NavBar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
