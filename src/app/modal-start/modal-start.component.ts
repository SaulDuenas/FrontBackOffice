import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { UsuarioService } from "../services/usuario/usuario.service";
import * as jwt_decode from "jwt-decode";
@Component({
  selector: "app-modal-start",
  templateUrl: "./modal-start.component.html",
  styleUrls: ["./modal-start.component.css"],
})
export class ModalStartComponent {
  @Input() oldname = "";
  @Output() close = new EventEmitter();
  newname = "";
  showIt = false;
  userToken;
  id_cliente;
  constructor(private usuarioService: UsuarioService) {
    this.leerToken();
  }
  ngOnInit() {
    // copy all inputs to avoid polluting them
    this.newname = this.oldname;
  }

  ok() {
    this.close.emit();
    console.log(this.showIt);
    if (this.showIt) {
      this.usuarioService.setHidePopUp(this.id_cliente).subscribe((data) => {
        console.log(data);
      });
    }
  }

  cancel() {
    this.close.emit();
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.id_cliente = decoded["id_cliente"];
    } else {
      console.log("No hay token");
      this.userToken = "";
    }
    return this.userToken;
  }
}
