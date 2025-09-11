import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { BasicDataService } from '../../services/BasicData';
import { BasicResponseModel } from '../../interfaces/BasicResponseModel.interface';
import { GeneralResponse } from '../../interfaces/GeneralResponse.interface';
import { AlertService } from '../../services/alert';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { LoaderService } from '../../services/loader';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-update-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    ToastModule,
    CheckboxModule,
    CommonModule,
    ToastModule
  ],
  templateUrl: './update-users.html',
  styleUrl: './update-users.scss',
  providers: [MessageService],
})
export class UpdateUsers implements OnInit {
  public titlePage: string = '';
  // Formulario
  public formUser: FormGroup = {} as FormGroup;
  // Arrays de informacion
  public countries: any[] = [];
  public genders: any[] = [];
  // Variables de configuracion
  public maxDate!: Date;
  yearRange: string = '';
  // Flags
  public isEditing: boolean = false;
  public isSubmitting = false;

  constructor(
    private readonly userService: UsersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly basicService: BasicDataService,
    private readonly alert: AlertService,
    private readonly messageService: MessageService,
    private readonly loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCountriesAndGenders();
    this.initializeData();

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
    this.handleRouteId();
  }

  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  // INICIALIZACION DE FORMULARIO Y CONFIGURACION
  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  public initForm(): void {
    this.formUser = this.fb.group({
      id: [null],
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phoneNumber: ['', [Validators.pattern(/^\d{7,20}$/)]],
      countryId: [null, [Validators.required]],
      genderId: [null, [Validators.required]],
      birthDate: [null, [Validators.required]],
      isActive: [true],
    });
  }

  private patchFormValues(user: any): void {
    this.formUser.patchValue({
      id: user.id,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.cellphone,
      countryId: user.country * 1,
      genderId: user.gender * 1,
      birthDate: user.birthDate ? new Date(user.birthDate) : null,
      isActive: user.isActive,
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  private handleRouteId(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === 'new') {
      this.titlePage = 'Create User';
      this.isEditing = false;
      return;
    }

    if (id) {
      this.userService.getUserById(+id).subscribe({
        next: (user) => {
          if (user) {
            this.titlePage = 'Edit User';
            this.patchFormValues(user.data);

            this.isEditing = true;
          } else {
            this.router.navigate(['/users']);
          }
        },
        error: () => {
          this.router.navigate(['/users']);
        },
      });
    } else {
      this.router.navigate(['/users']);
    }
  }

  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  // OBTENER DATA DEL FORMULARIO
  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==

  private initializeData(): void {
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);
    this.maxDate = minAgeDate;

    const currentYear = new Date().getFullYear();
    this.yearRange = `${currentYear - 100}:${currentYear - 13}`;
  }

  loadCountriesAndGenders(): void {
    forkJoin({
      countries: this.basicService.getAllCountries(),
      genders: this.basicService.getAllGenders(),
    }).subscribe({
      next: (response: {
        countries: GeneralResponse<BasicResponseModel[]>;
        genders: GeneralResponse<BasicResponseModel[]>;
      }) => {
        this.countries = response.countries.data;
        this.genders = response.genders.data;
      },
      error: (err) => {
        this.alert
          .custom({
            title: 'Error loading data',
            text: 'Unable to load countries and genders. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: false,
          })
          .then((result: any) => {
            if (result.isConfirmed) {
              this.router.navigate(['/users']);
            }
          });
      },
    });
  }

  saveUser(): void {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly',
      });
      return;
    }

    const userPayload = this.formUser.value;

    this.loader.show();

    const request$ = this.isEditing
      ? this.userService.updateUser(userPayload)
      : this.userService.createUser(userPayload);

    request$.subscribe({
      next: (resp) => {
        this.loader.hide();
        this.alert
          .custom({
            title: 'Success',
            text: this.isEditing ? 'User updated successfully' : 'User created successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: false,
          })
          .then((result: any) => {
            if (result.isConfirmed) {
              this.router.navigate(['/users']);
            }
          });

        if (!this.isEditing) {
          this.formUser.reset({ isActive: true });
        }
      },
      error: (err) => {
        this.loader.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditing ? 'Failed to update user' : 'Failed to create user',
        });
        console.error(err);
      },
    });
  }

  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  // VALIDACIONES Y UTILIDADES
  //== == == == == == == == == == == == == == == == == == == == == == == == == == ==
  public isFieldInvalid(fieldName: string): boolean {
    const field = this.formUser.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public getFieldError(fieldName: string): string | null {
    const field = this.formUser.get(fieldName);
    if (!field?.errors || !this.isFieldInvalid(fieldName)) {
      return null;
    }

    const errors = field.errors;

    if (errors['required']) return `${fieldName} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['whitespace']) return 'Field cannot be empty or contain only spaces';
    if (errors['invalidAge']) return `Minimum age is ${errors['invalidAge'].requiredAge} years`;

    return 'Invalid input';
  }

  public getFormProgress(): number {
    const requiredFields = ['userName', 'email', 'countryId', 'genderId', 'birthDate'];
    const optionalFields = ['phoneNumber'];

    let filledCount = 0;
    let totalWeight = 0;

    requiredFields.forEach((field) => {
      totalWeight += 2;
      const control = this.formUser.get(field);
      if (control?.value && control.valid) {
        filledCount += 2;
      }
    });

    optionalFields.forEach((field) => {
      totalWeight += 1;
      const control = this.formUser.get(field);
      if (control?.value && control.valid) {
        filledCount += 1;
      }
    });

    return Math.round((filledCount / totalWeight) * 100);
  }
}
