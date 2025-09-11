import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users';
import { UserModel } from '../../interfaces/User.interface';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader';
import { AlertService } from '../../services/alert';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [
    TableModule,
    CardModule,
    AvatarModule,
    TagModule,
    FormsModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
  providers: [MessageService]
})
export class Users implements OnInit {
  // Arrays de informacion
  public allUsers: any[] = [];
  filteredUsers: UserModel[] = [...this.allUsers];
  searchValue: string = '';
  selectedUsers: UserModel[] = [];
  loading: boolean = true;

  constructor(
    private readonly usersService: UsersService,
    private readonly loader: LoaderService,
    private readonly alert: AlertService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  // METODOS PARA OBTENER INFORMACION
  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  getAllUsers(): void {
    this.loading = true;
    this.loader.show();
    this.usersService.getAllUsers().subscribe({
      next: (resp) => {
        this.loader.hide();
        this.allUsers = resp.data;
        this.loading = false;
      },
      error: (err) => {
        this.loader.hide();
        this.loading = false;
        this.alert.show('Error fetching users', 'error');
        console.error(err);
      },
    });
  }
  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  // FUNCIONALIDAD DE LA TABLA
  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==

  applyFilter(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.allUsers.filter(
      (u) =>
        u.userName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.country.toLowerCase().includes(query)
    );
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  // FUNCIONALIDAD DE ALTERACION DE INFORMACION
  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==

  onAdd() {
    this.router.navigate(['/form-user', 'new']);
  }

  onEdit(user: any) {
    this.router.navigate(['/form-user', user.id]);
  }

  onDelete(users: any[]) {
    if (!users || users.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debes seleccionar al menos un usuario',
      });
      return;
    }
    const body = users.map((u) => u.id);
    this.alert
      .custom({
        title: 'Are you sure?',
        text: `You are about to delete ${users.length} user(s). This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          this.loader.show();
          this.usersService.deleteUsers(body).subscribe({
            next: (resp) => {
              this.allUsers = this.allUsers.filter((user) => !resp.data.includes(user.id));
              this.loader.hide();
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: `User(s) deleted successfully (${resp.data.length})`,
              });

              this.selectedUsers = [];
            },
            error: (err) => {
              this.loader.hide();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete users',
              });
              console.error(err);
            },
          });
        }
      });
  }
}
