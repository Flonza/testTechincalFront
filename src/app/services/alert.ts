import { Injectable } from '@angular/core';

import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  info(title: string) {
    Swal.fire({
      title,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  show(message: string, type: SweetAlertIcon) {
    Swal.fire({
      text: message,
      icon: type,
      confirmButtonText: 'OK'
    });
  }

  custom(options: SweetAlertOptions):any {
    return Swal.fire(options);
  }
}

